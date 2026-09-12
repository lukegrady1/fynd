/**
 * The plan names, on their own so client components can type against them.
 * `src/lib/stripe.ts` is server-only and cannot be imported from the browser.
 */
export type Plan = "review-system" | "website-reviews";
