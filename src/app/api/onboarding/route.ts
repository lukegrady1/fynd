import { NextResponse } from "next/server";
import { z } from "zod";

import { notifyGhl } from "@/lib/ghl";
import { recordConnectStatus, upsertOnboardingContact } from "@/lib/ghl-contacts";
import { connectStatusSchema, onboardingSchema } from "@/lib/onboarding";

/**
 * Onboarding writes.
 *
 * Two payload shapes on one route, discriminated by `kind`:
 *
 * - `profile` — everything from steps 1–3, sent as soon as those are valid and
 *   BEFORE the connect step is attempted. Capturing here is the whole point:
 *   someone who bounces off an OAuth screen is still fully onboarded from a
 *   sales point of view, and the connection can be chased by email.
 * - `connect` — the outcome of step 4, "skipped" included.
 *
 * `kind` is read before validation rather than folded into a discriminated
 * union because `onboardingSchema` carries a `.refine()`, and a refined schema
 * can't be `.extend()`ed onto a discriminator.
 *
 * The profile write is NOT best-effort. It goes straight to the GHL v2 API —
 * a contact upsert plus an opportunity in the Fynd Onboarding pipeline — and a
 * failure returns 502 so the form shows an error instead of "That's
 * everything." over data that went nowhere. The webhook to `notifyGhl` still
 * fires alongside it for workflow triggers, and stays best-effort, because
 * telemetry going missing costs nothing.
 *
 * The connect write is best-effort in both channels: by the time it runs the
 * customer's details are already saved, and nobody should see an error because
 * a status field didn't move.
 */

const kindSchema = z.object({ kind: z.enum(["profile", "connect"]) });

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null);
  const kind = kindSchema.safeParse(body);

  if (!kind.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (kind.data.kind === "profile") {
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const data = parsed.data;

    // The write that matters. Everything below it is notification.
    const written = await upsertOnboardingContact({
      ownerName: data.ownerName,
      businessName: data.businessName,
      email: data.email,
      phone: data.phone,
      businessType: data.businessType,
      platform: data.platform,
      otherPlatform: data.otherPlatform,
    });

    if (written.status === "unconfigured") {
      console.error("[onboarding] missing env:", written.missing);
      return NextResponse.json(
        { error: "Could not save your details." },
        { status: 503 },
      );
    }

    if (written.status === "failed") {
      // Logged in full: this is a paying customer whose answers are now only
      // in their browser, and the log line is the one chance to recover them.
      console.error(
        "[onboarding] contact write failed:",
        written.reason,
        JSON.stringify({
          email: data.email,
          business: data.businessName,
          phone: data.phone,
        }),
      );
      return NextResponse.json(
        { error: "Could not save your details." },
        { status: 502 },
      );
    }

    await notifyGhl(
      {
        event: "onboarding_submitted",
        ghl_contact_id: written.contactId,
        page: "welcome",
        meta: {
          owner_name: data.ownerName,
          business_name: data.businessName,
          email: data.email,
          phone: data.phone,
          business_type: data.businessType,
          platform: data.platform,
          // The free-text answer is the product signal — if fifteen people
          // type the same name, that is the next integration to build.
          other_platform: data.otherPlatform ?? null,
          completion_signal: data.completionSignal ?? null,
        },
      },
      // Idempotent on the person, not the moment, so a double-click can't
      // create two onboarding records.
      data.email,
    );

    return NextResponse.json({ ok: true, contactId: written.contactId });
  }

  const parsed = connectStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const data = parsed.data;

  const recorded = await recordConnectStatus(
    data.email,
    data.status,
    data.completionSignal,
  );
  if (recorded.status !== "ok") {
    console.error("[onboarding] connect status not recorded:", recorded);
  }

  await notifyGhl(
    {
      event: "onboarding_connect",
      ghl_contact_id: data.cid ?? null,
      page: "welcome",
      meta: {
        email: data.email,
        platform: data.platform,
        status: data.status,
        completion_signal: data.completionSignal ?? null,
      },
    },
    `${data.email}:${data.platform}`,
  );

  return NextResponse.json({ ok: true });
};
