/**
 * The bits of the GoHighLevel embed that both sides need.
 *
 * Separate from lib/ghl.ts because that module is `server-only` — it holds the
 * webhook helper and reads server env — and CalendarModule is a client
 * component that needs the host to load GHL's resize script.
 */

/**
 * The white-label host these calendars are served from.
 *
 * NOT api.leadconnectorhq.com — that is GoHighLevel's generic domain, and this
 * account serves its widgets from its own. The embed code GHL hands you names
 * the right host; if a calendar renders blank, check this first.
 */
export const GHL_EMBED_HOST = "api.gradydigital.com";

/** Auto-resizes the booking iframe by id. Served from the same host. */
export const GHL_EMBED_SCRIPT = `https://${GHL_EMBED_HOST}/js/form_embed.js`;
