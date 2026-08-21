import "server-only";

/**
 * GoHighLevel outbound webhook helper.
 *
 * STUB — the normalized payload shape and idempotency contract are final and
 * match the other Grady Digital webhooks, but the actual POST is not enabled
 * until GHL_INBOUND_WEBHOOK_URL is provisioned. Until then this logs and
 * returns `skipped` rather than throwing, so pages keep working locally.
 */

export type GhlEvent =
  | "checkout_started"
  | "checkout_completed"
  | "calendar_viewed"
  | "vsl_watched_50"
  | "booking_completed";

export type GhlPayload = {
  event: GhlEvent;
  ghl_contact_id: string | null;
  page: "start" | "call";
  timestamp: string;
  meta: Record<string, unknown>;
};

export type GhlResult =
  | { status: "sent" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

/**
 * Idempotency key so a retried webhook doesn't double-fire a GHL workflow.
 * Keyed on contact + event + a caller-supplied discriminator (a Stripe session
 * id, a booking id) so genuine repeat events still get through.
 */
export const idempotencyKey = (
  event: GhlEvent,
  contactId: string | null,
  discriminator: string,
) => `${event}:${contactId ?? "anon"}:${discriminator}`;

export const notifyGhl = async (
  payload: Omit<GhlPayload, "timestamp">,
  discriminator: string,
): Promise<GhlResult> => {
  const url = process.env.GHL_INBOUND_WEBHOOK_URL;

  const body: GhlPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  if (!url) {
    console.warn(
      "[ghl] GHL_INBOUND_WEBHOOK_URL not set — webhook not sent:",
      body.event,
    );
    return { status: "skipped", reason: "GHL_INBOUND_WEBHOOK_URL not set" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey(
          payload.event,
          payload.ghl_contact_id,
          discriminator,
        ),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { status: "failed", reason: `GHL responded ${res.status}` };
    }
    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
};

/**
 * Builds the GHL calendar embed URL with prefill so nobody retypes their
 * details on a phone keyboard.
 */
export const calendarEmbedUrl = (prefill: {
  firstName?: string;
  phone?: string;
  email?: string;
}) => {
  const id = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID;
  if (!id) return null;

  const url = new URL(`https://api.leadconnectorhq.com/widget/booking/${id}`);
  url.searchParams.set("prefill", "true");
  if (prefill.firstName) url.searchParams.set("first_name", prefill.firstName);
  if (prefill.phone) url.searchParams.set("phone", prefill.phone);
  if (prefill.email) url.searchParams.set("email", prefill.email);
  return url.toString();
};
