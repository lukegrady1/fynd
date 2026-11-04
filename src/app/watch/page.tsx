import type { Metadata } from "next";
import { meta, watch, watchFaq } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { WatchHero } from "@/components/sections/review/WatchHero";
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
 * /watch — the VSL page, texted to leads, and the Review System's own
 * long page.
 *
 * Since Nov 3, 2026 it carries /manage's argument for reviews only
 * (Luke: "add stuff to this page like it is the management page but it's
 * for reviews only"), in its own format (Luke, same day: "change the
 * format so it isn't the same exact components as the manage page").
 * The copy is `watch` in copy.ts, section for section the same shape as
 * /manage's; the components are this page's own: the video hero with
 * the big pill ask -> the trust strip -> how it works as a you/us ledger
 * (`WatchHowItWorks`) -> the free week as a vertical timeline
 * (`WatchTrialTimeline`) -> what to judge when and the numbers, on white
 * with no cards (`WatchProof`) -> what owners say -> the price card
 * (#convert; the one /manage component kept, because Luke asked for
 * that card's style) -> every feature as a grid of open cards
 * (`WatchFeatureGrid`) -> the homepage's plain FAQ -> the homepage's
 * dark closer. The previous version — /manage's components with a
 * light/dark tone — is commit a59f45e if it's wanted back.
 *
 * The ask is one card: the Review System on a 7-day free trial, then
 * $97/month. It is the only plan on the page; every button scrolls to
 * it, the sticky pill has no demo beside it, and the call is a quiet
 * text link in the trial section only. The checkout behind the button
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
      {/* No link on the logo: nothing on this page leads back to the site. */}
      <FunnelHeader tone="dark" homeLink={false} />

      <main className="flex-1">
        <WatchHero targetId={CONVERT_ID} />
        <TrustStrip />
        <WatchHowItWorks targetId={CONVERT_ID} />
        <WatchTrialTimeline targetId={CONVERT_ID} />
        <WatchProof targetId={CONVERT_ID} />
        <TestimonialBand />
        <ManagePricing
          cid={params.cid}
          copy={watch.pricing}
          plan="review-trial"
          price={0}
          section="trial_pricing"
          cancelPath="/watch"
        />
        <WatchFeatureGrid targetId={CONVERT_ID} />
        {/* The first eight questions open; the rest fold behind one row
            (mobile pass, Nov 3, 2026: 22 closed questions ran two phone
            screens). */}
        <ObjectionFaq heading={watchFaq.heading} items={watchFaq.items} collapseAfter={8} />
        <FinalCta
          heading={watch.finalCta.heading}
          ctaLabel={watch.finalCta.cta}
          targetId={CONVERT_ID}
          note={watch.finalCta.note}
          compactOnMobile
        />
      </main>

      <FunnelFooter />

      {/* No $/mo on the pill: the deal is the free days, not the monthly,
          and "$97/mo · Start your free trial" would read as both at once.
          No "Book a Demo" pill beside it either: every ask on this page
          is the trial (Luke, Nov 3, 2026). */}
      <StickyCta ctaLabel={watch.cta} targetId={CONVERT_ID} showPrice={false} showAfterId="hero" />
    </>
  );
}
