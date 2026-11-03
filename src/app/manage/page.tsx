import type { Metadata } from "next";
import { manage, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ManageHero } from "@/components/sections/manage/ManageHero";
import { BusyOwners } from "@/components/sections/manage/BusyOwners";
import { Everywhere } from "@/components/sections/manage/Everywhere";
import { FirstMonth } from "@/components/sections/manage/FirstMonth";
import { JudgeReport } from "@/components/sections/manage/JudgeReport";
import { TheMath } from "@/components/sections/manage/TheMath";
import { ToolsReplaced } from "@/components/sections/manage/ToolsReplaced";
import { WebsiteSection } from "@/components/sections/manage/WebsiteSection";
import { ManagePricing } from "@/components/sections/manage/ManagePricing";
import { FeatureTable } from "@/components/sections/manage/FeatureTable";
import { ManageFaq } from "@/components/sections/manage/ManageFaq";
import { ManageCloser } from "@/components/sections/manage/ManageCloser";

/**
 * /manage — full Google Business Profile management, $297/month, reviews
 * included. The sibling of /optimize: that page sells the one-time $99,
 * this one sells the service that keeps the profile that way.
 *
 * The page is the white-labelled platform's own sales page
 * (merchynt.com/paige) rebuilt in Fynd's branding, section for section
 * and in its order: the hero with the "new customer" call -> built for
 * busy owners (the two cards, three stats) -> "your business,
 * everywhere" (the channel ring) -> the first month in three steps ->
 * what to judge when, with the sample report -> the math -> the tools
 * replaced -> "every day you wait" with the $297 card (#convert) ->
 * every feature as one table -> the website (moved down from before the
 * price card, Luke, Nov 3, 2026; it is a $249 one-time add-on, not part
 * of the $297) -> FAQ -> closer. What the
 * platform's page has that this one leaves out on purpose is listed on
 * `manage` in copy.ts.
 *
 * The ask is the checkout: the `gbp-management` plan, same billing shape
 * as the review system, landing on /manage/welcome.
 *
 * Indexable, like /optimize.
 */
export const metadata: Metadata = {
  title: meta.manage.title,
  description: meta.manage.description,
};

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="manage" cid={params.cid} />
      <FunnelHeader tone="dark" />

      <main className="flex-1">
        <ManageHero targetId="convert" />
        <BusyOwners />
        <Everywhere />
        <FirstMonth />
        <JudgeReport />
        <TheMath />
        <ToolsReplaced />
        <ManagePricing cid={params.cid} cancelled={params.cancelled} />
        <FeatureTable />
        <WebsiteSection />
        <ManageFaq />
        <ManageCloser targetId="convert" />
      </main>

      <FunnelFooter />

      <StickyCta
        ctaLabel={manage.stickyCta}
        targetId="convert"
        price={manage.price}
      />
    </>
  );
}
