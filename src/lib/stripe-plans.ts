/**
 * The plan names, on their own so client components can type against them.
 * `src/lib/stripe.ts` is server-only and cannot be imported from the browser.
 */
/**
 * "gbp-management" is the $297/month profile management (/manage). Same
 * billing shape as the review system — a month paid today, then monthly
 * from the anchor — on its own recurring price.
 */
export type Plan = "review-system" | "website-reviews" | "gbp-management";

export const PLAN_LIST = ["review-system", "website-reviews", "gbp-management"] as const satisfies readonly Plan[];

/**
 * One-off products: a single charge, no subscription behind it. Kept apart
 * from `Plan` on purpose — everything typed `Plan` goes on to create a
 * $97/month subscription, and a one-time product must never reach that code.
 */
export type OneTimeProduct = "gbp-optimization" | "website-build";

/**
 * The free trial sold on /watch: the Review System, `offer.trialDays` free,
 * then $97/month. Its own type rather than a fourth `Plan` because the
 * billing shape is different — nothing is charged at checkout — and
 * everything typed `Plan` charges a month up front. `/api/checkout` sends
 * it to `createTrialCheckoutSession`, the same session `/offer/trial` mints.
 */
export type TrialPlan = "review-trial";

export const TRIAL_PLANS = ["review-trial"] as const satisfies readonly TrialPlan[];

export const isTrialPlan = (value: string): value is TrialPlan =>
  (TRIAL_PLANS as readonly string[]).includes(value);

/** Anything a checkout button can sell. */
export type Purchasable = Plan | OneTimeProduct | TrialPlan;

export const ONE_TIME_PRODUCTS = ["gbp-optimization", "website-build"] as const satisfies readonly OneTimeProduct[];

export const isOneTimeProduct = (value: string): value is OneTimeProduct =>
  (ONE_TIME_PRODUCTS as readonly string[]).includes(value);

/**
 * Where Stripe sends someone who backs out of checkout, when the page they
 * started from is not the plan's own page. Each plan has a default (its own
 * page); /watch sells both plans, so its button names itself here and the
 * visitor lands back on the video rather than on a page they never saw. A
 * closed list, not a free path, so the client cannot pick the destination.
 */
export const CANCEL_PATHS = ["/watch", "/reviews"] as const;
export type CancelPath = (typeof CANCEL_PATHS)[number];
