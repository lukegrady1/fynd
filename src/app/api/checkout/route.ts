import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createCheckoutSession,
  createOneTimeCheckoutSession,
  createTrialCheckoutSession,
} from "@/lib/stripe";
import { OFFERS } from "@/lib/offers";
import {
  CANCEL_PATHS,
  ONE_TIME_PRODUCTS,
  PLAN_LIST,
  TRIAL_PLANS,
  isOneTimeProduct,
  isTrialPlan,
} from "@/lib/stripe-plans";
import { notifyGhl } from "@/lib/ghl";
import { siteOrigin } from "@/lib/site-origin";

const bodySchema = z.object({
  cid: z.string().max(64).nullable().optional(),
  plan: z.enum([...PLAN_LIST, ...ONE_TIME_PRODUCTS, ...TRIAL_PLANS]),
  cancelPath: z.enum(CANCEL_PATHS).optional(),
});

const pageFor = (plan: z.infer<typeof bodySchema>["plan"]) =>
  plan === "website-reviews"
    ? "website"
    : plan === "gbp-optimization"
      ? "optimize"
      : plan === "gbp-management"
        ? "manage"
        : plan === "review-trial"
          ? "watch"
          : "start";

const UNAVAILABLE =
  "Checkout isn't available right now. Please book a call and I'll get you set up.";

export const POST = async (request: Request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const cid = parsed.data.cid ?? null;
  const { plan } = parsed.data;
  // Where Stripe sends them back. Not the request origin — see site-origin.ts.
  const origin = siteOrigin(request);

  // Fires before redirect so the abandoned-checkout sequence has a trigger.
  await notifyGhl(
    {
      event: "checkout_started",
      ghl_contact_id: cid,
      page: pageFor(plan),
      meta: { plan },
    },
    `${Date.now()}`,
  );

  // Three builders, deliberately: the one-time products never touch the
  // code that saves a card and creates a subscription, and the free trial
  // (the /watch button, the same session as /offer/trial) never touches the
  // code that charges a month up front.
  const result = isTrialPlan(plan)
    ? await createTrialCheckoutSession({
        offer: { slug: "trial", ...OFFERS.trial },
        cid,
        origin,
        cancelPath: parsed.data.cancelPath,
        fromLink: false,
      })
    : isOneTimeProduct(plan)
      ? await createOneTimeCheckoutSession({ cid, product: plan, origin })
      : await createCheckoutSession({
          cid,
          plan,
          origin,
          cancelPath: parsed.data.cancelPath,
        });

  if (result.status === "ok") {
    return NextResponse.json({ url: result.url });
  }

  if (result.status === "unconfigured") {
    console.error("[checkout] missing env:", result.missing.join(", "));
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }

  return NextResponse.json(
    {
      error:
        "Something went wrong starting checkout. Please book a call and I'll get you set up.",
    },
    { status: 500 },
  );
};
