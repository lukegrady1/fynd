import type { Metadata } from "next";
import { meta, setter } from "@/content/copy";
import { calendarEmbedUrl } from "@/lib/ghl";
import { FunnelHeader } from "@/components/sections/review/PageChrome";
import { CalendarEmbed } from "@/components/sections/review/CalendarModule";
import { Container, Eyebrow } from "@/components/ui/Layout";

/**
 * The setter's booking page: the calendar, and nothing else.
 *
 * The setter keeps this open while on the phone with a lead, clicks a free
 * slot and books it on the lead's behalf. It embeds the "Fynd Demo Call"
 * calendar, which is deliberately NOT the calendar behind /demo — same person,
 * a 15-minute slot, and a separate calendar so a setter-booked demo is
 * distinguishable in GHL from one the lead booked themselves. Its name
 * is lead-facing on purpose: it shows in the widget header and on the invite.
 *
 * No footer, no tracking, no prefill. Nobody is being persuaded here, and the
 * lead's details go in by hand because the setter is the one typing them.
 *
 * noindex/nofollow: it is an internal tool on a public URL, not a page.
 */
export const metadata: Metadata = {
  title: meta.schedule.title,
  description: meta.schedule.description,
  robots: { index: false, follow: false },
};

export default function SchedulePage() {
  const embedUrl = calendarEmbedUrl(
    {},
    process.env.NEXT_PUBLIC_GHL_SETTER_CALENDAR_ID,
  );

  return (
    <>
      <FunnelHeader />

      <main className="flex-1 bg-fynd-gray py-10 lg:py-14">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <Eyebrow>{setter.eyebrow}</Eyebrow>
            <h1 className="mt-2 text-h3 text-navy">{setter.heading}</h1>
            <p className="mt-2 text-small text-ink-soft">{setter.note}</p>
          </div>
          {embedUrl ? (
            <CalendarEmbed embedUrl={embedUrl} className="mx-auto mt-6 max-w-[520px]" />
          ) : (
            <p className="mx-auto mt-6 max-w-[520px] rounded-lg border border-line bg-white p-5 text-small text-ink-soft">
              {setter.notConfigured}
            </p>
          )}
        </Container>
      </main>
    </>
  );
}
