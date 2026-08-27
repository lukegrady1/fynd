import type { Metadata } from "next";
import { meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { calendarEmbedUrl } from "@/lib/ghl";
import { PageTracking } from "@/components/sections/review/PageTracking";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { CalendarModule } from "@/components/sections/review/CalendarModule";

/**
 * Booking, on its own route.
 *
 * This used to be a module partway down the landing page. Every "Book a Demo"
 * now opens it in a new tab instead, so someone can pick a time without losing
 * the page that persuaded them to.
 *
 * noindex because there is nothing here to rank: a calendar embed and a short
 * preframe, reachable on a dozen URLs once the prefill params are on it. The
 * page it is linked from is the indexable one.
 */
export const metadata: Metadata = {
  title: meta.demo.title,
  description: meta.demo.description,
  robots: { index: false, follow: true },
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

  // Prefilled so nobody retypes their details on a phone keyboard. The links
  // into this page carry the query string over for exactly this. Null when GHL
  // isn't configured yet — CalendarModule renders its own fallback.
  const embedUrl = calendarEmbedUrl({
    firstName: params.firstName,
    phone: params.phone,
    email: params.email,
  });

  return (
    <>
      <PageTracking page="demo" cid={params.cid} />
      <FunnelHeader />

      <main className="flex-1">
        <CalendarModule embedUrl={embedUrl} />
      </main>

      <FunnelFooter />
    </>
  );
}
