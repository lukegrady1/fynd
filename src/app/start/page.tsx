import type { Metadata } from "next";
import { meta, finalCta as finalCtaCopy, hero } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { resolveDeadline } from "@/lib/offer";

import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelHeader, FunnelFooter } from "@/components/sections/review/PageChrome";
import { StickyOfferBar } from "@/components/sections/review/StickyOfferBar";
import { ReviewHero } from "@/components/sections/review/ReviewHero";
import { DemoVideo } from "@/components/sections/review/DemoVideo";
import { WhatYouGet } from "@/components/sections/review/WhatYouGet";
import { Testimonials } from "@/components/sections/review/Testimonials";
import { Mechanism } from "@/components/sections/review/Mechanism";
import { ProofSection } from "@/components/sections/review/ProofSection";
import { RoiCalculator } from "@/components/sections/review/RoiCalculator";
import { FitSection } from "@/components/sections/review/FitSection";
import { Compliance } from "@/components/sections/review/Compliance";
import { FounderNote } from "@/components/sections/review/FounderNote";
import { CheckoutModule } from "@/components/sections/review/CheckoutModule";
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
  const deadline = resolveDeadline(params.exp, params.sig);

  return (
    <>
      <PageTracking page="start" cid={params.cid} />
      <FunnelHeader />

      {/* Bottom bar on mobile needs clearance so it never covers content.
          No top padding on desktop: the sticky bar only fades in after the
          hero exits, so reserving space for it just opens a void up top. */}
      <main className="flex-1 pb-24 lg:pb-0">
        <ReviewHero
          biz={params.biz}
          deadline={deadline}
          ctaLabel={hero.ctaStart}
          targetId="convert"
        />
        <Mechanism />
        <DemoVideo />
        <ProofSection />
        <RoiCalculator />
        <WhatYouGet />
        <FitSection />
        <Testimonials />
        <CheckoutModule cid={params.cid} cancelled={params.cancelled} />
        <Compliance />
        <ObjectionFaq />
        <FounderNote />
        <FinalCta
          heading={finalCtaCopy.headingStart}
          sub={finalCtaCopy.subStart}
          ctaLabel={finalCtaCopy.ctaStart}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      <StickyOfferBar
        ctaLabel="Start for $97"
        targetId="convert"
        deadline={deadline}
      />
    </>
  );
}
