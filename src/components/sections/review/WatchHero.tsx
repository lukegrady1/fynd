"use client";

import { Star } from "lucide-react";
import { watch } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { VslPlayer } from "./VslPlayer";

/**
 * The /watch hero: a headline, the video, the ask.
 *
 * Stacked and centred rather than the two-column hero on the homepage,
 * because the video is the whole point of the page and a 16:9 frame squeezed
 * into half the row is a thumbnail. On a phone the order is headline, video,
 * buttons — the video sits inside the first screen and a half.
 *
 * The ask is under the video, not beside the headline. Someone who arrives
 * ready to start scrolls one screen; everyone else meets it after the
 * thing that earns it. It is /manage's hero ask (Luke, Nov 3, 2026): one
 * big pill to the price card, the trial line under it, then five stars
 * and the trust line. The "Book a Demo" button that sat beside the old
 * one is gone from the hero; the call link lives in the trial section and
 * the closer now.
 */
export function WatchHero({ targetId }: { targetId: string }) {
  const copy = watch.hero;

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-navy py-12 lg:py-20"
    >
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/70 to-navy/40"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
          <h1 className="text-hero text-white">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green">{copy.accent}</span>
          </h1>
        </div>

        <VslPlayer
          targetId={targetId}
          className="mx-auto mt-8 w-full max-w-[960px] lg:mt-10"
        />

        <div className="mx-auto mt-8 flex w-full max-w-[440px] flex-col items-center gap-3">
          <ScrollButton
            targetId={targetId}
            label={watch.cta}
            section="hero"
            className="h-14 w-full rounded-full text-[18px] sm:h-16 sm:w-full sm:text-[20px]"
          />
          <p className="text-small text-white/60">{copy.ctaNote}</p>
          <p className="flex items-center gap-2.5 text-small font-semibold text-white/85">
            <span className="flex gap-0.5" role="img" aria-label={copy.trustSr}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} strokeWidth={0} className="h-4 w-4 fill-fynd-orange" />
              ))}
            </span>
            {copy.trust}
          </p>
        </div>
      </Container>
    </section>
  );
}
