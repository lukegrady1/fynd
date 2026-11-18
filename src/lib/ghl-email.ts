import "server-only";

import { onboardingEmails, type EmailVars } from "@/content/emails";
import type { OnboardingService } from "@/lib/services";
import { renderEmail } from "./email-html";

/**
 * Sends the per-service onboarding email through GoHighLevel.
 *
 * Why GHL and not a mail API: the email goes out as a conversation message
 * on the contact, so it shows in the contact's timeline, it comes from the
 * fynnd.co sending domain configured in GHL (Settings → Email Services →
 * Dedicated Domain), and when the customer hits reply the answer lands in
 * the GHL inbox next to their texts instead of in somebody's personal
 * mailbox. The thanks pages promise "reply to the first email you get from
 * us"; this is what makes that true.
 *
 * Idempotent by tag. Stripe delivers the webhook at least once, so before
 * sending we read the contact's tags and skip if `fynd-email:<service>` is
 * already there; after sending we add it. Two deliveries a second apart
 * could still both send (GHL has no idempotency key on this endpoint), so
 * the sender is only called from the webhook, never from the success pages
 * that race it.
 *
 * Fails soft. A paying customer's subscription is already safe by the time
 * this runs, and Stripe must not retry the webhook forever because mail
 * had a bad minute. The caller logs the result; the contact is still tagged
 * with the service, so a GHL workflow or a human can send it by hand.
 */

const API = "https://services.leadconnectorhq.com";

export const sentTag = (service: OnboardingService) => `fynd-email:${service}`;

export type SendResult =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "unconfigured"; missing: string }
  | { status: "failed"; reason: string };

const headers = (token: string, version: string) => ({
  Authorization: `Bearer ${token}`,
  Version: version,
  "Content-Type": "application/json",
  Accept: "application/json",
});

const call = async (
  token: string,
  version: string,
  path: string,
  init?: { method: string; body: unknown },
) => {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: headers(token, version),
    ...(init ? { body: JSON.stringify(init.body) } : {}),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${path} responded ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res.json();
};

/**
 * "Luke at Fynd <luke@fynnd.co>" → { name, address }. GHL takes the two
 * apart: `emailFrom` is the address, `fromName` the display name.
 */
const parseFrom = (raw: string | undefined) => {
  const value = raw?.trim();
  if (!value) return null;
  const match = value.match(/^(.*?)\s*<([^>]+)>$/);
  return match
    ? { name: match[1].trim() || null, address: match[2].trim() }
    : { name: null, address: value };
};

export const sendOnboardingEmail = async (input: {
  contactId: string;
  /** The customer's address, so GHL sends to this one even if the contact has several. */
  email: string;
  service: OnboardingService;
  vars: EmailVars;
}): Promise<SendResult> => {
  const token = process.env.GHL_PIT;
  if (!token) return { status: "unconfigured", missing: "GHL_PIT" };

  const tag = sentTag(input.service);

  let existingTags: string[] = [];
  try {
    const found = await call(token, "2021-07-28", `/contacts/${input.contactId}`);
    existingTags = (found?.contact?.tags ?? []).map((t: string) => t.toLowerCase());
  } catch (error) {
    // Can't tell whether it was sent. Sending twice beats never sending,
    // but log it so a double is explainable.
    console.error("[ghl-email] could not read tags before sending:", error);
  }
  if (existingTags.includes(tag)) {
    return { status: "skipped", reason: `already tagged ${tag}` };
  }

  const content = onboardingEmails[input.service](input.vars);
  const { html } = renderEmail(content);
  const from = parseFrom(process.env.FYND_EMAIL_FROM);

  try {
    const sent = await call(token, "2021-04-15", "/conversations/messages", {
      method: "POST",
      body: {
        type: "Email",
        contactId: input.contactId,
        emailTo: input.email,
        subject: content.subject,
        html,
        ...(from ? { emailFrom: from.address } : {}),
        ...(from?.name ? { fromName: from.name } : {}),
      },
    });

    // Best effort: a missed tag means a possible second email, not a lost one.
    try {
      await call(token, "2021-07-28", `/contacts/${input.contactId}/tags`, {
        method: "POST",
        body: { tags: [tag] },
      });
    } catch (error) {
      console.error("[ghl-email] sent but could not add tag", tag, error);
    }

    return { status: "sent", messageId: sent?.messageId ?? sent?.emailMessageId ?? null };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
};
