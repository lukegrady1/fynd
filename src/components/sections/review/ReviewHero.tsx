"use client";

import { hero, offer } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { Deadline } from "@/lib/offer";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { DeadlineChip } from "./OfferBits";
import { RatingCounter } from "./RatingCounter";

/**
 * Hero — design.md §10 signature pattern 1: Deep Navy with the dotted world
 * map and colored pins, headline split across two lines with the payoff in
 * Fynd Green.
 *
 * The navy ground exists for a reason beyond brand: the rating counter is a
 * white card, and on a white page it read as a faint outline floating in
 * space. On navy, with a blue glow behind it, it finally carries the section
 * the way the signature element should.
 */
export function ReviewHero({
  biz,
  deadline,
  ctaLabel,
  targetId,
}: {
  biz?: string;
  deadline: Deadline;
  ctaLabel: string;
  targetId: string;
}) {
  const goTo = (id: string, section: string, label: string) => {
    track("cta_click", { cta: label, section });
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: id === "demo" ? "center" : "start" });
  };

  const lead = biz ? hero.h1LeadWithBiz : hero.h1Lead;
  const accent = biz ? hero.h1AccentWithBiz(biz) : hero.h1Accent;

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-navy pb-14 pt-12 lg:pb-24 lg:pt-20"
    >
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/70 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/80 lg:to-transparent"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_minmax(0,420px)] lg:gap-16">
          <div>
            <DeadlineChip deadline={deadline} tone="dark" />

            <h1 className="mt-6 text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-white min-[420px]:text-[34px] sm:text-[44px] lg:text-[52px]">
              <span className="block">{lead}</span>
              <span className="block text-fynd-green">{accent}</span>
            </h1>

            <p className="mt-5 max-w-[500px] text-body text-white/75">
              {hero.sub}
            </p>

            {/* On mobile the counter sits directly under the promise, where it
                does the most work, and moves alongside it from lg up. */}
            <div className="mt-9 lg:hidden">
              <CounterWithGlow biz={biz} />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => goTo(targetId, "hero", ctaLabel)}
                className="flex h-14 items-center justify-center rounded-sm bg-fynd-blue px-7 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] hover:-translate-y-px active:scale-[0.99]"
              >
                {ctaLabel}
              </button>

              <button
                type="button"
                onClick={() => goTo("demo", "hero", "demo")}
                className="flex h-14 items-center justify-center rounded-sm border-[1.5px] border-white/30 px-7 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:border-white hover:bg-white/10"
              >
                {hero.demoLink}
              </button>
            </div>

            {/* One compact price line — the stacked block that used to sit here
                repeated the deadline chip and buried the CTA. */}
            <p className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-small tabular-nums text-white/50 line-through decoration-fynd-orange decoration-2">
                ${offer.priceLater}/mo
              </span>
              <span className="text-h3 font-bold tabular-nums text-white">
                ${offer.priceNow}
                <span className="text-body font-medium text-white/72">/mo</span>
              </span>
              <span className="text-small text-white/60">
                {offer.priceReason}
              </span>
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {hero.trustRow.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-small text-white/72"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-fynd-green"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <CounterWithGlow biz={biz} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Soft blue bloom behind the card so it lifts off the navy. */
function CounterWithGlow({
  biz,
  size = "md",
}: {
  biz?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-lg bg-fynd-blue/25 blur-3xl"
      />
      <div className="relative">
        <RatingCounter businessName={biz} size={size} />
      </div>
    </div>
  );
}
