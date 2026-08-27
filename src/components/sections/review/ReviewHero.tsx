"use client";

import { ArrowRight, Check } from "lucide-react";
import { hero } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { HeroCollage } from "./HeroCollage";
import { HeroProof } from "./HeroProof";
import { OfferClock } from "./OfferClock";
import { DemoCta } from "./DemoCta";

/**
 * Hero. The visual is the automation running end to end, not a dashboard —
 * the product's magic is that a finished job turns into a review without
 * anyone touching it, and a static dashboard cannot show that.
 */
export function ReviewHero({
  biz,
  variant,
  targetId,
  withDemo,
}: {
  biz?: string;
  /** "start" sells the product, "call" sells the call. See copy.ts. */
  variant: "start" | "call";
  targetId: string;
  /** Pairs "Book a Demo" with the primary ask. */
  withDemo?: boolean;
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
        <div className="grid items-center gap-12 xl:grid-cols-[0.85fr_1.15fr] xl:gap-10">
          <div>
            {/* The offer flag sits above the headline rather than on the
                button: it is content the reader takes in with the h1, not a
                sticker on a control, and it leaves both CTAs clean. */}
            <OfferClock tone="dark" />

            <h1 className="mt-6 text-[27px] font-bold leading-[1.1] tracking-[-0.02em] text-white min-[420px]:text-[31px] sm:text-[38px] lg:text-[42px]">
              <span className="block">{lead}</span>
              <span className="block text-fynd-green">{accent}</span>
            </h1>

            <p className="mt-6 max-w-[460px] text-body text-white/75">
              {copy.sub}
            </p>

            {/* A w-fit grid, not a flex row: two equal columns that size to
                the WIDER label rather than stretching to fill the line. Flex
                with flex-1 fills the row (too wide) and flex with auto widths
                makes them unequal; grid with fit-content gives both at once.
                Both still fit side by side at 320px. h-12 is the floor —
                below that the tap target drops under 44px. */}
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

                {withDemo && (
                  <DemoCta
                    section="hero"
                    className="h-12 w-full whitespace-nowrap px-3 text-small sm:h-14 sm:w-full sm:px-8 sm:text-body"
                  />
                )}
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

            <HeroProof className="mt-7" />
          </div>

          <HeroCollage business={biz} />
        </div>
      </Container>
    </section>
  );
}
