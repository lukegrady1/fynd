import type { Metadata } from "next";
import {
  meta,
  finalCta as finalCtaCopy,
  pricing as pricingCopy,
} from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelHeader, FunnelFooter } from "@/components/sections/review/PageChrome";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ReviewHero } from "@/components/sections/review/ReviewHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { StatBar } from "@/components/sections/review/StatBar";
import { ProblemSection, WhyReviews } from "@/components/sections/review/ProblemSection";
import { Mechanism } from "@/components/sections/review/Mechanism";
import { ResultsSection } from "@/components/sections/review/ResultsSection";
import { PricingSection } from "@/components/sections/review/PricingSection";
import { FeatureGrid } from "@/components/sections/review/FeatureGrid";
import { CaseStudies, TrustBar } from "@/components/sections/review/SocialProof";
import { Testimonials } from "@/components/sections/review/Testimonials";
import { BookingIntegrations } from "@/components/sections/review/BookingIntegrations";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";

export const metadata: Metadata = {
  title: meta.start.title,
  description: meta.start.description,
  // Prices here differ from public site pricing — keep it out of search.
  robots: { index: false, follow: false },
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="start" cid={params.cid} />
      <FunnelHeader tone="dark" />

      {/* Bottom bar on mobile needs clearance so it never covers content.
          No top padding on desktop: the sticky bar only fades in after the
          hero exits, so reserving space for it just opens a void up top. */}
      <main className="flex-1">
        {/* ── Setup: who this is for, what's wrong, how it works. ── */}
        <ReviewHero biz={params.biz} variant="start" targetId="convert" />
        <TrustStrip />
        <ProblemSection />
        <Mechanism />

        {/* ── Stakes, then proof. Why it matters now sits ahead of the
            results, so the numbers land on someone who already cares. ── */}
        <WhyReviews />
        <StatBar />
        <TrustBar />
        <ResultsSection ctaLabel={pricingCopy.cta} targetId="convert" />
        <CaseStudies />
        <Testimonials />

        {/* ── The ask, then everything behind it. ── */}
        <PricingSection
          mode="checkout"
          cid={params.cid}
          cancelled={params.cancelled}
        />
        <FeatureGrid business={params.biz} />
        <BookingIntegrations />
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.heading}
          ctaLabel={finalCtaCopy.ctaStart}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel="Start setup" targetId="convert" />
    </>
  );
}
