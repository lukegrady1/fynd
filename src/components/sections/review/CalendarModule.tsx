"use client";

import { useEffect, useState } from "react";
import { calendar, offer } from "@/content/copy";
import { track, trackOnce } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { CapacityLine, PriceBlock } from "./OfferBits";

/**
 * /call — booking. Matches the checkout card's dimensions so the pages twin.
 *
 * The iframe gets a fixed min-height (700px mobile / 620px desktop) so the
 * page doesn't jump as the embed loads, with a skeleton underneath.
 */
export function CalendarModule({
  embedUrl,
  deadlineLabel,
}: {
  embedUrl: string | null;
  deadlineLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    trackOnce("calendar_loaded", { configured: Boolean(embedUrl) });
  }, [embedUrl]);

  return (
    <section id="convert" className="scroll-mt-20 bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[520px]">
          {/* Offer block stays on this page so nobody arrives at the call
              thinking it's free consulting. */}
          <div className="rounded-lg border border-line bg-white p-6 lg:p-8">
            <PriceBlock />
            <p className="mt-4 text-small text-ink-soft">
              {calendar.preframe(deadlineLabel)}
            </p>
          </div>

          <div className="mt-6 rounded-lg border-2 border-fynd-blue bg-white p-6 lg:p-8">
            <h2 className="text-h2 text-ink">{calendar.heading}</h2>
            <p className="mt-3 text-body text-ink-soft">{calendar.body}</p>

            <div className="relative mt-6 min-h-[700px] lg:min-h-[620px]">
              {embedUrl ? (
                <>
                  {!loaded && <CalendarSkeleton />}
                  <iframe
                    src={embedUrl}
                    title="Book a time"
                    className="absolute inset-0 h-full w-full rounded-sm border border-line"
                    onLoad={() => {
                      setLoaded(true);
                      track("calendar_loaded", { state: "iframe_ready" });
                    }}
                  />
                </>
              ) : (
                <CalendarSkeleton
                  note="Calendar not configured — set NEXT_PUBLIC_GHL_CALENDAR_ID."
                />
              )}
            </div>

            <p className="mt-5 text-small text-ink-soft">
              {calendar.textInstead}
            </p>
          </div>

          <CapacityLine className="mt-5 text-center" />
        </div>
      </Container>
    </section>
  );
}

function CalendarSkeleton({ note }: { note?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 rounded-sm border border-line bg-fynd-gray p-5">
      <div className="h-5 w-40 animate-pulse rounded-sm bg-line" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-sm bg-line"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <p className="mt-auto text-small text-ink-soft">
        {note ?? calendar.loading}
      </p>
    </div>
  );
}

export { offer };
