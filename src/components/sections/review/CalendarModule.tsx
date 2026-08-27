"use client";

import { useEffect, useId, useState } from "react";
import Script from "next/script";
import { calendar, offer } from "@/content/copy";
import { GHL_EMBED_SCRIPT } from "@/lib/ghl-embed";
import { track, trackOnce } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

/**
 * The booking calendar, and nothing else.
 *
 * This used to carry a preframe, an agenda card, a heading and a text-instead
 * note. They are gone: /demo is reached by clicking "Book a Demo" from a page
 * that has already made the argument, so re-making it here just puts furniture
 * between someone and the time they came to pick.
 *
 * The iframe keeps its fixed min-height (700px mobile / 620px desktop) so the
 * page doesn't jump as the embed loads, with a skeleton underneath.
 */
export function CalendarModule({
  embedUrl,
  id = "convert",
}: {
  embedUrl: string | null;
  /**
   * Defaults to "convert" for a page where booking IS the conversion. On the
   * combined page checkout owns "convert", so this renders on "demo" instead —
   * two modules on one page cannot share an anchor.
   */
  id?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  /**
   * GHL's form_embed.js resizes the iframe by id, so it needs one, and it has
   * to survive hydration — useId rather than the Date.now() their snippet
   * uses, which would differ between server and client render. The id still
   * leads with the calendar id, which is the part their script keys on.
   */
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const calendarId = embedUrl?.split("/").pop()?.split("?")[0] ?? "cal";
  const frameId = `${calendarId}_${reactId}`;

  useEffect(() => {
    trackOnce("calendar_loaded", { configured: Boolean(embedUrl) });
  }, [embedUrl]);

  return (
    <section id={id} className="scroll-mt-20 bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="relative mx-auto min-h-[700px] max-w-[520px] lg:min-h-[620px]">
          {embedUrl ? (
            <>
              {!loaded && <CalendarSkeleton />}
              {/* In flow rather than absolutely positioned, because
                  form_embed.js sets the height inline and an absolute frame
                  would clip whatever it grows to. min-height keeps the space
                  reserved so the page doesn't jump while it loads, and
                  scrolling is left enabled: if the resize script is blocked,
                  an inner scrollbar is ugly but a clipped calendar is
                  unusable. */}
              <iframe
                id={frameId}
                src={embedUrl}
                title="Book a time"
                allow="payment"
                className="block min-h-[700px] w-full rounded-lg border border-line bg-white lg:min-h-[620px]"
                onLoad={() => {
                  setLoaded(true);
                  track("calendar_loaded", { state: "iframe_ready" });
                }}
              />
              <Script
                src={GHL_EMBED_SCRIPT}
                strategy="lazyOnload"
              />
            </>
          ) : (
            <CalendarSkeleton
              note="Calendar not configured — set NEXT_PUBLIC_GHL_CALENDAR_ID."
            />
          )}
        </div>
      </Container>
    </section>
  );
}

function CalendarSkeleton({ note }: { note?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 rounded-lg border border-line bg-white p-5">
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
