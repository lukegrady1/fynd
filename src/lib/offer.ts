import { createHmac, timingSafeEqual } from "node:crypto";
import { offer } from "@/content/copy";

/**
 * Deadline rules (spec §5) — the urgency has to be true:
 *  - `exp` comes from the GHL workflow as call time + 72h.
 *  - Missing, malformed, unsigned-but-required, or already past → fall back to
 *    the cohort deadline. Never a negative timer, never a silent reset.
 *  - Over 24h remaining → render the date and time. A ticking clock at 68
 *    hours is theater; a date is information.
 *  - Under 24h → live countdown.
 */

export type Deadline = {
  /** Epoch ms of the deadline actually in force. */
  at: number;
  /** Pre-formatted for SSR so client and server agree. */
  formatted: string;
  /** True when this came from a valid `exp` param rather than the cohort date. */
  perProspect: boolean;
  /** True when under 24h remain and a live countdown should run. */
  urgent: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const cohortDeadlineMs = () => new Date(offer.cohortDeadlineIso).getTime();

/**
 * Formats in a fixed timezone. Without an explicit zone the server and the
 * client format differently and React reports a hydration mismatch.
 */
export const formatDeadline = (ms: number) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: offer.timeZone,
  }).format(new Date(ms));

const sign = (exp: string, secret: string) =>
  createHmac("sha256", secret).update(exp).digest("hex");

/** Constant-time compare that tolerates length mismatch. */
const safeEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

/**
 * Verifies the optional HMAC on `exp` so a forwarded link can't be edited.
 * When OFFER_HMAC_SECRET is unset, signing is treated as not-yet-enabled and
 * `exp` is accepted unsigned — so the page keeps working before the secret is
 * provisioned. Once the secret IS set, an invalid or missing signature is
 * rejected and we fall back to the cohort deadline.
 */
export const verifyExp = (exp: string, sig?: string): boolean => {
  const secret = process.env.OFFER_HMAC_SECRET;
  if (!secret) return true;
  if (!sig) return false;
  return safeEqual(sign(exp, secret), sig);
};

export const resolveDeadline = (
  expParam?: string,
  sigParam?: string,
  now: number = Date.now(),
): Deadline => {
  const cohort = cohortDeadlineMs();
  let at = cohort;
  let perProspect = false;

  const expSeconds = Number(expParam);
  const valid =
    expParam !== undefined &&
    Number.isFinite(expSeconds) &&
    expSeconds > 0 &&
    verifyExp(expParam, sigParam);

  if (valid) {
    const expMs = expSeconds * 1000;
    // A past `exp` falls through to the cohort date rather than showing a
    // negative timer or quietly extending the prospect's clock.
    if (expMs > now) {
      at = expMs;
      perProspect = true;
    }
  }

  // If the cohort date has also passed there is no honest deadline to show;
  // callers render the price without a deadline chip.
  const remaining = at - now;

  return {
    at,
    formatted: formatDeadline(at),
    perProspect,
    urgent: remaining > 0 && remaining < DAY_MS,
  };
};

/** True when the deadline in force is still in the future. */
export const isLive = (d: Deadline, now: number = Date.now()) => d.at > now;

export const priceBlock = {
  /** What the client pays today — the software, at cost. */
  software: offer.software,
  /** What management costs once the free window closes. */
  managed: offer.managed,
  formattedSoftware: `$${offer.software}`,
  formattedManaged: `$${offer.managed}`,
} as const;
