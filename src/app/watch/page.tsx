import type { Metadata } from "next";
import { meta, watch } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { calendarEmbedUrl } from "@/lib/ghl";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { WatchHero } from "@/components/sections/review/WatchHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { TestimonialBand } from "@/components/sections/review/TestimonialBand";
import { BookDemo } from "@/components/sections/review/BookDemo";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { StickyCta } from "@/components/sections/review/StickyCta";

/**
 * /watch — the VSL page, texted to leads.
 *
 * The video, what owners say, the calendar, then the FAQ. No price
 * and no checkout — the video sells the idea and the call is the only ask,
 * so the sticky pill and every button on the page scroll to the calendar.
 *
 * Takes the same query params as the other funnel URLs: ?fn=, ?phone= and
 * ?email= prefill the calendar, ?cid= ties the analytics back to the SMS
 * list. ?biz= is accepted but ignored here — the headline is the same for
 * everyone.
 *
 * noindex like /start: it is a link people receive, not a page to rank.
 */
export const metadata: Metadata = {
  title: meta.watch.title,
  description: meta.watch.description,
  robots: { index: false, follow: false },
};

const BOOKING_ID = "book";

export default async function WatchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  const embedUrl = calendarEmbedUrl({
    firstName: params.firstName,
    phone: params.phone,
    email: params.email,
  });

  return (
    <>
      <PageTracking page="watch" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <WatchHero targetId={BOOKING_ID} />
        <TrustStrip />
        <TestimonialBand />
        <BookDemo embedUrl={embedUrl} id={BOOKING_ID} />
        {/* Below the ask, for whoever scrolled past the calendar still
            unsure. The same questions as the homepage. */}
        <ObjectionFaq />
      </main>

      <FunnelFooter />

      <StickyCta
        ctaLabel={watch.hero.cta}
        targetId={BOOKING_ID}
        showPrice={false}
      />
    </>
  );
}
