import "server-only";

import Stripe from "stripe";

import { firstOfNextMonthEastern } from "./billing-anchor";

/**
 * Stripe Checkout boundary.
 *
 * All Stripe knowledge stays behind `createCheckoutSession` so the billing
 * provider remains swappable — GHL native billing is the documented
 * alternative.
 *
 * BILLING SHAPE: everyone is billed on the 1st. A customer subscribing
 * mid-month pays a prorated amount for the rest of that month at checkout,
 * then the full price on the 1st, and on the 1st every month after.
 *
 * The proration is Stripe's to calculate. Nothing here works out a partial
 * amount — `billing_cycle_anchor` tells Stripe when the first full period
 * starts and `create_prorations` tells it to bill the gap, which is what the
 * two fields are for. A hand-rolled `price / 30 * daysLeft` would disagree
 * with the invoice Stripe actually issues.
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
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata,
      subscription_data: {
        metadata,
        /** Midnight Eastern on the 1st of next month. */
        billing_cycle_anchor: firstOfNextMonthEastern(),
        /**
         * Stripe's default, stated explicitly: the whole billing design turns
         * on it, and a silent default is not the place for that.
         */
        proration_behavior: "create_prorations",
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
