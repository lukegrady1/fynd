"use client";

import { useId } from "react";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DotGrid } from "@/components/textures/Textures";
import { DemoCta } from "./DemoCta";

/**
 * Dark closer. One line, one button, back to pricing. Everything else was
 * stripped on purpose — restating the offer here competed with the ask.
 */

/**
 * A marker smudge under whatever word it sits beneath.
 *
 * A filled shape rather than a stroke, so the band can vary in thickness the
 * way a felt-tip does, run through a turbulence + displacement filter that
 * chews the edges up. A clean stroke reads as a border-bottom; the roughened
 * fill reads as ink.
 *
 * Scales uniformly with the word's width instead of stretching to it — a
 * marker stroke that got wider without getting thicker would look like a
 * rubber band. The filter id is per-instance so two of these on one page can't
 * collide.
 */
function Underline() {
  const filterId = `marker-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 26"
      fill="none"
      className="pointer-events-none absolute left-0 top-full w-full -translate-y-[0.1em] overflow-visible text-fynd-green"
    >
      <defs>
        <filter
          id={filterId}
          x="-10%"
          y="-80%"
          width="120%"
          height="260%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.55"
            numOctaves="3"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter={`url(#${filterId})`} fill="currentColor">
        {/* One pass only. A second, offset stroke underneath read as a drop
            shadow rather than as ink doubling back. */}
        <path d="M6 8c54-9 118-11 180-8 33 2 66 7 110 3l-3 16c-41 5-77 0-113-2-59-3-119-1-176 8z" />
      </g>
    </svg>
  );
}

export function FinalCta({
  heading,
  ctaLabel,
  targetId,
  withDemo,
}: {
  heading: { lead: string; accent: string; tail: string };
  ctaLabel: string;
  targetId: string;
  withDemo?: boolean;
}) {
  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "final_cta" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 lg:py-24">
      <DotGrid tone="dark" />
      <Container className="relative">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <h2 className="text-h1 text-white">
            {heading.lead}{" "}
            {/* The word stays white; the green is a drawn underline beneath
                it. inline-block so the SVG can be positioned against the word
                rather than the whole line. */}
            <span className="relative inline-block">
              {heading.accent}
              <Underline />
            </span>
            {heading.tail}
          </h2>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleClick}
              className="flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
            >
              {ctaLabel}
            </button>
            {withDemo && <DemoCta section="final_cta" />}
          </div>
        </div>
      </Container>
    </section>
  );
}
