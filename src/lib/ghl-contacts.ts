import "server-only";

/**
 * Direct writes to the GoHighLevel v2 API.
 *
 * Separate from `ghl.ts` on purpose. That module is a fire-and-forget webhook
 * for funnel telemetry — it degrades to `skipped` when unconfigured, because
 * losing a `calendar_viewed` event costs nothing. This module carries the only
 * copy of a customer's onboarding answers, so it does the opposite: it fails
 * loudly, and the caller is expected to surface that failure rather than tell
 * the customer they're done.
 *
 * Auth is a Private Integration Token scoped to one sub-account. It is a
 * secret — server-only, never `NEXT_PUBLIC_`.
 */

const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

/**
 * Custom field keys, created in the sub-account.
 *
 * **Write them WITHOUT the `contact.` prefix.** `GET /contacts/{id}` and the
 * customFields endpoint both report the key as `contact.fynd_business_type`,
 * but sending that on a write is accepted with a 200 and then silently
 * ignored — the field just never lands. Only the bare key works. This cost a
 * debugging round; do not "fix" these by pasting the key back from a GET.
 *
 * All TEXT (bar the last) deliberately: a picklist in GHL that drifted from
 * the roster in `src/content/onboarding.ts` would 422 the whole upsert and
 * lose the customer — exactly the failure this module exists to prevent.
 * Convert them to dropdowns in the GHL UI later if the roster ever settles.
 */
export const FIELD = {
  businessType: "fynd_business_type",
  bookingPlatform: "fynd_booking_platform",
  otherPlatform: "fynd_other_platform",
  connectStatus: "fynd_connect_status",
  completionSignal: "fynd_completion_signal",
} as const;

/** Stage ids for the "Fynd Onboarding" pipeline. */
export const STAGE = {
  formSubmitted: "64a6e44f-e18f-4e49-87a0-535a3cbd0076",
  needsAccess: "ea9a7036-482d-4300-8b6e-e9317b130d0b",
  accessPending: "870b7eac-1c06-44c4-8dd4-eeb564671232",
  connected: "00fc936f-83d8-4d78-beda-1a0224e29618",
} as const;

export type GhlConfig = { token: string; locationId: string; pipelineId: string };

export const ghlConfig = (): GhlConfig | null => {
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID;
  const pipelineId = process.env.GHL_ONBOARDING_PIPELINE_ID;
  if (!token || !locationId || !pipelineId) return null;
  return { token, locationId, pipelineId };
};

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Version: VERSION,
  "Content-Type": "application/json",
  Accept: "application/json",
});

/**
 * Splits a single "owner name" field into the first/last GHL wants.
 *
 * Everything after the first space is the surname, so "Mary Anne van Dijk"
 * keeps its surname intact. A single word leaves lastName empty rather than
 * duplicating — a contact called "Jamie Jamie" looks like a bug to whoever
 * opens the record.
 */
const splitName = (full: string) => {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
};

export type OnboardingContact = {
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  platform: string;
  otherPlatform?: string;
};

export type WriteResult =
  | { status: "ok"; contactId: string; opportunityId: string | null }
  | { status: "unconfigured"; missing: string }
  | { status: "failed"; reason: string };

const request = async (
  config: GhlConfig,
  path: string,
  init: { method: string; body: unknown },
) => {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: headers(config.token),
    body: JSON.stringify(init.body),
    // These are short writes on a request path a human is waiting on. Without
    // a bound, a hung GHL leaves the customer staring at a spinner.
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${path} responded ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res.json();
};

/**
 * Creates or updates the contact, then opens an opportunity in the Fynd
 * Onboarding pipeline.
 *
 * `upsert` keys on email within the location, so a customer who reloads the
 * form and submits twice updates one record instead of creating two.
 *
 * The opportunity is best-effort: if the contact write succeeded we have the
 * customer's details, which is the part that cannot be reconstructed. A failed
 * opportunity is logged and reported as a null id rather than failing the
 * whole submission and telling a customer their details didn't save when they
 * did.
 */
