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
  variant,
  targetId,
}: {
  biz?: string;
  deadline: Deadline;
  /** "start" sells the product, "call" sells the call. See copy.ts. */
  variant: "start" | "call";
  targetId: string;
}) {
  const copy = hero[variant];
  const ctaLabel = copy.cta;
  // The demo only exists once a video id is set. Without this the hero offers
  // a second, equal-weight CTA that leads to a dead placeholder.
  const hasDemo = Boolean(process.env.NEXT_PUBLIC_VSL_EMBED_ID);
  const goTo = (id: string, section: string, label: string) => {
    track("cta_click", { cta: label, section });
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: id === "demo" ? "center" : "start" });
  };

  const lead = biz ? copy.leadWithBiz : copy.lead;
  const accent = biz ? copy.accentWithBiz(biz) : copy.accent;

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
              {copy.sub}
            </p>

            {/* On mobile the counter sits directly under the promise, where it
                does the most work, and moves alongside it from lg up. */}
            <div className="mt-9 lg:hidden">
              <CounterWithGlow biz={biz} />
            </div>

            <div className="mt-9 flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => goTo(targetId, "hero", ctaLabel)}
                className="flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] hover:-translate-y-px active:scale-[0.99] sm:w-auto"
              >
                {ctaLabel}
              </button>

              {hasDemo && (
                <button
                  type="button"
                  onClick={() => goTo("demo", "hero", "demo")}
                  className="text-body font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  {hero.demoLink}
                </button>
              )}
            </div>

            {/* Anchored on the free labour rather than a struck-through
                price — the discount is that the work costs nothing. */}
            <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <p className="flex items-baseline gap-2.5">
                <span className="text-small text-white/60">
                  {offer.labels.management}
                </span>
                <span className="text-h3 font-bold text-fynd-green">
                  {offer.labels.free}
                </span>
              </p>
              <p className="flex items-baseline gap-2.5">
                <span className="text-small text-white/60">
                  {offer.labels.software}
                </span>
                <span className="text-h3 font-bold tabular-nums text-white">
                  ${offer.software}
                  <span className="text-body font-medium text-white/72">
                    /mo
                  </span>
                </span>
              </p>
            </div>

            <p className="mt-2 max-w-[500px] text-small text-white/60">
              {hero.angleLine}
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
