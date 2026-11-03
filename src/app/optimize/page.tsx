import type { Metadata } from "next";
import { meta, optimize } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { OptimizeHero } from "@/components/sections/optimize/OptimizeHero";
import { RankingFactors } from "@/components/sections/optimize/RankingFactors";
import { UpdateChecklist } from "@/components/sections/optimize/UpdateChecklist";
import { ProfileCompare } from "@/components/sections/optimize/ProfileCompare";
import { OptimizePricing } from "@/components/sections/optimize/OptimizePricing";
import { WhyOngoing } from "@/components/sections/optimize/WhyOngoing";

/**
 * /optimize — the one-time Google Business Profile optimization, $99.
 *
 * Problem (the hero's half-empty profile) -> how Google ranks, in three
 * cards, so the list has a reason -> the full list of what to update, with
 * why, and not what to write -> typical beside optimized -> the $99 to
 * have us do it, with the three steps after paying -> why kept-up beats
 * filled-in, with the one-off beside the monthly service as a table ->
 * the one-off's questions -> closer. The table's button is the only ask
 * for the monthly plan (Luke, Nov 3, 2026: the separate "rather not think
 * about it" section with the book-a-call line came out). The list is the free
 * value; the writing is what's for sale.
 *
 * Indexable: a public price for a public service, like /website. The
 * checkout is a plain one-time payment — see `createOneTimeCheckoutSession`
 * — and `/optimize/thanks` is its own success page, not /start/welcome.
 */
export const metadata: Metadata = {
  title: meta.optimize.title,
  description: meta.optimize.description,
};

export default async function OptimizePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="optimize" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <OptimizeHero targetId="how" managedId="ongoing" />
        <RankingFactors />
        <UpdateChecklist />
        <ProfileCompare />
        <OptimizePricing
          cid={params.cid}
          cancelled={params.cancelled}
          managedId="ongoing"
        />
        <WhyOngoing id="ongoing" />
        <ObjectionFaq heading={optimize.faq.heading} items={optimize.faq.items} />
        <FinalCta
          heading={optimize.finalCta.heading}
          ctaLabel={optimize.finalCta.cta}
          targetId="convert"
        />
      </main>

      <FunnelFooter />

      {/* No price on the pill: it prints "$N/mo", and this is $99 once. The
          label carries the number instead. */}
      <StickyCta
        ctaLabel={optimize.stickyCta}
        targetId="convert"
        showPrice={false}
      />
    </>
  );
}
