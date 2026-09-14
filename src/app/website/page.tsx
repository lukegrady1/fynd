import type { Metadata } from "next";
import { bundle, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { BundleHero } from "@/components/sections/review/BundleHero";
import { BundleIncludes } from "@/components/sections/review/BundleIncludes";
import { BundlePricing } from "@/components/sections/review/BundlePricing";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";
import { FinalCta } from "@/components/sections/review/FinalCta";
import { StickyCta } from "@/components/sections/review/StickyCta";

/**
 * /website — the Website + Reviews plan.
 *
 * Hero, what's included, the $249 card, four questions, the closer. Short on
 * purpose: the homepage has already made the case for reviews at length, and
 * the only new argument here is the website, which the includes section
 * carries.
 *
 * Indexable, unlike the funnel links: this is a public price for a public
 * plan, and the page is linked from the homepage.
 */
export const metadata: Metadata = {
  title: meta.website.title,
  description: meta.website.description,
};

export default async function WebsitePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="website" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <BundleHero targetId="convert" />
        <BundleIncludes />
        <BundlePricing cid={params.cid} cancelled={params.cancelled} />
        <ObjectionFaq heading={bundle.faq.heading} items={bundle.faq.items} />
        <FinalCta
          heading={bundle.finalCta.heading}
          ctaLabel={bundle.finalCta.cta}
          targetId="convert"
          withDemo
        />
      </main>

      <FunnelFooter />

      {/* No $/mo on the pill: "$249/mo" would be wrong and "$97/mo" would
          hide the first charge. The card has both numbers. */}
      <StickyCta
        ctaLabel="Start now"
        targetId="convert"
        showPrice={false}
        withDemo
      />
    </>
  );
}
