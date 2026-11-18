import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { auditNote, readAuditLead } from "@/lib/gbp-audit-lead";
import { recordAuditLead } from "@/lib/ghl-contacts";

/**
 * POST /api/webhooks/gbp-audit?key=<GBP_AUDIT_WEBHOOK_SECRET>
 *
 * Where the free GBP audit tool sends its leads (the "GBP Audit Leads
 * Webhook" setting in the tool). Each lead becomes a GHL contact tagged
 * `gbp-audit-lead`, source "GBP Audit", with the whole payload as a note;
 * the tag fires the GHL workflow that pushes a notification to the
 * LeadConnector app.
 *
 * The tool doesn't sign its requests, so the shared secret rides in the
 * URL. Without the env var set the route refuses everything rather than
 * taking leads from anyone who finds it.
 *
 * Returns 200 once the contact is written, 500 if GHL failed (so a tool
 * that retries will), and 422 for a payload with no email or phone, which
 * no retry fixes.
 */
export const runtime = "nodejs";

const keyMatches = (given: string | null, expected: string) => {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const readBody = async (req: Request): Promise<unknown> => {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    return Object.fromEntries((await req.formData()).entries());
  }
  const text = await req.text();
  try {
    return JSON.parse(text);
  } catch {
    return { body: text };
  }
};

export async function POST(req: Request) {
  const secret = process.env.GBP_AUDIT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[gbp-audit] GBP_AUDIT_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  if (!keyMatches(new URL(req.url).searchParams.get("key"), secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const lead = readAuditLead(await readBody(req));
  // The keys only, never the values: enough to see the tool's shape in the
  // logs without writing leads' details there.
  console.log("[gbp-audit] received keys:", lead.fields.map(([p]) => p).join(", "));

  const result = await recordAuditLead({ ...lead, note: auditNote(lead) });

  if (result.status === "ok") {
    return NextResponse.json({ ok: true, contactId: result.contactId });
  }
  console.error("[gbp-audit] not recorded:", result.status === "failed" ? result.reason : result.missing);
  if (result.status === "failed" && result.reason.startsWith("no email or phone")) {
    return NextResponse.json({ error: result.reason }, { status: 422 });
  }
  return NextResponse.json({ error: "could not record lead" }, { status: 500 });
}
