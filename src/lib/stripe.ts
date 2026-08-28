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
 * pays $97 at checkout and that payment carries them past the end of the
 * month to the next billing day — always at least a full month, up to 46
 * days. After that it is $97 on the 1st or the 15th, monthly.
 *
 * Nothing is prorated. The extra days are given away on purpose: a whole
 * month is collected on day one rather than a part-month that can be as low
 * as a few dollars.
 *
 * MECHANISM, and it is not the obvious one. Stripe rejects
 * `proration_behavior: "none"` outright in a Checkout Session that carries a
 * one-time price, so the "charge full price now, start the cycle later" shape
 * cannot be built from `billing_cycle_anchor`. It is built instead from a
 * trial that ends on the anchor, plus a one-time line item that collects the
 * money today. The subscription sits in `trialing` until the anchor and bills
 * normally from there.
 *
 * The cost of that mechanism is wording: Checkout derives "Try …", "N days
 * free" and the "Pay and start trial" button from the trial and none of the
 * three can be overridden. `custom_text` and the one-time item's own name
 * carry the real numbers instead.
 */

export type CheckoutRequest = {
  /** GHL contact id, carried into Stripe metadata. */
  cid: string | null;
  plan: "review-system";
  origin: string;
};

export type CheckoutResult =
  | { status: "ok"; url: string }
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; message: string };

/**
 * The live $97/month price. Overridable per environment so a test deploy can
 * point at a test-mode price without a code change.
 */
const PRICE_ID =
  process.env.STRIPE_PRICE_REVIEW_97 ?? "price_1U95IV3sJGpur4VmHm1ixoq5";

/**
 * Must match the recurring price above. The one-time item that collects the
 * first period is built inline, so the amount is stated here rather than read
 * back from Stripe.
 */
const PRICE_CENTS = 9700;

/** "$97.00" — cents are load-bearing here; "$97" reads like an estimate. */
const PRICE_LABEL = `$${(PRICE_CENTS / 100).toFixed(2)}`;

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

  // Shared by the session and the subscription: the session's copy is read by
  // checkout.session.completed, the subscription's by every later billing
  // event, which never sees the session.
  const metadata = {
    ghl_contact_id: req.cid ?? "",
    source: "start-page",
    plan: req.plan,
  };

  try {
    const anchor = nextBillingAnchor();
    const anchorLabel = formatAnchor(anchor);

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: PRICE_ID, quantity: 1 },
        {
          quantity: 1,
          // Inline rather than a stored Price: the description names the
          // period end, which differs per customer.
          price_data: {
            currency: "usd",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "Fynd — due today",
              description: `Covers your first period, today through ${anchorLabel}.`,
            },
          },
        },
      ],
      metadata,
      subscription_data: {
        metadata,
        /**
         * Ends on the anchor, which is what defers the first recurring
         * charge. The one-time line item above is what is actually paid
         * today, so nothing here is free — see the note at the top.
         */
        trial_end: anchor,
      },
      /**
       * Sits directly above the pay button, which Checkout will not relabel.
       * States this customer's own dates; the standing policy ("billed on the
       * 1st or the 15th") lives on the recurring product's description, where
       * it renders beside Checkout's "N days free" and defuses it.
       */
      custom_text: {
        submit: {
          message: `${PRICE_LABEL} is due today and covers you through ${anchorLabel}. Your next payment of ${PRICE_LABEL} is on ${anchorLabel}, then monthly on the ${anchorDayOrdinal(anchor)}.`,
        },
      },
      success_url: `${req.origin}/start/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.origin}/?cancelled=1`,
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
