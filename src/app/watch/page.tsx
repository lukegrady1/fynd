import type { Metadata } from "next";
import { finalCta as finalCtaCopy, meta, watch } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { WatchHero } from "@/components/sections/review/WatchHero";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { TestimonialBand } from "@/components/sections/review/TestimonialBand";
import { PlanChooser } from "@/components/sections/review/PlanChooser";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";
import { StickyCta } from "@/components/sections/review/StickyCta";

/**
 * /watch — the VSL page, texted to leads.
 *
 * The same shape as the homepage and /website: hero, proof, the ask, the
 * FAQ, the closer. The video is the hero, and the ask is a plan picker with
 * both plans in it — the $97 Review System and the $249 Website + Reviews —
 * because someone who has only seen the video has not been told which one
 * they want. Every "Start now" on the page scrolls to it; "Book a Demo"
 * opens /demo in a new tab, as everywhere else.
 *
 * The calendar column that used to be the only ask here is gone from the
 * page; `BookDemo.tsx` is still in the tree if it is wanted back.
 *
 * Takes the same query params as the other funnel URLs: ?cid= ties the
 * analytics back to the SMS list, ?fn=, ?phone= and ?email= ride through to
 * the demo calendar on the link, and ?plan= reopens the card someone backed
 * out of at Stripe. ?biz= is accepted but ignored here — the headline is the
 * same for everyone.
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
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <WatchHero targetId={CONVERT_ID} />
        <TrustStrip />
        <TestimonialBand />
        <PlanChooser
          cid={params.cid}
          cancelled={params.cancelled}
          initialPlan={params.plan}
          cancelPath="/watch"
        />
        {/* Below the ask, for whoever scrolled past the plans still unsure.
            The same questions as the homepage. */}
        <ObjectionFaq />
        <FinalCta
          heading={finalCtaCopy.heading}
          ctaLabel={watch.cta}
          targetId={CONVERT_ID}
          withDemo
        />
      </main>

      <FunnelFooter />

      {/* No $/mo on the pill: two prices on the page, and naming either on
          the pill would misquote the other. Same call as /website. */}
      <StickyCta
        ctaLabel={watch.cta}
        targetId={CONVERT_ID}
        showPrice={false}
        withDemo
      />
    </>
  );
}
