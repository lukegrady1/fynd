import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/stripe";
import { notifyGhl } from "@/lib/ghl";

const bodySchema = z.object({
  cid: z.string().max(64).nullable().optional(),
  plan: z.literal("review-system"),
});

export const POST = async (request: Request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const cid = parsed.data.cid ?? null;
  const origin = new URL(request.url).origin;

  // Fires before redirect so the abandoned-checkout sequence has a trigger.
  await notifyGhl(
    {
      event: "checkout_started",
      ghl_contact_id: cid,
      page: "start",
      meta: { plan: parsed.data.plan },
    },
    `${Date.now()}`,
  );

  const result = await createCheckoutSession({
    cid,
    plan: parsed.data.plan,
    origin,
  });

  if (result.status === "ok") {
    return NextResponse.json({ url: result.url });
  }

  if (result.status === "unconfigured") {
    console.error("[checkout] missing env:", result.missing.join(", "));
    return NextResponse.json(
      {
        error:
          "Checkout isn't available right now. Please book a call and I'll get you set up.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      error:
        "Something went wrong starting checkout. Please book a call and I'll get you set up.",
    },
    { status: 500 },
  );
};
