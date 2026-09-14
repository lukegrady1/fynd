import "server-only";

import Stripe from "stripe";

import {
  anchorDayOrdinal,
  formatAnchor,
  nextBillingAnchor,
} from "./billing-anchor";

/**
 * Stripe Checkout boundary.
 *
 * All Stripe knowledge stays behind `createCheckoutSession` so the billing
 * provider remains swappable — GHL native billing is the documented
 * alternative.
 *
 * BILLING SHAPE: full price up front, extended first period. The customer
 * pays $97 at checkout and that payment carries them to the next billing day
 * — the 1st or the 15th, whichever falls first on or after one month from
 * signup. After that it is $97/month on that day. First periods run 28-46
 * days and nothing is prorated in either direction: the extra days are given
 * away on purpose, in exchange for collecting a whole month on day one.
 *
 * MECHANISM: this is TWO operations, not one.
 *
 *   1. A `payment` mode Checkout Session collects $97 and saves the card
 *      (`setup_future_usage: "off_session"`).
 *   2. `ensureSubscription` then creates the subscription against that saved
 *      card, with a trial running to the anchor so the first recurring charge
 *      lands on the billing day.
 *
 * Subscription mode was tried first and rejected on wording. It can only
 * produce this shape via a trial, and Checkout then derives "Try …", "N days
 * free" and a "Pay and start trial" button from that trial — none of which
 * can be overridden, and "free" is untrue when $97 was just collected.
 * (`billing_cycle_anchor` cannot do it at all: Stripe refuses
 * `proration_behavior: "none"` in a session carrying a one-time price.)
 * Payment mode has no trial, so the page reads "$97.00 … Pay".
 *
 * The cost of splitting it is a window where the customer has paid and has no
 * subscription. `ensureSubscription` is therefore called from BOTH the
 * `checkout.session.completed` webhook and the success page, and is safe to
 * call any number of times — see its own comment for how.
 */

import type { Plan } from "./stripe-plans";
export type { Plan };

export type CheckoutRequest = {
  /** GHL contact id, carried into Stripe metadata. */
  cid: string | null;
  plan: Plan;
  origin: string;
};

export type CheckoutResult =
  | { status: "ok"; url: string }
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; message: string };

/**
 * The two plans. Same billing shape for both — a one-time charge today that
 * carries the customer to the anchor, then a subscription from the anchor —
 * so a plan is a name, what today's charge is, and the recurring price to
 * hang the subscription on.
 *
 * They differ only in today's charge. The review plan collects one month
 * ($97) up front. The website plan collects $249, which is the website
 * build plus that same first period, and then continues on the SAME $97
 * recurring price — the site is paid for once, the reviews are what recurs.
 *
 * `firstCents` is the inline one-time item; `recurringCents` must match the
 * recurring Stripe price and is only used for the wording on the checkout
 * page, since the amount itself lives on the price.
 *
 * The price id has a live default so checkout works with only the secret
 * key set; the env var exists to point a test deploy at a test-mode price.
 */
const REVIEW_PRICE_ID =
  process.env.STRIPE_PRICE_REVIEW_97 ?? "price_1U95IV3sJGpur4VmHm1ixoq5";

const PLANS: Record<
  Plan,
  {
    name: string;
    /** Charged at checkout. Covers today through the anchor. */
    firstCents: number;
    /** What the subscription bills from the anchor. */
    recurringCents: number;
    /** Product description on the checkout line item. */
    describe: (anchorLabel: string, recurringLabel: string) => string;
    priceId: string | undefined;
    cancelPath: string;
  }
> = {
  "review-system": {
    name: "Fynd Review System",
    firstCents: 9700,
    recurringCents: 9700,
    describe: (anchorLabel, recurringLabel) =>
      `Your first period, today through ${anchorLabel}. Continues as a ${recurringLabel}/month subscription on ${anchorLabel}.`,
    priceId: REVIEW_PRICE_ID,
    cancelPath: "/",
  },
  "website-reviews": {
    name: "Fynd Website + Reviews",
    firstCents: 24900,
    recurringCents: 9700,
    describe: (anchorLabel, recurringLabel) =>
      `Your website build, plus the Review System today through ${anchorLabel}. The Review System continues as a ${recurringLabel}/month subscription on ${anchorLabel}.`,
    priceId: REVIEW_PRICE_ID,
    cancelPath: "/website",
  },
};

