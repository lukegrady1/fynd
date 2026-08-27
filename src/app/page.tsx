import type { Metadata } from "next";
import { meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { LandingPage } from "@/components/sections/review/LandingPage";

/**
 * The homepage is the landing page.
 *
 * The old marketing homepage (Hero / PillarRow / DashboardProof / CtaCloser)
 * is gone from this route; those components are still in the tree if any of it
 * is wanted back.
 *
 * Note this route is indexable, unlike /start and /call. The pricing shown
 * here — $197 struck through, $97 charged, with the offer clock — is now the
 * public price, which is the thing that kept the funnel pages out of search.
 */
export const metadata: Metadata = {
  title: meta.home.title,
  description: meta.home.description,
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return <LandingPage params={params} page="home" />;
}
