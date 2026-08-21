import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, Check } from "lucide-react";
import { confirmed } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { formatDeadline } from "@/lib/offer";
import { Container } from "@/components/ui/Layout";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { PageTracking } from "@/components/sections/review/PageTracking";

export const metadata: Metadata = {
  title: "You're booked — Fynd",
  robots: { index: false, follow: false },
};

/**
 * GHL redirects here after a booking. It passes the slot back on the query
 * string; `start` is read as unix seconds when present.
 */
export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = parseParams(sp);

  const startRaw = Array.isArray(sp.start) ? sp.start[0] : sp.start;
  const startMs = Number(startRaw) * 1000;
  const slot =
    Number.isFinite(startMs) && startMs > 0 ? formatDeadline(startMs) : null;

  return (
    <>
      <PageTracking page="confirmed" cid={params.cid} />
      <FunnelHeader />

      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[620px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fynd-green/15">
              <Check
                aria-hidden="true"
                strokeWidth={2.5}
                className="h-6 w-6 text-[#0F8F6E]"
              />
            </span>

            <h1 className="mt-5 text-h1 text-ink">{confirmed.heading}</h1>

            {slot && (
              <p className="mt-4 rounded-sm border border-line bg-fynd-gray px-4 py-3 text-h3 tabular-nums text-ink">
                {slot}
              </p>
            )}

            <p className="mt-4 text-body text-ink-soft">{confirmed.sub}</p>

            {/* TODO(integration): generate a real .ics / Google Calendar link
                from the booking once GHL passes the slot through. */}
            <p className="mt-6 inline-flex items-center gap-2 text-small text-ink-soft">
              <CalendarPlus aria-hidden="true" className="h-4 w-4" />
              {confirmed.addToCalendar} — available once the calendar is wired up.
            </p>

            {/* Some people book and then buy before the call. Let them. */}
            <section className="mt-10 rounded-lg border border-line bg-fynd-gray p-6 lg:p-8">
              <h2 className="text-h3 text-ink">{confirmed.skipHeading}</h2>
              <p className="mt-1.5 text-body text-ink-soft">
                {confirmed.skipBody}
              </p>
              <Link
                href="/start"
                className="mt-5 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto sm:self-start sm:px-8"
              >
                {confirmed.skipCta}
              </Link>
            </section>
          </div>
        </Container>
      </main>

      <FunnelFooter />
    </>
  );
}
