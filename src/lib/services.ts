import type { OneTimeProduct } from "./stripe-plans";

/**
 * The six things a customer can buy, as onboarding sees them.
 *
 * Checkout thinks in `Plan` / `TrialPlan` / `OneTimeProduct` because those
 * are billing shapes. Onboarding thinks in what the customer now needs to
 * do, which is a different cut: the free trial and the paid Review System
 * bill differently but onboard identically bar one billing line, while the
 * $249 website alone and the $249 Website + Reviews bill identically and
 * onboard very differently.
 *
 * Importable from the browser (no `server-only`): the chat UI types against
 * it.
 */
export type OnboardingService =
  | "reviews"
  | "reviews-trial"
  | "website-reviews"
  | "manage"
  | "optimize"
  | "website";

export const ONBOARDING_SERVICES = [
  "reviews",
  "reviews-trial",
  "website-reviews",
  "manage",
  "optimize",
  "website",
] as const satisfies readonly OnboardingService[];

export const isOnboardingService = (value: unknown): value is OnboardingService =>
  typeof value === "string" && (ONBOARDING_SERVICES as readonly string[]).includes(value);

/** What the customer sees it called. */
export const SERVICE_NAME: Record<OnboardingService, string> = {
  reviews: "Fynd Review System",
  "reviews-trial": "Fynd Review System",
  "website-reviews": "Fynd Website + Reviews",
  manage: "Fynd Profile Management",
  optimize: "Fynd Profile Optimization",
  website: "Fynd Website Build",
};

/**
 * The per-service contact tag in GHL, for workflows that branch on the
 * service (reminders, check-ins). Subscription contacts also carry
 * "fynd-paid"; the one-offs keep the tags `oneTimeGhl` has always set.
 */
export const SERVICE_TAG: Record<OnboardingService, string> = {
  reviews: "fynd-reviews-paid",
  "reviews-trial": "fynd-trial-started",
  "website-reviews": "fynd-website-reviews-paid",
  manage: "fynd-manage-paid",
  optimize: "fynd-gbp-paid",
  website: "fynd-website-paid",
};

const ONE_TIME_SERVICE: Record<OneTimeProduct, OnboardingService> = {
  "gbp-optimization": "optimize",
  "website-build": "website",
};

/**
 * Which service a Checkout Session sold, from its metadata alone.
 *
 * `billing: "one-time"` + `product` is a one-off; otherwise `plan` says
 * which subscription, and `billing: "trial"` marks the /watch free trial on
 * the review-system plan. Anything unrecognised is the Review System, the
 * oldest product and the one every early session was.
 */
export const serviceFromMetadata = (
  meta: Record<string, string | undefined> | null | undefined,
): OnboardingService => {
  const m = meta ?? {};
  if (m.billing === "one-time" && m.product && m.product in ONE_TIME_SERVICE) {
    return ONE_TIME_SERVICE[m.product as OneTimeProduct];
  }
  if (m.plan === "gbp-management") return "manage";
  if (m.plan === "website-reviews") return "website-reviews";
  // The website with hosting after it: the website steps and email.
  if (m.plan === "website-hosting") return "website";
  if (m.billing === "trial") return "reviews-trial";
  return "reviews";
};

/** Is this a subscription the Fynd Onboarding pipeline tracks? */
export const hasOnboardingPipeline = (service: OnboardingService) =>
  service === "reviews" || service === "reviews-trial" || service === "website-reviews" || service === "manage";
