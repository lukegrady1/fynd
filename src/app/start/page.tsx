import type { Metadata } from "next";
import { meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { LandingPage } from "@/components/sections/review/LandingPage";

/**
 * Kept alive because this URL is already in people's text messages, with
 * ?biz=, ?cid= and ?exp= on it. It renders the same combined page as the
 * homepage — same content, same both-asks — and stays noindex so the one
 * indexable copy is "/".
 */
export const metadata: Metadata = {
  title: meta.start.title,
  description: meta.start.description,
  robots: { index: false, follow: false },
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  return <LandingPage params={params} page="start" />;
}
