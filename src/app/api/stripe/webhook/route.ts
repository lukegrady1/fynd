import { NextResponse } from "next/server";
import { notifyGhl } from "@/lib/ghl";

/**
 * Stripe webhook receiver.
 *
 * STUB — the signature MUST be verified before this is pointed at a live
 * endpoint. Right now an unverified request is rejected outright rather than
 * trusted, so enabling the route by accident can't fire GHL workflows.
 */

export const POST = async (request: Request) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Raw body is required for signature verification — do not use request.json().
  const raw = await request.text();

  // TODO(integration): install `stripe` and verify before trusting the payload.
  //
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //   let event: Stripe.Event;
  //   try {
  //     event = stripe.webhooks.constructEvent(raw, signature, secret);
  //   } catch {
  //     return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  //   }
  //   if (event.type !== "checkout.session.completed") {
  //     return NextResponse.json({ received: true });
  //   }
  //   const session = event.data.object as Stripe.Checkout.Session;
  //   await notifyGhl(
  //     {
  //       event: "checkout_completed",
  //       ghl_contact_id: session.metadata?.ghl_contact_id ?? null,
  //       page: "start",
  //       meta: {
  //         amount_total: session.amount_total,
  //         customer_email: session.customer_details?.email,
  //         subscription: session.subscription,
  //       },
  //     },
  //     session.id, // idempotent per checkout session
  //   );
  //   return NextResponse.json({ received: true });

  void raw;
  void notifyGhl;

  return NextResponse.json(
    { error: "Webhook verification not yet enabled." },
    { status: 501 },
  );
};
