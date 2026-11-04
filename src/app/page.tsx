import type { Metadata } from "next";
import { meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { FunnelFooter } from "@/components/sections/review/PageChrome";
import { Nav } from "@/components/site/Nav";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { HomeNumbers } from "@/components/sections/home/HomeNumbers";
import { HomeCloser } from "@/components/sections/home/HomeCloser";
import { TrustStrip } from "@/components/sections/review/TrustStrip";
import { ResultsSection } from "@/components/sections/review/ResultsSection";
import { ObjectionFaq } from "@/components/sections/review/ObjectionFaq";

/**
 * The homepage is a hub (Luke, Nov 3, 2026). It used to be the $97
 * landing page in full (`LandingPage`, still what /start renders); now it
 * shows each thing Fynd does and sends the visitor to the page that sells
 * it: the hero -> the industries -> the three services, each with its
 * page's own illustration, and the $99 as a band under them -> the real
 * before/after (Salt Salon) with the three outcomes -> the numbers -> the
 * questions -> the closer (the call, or the Review System).
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
        {/* The real profile and the three outcomes; no button of its own,
            the closer carries the ask. */}
        <ResultsSection />
        <HomeNumbers />
        <ObjectionFaq collapseAfter={6} />
        <HomeCloser />
      </main>

      <FunnelFooter />
    </>
  );
}
