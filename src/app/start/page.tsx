import type { Metadata } from "next";
import { meta, finalCta as finalCtaCopy, hero } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelHeader, FunnelFooter } from "@/components/sections/review/PageChrome";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ReviewHero } from "@/components/sections/review/ReviewHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { ProblemSection, WhyReviews } from "@/components/sections/review/ProblemSection";
import { Mechanism } from "@/components/sections/review/Mechanism";
import { ResultsSection } from "@/components/sections/review/ResultsSection";
import { DemoVideo } from "@/components/sections/review/DemoVideo";
import { PricingSection } from "@/components/sections/review/PricingSection";
import { FeatureGrid } from "@/components/sections/review/FeatureGrid";
import { StatsGrid } from "@/components/sections/review/StatsGrid";
import { CaseStudies, TrustBar } from "@/components/sections/review/SocialProof";
import { Testimonials } from "@/components/sections/review/Testimonials";
import { FitSection } from "@/components/sections/review/FitSection";
import { QuickWins } from "@/components/sections/review/QuickWins";
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
        {/* ── Chapter one: dark. Outcome, problem, mechanism, results. ── */}
        <ReviewHero biz={params.biz} variant="start" targetId="convert" />
        <TrustStrip />
        <ProblemSection />
        <Mechanism />
        <DemoVideo />
        <ResultsSection ctaLabel={hero.start.cta} targetId="convert" />

        {/* ── Chapter two: light. The offer and what you get. ── */}
        {/* Pricing is the conversion module here — it owns #convert and runs
            checkout itself, so there is still exactly one place to buy. */}
        <PricingSection
          mode="checkout"
          cid={params.cid}
          cancelled={params.cancelled}
        />
        <FeatureGrid business={params.biz} />
        <TrustBar />
        <CaseStudies />
        <Testimonials />
        <StatsGrid />

        {/* ── Chapter three: dark. Fit, setup, objections, close. ── */}
        <FitSection />
        <QuickWins />
        <WhyReviews />
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.headingStart}
          sub={finalCtaCopy.subStart}
          ctaLabel={finalCtaCopy.ctaStart}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel="Start setup" targetId="convert" />
    </>
  );
}
