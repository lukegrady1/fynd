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
import { HowItWorks, WhatYouGet } from "@/components/sections/review/HowItWorks";
import { Testimonials } from "@/components/sections/review/Testimonials";
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
      <FunnelHeader />

      <main className="flex-1 pb-24 lg:pb-0">
        <ReviewHero
          biz={params.biz}
          deadline={deadline}
          ctaLabel={hero.ctaCall}
          targetId="convert"
        />
        <DemoVideo />
        <HowItWorks />
        <WhatYouGet />
        <Testimonials />
        <CalendarModule
          embedUrl={embedUrl}
          deadlineLabel={deadline.formatted}
        />
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
