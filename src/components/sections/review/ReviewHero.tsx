"use client";

import { ArrowRight, Check } from "lucide-react";
import { hero, heroFlow } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { HeroFlow } from "./HeroFlow";

/**
 * Hero. The visual is the automation running end to end, not a dashboard —
 * the product's magic is that a finished job turns into a review without
 * anyone touching it, and a static dashboard cannot show that.
 */
export function ReviewHero({
  biz,
  variant,
  targetId,
}: {
  biz?: string;
  /** "start" sells the product, "call" sells the call. See copy.ts. */
  variant: "start" | "call";
  targetId: string;
}) {
  const copy = hero[variant];
  const lead = biz ? copy.leadWithBiz : copy.lead;
  const accent = biz ? copy.accentWithBiz(biz) : copy.accent;

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
        <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1fr] lg:gap-10">
          <div>
            <Eyebrow tone="light" variant="pill">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-fynd-green"
                />
                {heroFlow.eyebrow}
              </span>
            </Eyebrow>

            <h1 className="mt-6 text-[27px] font-bold leading-[1.1] tracking-[-0.02em] text-white min-[420px]:text-[31px] sm:text-[38px] lg:text-[42px]">
              <span className="block">{lead}</span>
              <span className="block text-fynd-green">{accent}</span>
            </h1>

            <p className="mt-6 max-w-[460px] text-body text-white/75">
              {copy.sub}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
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

              <p className="flex items-center gap-2 text-small text-white/60">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="h-4 w-4 shrink-0 text-fynd-green"
                />
                {copy.reassure}
              </p>
            </div>
          </div>

          <HeroFlow business={biz} />
        </div>
      </Container>
    </section>
  );
}
