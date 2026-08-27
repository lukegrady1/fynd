import {
  finalCta as finalCtaCopy,
  pricing as pricingCopy,
} from "@/content/copy";
import type { PageId } from "@/lib/analytics";
import type { PageParams } from "@/lib/params";
import { PageTracking } from "./PageTracking";
import { FunnelHeader, FunnelFooter } from "./PageChrome";
import { StickyCta } from "./StickyCta";
import { ReviewHero } from "./ReviewHero";
import { TrustStrip } from "./TrustStrip";
import { StatBar } from "./StatBar";
import { WhyReviews } from "./ProblemSection";
import { ProblemStory } from "./ProblemStory";
import { Mechanism } from "./Mechanism";
import { ResultsSection } from "./ResultsSection";
import { PricingSection } from "./PricingSection";
import { AddOnServices } from "./AddOnServices";
import { FeatureGrid } from "./FeatureGrid";
import { CaseStudies, TrustBar } from "./SocialProof";
import { Testimonials } from "./Testimonials";
import { ObjectionFaq } from "./ObjectionFaq";
import { FinalCta } from "./FinalCta";

/**
 * The whole landing page, in one piece.
 *
 * /start and /call used to be separate routes that were ~85% the same markup,
 * differing only in which conversion module they ended on — Stripe checkout or
 * the GHL calendar. They are now one page carrying both, and it is the site's
 * homepage.
 *
 * One conversion module on the page — checkout, at #convert. Booking moved to
 * its own route, /demo, which every "Book a Demo" opens in a new tab.
 *
 * `withDemo` on each CTA surface is what pairs the second ask with the first.
 * It is a prop rather than a default so the funnel components stay usable on a
 * page with only one ask — the pricing card is exactly that case: inside the
 * card the second button competed with the thing the card exists to sell.
 */
export function LandingPage({
  params,
  page,
}: {
  params: PageParams;
  /** Which route is rendering this, for the analytics context only. */
  page: PageId;
}) {
  return (
    <>
      <PageTracking page={page} cid={params.cid} />
      <FunnelHeader tone="dark" />

      {/* Bottom bar on mobile needs clearance so it never covers content.
          No top padding on desktop: the sticky bar only fades in after the
          hero exits, so reserving space for it just opens a void up top. */}
      <main className="flex-1">
        {/* ── Setup: who this is for, what's wrong, how it works. ── */}
        <ReviewHero
          biz={params.biz}
          variant="start"
          targetId="convert"
          withDemo
        />
        <TrustStrip />
        <ProblemStory />
        <Mechanism />

        {/* ── Stakes, then proof. Why it matters now sits ahead of the
            results, so the numbers land on someone who already cares. ── */}
        <WhyReviews />
        <StatBar />
        <TrustBar />
        <ResultsSection
          ctaLabel={pricingCopy.cta}
          targetId="convert"
          withDemo
        />
        <CaseStudies />
        <Testimonials />

        {/* ── The ask. No demo button inside the card: everywhere else the
            two sit side by side, but in the checkout card itself a second
            option undercuts the one thing the card is for. ── */}
        <PricingSection
          mode="checkout"
          cid={params.cid}
          cancelled={params.cancelled}
        />
        <AddOnServices />

        {/* ── Everything behind the ask. The Fit section used to sit here;
            it is the "Booking software integration" modal now, in full. ── */}
        <FeatureGrid business={params.biz} />
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.heading}
          ctaLabel={finalCtaCopy.ctaStart}
          targetId="convert"
          withDemo
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel="Start setup" targetId="convert" withDemo />
    </>
  );
}
