import "server-only";

import Stripe from "stripe";

import {
  anchorDayOrdinal,
  easternMidnight,
  formatAnchor,
  nextBillingAnchor,
  oneMonthAfter,
} from "./billing-anchor";
import type { Offer, OfferSlug } from "./offers";

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

import type { CancelPath, Plan } from "./stripe-plans";
export type { Plan };

export type CheckoutRequest = {
  /** GHL contact id, carried into Stripe metadata. */
  cid: string | null;
  plan: Plan;
  origin: string;
  /** Overrides the plan's own cancel page — see `CANCEL_PATHS`. */
  cancelPath?: CancelPath;
  /** Set when the session comes from a permanent /offer/<slug> link. */
  offer?: OfferSlug;
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
    source: req.offer
      ? `offer-${req.offer}`
      : req.plan === "website-reviews"
        ? "website-page"
        : "start-page",
    plan: req.plan,
    ...(req.offer ? { offer: req.offer } : {}),
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
      // `plan` rides along so a page that sells both plans can reopen the
      // one they were on; the single-plan pages ignore it.
      // Offer links return to a plain page: no "Still deciding?" note and no
      // tab switch, so /watch looks exactly as it did when the lead first saw it.
      cancel_url: req.offer
        ? `${req.origin}${req.cancelPath ?? plan.cancelPath}`
        : `${req.origin}${req.cancelPath ?? plan.cancelPath}?cancelled=1&plan=${req.plan}`,
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

export type DeferredCheckoutRequest = {
  offer: { slug: OfferSlug } & Extract<Offer, { billing: "deferred" }>;
  cid: string | null;
  origin: string;
  /** Overrides the plan's own cancel page — see `CANCEL_PATHS`. */
  cancelPath?: CancelPath;
};

export type DeferredCheckoutResult =
  | CheckoutResult
  /** The start date is too close or past; the link no longer sells this. */
  | { status: "closed" };

/**
 * A session must be finished at least this long before the start date, so
 * the subscription's trial always ends in the future when it is created.
 */
const DEFERRED_CUTOFF_SECONDS = 60 * 60;
/** Stripe's floor on `expires_at`. */
const MIN_SESSION_SECONDS = 30 * 60;
/** Stripe's ceiling on `expires_at`, less a minute of clock slack. */
const MAX_SESSION_SECONDS = 24 * 60 * 60 - 60;

/**
 * "Nothing today, everything on a fixed date" — the deferred offers in
 * `src/lib/offers.ts`.
 *
 * A `setup` mode Checkout Session: no charge, no line items, it only saves
 * the card. `ensureSubscription` then creates the subscription at once with
 * a trial ending on the start date, plus the offer's one-time charge as an
 * invoice item on that subscription, so the first invoice on the start date
 * carries both. The customer sees an active subscription immediately and is
 * billed nothing until then.
 *
 * Setup mode has no order summary, so the submit message under the button
 * is the whole of what they are agreeing to and has to state every amount
 * and date.
 *
 * The session's expiry is pulled in so it cannot be completed within an
 * hour of the start date; past that point the offer is "closed" and the
 * route sends people to the normal checkout instead.
 */
export const createDeferredCheckoutSession = async (
  req: DeferredCheckoutRequest,
): Promise<DeferredCheckoutResult> => {
  const missing = missingStripeEnv();
  if (missing.length > 0) return { status: "unconfigured", missing };

  const plan = PLANS[req.offer.plan];
  if (!plan.priceId) {
    return { status: "unconfigured", missing: [`price id for ${req.offer.plan}`] };
  }

  const start = easternMidnight(req.offer.startsOn);
  if (start === null) {
    return { status: "error", message: `offer ${req.offer.slug} has an invalid startsOn` };
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Math.min(now + MAX_SESSION_SECONDS, start - DEFERRED_CUTOFF_SECONDS);
  if (expiresAt - now < MIN_SESSION_SECONDS) return { status: "closed" };

  // The first invoice is the plan's month plus, if the offer charges more
  // than that, one extra line for the difference.
  const firstCents = req.offer.firstCents ?? plan.recurringCents;
  if (firstCents < plan.recurringCents) {
    return { status: "error", message: `offer ${req.offer.slug} charges less than one month` };
  }
  const oneTime =
    firstCents > plan.recurringCents
      ? {
          cents: firstCents - plan.recurringCents,
          description: req.offer.firstDescription ?? "One-time charge",
        }
      : null;

  const startLabel = formatAnchor(start);
  const recurringLabel = priceLabel(plan.recurringCents);
  const thenLabel = `It then continues at ${recurringLabel} a month on the ${anchorDayOrdinal(start)}, from ${formatAnchor(oneMonthAfter(start))}. Cancel any time.`;

  const message = oneTime
    ? `Nothing is charged today. Your card is saved and billed ${priceLabel(firstCents)} on ${startLabel}, for your website build and your first month of the Review System. ${thenLabel}`
    : `Nothing is charged today. Your card is saved and billed ${recurringLabel} on ${startLabel}, for your first month of the Review System. ${thenLabel}`;

  // Everything ensureSubscription needs rides on the session, so editing
  // the offers table later never changes what an existing customer gets.
  const metadata = {
    ghl_contact_id: req.cid ?? "",
    source: `offer-${req.offer.slug}`,
    plan: req.offer.plan,
    offer: req.offer.slug,
    deferred_start: String(start),
    ...(oneTime
      ? {
          one_time_cents: String(oneTime.cents),
          one_time_description: oneTime.description,
        }
      : {}),
  };

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "setup",
      currency: "usd",
      payment_method_types: ["card"],
      // The subscription hangs off this Customer. Setup mode only creates
      // one when asked; the earlier one-off sessions did not, which is why
      // they needed a manual step afterwards.
      customer_creation: "always",
      setup_intent_data: {
        description: `${plan.name}: nothing today, first charge ${startLabel}`,
        metadata,
      },
      metadata,
      expires_at: expiresAt,
      custom_text: { submit: { message } },
      success_url: `${req.origin}/start/welcome?session_id={CHECKOUT_SESSION_ID}`,
      // Plain page, like the other offer links — see createCheckoutSession.
      cancel_url: `${req.origin}${req.cancelPath ?? plan.cancelPath}`,
    });

    if (!session.url) {
      return { status: "error", message: "Stripe returned no checkout URL." };
    }
    return { status: "ok", url: session.url };
  } catch (error) {
    const message = stripeErrorMessage(error);
    console.error("[stripe] deferred checkout session failed:", message);
    return { status: "error", message };
  }
};

