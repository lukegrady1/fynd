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
  /**
   * True when the visitor bought inside the free-management window. This
   * picks the Stripe price, and it is the reason the countdown on the pricing
   * section is allowed to exist: when the window closes the number shown AND
   * the number charged both move to the managed rate.
   */
  managementFree: boolean;
  origin: string;
};

export type CheckoutResult =
  | { status: "ok"; url: string }
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; message: string };

const requiredEnv = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_REVIEW_97",
  "STRIPE_PRICE_REVIEW_197",
] as const;

/** The price the session must charge, derived server-side. */
export const priceEnvFor = (managementFree: boolean) =>
  managementFree ? "STRIPE_PRICE_REVIEW_97" : "STRIPE_PRICE_REVIEW_197";

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
  //     line_items: [
  //       { price: process.env[priceEnvFor(req.managementFree)]!, quantity: 1 },
  //     ],
  //     metadata: {
  //       ghl_contact_id: req.cid ?? "",
  //       source: "start-page",
  //       management_free: String(req.managementFree),
  //     },
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
  //
  // TODO(luke): STRIPE_PRICE_REVIEW_197 must be a real recurring price equal
  // to `offer.managed`. Until both prices exist, the countdown on the pricing
  // section is showing a change that checkout cannot actually make.

  return {
    status: "error",
    message: "Stripe integration not yet enabled.",
  };
};
