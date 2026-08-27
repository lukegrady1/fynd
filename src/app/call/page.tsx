import type { Metadata } from "next";
import { meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { LandingPage } from "@/components/sections/review/LandingPage";

/**
 * Same as /start — this URL is already out in text messages, so it keeps
 * working and keeps its prefill params. The calendar it used to be dedicated
 * to is now the #demo module on the shared page.
 */
export const metadata: Metadata = {
  title: meta.call.title,
  description: meta.call.description,
  robots: { index: false, follow: false },
};

export default async function CallPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return <LandingPage params={params} page="call" />;
}
