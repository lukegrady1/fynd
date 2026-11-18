import type { Metadata } from "next";
import { home, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelFooter } from "@/components/sections/review/PageChrome";
import { Nav } from "@/components/site/Nav";
import { FreeAudit } from "@/components/sections/manage/FreeAudit";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { HomeCloser } from "@/components/sections/home/HomeCloser";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { TheMath } from "@/components/sections/manage/TheMath";
import { ManageRoi } from "@/components/sections/manage/ManageRoi";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";

/**
 * The homepage is a hub (Luke, Nov 3, 2026). It used to be the $97
 * landing page in full (`LandingPage`, still what /start renders); now it
 * shows each thing Fynd does and sends the visitor to the page that sells
 * it: the hero -> the industries -> the three services, each with its
 * page's own illustration, and the $99 as a band under them -> /manage's
 * "the math" and the payoff calculator (Nov 16, 2026; the Salt Salon
 * results and the numbers panel stay on /reviews) -> the questions -> the
 * closer (the call, or full management).
 *
 * Indexable. /watch, /start and /call are never linked from here.
 */
export const metadata: Metadata = {
  title: meta.home.title,
  description: meta.home.description,
};

const SERVICES_ID = "services";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return (
    <>
      <PageTracking page="home" cid={params.cid} />
      <Nav />

      <main className="flex-1">
        <HomeHero targetId={SERVICES_ID} />
        <TrustStrip />
        <HomeServices id={SERVICES_ID} />
        <FreeAudit section="home_audit" />
        {/* Full management's case: what it costs against a marketer, then
            what it's worth in the visitor's own numbers. */}
        <TheMath link={home.manageLink} topPad />
        <ManageRoi link={home.manageLink} />
        <ObjectionFaq collapseAfter={6} />
        <HomeCloser />
      </main>

      <FunnelFooter />
    </>
  );
}