/** "$97.00" — cents are load-bearing here; "$97" reads like an estimate. */
const priceLabel = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const isPlan = (value: unknown): value is Plan =>
  typeof value === "string" && value in PLANS;

/**
 * Only the secret key is required; the price has a default above.
 *
 * There is no webhook route: subscription state is not tracked in the app yet,
 * so nothing here reacts to renewals, failed payments or cancellations. Stripe
 * still bills correctly on its own — but the site cannot tell you whether a
 * given customer is currently paying. Add the receiver back before anything
 * depends on knowing that.
 */
const requiredEnv = ["STRIPE_SECRET_KEY"] as const;

export const missingStripeEnv = () =>
  requiredEnv.filter((key) => !process.env[key]);

/** Lazy so importing this module never throws when the key is absent. */
let client: Stripe | null = null;

const stripe = () => {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return client;
};

/**
 * Creates a subscription Checkout Session and returns its hosted URL.
 *
 * Not a custom card form on purpose — Checkout handles SCA, wallets and Apple
 * Pay, which matters a lot given this page is opened on a phone while the
 * prospect is still on the call.
 */
export const createCheckoutSession = async (
  req: CheckoutRequest,
): Promise<CheckoutResult> => {
  const missing = missingStripeEnv();
  if (missing.length > 0) {
    return { status: "unconfigured", missing };
  }

  const plan = PLANS[req.plan];
  if (!plan.priceId) {
    return { status: "unconfigured", missing: [`price id for ${req.plan}`] };
  }
  const FIRST_LABEL = priceLabel(plan.firstCents);
  const RECURRING_LABEL = priceLabel(plan.recurringCents);

  // Shared by the session and the subscription: the session's copy is read by
  // checkout.session.completed, the subscription's by every later billing
  // event, which never sees the session. `plan` is what ensureSubscription
  // reads to pick the recurring price.
  const metadata = {
    ghl_contact_id: req.cid ?? "",
    source: req.plan === "website-reviews" ? "website-page" : "start-page",
    plan: req.plan,
  };

  try {
    const anchor = nextBillingAnchor();
    const anchorLabel = formatAnchor(anchor);

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      // A Customer is required to hang the subscription off afterwards;
      // payment mode does not create one on its own.
      customer_creation: "always",
      payment_intent_data: {
        // What makes the card reusable for the subscription. It also makes
        // Checkout print its own "…and future payments" consent line, which
        // is the authorisation for that later billing.
        setup_future_usage: "off_session",
        metadata,
      },
      line_items: [
        {
          quantity: 1,
          // Inline rather than a stored Price: the description names the
          // period end, which differs per customer.
          price_data: {
            currency: "usd",
            unit_amount: plan.firstCents,
            product_data: {
              name: plan.name,
              description: plan.describe(anchorLabel, RECURRING_LABEL),
            },
          },
        },
      ],
      // The anchor is carried on the session so the webhook and the success
      // page both build the same subscription. Recomputing it later would
      // drift for anyone who pays either side of midnight.
      metadata: { ...metadata, billing_anchor: String(anchor) },
      custom_text: {
        submit: {
          message: `${FIRST_LABEL} is due today and covers you through ${anchorLabel}. It then continues as a ${RECURRING_LABEL}/month subscription, billed on the ${anchorDayOrdinal(anchor)}. Cancel any time.`,
        },
      },
      success_url: `${req.origin}/start/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.origin}${plan.cancelPath}?cancelled=1`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return { status: "error", message: "Stripe returned no checkout URL." };
    }

    return { status: "ok", url: session.url };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? `${error.type}: ${error.message}`
        : error instanceof Error
          ? error.message
          : "Unknown Stripe error.";

    console.error("[stripe] checkout session failed:", message);
    return { status: "error", message };
  }
};

