"use client";

import { ArrowRight, Check, Globe, Star } from "lucide-react";
import { bundle } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { DemoCta } from "./DemoCta";

/**
 * /website hero. Same bones as the homepage hero — navy, dotted map, two-line
 * headline with the payoff in green — with the two halves of the plan drawn
 * as a pair of cards on the right, because "website plus reviews" is the
 * whole pitch and a sentence can't show two things side by side.
 */
export function BundleHero({ targetId }: { targetId: string }) {
  const copy = bundle.hero;

  const goTo = () => {
    track("cta_click", { cta: copy.cta, section: "hero" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-navy py-16 lg:py-24"
    >
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/70 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/85 lg:to-navy/50"
      />

      <Container className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
          <div>
            <h1 className="text-hero text-white">
              <span className="block">{copy.lead}</span>
              <span className="block text-fynd-green">{copy.accent}</span>
            </h1>

            <p className="mt-6 max-w-[460px] text-body text-white/75">
              {copy.sub}
            </p>

            <div className="mt-9">
              <div className="grid w-fit grid-cols-2 items-center gap-2.5 sm:gap-4">
                <button
                  type="button"
                  onClick={goTo}
                  className="group flex h-12 w-full items-center justify-center whitespace-nowrap rounded-sm bg-fynd-blue px-3 text-small font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:h-14 sm:px-8 sm:text-body"
                >
                  {copy.cta}
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-1.5 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px] sm:ml-2"
                  />
                </button>
                <DemoCta
                  section="hero"
                  className="h-12 w-full whitespace-nowrap px-3 text-small sm:h-14 sm:w-full sm:px-8 sm:text-body"
                />
              </div>

              <p className="mt-4 flex items-center gap-2 text-small text-white/60">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="h-4 w-4 shrink-0 text-fynd-green"
                />
                {copy.reassure}
              </p>
            </div>
          </div>

          <PlanPair />
        </div>
      </Container>
    </section>
  );
}

/**
 * The two halves, as cards. Titles and one line each; the full lists are in
 * the includes section below, and repeating them here would make the hero
 * the longest thing on the page.
 */
function PlanPair() {
  const { website, reviews } = bundle.includes;

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
      <ul className="flex flex-col gap-3">
        <li className="rounded-lg border border-white/10 bg-navy-card p-5 lg:p-6">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-fynd-blue/30 bg-fynd-blue/15 text-fynd-blue">
              <Globe aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
            </span>
            <span className="text-h3 text-white">{website.title}</span>
          </span>
          <p className="mt-3 text-small text-white/72">{website.blurb}</p>
        </li>

        <li
          aria-hidden="true"
          className="flex items-center justify-center text-micro uppercase text-white/50"
        >
          <span className="h-px flex-1 bg-white/10" />
          <span className="px-3">plus</span>
          <span className="h-px flex-1 bg-white/10" />
        </li>

        <li className="rounded-lg border border-white/10 bg-navy-card p-5 lg:p-6">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-fynd-green/30 bg-fynd-green/15 text-fynd-green">
              <Star aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
            </span>
            <span className="text-h3 text-white">{reviews.title}</span>
          </span>
          <p className="mt-3 text-small text-white/72">{reviews.blurb}</p>
        </li>
      </ul>

      <p className="mt-4 text-center text-small text-white/60">
        <span className="font-bold tabular-nums text-white">
          ${bundle.price}
        </span>{" "}
        today, then{" "}
        <span className="font-bold tabular-nums text-white">
          ${bundle.monthly}
        </span>
        /month
      </p>
    </div>
  );
}
