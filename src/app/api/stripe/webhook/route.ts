import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { constructWebhookEvent, ensureSubscription } from "@/lib/stripe";
import { notifyGhl } from "@/lib/ghl";

/**
 * Stripe webhook receiver.
 *
 * Exists for one job: the customer paid in `payment` mode, and the
 * subscription that follows has to be created even if their browser never
 * reaches the success page. This is the reliable half of that pair — Stripe
 * retries it for days, a closed tab does not.
 *
 * Everything here is idempotent. Stripe delivers at-least-once, and the
 * success page races this on every normal checkout, so duplicate work is the
 * expected case rather than an edge one.
 */

/** Signature verification needs the exact bytes Stripe signed. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Raw body — request.json() would reformat it and break verification.
  const raw = await request.text();
  const verified = constructWebhookEvent(raw, signature);

  if (verified.status === "unconfigured") {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  if (verified.status === "invalid") {
    // 400 so Stripe stops retrying: a bad signature will never become good.
    console.error("[stripe-webhook] rejected:", verified.message);
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  const event = verified.event;

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const result = await ensureSubscription(session.id);

  if (result.status === "error" || result.status === "unconfigured") {
    // 500 so Stripe retries. This is the path where a customer has paid and
    // has no subscription, and a retry is the thing that fixes it.
    console.error(
      "[stripe-webhook] subscription not created for",
      session.id,
      result.status === "error" ? result.message : "unconfigured",
    );
    return NextResponse.json({ error: "Retry." }, { status: 500 });
  }

  if (result.status === "created") {
    // Only on first creation: the success page fires the same event, and
    // "existing" means somebody already did.
    await notifyGhl(
      {
        event: "checkout_completed",
        ghl_contact_id: session.metadata?.ghl_contact_id ?? null,
        page: "start",
        meta: {
          amount_total: session.amount_total,
          customer_email: session.customer_details?.email,
          subscription: result.subscriptionId,
        },
      },
      session.id, // idempotent per checkout session
    );
  }

  return NextResponse.json({ received: true, subscription: result.status });
};
