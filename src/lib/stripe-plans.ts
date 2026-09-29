/**
 * The plan names, on their own so client components can type against them.
 * `src/lib/stripe.ts` is server-only and cannot be imported from the browser.
 */
export type Plan = "review-system" | "website-reviews";

/**
 * Where Stripe sends someone who backs out of checkout, when the page they
 * started from is not the plan's own page. Each plan has a default (its own
 * page); /watch sells both plans, so its button names itself here and the
 * visitor lands back on the video rather than on a page they never saw. A
 * closed list, not a free path, so the client cannot pick the destination.
 */
export const CANCEL_PATHS = ["/watch"] as const;
export type CancelPath = (typeof CANCEL_PATHS)[number];
