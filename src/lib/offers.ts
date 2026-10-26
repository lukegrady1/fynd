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
 *   - "deferred" the same plan and the same charge, moved to `startsOn`.
 *                Checkout only saves the card; the plan's first charge is
 *                taken on that day and the $97/month starts on the billing
 *                day after it. See `createDeferredCheckoutSession`.
 *
 * A new custom deal is one line here. Slugs are lowercase and URL-safe;
 * link-preview text for each lives in `offerLinks` in `src/content/copy.ts`.
 */

export type Offer = { plan: Plan } & (
  | { billing: "now" }
  | {
      billing: "deferred";
      /**
       * YYYY-MM-DD, midnight Eastern: the day the plan's first charge is
       * taken. Any date works; the $97/month then starts on the billing day
       * a checkout on this date would get. The link stops minting sessions
       * an hour before it and sends people to the plan's public page.
       */
      startsOn: string;
    }
);

export const OFFERS = {
  /** Website + Reviews: $249 today, then $97/month. */
  website: { plan: "website-reviews", billing: "now" },
  /** Review System only: $97 today, then $97/month. */
  reviews: { plan: "review-system", billing: "now" },
  /**
   * The /website checkout with the charge moved: nothing today, $249 on
   * November 1, then $97 on the 1st from December 1.
   */
  nov1: { plan: "website-reviews", billing: "deferred", startsOn: "2026-11-01" },
  /**
   * The /reviews checkout with the charge moved: nothing today, $97 on
   * November 13, then $97 on the 15th from December 15.
   */
  nov13: { plan: "review-system", billing: "deferred", startsOn: "2026-11-13" },
} satisfies Record<string, Offer>;

export type OfferSlug = keyof typeof OFFERS;

export const findOffer = (
  slug: string,
): ({ slug: OfferSlug } & Offer) | null =>
  Object.hasOwn(OFFERS, slug)
    ? { slug: slug as OfferSlug, ...(OFFERS[slug as OfferSlug] as Offer) }
    : null;
