import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createCheckoutSession,
  createOneTimeCheckoutSession,
} from "@/lib/stripe";
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

  // TODO(stripe): the /watch free trial. No session builder exists for it
  // yet — it needs a setup-mode session (card saved, nothing charged) and a
  // subscription trialing `offer.trialDays` days, the shape
  // `createDeferredCheckoutSession` already uses minus the one-time charge.
  // Until then the button gets the same "not available" answer as missing
  // env, rather than falling into `createCheckoutSession` and charging $97
  // under a "free trial" label.
  if (isTrialPlan(plan)) {
    console.error("[checkout] trial checkout not built yet:", plan);
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }

  // Two builders, deliberately: the one-time products never touch the code
  // that saves a card and creates a subscription.
  const result = isOneTimeProduct(plan)
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
