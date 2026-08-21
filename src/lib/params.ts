import { z } from "zod";

/**
 * Query params arrive from GHL workflows and end up in the DOM, so `fn` and
 * `biz` are sanitized hard: HTML stripped, control characters removed, capped
 * at 40 chars, title-cased. An empty result is treated as absent so pages fall
 * back to generic copy rather than rendering "for undefined" or a blank gap.
 */

const MAX_LEN = 40;

/** Words that should stay lowercase inside a title-cased name. */
const MINOR = new Set(["and", "of", "the", "for", "to", "at", "in", "on", "by"]);

const titleCase = (input: string) =>
  input
    .split(/\s+/)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && MINOR.has(lower)) return lower;
      // Preserve intentional inner caps (McKay, MrDetails, LLC) rather than
      // flattening them — CRM fields often carry real brand casing.
      if (/[a-z]/.test(word) && /[A-Z]/.test(word.slice(1))) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");

export const sanitizeName = (raw?: string | string[]): string | undefined => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return undefined;

  const cleaned = value
    // Strip anything tag-shaped before decoding, then any stray brackets.
    .replace(/<[^>]*>/g, " ")
    .replace(/[<>]/g, " ")
    // Drop control characters.
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LEN)
    .trim();

  if (!cleaned) return undefined;
  return titleCase(cleaned);
};

/** `cid` is an opaque CRM id — allow only safe id characters. */
export const sanitizeId = (raw?: string | string[]): string | undefined => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().slice(0, 64);
  return /^[A-Za-z0-9_-]+$/.test(cleaned) ? cleaned : undefined;
};

const firstString = (raw?: string | string[]) =>
  Array.isArray(raw) ? raw[0] : raw;

export type SearchParams = Record<string, string | string[] | undefined>;

export type PageParams = {
  cid?: string;
  firstName?: string;
  biz?: string;
  exp?: string;
  sig?: string;
  cancelled: boolean;
  /** Passed through to the GHL calendar prefill. */
  phone?: string;
  email?: string;
};

export const emailSchema = z.string().email().max(120);
export const phoneSchema = z.string().regex(/^[+0-9() .-]{7,20}$/);

export const parseParams = (sp: SearchParams): PageParams => {
  const email = firstString(sp.email);
  const phone = firstString(sp.phone);

  return {
    cid: sanitizeId(sp.cid),
    firstName: sanitizeName(sp.fn),
    biz: sanitizeName(sp.biz),
    exp: firstString(sp.exp),
    sig: firstString(sp.sig),
    cancelled: firstString(sp.cancelled) === "1",
    email: emailSchema.safeParse(email).success ? email : undefined,
    phone: phoneSchema.safeParse(phone).success ? phone : undefined,
  };
};
