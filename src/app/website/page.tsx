import type { Metadata } from "next";
import { formatAnchor, nextBillingAnchor } from "@/lib/billing-anchor";
import { bundle, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelFooter } from "@/components/sections/review/PageChrome";
import { Nav } from "@/components/site/Nav";
import { FreeAudit } from "@/components/sections/manage/FreeAudit";
import { WebsiteHero } from "@/components/sections/website/WebsiteHero";
import { BundleIncludes } from "@/components/sections/review/BundleIncludes";
import { WatchTrialTimeline } from "@/components/sections/review/WatchTrialTimeline";
import { ManagePricing } from "@/components/sections/manage/ManagePricing";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";
import { StickyCta } from "@/components/sections/review/StickyCta";

/**
 * /website — the Website + Reviews plan, in /manage's shape (Luke, Nov 3,
 * 2026): the hero with the drawn site -> what's included, as two columns
 * -> the first two weeks on the rail -> the price card (#convert, the
 * `website-reviews` plan: $249 today, then $97/month from the billing
 * anchor) -> the questions -> the closer. The offer clock and the
 * $197 strikethrough that the old hero and card carried are gone from
 * this page.
 *
 * Indexable: a public price for a public plan, linked from the nav.
 */
export const metadata: Metadata = {
  title: meta.website.title,
  description: meta.website.description,
};

const CONVERT_ID = "convert";

export default async function WebsitePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);
  // The first $97's real date for a purchase today, worked out the way
  // checkout does (billing-anchor.ts). The function stays on the server.
  const { firstCharge, ...pricingCopy } = bundle.page.pricing;

  return (
    <>
      <PageTracking page="website" cid={params.cid} />
      <Nav />

      <main className="flex-1">
        <WebsiteHero targetId={CONVERT_ID} />
        <BundleIncludes />
        <FreeAudit section="website_audit" copy={bundle.page.audit} />
        <WatchTrialTimeline targetId={CONVERT_ID} copy={bundle.page.firstWeeks} />
        <ManagePricing
          cid={params.cid}
          copy={{ ...pricingCopy, card: { ...pricingCopy.card, anchorNote: firstCharge(formatAnchor(nextBillingAnchor())) } }}
          plan="website-reviews"
          price={bundle.price}
          section="website_pricing"
        />
        <ObjectionFaq heading={bundle.faq.heading} items={bundle.faq.items} />
        <FinalCta
          heading={bundle.finalCta.heading}
          ctaLabel={bundle.finalCta.cta}
          targetId={CONVERT_ID}
        />
      </main>

      <FunnelFooter />

      {/* No $/mo on the pill: "$249/mo" would be wrong and "$97/mo" would
          hide the first charge. The card has both numbers. */}
      <StickyCta ctaLabel="Start now" targetId={CONVERT_ID} showPrice={false} />
    </>
  );
}
