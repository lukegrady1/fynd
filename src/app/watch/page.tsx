import type { Metadata } from "next";
import { meta, offer, watch, watchFaq } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { WatchHero } from "@/components/sections/review/WatchHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { TestimonialBand } from "@/components/sections/review/TestimonialBand";
import { WatchJudge } from "@/components/sections/review/WatchJudge";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { BusyOwners } from "@/components/sections/manage/BusyOwners";
import { FirstMonth } from "@/components/sections/manage/FirstMonth";
import { ManagePricing } from "@/components/sections/manage/ManagePricing";
import { FeatureTable } from "@/components/sections/manage/FeatureTable";
import { ManageFaq } from "@/components/sections/manage/ManageFaq";
import { ManageCloser } from "@/components/sections/manage/ManageCloser";

/**
 * /watch — the VSL page, texted to leads, and the Review System's own
 * long page.
 *
 * Since Nov 3, 2026 it is /manage's page for reviews only (Luke: "add
 * stuff to this page like it is the management page but it's for reviews
 * only"), built from the same section components with `watch`'s copy
 * passed in — but not /manage's wall of navy: the sections alternate
 * light and dark (`tone="light"` on the shared ones) so the page reads
 * as its own (Luke, Nov 3, 2026). The video hero with /manage's ask under it -> the trust
 * strip -> built for busy owners (the two cards, three stats) -> the
 * free week in three steps on the rail -> what to judge in 7 days and
 * what takes longer, ending on the real Salt Salon before/after -> what
 * owners say -> the price card (#convert) -> every feature -> FAQ ->
 * closer. What /manage has that this leaves out on purpose: the channel
 * ring (reviews are Google first, not eleven channels), the math and the
 * tools replaced (no honest review-only cost figures to put in them), and
 * the website section.
 *
 * The ask is one card: the Review System on a 7-day free trial, then
 * $97/month. It is the only plan on the page — the two-tab picker that
 * also sold the $249 website plan, and the $197-to-$97 promo, came off
 * on Nov 3, 2026 (`PlanChooser.tsx` is still in the tree if it is wanted
 * back, as is `BookDemo.tsx` from before that). Every "Start your free
 * trial" on the page scrolls to the card. The checkout behind the button
 * is not built yet; see `TrialPlan` in `stripe-plans.ts`.
 *
 * Takes the same query params as the other funnel URLs: ?cid= ties the
 * analytics back to the SMS list, and ?fn=, ?phone= and ?email= ride
 * through to the demo calendar on the link. ?plan= and ?biz= are accepted
 * but ignored here — one card, one headline for everyone.
 *
 * noindex like /start: it is a link people receive, not a page to rank.
 */
export const metadata: Metadata = {
  title: meta.watch.title,
  description: meta.watch.description,
  robots: { index: false, follow: false },
};

const CONVERT_ID = "convert";

export default async function WatchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="watch" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <WatchHero targetId={CONVERT_ID} />
        <TrustStrip />
        <BusyOwners copy={watch.busy} targetId={CONVERT_ID} tone="light" />
        <FirstMonth copy={watch.trialWeek} targetId={CONVERT_ID} />
        <WatchJudge targetId={CONVERT_ID} />
        <TestimonialBand />
        <ManagePricing
          cid={params.cid}
          cancelled={params.cancelled}
          copy={watch.pricing}
          plan="review-trial"
          price={offer.price}
          section="trial_pricing"
          cancelPath="/watch"
        />
        <FeatureTable copy={watch.features} targetId={CONVERT_ID} tone="light" />
        <ManageFaq copy={watchFaq} tone="light" />
        <ManageCloser targetId={CONVERT_ID} copy={watch.finalCta} />
      </main>

      <FunnelFooter />

      {/* No $/mo on the pill: the deal is the free days, not the monthly,
          and "$97/mo · Start your free trial" would read as both at once.
          No "Book a Demo" pill beside it either: every ask on this page
          is the trial (Luke, Nov 3, 2026); the call is a quiet text link
          in the trial section and the closer. */}
      <StickyCta ctaLabel={watch.cta} targetId={CONVERT_ID} showPrice={false} />
    </>
  );
}
