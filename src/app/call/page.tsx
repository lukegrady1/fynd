import type { Metadata } from "next";
import { meta, finalCta as finalCtaCopy, hero } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { calendarEmbedUrl } from "@/lib/ghl";
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
import { CalendarModule } from "@/components/sections/review/CalendarModule";

export const metadata: Metadata = {
  title: meta.call.title,
  description: meta.call.description,
  robots: { index: false, follow: false },
};

export default async function CallPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  // Prefilled so nobody retypes their details on a phone keyboard.
  const embedUrl = calendarEmbedUrl({
    firstName: params.firstName,
    phone: params.phone,
    email: params.email,
  });

  return (
    <>
      <PageTracking page="call" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        {/* ── Chapter one: dark. Outcome, problem, mechanism, results. ── */}
        <ReviewHero biz={params.biz} variant="call" targetId="convert" />
        <TrustStrip />
        <ProblemSection />
        <Mechanism />
        <DemoVideo />
        <ResultsSection ctaLabel={hero.call.cta} targetId="convert" />

        {/* ── Chapter two: light. The offer and what you get. ── */}
        <CalendarModule embedUrl={embedUrl} />
        <PricingSection ctaLabel={hero.call.cta} targetId="convert" />
        <FeatureGrid />
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
          heading={finalCtaCopy.headingCall}
          sub={finalCtaCopy.subCall}
          ctaLabel={finalCtaCopy.ctaCall}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel="Pick a time" targetId="convert" />
    </>
  );
}
