import type { Plan } from "./stripe-plans";

/**
 * Permanent payment links: fynnd.co/offer/<slug>.
 *
 * A Stripe Checkout URL dies after 24 hours, so these are not Stripe URLs.
 * Each one is a route on this site (`src/app/offer/[slug]/route.ts`) that
 * mints a fresh Checkout Session the moment someone taps it and redirects
 * straight to Stripe. The link in a text message never expires; the session
 * behind it is always new, with today's dates and wording.
 *
 * Two billing shapes:
 *
 *   - "now"      the normal checkout, identical to the Start now buttons:
 *                the plan's first charge today, then $97/month from the
 *                billing anchor. See `createCheckoutSession`.
 *   - "deferred" nothing today. Checkout runs in setup mode and only saves
 *                the card; the subscription is created at once with a trial
 *                to `startsOn`, and everything is billed on that day. See
 *                `createDeferredCheckoutSession`.
 *
 * A new custom deal is one line here. Slugs are lowercase and URL-safe;
 * link-preview text for each lives in `offerLinks` in `src/content/copy.ts`.
 */

type OneTime = {
  /** Added to the first invoice, on top of the first month. */
  cents: number;
  /** The line on that invoice. */
  description: string;
};

export type Offer = { plan: Plan } & (
  | { billing: "now" }
  | {
      billing: "deferred";
      /**
       * YYYY-MM-DD, midnight Eastern. Must be the 1st or the 15th so the
       * customer lands on a normal billing day afterwards. The link stops
       * minting sessions shortly before this, and sends people to the plan's
       * public page instead.
       */
      startsOn: string;
      oneTime?: OneTime;
    }
);

export const OFFERS = {
  /** Website + Reviews: $249 today, then $97/month. */
  website: { plan: "website-reviews", billing: "now" },
  /** Review System only: $97 today, then $97/month. */
  reviews: { plan: "review-system", billing: "now" },
  /**
   * Website + Reviews, nothing today: $346 on November 1 ($249 build plus
   * the first $97 month), then $97 on the 1st from December 1.
   */
  nov1: {
    plan: "website-reviews",
    billing: "deferred",
    startsOn: "2026-11-01",
    oneTime: { cents: 24900, description: "Fynd website build" },
  },
} satisfies Record<string, Offer>;

export type OfferSlug = keyof typeof OFFERS;

export const findOffer = (
  slug: string,
): ({ slug: OfferSlug } & Offer) | null =>
  Object.hasOwn(OFFERS, slug)
    ? { slug: slug as OfferSlug, ...(OFFERS[slug as OfferSlug] as Offer) }
    : null;
