import { NextResponse, type NextRequest } from "next/server";

import { offerLinks } from "@/content/copy";
import { notifyGhl } from "@/lib/ghl";
import { findOffer } from "@/lib/offers";
import { sanitizeId } from "@/lib/params";
import { siteOrigin } from "@/lib/site-origin";
import {
  createCheckoutSession,
  createDeferredCheckoutSession,
} from "@/lib/stripe";

/**
 * fynnd.co/offer/<slug> — a payment link that never expires.
 *
 * Every visit mints a new Stripe Checkout Session and 303s to it, so the URL
 * in the text message stays good while each session behind it is fresh. The
 * offers themselves are in `src/lib/offers.ts`. `?cid=` is carried into
 * Stripe metadata like the Start now buttons.
 *
 * Link previews are answered with a small HTML card instead. iMessage,
 * WhatsApp and Slack all fetch a link the moment it is sent; without this,
 * every text would mint a session and fire `checkout_started` at GHL, which
 * starts the abandoned-checkout sequence on someone who has not opened it.
 */

export const dynamic = "force-dynamic";

const NO_INDEX = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

/**
 * Apple's link previews identify as facebookexternalhit + Twitterbot, so
 * those two cover iMessage as well.
 */
const PREVIEW_BOT =
  /bot\b|crawler|spider|facebookexternalhit|facebot|twitterbot|whatsapp|slack|discord|telegram|linkedin|skypeuri|embedly|pinterest|preview/i;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const previewCard = (title: string, description: string, origin: string) => {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${t}</title><meta name="robots" content="noindex, nofollow"><meta name="description" content="${d}"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:site_name" content="Fynd"><meta property="og:type" content="website"><meta property="og:image" content="${origin}/opengraph-image.png"><meta name="twitter:card" content="summary_large_image"></head><body></body></html>`;
};

/** Where a link goes when it cannot mint a session: the plan's own page. */
const fallbackPath = (plan: "review-system" | "website-reviews") =>
  plan === "website-reviews" ? "/website" : "/";

export const GET = async (
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await ctx.params;
  const origin = siteOrigin(request);
  const offer = findOffer(slug.toLowerCase());

  // A mistyped link lands on the homepage rather than a bare 404.
  if (!offer) {
    return NextResponse.redirect(`${origin}/`, { status: 303, headers: NO_INDEX });
  }

  // Netlify hands HEAD to this GET handler rather than to HEAD below, so it
  // is checked here too. Link checkers and uptime monitors send it; minting
  // a session for each would fill Stripe with abandoned checkouts.
  if (request.method === "HEAD") {
    return new NextResponse(null, { headers: NO_INDEX });
  }

  if (PREVIEW_BOT.test(request.headers.get("user-agent") ?? "")) {
    const copy = offerLinks[offer.slug];
    return new NextResponse(previewCard(copy.title, copy.description, origin), {
      headers: { ...NO_INDEX, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const cid = sanitizeId(request.nextUrl.searchParams.get("cid") ?? undefined) ?? null;

  const result =
    offer.billing === "deferred"
      ? await createDeferredCheckoutSession({ offer, cid, origin })
      : await createCheckoutSession({ cid, plan: offer.plan, origin, offer: offer.slug });

  if (result.status === "ok") {
    // Only once a real session exists, so a closed or broken link never
    // starts an abandoned-checkout sequence.
    await notifyGhl(
      {
        event: "checkout_started",
        ghl_contact_id: cid,
        page: offer.plan === "website-reviews" ? "website" : "start",
        meta: { plan: offer.plan, offer: offer.slug },
      },
      `${Date.now()}`,
    );
    return NextResponse.redirect(result.url, { status: 303, headers: NO_INDEX });
  }

  if (result.status !== "closed") {
    console.error(
      `[offer] ${offer.slug} could not mint a session:`,
      result.status === "error" ? result.message : result.missing.join(", "),
    );
  }

  // Closed (a deferred date has passed) or Stripe failed: the plan's public
  // page still has a working Start now button and a way to book a call.
  return NextResponse.redirect(`${origin}${fallbackPath(offer.plan)}`, {
    status: 303,
    headers: NO_INDEX,
  });
};

/** Link checkers send HEAD. Answer without minting anything. */
export const HEAD = () => new NextResponse(null, { headers: NO_INDEX });
