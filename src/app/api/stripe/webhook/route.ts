import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  constructWebhookEvent,
  ensureSubscription,
  oneTimeGhl,
  oneTimePage,
  readOneTimeSession,
} from "@/lib/stripe";
import { notifyGhl } from "@/lib/ghl";
import { recordOneTimeCustomer, recordPaidCustomer } from "@/lib/ghl-contacts";

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

  // A one-time purchase: nothing to build, just the contact to record.
  if (result.status === "none") {
    return oneTimePurchase(session);
  }

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

  // Open the onboarding card as soon as they pay, not when they get round to
  // the form. Runs on every delivery, not just first creation: the contact
  // write is idempotent, and a customer missing from GHL is worse than a
  // redundant upsert. Deliberately not fatal — Stripe must not retry forever
  // because GHL had a bad minute, and the subscription is already safe.
  const plan = session.metadata?.plan;
  const email = session.customer_details?.email;
  if (email) {
    const written = await recordPaidCustomer({
      email,
      name: session.customer_details?.name,
      phone: session.customer_details?.phone,
      ...(plan === "gbp-management" ? { tag: "fynd-manage-paid" } : {}),
    });
    if (written.status !== "ok") {
      console.error(
        "[stripe-webhook] paid customer not written to GHL:",
        JSON.stringify({ session: session.id, email, written }),
      );
    }
  } else {
    console.error("[stripe-webhook] no email on session", session.id);
  }

  if (result.status === "created") {
    // Only on first creation: the success page fires the same event, and
    // "existing" means somebody already did.
    await notifyGhl(
      {
        event: "checkout_completed",
        ghl_contact_id: session.metadata?.ghl_contact_id ?? null,
        page:
          plan === "gbp-management"
            ? "manage"
            : plan === "website-reviews"
              ? "website"
              : "start",
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

/**
 * The $99 profile optimization and anything else sold once. Tags the contact
 * so a GHL workflow can send the access steps; no pipeline card, because the
 * onboarding pipeline is the subscription's. Non-fatal like the subscription
 * path's GHL write, and the thank-you page makes the same write as a backstop.
 */
const oneTimePurchase = async (session: Stripe.Checkout.Session) => {
  const paid = await readOneTimeSession(session.id);

  if (paid.status !== "paid") {
    // "unpaid" on a completed session should not happen; the rest are
    // Stripe trouble worth a retry.
    console.error(
      "[stripe-webhook] one-time session not readable:",
      session.id,
      paid.status === "error" ? paid.message : paid.status,
    );
    return NextResponse.json({ error: "Retry." }, { status: 500 });
  }

  if (paid.email) {
    const written = await recordOneTimeCustomer({
      email: paid.email,
      name: paid.name,
      phone: paid.phone,
      ...oneTimeGhl(paid.product),
    });
    if (written.status !== "ok") {
      console.error(
        "[stripe-webhook] one-time customer not written to GHL:",
        JSON.stringify({ session: session.id, email: paid.email, written }),
      );
    }
  } else {
    console.error("[stripe-webhook] no email on session", session.id);
  }

  await notifyGhl(
    {
      event: "checkout_completed",
      ghl_contact_id: paid.ghlContactId,
      page: oneTimePage(paid.product),
      meta: {
        amount_total: session.amount_total,
        customer_email: paid.email,
        product: paid.product,
      },
    },
    session.id, // idempotent per checkout session
  );

  return NextResponse.json({ received: true, subscription: "none" });
};
