import type { Metadata } from "next";
import { meta, finalCta as finalCtaCopy, hero } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { resolveDeadline } from "@/lib/offer";
import { calendarEmbedUrl } from "@/lib/ghl";

import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelHeader, FunnelFooter } from "@/components/sections/review/PageChrome";
import { StickyOfferBar } from "@/components/sections/review/StickyOfferBar";
import { ReviewHero } from "@/components/sections/review/ReviewHero";
import { DemoVideo } from "@/components/sections/review/DemoVideo";
import { Testimonials } from "@/components/sections/review/Testimonials";
import { Mechanism } from "@/components/sections/review/Mechanism";
import { ProofSection } from "@/components/sections/review/ProofSection";
import { RoiCalculator } from "@/components/sections/review/RoiCalculator";
import { FitSection } from "@/components/sections/review/FitSection";
import { Compliance } from "@/components/sections/review/Compliance";
import { TrustBar, CaseStudies } from "@/components/sections/review/SocialProof";
import { ProblemSection, WhyReviews } from "@/components/sections/review/ProblemSection";
import { QuickWins } from "@/components/sections/review/QuickWins";
import { FeatureGrid } from "@/components/sections/review/FeatureGrid";
import { CompetitorCompare } from "@/components/sections/review/CompetitorCompare";
import { StatsGrid } from "@/components/sections/review/StatsGrid";
import { PricingSection } from "@/components/sections/review/PricingSection";
import { CalendarModule } from "@/components/sections/review/CalendarModule";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";

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
  const deadline = resolveDeadline(params.exp, params.sig);

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

      <main className="flex-1 pb-24 lg:pb-0">
        <ReviewHero
          biz={params.biz}
          deadline={deadline}
          variant="call"
          targetId="convert"
        />
        <TrustBar />

        {/* Booking a call is a low-commitment ask, so it comes almost
            immediately — the hero sells the call and this delivers it. The
            visitor just got off the phone; making them scroll four screens to
            reach a calendar is the whole problem. Everything below is the long
            tail for whoever is still hesitating. */}
        <CalendarModule
          embedUrl={embedUrl}
          deadlineLabel={deadline.formatted}
        />

        <Mechanism />
        <ProblemSection />
        <FeatureGrid />
        <QuickWins />
        <DemoVideo />
        <CompetitorCompare ctaLabel={hero.call.cta} targetId="convert" />
        <ProofSection />
        <StatsGrid />
        <FitSection />
        <PricingSection ctaLabel={hero.call.cta} targetId="convert" />
        <WhyReviews />
        <RoiCalculator />
        <CaseStudies />
        <Testimonials />
        <Compliance />
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.headingCall}
          sub={finalCtaCopy.subCall}
          ctaLabel={finalCtaCopy.ctaCall}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyOfferBar
        ctaLabel="Pick a time"
        targetId="convert"
        deadline={deadline}
      />
    </>
  );
}
