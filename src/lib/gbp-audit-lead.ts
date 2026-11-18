/**
 * Reading a lead out of the GBP audit tool's webhook.
 *
 * The audit tool (audit.seo.fynnd.co, the white-labelled platform's) posts
 * a lead when someone runs an audit. Its payload shape isn't documented to
 * us, so this doesn't assume one: it flattens whatever arrives (JSON or a
 * form post) into `path: value` pairs and picks the contact fields out by
 * what the keys and values look like. Everything it received, matched or
 * not, goes on the GHL contact as a note, so nothing the tool sent is lost
 * even if a field lands under a name we didn't expect.
 */

export type AuditLead = {
  email: string | null;
  phone: string | null;
  name: string | null;
  businessName: string | null;
  website: string | null;
  /** Every scalar in the payload, flattened, for the note. */
  fields: [path: string, value: string][];
};

const flatten = (value: unknown, path = "", out: [string, string][] = []): [string, string][] => {
  if (value === null || value === undefined || value === "") return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${path}[${i}]`, out));
  } else if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, path ? `${path}.${k}` : k, out);
    }
  } else {
    out.push([path, String(value).trim()]);
  }
  return out;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The last segment of a path, lower-cased, without separators: "contact.First_Name" -> "firstname". */
const leaf = (path: string) =>
  (path.split(".").pop() ?? path).replace(/\[\d+\]/g, "").toLowerCase().replace(/[^a-z]/g, "");

const find = (fields: [string, string][], test: (key: string, value: string, path: string) => boolean) =>
  fields.find(([p, v]) => test(leaf(p), v, p.toLowerCase()))?.[1] ?? null;

/** A path under a business/company/location object, e.g. "business.name". */
const BUSINESS_PATH = /(business|company|location|profile|gbp|listing)/;

export const readAuditLead = (payload: unknown): AuditLead => {
  const fields = flatten(payload);

  const email =
    find(fields, (k, v) => k.includes("email") && EMAIL.test(v)) ?? find(fields, (_, v) => EMAIL.test(v));
  const phone = find(fields, (k, v) => k.includes("phone") && /\d{7,}/.test(v.replace(/\D/g, "")));

  const first = find(fields, (k) => k === "firstname" || k === "first");
  const last = find(fields, (k) => k === "lastname" || k === "last");
  const name =
    (first ? [first, last].filter(Boolean).join(" ") : null) ??
    find(
      fields,
      (k, v, p) =>
        ["name", "fullname", "contactname", "ownername", "username", "displayname"].includes(k) &&
        !BUSINESS_PATH.test(p.replace(/\.[^.]*$/, "")) &&
        // Not a Google resource name ("locations/123") or an email.
        !/[/@]/.test(v) && !/^\d+$/.test(v),
    );

  // The audit tool's own payload (seen Nov 17, 2026) is flat: name, email,
  // phoneNumber, title (the Business Profile's name), websiteUri,
  // category, optimisationPercent, auditReportUrl. So a top-level `title`
  // is the business, after any explicitly named business field.
  const businessName =
    find(
      fields,
      (k, _, p) =>
        ["businessname", "company", "companyname", "locationname", "profilename"].includes(k) ||
        ((k === "name" || k === "title") && BUSINESS_PATH.test(p.replace(/\.[^.]*$/, ""))),
    ) ?? find(fields, (k, _, p) => k === "title" && !p.includes("."));
  const website = find(fields, (k, v) => (k.includes("website") || k === "url" || k === "site") && /\./.test(v));

  return { email, phone, name, businessName, website, fields };
};

/** The note body: what was matched first, then everything received. Capped well under GHL's limit. */
export const auditNote = (lead: AuditLead): string => {
  const lines = [
    "GBP audit lead (from the audit tool's webhook)",
    "",
    ...lead.fields.map(([p, v]) => `${p}: ${v}`),
  ];
  const text = lines.join("\n");
  return text.length > 8000 ? `${text.slice(0, 8000)}\n…(truncated)` : text;
};
