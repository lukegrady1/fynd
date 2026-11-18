import type { Metadata } from "next";
import { manage, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelFooter } from "@/components/sections/review/PageChrome";
import { Nav } from "@/components/site/Nav";
import { StickyCta } from "@/components/sections/review/StickyCta";
import { ManageHero } from "@/components/sections/manage/ManageHero";
import { BusyOwners } from "@/components/sections/manage/BusyOwners";
import { Everywhere } from "@/components/sections/manage/Everywhere";
import { FirstMonth } from "@/components/sections/manage/FirstMonth";
import { JudgeReport } from "@/components/sections/manage/JudgeReport";
import { TheMath } from "@/components/sections/manage/TheMath";
import { ManageRoi } from "@/components/sections/manage/ManageRoi";
import { ToolsReplaced } from "@/components/sections/manage/ToolsReplaced";
import { ManagePricing } from "@/components/sections/manage/ManagePricing";
import { FeatureTable } from "@/components/sections/manage/FeatureTable";
import { ManageFaq } from "@/components/sections/manage/ManageFaq";
import { FreeAudit } from "@/components/sections/manage/FreeAudit";
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
 * everywhere" (the channel ring) -> the free profile audit (a link out
 * to the tool, Luke, Nov 17, 2026; not the platform's) -> the first month in three steps ->
 * what to judge when, with the sample report -> the math -> the payoff
 * calculator (ours, not the platform's; Luke, Nov 16, 2026) -> the tools
 * replaced -> "every day you wait" with the $297 card (#convert) ->
 * every feature as one table -> FAQ -> closer. (The $249 website
 * section was removed Nov 17, 2026: the site has its own /website page
 * in the nav now, Luke.) What the
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
      <Nav />

      <main className="flex-1">
        <ManageHero targetId="convert" />
        <BusyOwners />
        <Everywhere />
        <FreeAudit />
        <FirstMonth />
        <JudgeReport />
        <TheMath />
        <ManageRoi targetId="convert" />
        <ToolsReplaced />
        <ManagePricing cid={params.cid} />
        <FeatureTable />
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
