import type { OneTimeProduct, Plan } from "./stripe-plans";

/**
 * Permanent payment links: fynnd.co/offer/<slug>.
 *
 * A Stripe Checkout URL dies after 24 hours, so these are not Stripe URLs.
 * Each one is a route on this site (`src/app/offer/[slug]/route.ts`) that
 * mints a fresh Checkout Session the moment someone taps it and redirects
 * straight to Stripe. The link in a text message never expires; the session
 * behind it is always new, with today's dates and wording.
 *
 * Three billing shapes:
 *
 *   - "now"      the normal checkout, identical to the Start now buttons:
 *                the plan's first charge today, then $97/month from the
 *                billing anchor. See `createCheckoutSession`.
 *   - "deferred" the same plan and the same charge, moved to `startsOn`.
 *                Checkout only saves the card; the plan's first charge is
 *                taken on that day and the $97/month starts on the billing
 *                day after it. See `createDeferredCheckoutSession`.
 *   - "trial"    nothing today: the card is saved and the plan's own
 *                $97/month subscription starts after `days` free, billed on
 *                that day each month from then (no 1st/15th anchor). The
 *                /watch deal. See `createTrialCheckoutSession`.
 *   - "one-time" a single charge for a `OneTimeProduct`, no plan and no
 *                subscription after. See `createOneTimeCheckoutSession`.
 *
 * A new custom deal is one line here. Slugs are lowercase and URL-safe;
 * link-preview text for each lives in `offerLinks` in `src/content/copy.ts`.
 */

export type Offer =
  | { billing: "one-time"; product: OneTimeProduct }
  | ({ plan: Plan } & (
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
  | {
      billing: "trial";
      /** Free days before the first charge. */
      days: number;
    }
));

export const OFFERS = {
  /**
   * The website build, $249 once, nothing after (Luke, Nov 3, 2026). This
   * slug used to be the Website + Reviews plan ($249 then $97/month);
   * that plan is still sold by the /website page's own button, and by the
   * `nov1` link below while it lasts.
   */
  website: { billing: "one-time", product: "website-build" },
  /** Review System only: $97 today, then $97/month. */
  reviews: { plan: "review-system", billing: "now" },
  /** Profile management: $297 today, then $297/month. */
  manage: { plan: "gbp-management", billing: "now" },
  /**
   * The Review System on a 7-day free trial: nothing today, then $97 a
   * month from day 8, on that day each month. What /watch sells; its own
   * button mints the same session (plan `review-trial` at /api/checkout).
   */
  trial: { plan: "review-system", billing: "trial", days: 7 },
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
