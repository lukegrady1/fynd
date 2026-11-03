"use client";

import { ArrowRight, Check, Search } from "lucide-react";
import { optimize } from "@/content/copy";
import { track } from "@/lib/analytics";
import { colors } from "@/lib/brand";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { GoogleProfile, profileGaps } from "./GoogleProfile";

/**
 * /optimize hero: the problem, as a picture.
 *
 * Same bones as the other heroes — navy, dotted map, two-line headline with
 * the payoff in green — and design.md's hero pattern on the right: a
 * product screenshot floated right with a soft blue glow. Here the
 * screenshot is a phone showing a Google search for the business and the
 * profile that opens under it, typical state, orange dots on the gaps. The
 * phone is cropped at the bottom so the hero stays a hero rather than the
 * page; the full card is further down, beside the optimized one.
 *
 * The button says "Learn how" and scrolls to the checklist, not the $99
 * (Luke): the page teaches first and asks later. A quiet text link for
 * whoever came here wanting the monthly plan instead.
 */
export function OptimizeHero({
  targetId,
  managedId,
}: {
  targetId: string;
  managedId: string;
}) {
  const copy = optimize.hero;
  const gapCount = profileGaps(true).length;

  const scrollTo = (id: string, section: string, cta: string) => {
    track("cta_click", { cta, section });
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-navy pt-16 lg:pt-24"
    >
      <DottedWorldMap pins={pins} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/70 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/85 lg:to-navy/50"
      />

      <Container className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-16">
          <div className="pb-4 lg:pb-24">

            <h1 className="text-hero text-white">
              <span className="block">{copy.lead}</span>
              <span className="block text-fynd-green">{copy.accent}</span>
            </h1>

            <p className="mt-6 max-w-[460px] text-body text-white/75">
              {copy.sub}
            </p>

            <div className="mt-9">
              <button
                type="button"
                onClick={() => scrollTo(targetId, "hero", copy.cta)}
                className="group flex h-12 w-full items-center justify-center whitespace-nowrap rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:h-14 sm:w-auto sm:px-8"
              >
                {copy.cta}
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
                />
              </button>

              <p className="mt-4 flex items-center gap-2 text-small text-white/60">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="h-4 w-4 shrink-0 text-fynd-green"
                />
                {copy.reassure}
              </p>

              <button
                type="button"
                onClick={() => scrollTo(managedId, "hero", copy.managedLink)}
                className="mt-3 text-small font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white"
              >
                {copy.managedLink} &rarr;
              </button>
            </div>
          </div>

          {/* The phone. Self-end so it sits on the section's bottom edge and
              the crop reads as the device running off the page, not as a
              box that ran out of room. */}
          <div className="relative mx-auto w-full max-w-[340px] self-end lg:mx-0 lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-x-16 -top-10 bottom-0 rounded-full bg-fynd-blue/25 blur-3xl"
            />

            <div className="relative max-h-[560px] overflow-hidden">
              <div className="rounded-t-[40px] bg-navy-card p-2.5 pb-0 ring-1 ring-white/10 shadow-lg">
                <div className="overflow-hidden rounded-t-[32px] bg-white">
                  <div aria-hidden="true" className="px-3 pb-2 pt-3">
                    <div className="flex h-10 items-center gap-2.5 rounded-full bg-fynd-gray px-3.5">
                      <Search
                        strokeWidth={2}
                        className="h-4 w-4 shrink-0 text-ink-soft"
                      />
                      <span className="truncate text-small text-ink">
                        {optimize.profile.business}
                      </span>
                    </div>
                  </div>
                  <GoogleProfile
                    state="typical"
                    compact
                    annotate="dots"
                    className="rounded-none border-0 border-t border-line shadow-none"
                  />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy to-transparent"
              />
            </div>

            <p className="absolute -top-4 left-4 flex items-center gap-2 rounded-full bg-navy-card px-3.5 py-2 text-small font-semibold text-white shadow-lg ring-1 ring-fynd-orange/60">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-fynd-orange"
              />
              {gapCount} {copy.callout}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The default pins sit in a band across the top and bottom of the hero; the
 * right-hand ones would land on the phone here, so this hero keeps them to
 * the left half.
 */
const pins = [
  { left: 8, top: 22, color: colors.blue },
  { left: 24, top: 16, color: colors.orange },
  { left: 40, top: 20, color: colors.green },
  { left: 14, top: 92, color: colors.green },
  { left: 36, top: 96, color: colors.blue },
];
