import type { Metadata } from "next";
import {
  meta,
  finalCta as finalCtaCopy,
  hero as heroCopy,
} from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { calendarEmbedUrl } from "@/lib/ghl";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelHeader, FunnelFooter } from "@/components/sections/review/PageChrome";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ReviewHero } from "@/components/sections/review/ReviewHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { StatBar } from "@/components/sections/review/StatBar";
import { ProblemSection, WhyReviews } from "@/components/sections/review/ProblemSection";
import { Mechanism } from "@/components/sections/review/Mechanism";
import { ResultsSection } from "@/components/sections/review/ResultsSection";
import { FeatureGrid } from "@/components/sections/review/FeatureGrid";
import { CaseStudies, TrustBar } from "@/components/sections/review/SocialProof";
import { Testimonials } from "@/components/sections/review/Testimonials";
import { FitSection } from "@/components/sections/review/FitSection";
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
        {/* ── Setup: who this is for, what's wrong, how it works. ── */}
        <ReviewHero biz={params.biz} variant="call" targetId="convert" />
        <TrustStrip />
        <ProblemSection />
        <Mechanism />

        {/* ── Stakes, then proof. Why it matters now sits ahead of the
            results, so the numbers land on someone who already cares. ── */}
        <WhyReviews />
        <StatBar />
        <TrustBar />
        <ResultsSection ctaLabel={heroCopy.call.cta} targetId="convert" />
        <CaseStudies />
        <Testimonials />

        {/* ── The ask, then everything behind it. ── */}
        <CalendarModule embedUrl={embedUrl} />
        <FeatureGrid business={params.biz} />
        <FitSection />
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.heading}
          ctaLabel={finalCtaCopy.ctaCall}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyCta ctaLabel="Pick a time" targetId="convert" />
    </>
  );
}
