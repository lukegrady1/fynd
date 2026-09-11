"use client";

import { ArrowRight } from "lucide-react";
import { watch } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { VslPlayer } from "./VslPlayer";

/**
 * The /watch hero: a headline, the video, the ask.
 *
 * Stacked and centred rather than the two-column hero on /start, because the
 * video is the whole point of the page and a 16:9 frame squeezed into half
 * the row is a thumbnail. On a phone the order is headline, video, button —
 * the video sits inside the first screen and a half.
 *
 * The CTA is under the video, not beside the headline. Someone who arrives
 * ready to book scrolls one screen; everyone else meets the button after the
 * thing that earns it.
 */
export function WatchHero({ targetId }: { targetId: string }) {
  const copy = watch.hero;

  const goTo = () => {
    track("cta_click", { cta: copy.cta, section: "hero" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={goTo}
            className="group flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
          >
            {copy.cta}
            <ArrowRight
              aria-hidden="true"
              className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
            />
          </button>
        </div>
      </Container>
    </section>
  );
}