const stripeErrorMessage = (error: unknown) =>
  error instanceof Stripe.errors.StripeError
    ? `${error.type}: ${error.message}`
    : error instanceof Error
      ? error.message
      : "Unknown Stripe error.";

export type EnsureResult =
  | { status: "created"; subscriptionId: string }
  | { status: "existing"; subscriptionId: string }
  | { status: "unpaid" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

/**
 * What a completed session says to build, read off the session itself.
 *
 * `trialEnd` null means start billing now. That only happens to a deferred
 * session completed after its start date, which the session's expiry is set
 * to prevent; it is handled rather than assumed so a late webhook retry
 * still produces a correct subscription instead of a Stripe error.
 */
type Billing =
  | { status: "unpaid" }
  | { status: "error"; message: string }
  | {
      status: "ok";
      customer: string;
      paymentMethod: string;
      trialEnd: number | null;
      oneTime: { cents: number; description: string } | null;
    };

/** Stripe refuses a trial_end that is not comfortably in the future. */
const TRIAL_MARGIN_SECONDS = 10 * 60;

const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : (value?.id ?? null);

const readBilling = (session: Stripe.Checkout.Session): Billing => {
  const customer = idOf(session.customer);

  if (session.mode === "setup") {
    // Setup sessions never have payment_status "paid"; "complete" is the
    // evidence the card was saved.
    if (session.status !== "complete") return { status: "unpaid" };

    const setupIntent =
      typeof session.setup_intent === "string" ? null : session.setup_intent;
    const paymentMethod = idOf(setupIntent?.payment_method);
    const start = Number(session.metadata?.deferred_start);
    const oneTimeCents = Number(session.metadata?.one_time_cents);

    if (!customer || !paymentMethod || !start) {
      return {
        status: "error",
        message: `setup session ${session.id} complete but missing customer, payment method or deferred_start`,
      };
    }

    const now = Math.floor(Date.now() / 1000);
    return {
      status: "ok",
      customer,
      paymentMethod,
      trialEnd: start > now + TRIAL_MARGIN_SECONDS ? start : null,
      oneTime:
        oneTimeCents > 0
          ? {
              cents: oneTimeCents,
              description: session.metadata?.one_time_description || "One-time charge",
            }
          : null,
    };
  }

  // The one check that matters: never build a subscription off an unpaid
  // session. Reaching the success URL is not evidence of payment.
  if (session.payment_status !== "paid") return { status: "unpaid" };

  const paymentIntent =
    typeof session.payment_intent === "string" ? null : session.payment_intent;
  const paymentMethod = idOf(paymentIntent?.payment_method);

  if (!customer || !paymentMethod) {
    return {
      status: "error",
      message: `session ${session.id} paid but missing customer or payment method`,
    };
  }

  return {
    status: "ok",
    customer,
    paymentMethod,
    // Fall back to recomputing only if the session predates the metadata.
    trialEnd: Number(session.metadata?.billing_anchor) || nextBillingAnchor(),
    oneTime: null,
  };
};

/**
 * The deferred offer's one-time charge, as an invoice item — created once.
 *
 * Tied to the subscription, so it lands on that subscription's next invoice:
 * the one at the end of the trial, on the start date. It has to be created
 * AFTER the subscription, because a trialing subscription issues a $0
 * invoice the moment it is created and an item that already existed would
 * be swept onto it and charged today.
 *
 * The exception is `subscriptionId` null, the late path where there is no
 * trial: then it is created first, unattached, and the subscription's first
 * invoice (charged immediately) picks it up.
 *
 * Idempotent the same two ways as the subscription: a metadata tag found by
 * listing (all items, not just pending ones, or a reload after the start
 * date would charge the build twice), plus an idempotency key.
 */
const ensureOneTimeItem = async (
  customer: string,
  sessionId: string,
  oneTime: { cents: number; description: string },
  subscriptionId: string | null,
) => {
  const items = await stripe().invoiceItems.list({ customer, limit: 100 });
  if (items.data.some((item) => item.metadata?.checkout_session_id === sessionId)) {
    return;
  }

  await stripe().invoiceItems.create(
    {
      customer,
      amount: oneTime.cents,
      currency: "usd",
      description: oneTime.description,
      ...(subscriptionId ? { subscription: subscriptionId } : {}),
      metadata: { checkout_session_id: sessionId },
    },
    { idempotencyKey: `item:${sessionId}` },
  );
};

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
 *
 * Handles both kinds of session: `payment` mode (paid today, trial to the
 * anchor) and `setup` mode from a deferred offer (nothing paid, trial to the
 * offer's start date, plus its one-time charge — see `ensureOneTimeItem`).
 */
export const ensureSubscription = async (
  sessionId: string,
): Promise<EnsureResult> => {
  if (missingStripeEnv().length > 0) return { status: "unconfigured" };

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "setup_intent"],
    });

    const billing = readBilling(session);
    if (billing.status !== "ok") return billing;
    const { customer, paymentMethod, trialEnd, oneTime } = billing;

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

    // Checked on every call, not only on creation: a crash between the
    // subscription and the item must be healed by the next retry.
    if (already) {
      if (oneTime) await ensureOneTimeItem(customer, sessionId, oneTime, already.id);
      return { status: "existing", subscriptionId: already.id };
    }

    // Sessions from before there were two plans carry no `plan`; they are
    // all the review system.
    const plan = PLANS[isPlan(session.metadata?.plan) ? session.metadata.plan : "review-system"];
    if (!plan.priceId) {
      return {
        status: "error",
        message: `session ${sessionId} paid for ${session.metadata?.plan} but no recurring price is configured for it`,
      };
    }

    if (oneTime && trialEnd === null) {
      await ensureOneTimeItem(customer, sessionId, oneTime, null);
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
        // Payment mode: runs to the anchor, the first period was paid at
        // checkout. Setup mode: runs to the start date, nothing was paid.
        ...(trialEnd !== null ? { trial_end: trialEnd } : {}),
        proration_behavior: "none",
        metadata: {
          ...(session.metadata ?? {}),
          checkout_session_id: sessionId,
        },
      },
      { idempotencyKey: `sub:${sessionId}` },
    );

    if (oneTime && trialEnd !== null) {
      await ensureOneTimeItem(customer, sessionId, oneTime, subscription.id);
    }

    return { status: "created", subscriptionId: subscription.id };
  } catch (error) {
    const message = stripeErrorMessage(error);
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
