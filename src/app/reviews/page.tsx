import type { Metadata } from "next";
import { meta, offer, reviews } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelFooter } from "@/components/sections/review/PageChrome";
import { Nav } from "@/components/site/Nav";
import { ReviewsHero } from "@/components/sections/review/ReviewsHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { WatchHowItWorks } from "@/components/sections/review/WatchHowItWorks";
import { WatchTrialTimeline } from "@/components/sections/review/WatchTrialTimeline";
import { WatchProof } from "@/components/sections/review/WatchProof";
import { TestimonialBand } from "@/components/sections/review/TestimonialBand";
import { WatchFeatureGrid } from "@/components/sections/review/WatchFeatureGrid";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ManagePricing } from "@/components/sections/manage/ManagePricing";

/**
 * /reviews — the Review System's own page, $97/month (Luke, Nov 3, 2026:
 * a new /reviews page in the /manage and /optimize style; the homepage is
 * a hub that links the services). The same sections as /watch, which was
 * already this page for texted leads, with a drawn hero in place of the
 * video and the paid plan in place of the trial: hero -> trust strip ->
 * how it works -> the first week -> what to judge when, with the live
 * dashboard demo -> owners -> the price card (#convert, the anchored
 * `review-system` plan, like /start) -> every feature -> FAQ -> closer.
 * Copy is `reviews` in copy.ts, mostly `watch`'s with the trial words out.
 *
 * Indexable, like /optimize and /manage, and in the site nav.
 */
export const metadata: Metadata = {
  title: meta.reviews.title,
  description: meta.reviews.description,
};

const CONVERT_ID = "convert";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="reviews" cid={params.cid} />
      <Nav />

      <main className="flex-1">
        <ReviewsHero targetId={CONVERT_ID} />
        <TrustStrip />
        <WatchHowItWorks targetId={CONVERT_ID} copy={reviews.busy} />
        <WatchTrialTimeline targetId={CONVERT_ID} copy={reviews.firstWeek} />
        <WatchProof targetId={CONVERT_ID} copy={reviews.judge} />
        <TestimonialBand />
        <ManagePricing
          cid={params.cid}
          copy={reviews.pricing}
          plan="review-system"
          price={offer.price}
          section="reviews_pricing"
          cancelPath="/reviews"
        />
        <WatchFeatureGrid targetId={CONVERT_ID} copy={reviews.features} />
        <ObjectionFaq heading={reviews.faq.heading} items={reviews.faq.items} collapseAfter={8} />
        <FinalCta
          heading={reviews.finalCta.heading}
          ctaLabel={reviews.finalCta.cta}
          targetId={CONVERT_ID}
          note={reviews.finalCta.note}
          compactOnMobile
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel={reviews.cta} targetId={CONVERT_ID} price={offer.price} />
    </>
  );
}