export type EnsureResult =
  | { status: "created"; subscriptionId: string }
  | { status: "existing"; subscriptionId: string }
  | { status: "unpaid" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

/**
 * Creates the subscription behind a paid Checkout Session — or returns the one
 * that already exists.
 *
 * Called from two places on purpose. The webhook is the reliable path: it
 * fires whether or not the customer's browser survives the redirect. The
 * success page is the backstop for the webhook being slow, misconfigured, or
 * not yet pointed at this deploy. Either can win.
 *
 * SAFE TO CALL REPEATEDLY, by two independent mechanisms:
 *
 *   - It first looks for a subscription already tagged with this session id,
 *     which is what makes it idempotent for good (a customer can reload the
 *     success page next week).
 *   - The create itself carries an idempotency key derived from the session
 *     id, which closes the much narrower race where the webhook and the page
 *     both look, both find nothing, and both create. Stripe's keys only last
 *     24 hours, hence the tag as well.
 *
 * A double-charge is not among the failure modes here — this call bills
 * nothing. The subscription's first invoice is at the anchor.
 */
export const ensureSubscription = async (
  sessionId: string,
): Promise<EnsureResult> => {
  if (missingStripeEnv().length > 0) return { status: "unconfigured" };

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // The one check that matters: never build a subscription off an unpaid
    // session. Reaching the success URL is not evidence of payment.
    if (session.payment_status !== "paid") return { status: "unpaid" };

    const customer =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    const paymentIntent =
      typeof session.payment_intent === "string"
        ? null
        : session.payment_intent;

    const paymentMethod =
      typeof paymentIntent?.payment_method === "string"
        ? paymentIntent.payment_method
        : (paymentIntent?.payment_method?.id ?? null);

    if (!customer || !paymentMethod) {
      return {
        status: "error",
        message: `session ${sessionId} paid but missing customer or payment method`,
      };
    }

    const existing = await stripe().subscriptions.list({
      customer,
      status: "all",
      limit: 100,
    });

    const already = existing.data.find(
      (sub) =>
        sub.metadata?.checkout_session_id === sessionId &&
        sub.status !== "incomplete_expired" &&
        sub.status !== "canceled",
    );

    if (already) {
      return { status: "existing", subscriptionId: already.id };
    }

    // Fall back to recomputing only if the session predates the metadata.
    const anchor = Number(session.metadata?.billing_anchor) || nextBillingAnchor();

    // Sessions from before there were two plans carry no `plan`; they are
    // all the review system.
    const plan = PLANS[isPlan(session.metadata?.plan) ? session.metadata.plan : "review-system"];
    if (!plan.priceId) {
      return {
        status: "error",
        message: `session ${sessionId} paid for ${session.metadata?.plan} but no recurring price is configured for it`,
      };
    }

    // Makes the saved card the one invoices draw on; without it the renewal
    // has no payment method and fails.
    await stripe().customers.update(customer, {
      invoice_settings: { default_payment_method: paymentMethod },
    });

    const subscription = await stripe().subscriptions.create(
      {
        customer,
        items: [{ price: plan.priceId, quantity: 1 }],
        default_payment_method: paymentMethod,
        /** Runs to the anchor; the first period was paid at checkout. */
        trial_end: anchor,
        proration_behavior: "none",
        metadata: {
          ...(session.metadata ?? {}),
          checkout_session_id: sessionId,
        },
      },
      { idempotencyKey: `sub:${sessionId}` },
    );

    return { status: "created", subscriptionId: subscription.id };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? `${error.type}: ${error.message}`
        : error instanceof Error
          ? error.message
          : "Unknown Stripe error.";

    console.error("[stripe] ensureSubscription failed:", message);
    return { status: "error", message };
  }
};

export type WebhookVerification =
  | { status: "ok"; event: Stripe.Event }
  | { status: "invalid"; message: string }
  | { status: "unconfigured" };

/**
 * Verifies a webhook payload against STRIPE_WEBHOOK_SECRET.
 *
 * Kept here rather than in the route so every Stripe import stays behind this
 * module, and so the route cannot accidentally skip the check — an unverified
 * body is attacker-controlled, and this one creates subscriptions.
 *
 * `raw` must be the untouched request body; re-serialised JSON will not match
 * the signature.
 */
export const constructWebhookEvent = (
  raw: string,
  signature: string,
): WebhookVerification => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return { status: "unconfigured" };
  if (missingStripeEnv().length > 0) return { status: "unconfigured" };

  try {
    return {
      status: "ok",
      event: stripe().webhooks.constructEvent(raw, signature, secret),
    };
  } catch (error) {
    return {
      status: "invalid",
      message: error instanceof Error ? error.message : "unknown",
    };
  }
};