export const upsertOnboardingContact = async (
  contact: OnboardingContact,
): Promise<WriteResult> => {
  const config = ghlConfig();
  if (!config) {
    return {
      status: "unconfigured",
      missing: "GHL_PIT / GHL_LOCATION_ID / GHL_ONBOARDING_PIPELINE_ID",
    };
  }

  const { firstName, lastName } = splitName(contact.ownerName);

  let contactId: string;
  try {
    const result = await request(config, "/contacts/upsert", {
      method: "POST",
      body: {
        locationId: config.locationId,
        firstName,
        lastName,
        name: contact.ownerName,
        email: contact.email,
        phone: contact.phone,
        companyName: contact.businessName,
        source: "Fynd onboarding form",
        customFields: [
          { key: FIELD.businessType, field_value: contact.businessType },
          { key: FIELD.bookingPlatform, field_value: contact.platform },
          ...(contact.otherPlatform
            ? [{ key: FIELD.otherPlatform, field_value: contact.otherPlatform }]
            : []),
        ],
      },
    });
    contactId = result?.contact?.id;
    if (!contactId) throw new Error("upsert returned no contact id");

    // GHL answers 200 and drops customFields it doesn't recognise, so a
    // renamed or deleted field would quietly stop recording answers with
    // nothing in the logs. Cheap tripwire: we always send at least two.
    if (!result?.contact?.customFields?.length) {
      console.error(
        "[ghl] contact saved but NO custom fields landed — check the field keys in FIELD against the sub-account:",
        contactId,
      );
    }
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }

  let opportunityId: string | null = null;
  try {
    const opp = await request(config, "/opportunities/", {
      method: "POST",
      body: {
        pipelineId: config.pipelineId,
        locationId: config.locationId,
        pipelineStageId: STAGE.formSubmitted,
        name: contact.businessName,
        status: "open",
        contactId,
      },
    });
    opportunityId = opp?.opportunity?.id ?? null;
  } catch (error) {
    console.error("[ghl] opportunity create failed:", error);
  }

  return { status: "ok", contactId, opportunityId };
};

/**
 * Records the outcome of the connect step and moves the opportunity.
 *
 * Keyed by email rather than a returned id so it works even if the browser
 * lost the contact id between steps. Non-fatal throughout: the profile is
 * already saved by the time this runs, and a customer should never see an
 * error because a status field didn't move.
 */
export const recordConnectStatus = async (
  email: string,
  status: "oauth_started" | "invite_sent" | "manual" | "skipped",
  completionSignal?: string,
): Promise<WriteResult> => {
  const config = ghlConfig();
  if (!config) {
    return { status: "unconfigured", missing: "GHL_PIT / GHL_LOCATION_ID" };
  }

  try {
    const result = await request(config, "/contacts/upsert", {
      method: "POST",
      body: {
        locationId: config.locationId,
        email,
        customFields: [
          { key: FIELD.connectStatus, field_value: status },
          ...(completionSignal
            ? [{ key: FIELD.completionSignal, field_value: completionSignal }]
            : []),
        ],
      },
    });

    const contactId: string | undefined = result?.contact?.id;
    if (contactId) await moveOpportunity(config, contactId, status);

    return { status: "ok", contactId: contactId ?? "", opportunityId: null };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
};

/**
 * "Skipped" is the one that needs chasing, so it gets its own stage.
 *
 * The form no longer offers a skip link, so nothing emits this today and the
 * "Needs access" stage sits unused. Kept because the status is still valid on
 * the API and the stage still exists in GHL — re-adding the escape hatch is a
 * copy change, not a schema change.
 */
const stageFor = (status: string) =>
  status === "skipped" ? STAGE.needsAccess : STAGE.accessPending;

const moveOpportunity = async (
  config: GhlConfig,
  contactId: string,
  status: string,
) => {
  try {
    const search = await fetch(
      `${API}/opportunities/search?location_id=${config.locationId}&contact_id=${contactId}&pipeline_id=${config.pipelineId}`,
      { headers: headers(config.token), signal: AbortSignal.timeout(10_000) },
    );
    if (!search.ok) return;

    const found = await search.json();
    const id = found?.opportunities?.[0]?.id;
    if (!id) return;

    await request(config, `/opportunities/${id}`, {
      method: "PUT",
      body: { pipelineStageId: stageFor(status) },
    });
  } catch (error) {
    console.error("[ghl] opportunity move failed:", error);
  }
};
