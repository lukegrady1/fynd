import "server-only";

/**
 * Stripe Checkout boundary.
 *
 * STUB — deliberately thin. The spec calls for keeping this swappable (GHL
 * native billing is the alternative), so all Stripe knowledge stays behind
 * `createCheckoutSession`. The `stripe` package is not installed yet; when it
 * is, only the marked block below changes.
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

const requiredEnv = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_REVIEW_97"] as const;

export const missingStripeEnv = () =>
  requiredEnv.filter((key) => !process.env[key]);

/**
 * Creates a subscription Checkout Session and returns its hosted URL.
 *
 * Not built as a custom card form on purpose — Stripe Checkout handles SCA,
 * wallets, and Apple Pay, which matters a lot given this page is opened on a
 * phone while the prospect is still on the call.
 */
export const createCheckoutSession = async (
  req: CheckoutRequest,
): Promise<CheckoutResult> => {
  const missing = missingStripeEnv();
  if (missing.length > 0) {
    return { status: "unconfigured", missing };
  }

  void req; // consumed by the Stripe call below once enabled.

  // TODO(integration): install `stripe` and replace this block.
  //
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //   const session = await stripe.checkout.sessions.create({
  //     mode: "subscription",
  //     line_items: [{ price: process.env.STRIPE_PRICE_REVIEW_97!, quantity: 1 }],
  //     metadata: { ghl_contact_id: req.cid ?? "", source: "start-page" },
  //     subscription_data: {
  //       metadata: { ghl_contact_id: req.cid ?? "", source: "start-page" },
  //     },
  //     success_url: `${req.origin}/start/welcome?session_id={CHECKOUT_SESSION_ID}`,
  //     cancel_url: `${req.origin}/start?cancelled=1`,
  //     allow_promotion_codes: true,
  //   });
  //   return { status: "ok", url: session.url! };
  //
  // The webhook half lives in src/app/api/stripe/webhook/route.ts and must
  // verify the signature with STRIPE_WEBHOOK_SECRET before calling notifyGhl.

  return {
    status: "error",
    message: "Stripe integration not yet enabled.",
  };
};
