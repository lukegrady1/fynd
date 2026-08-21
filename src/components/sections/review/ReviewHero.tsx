"use client";

import { hero } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { Deadline } from "@/lib/offer";
import { Container } from "@/components/ui/Layout";
import { DeadlineChip, PriceBlock } from "./OfferBits";
import { RatingCounter } from "./RatingCounter";

/**
 * Hero. Quiet by design — the rating counter is the only loud element, so the
 * type around it stays restrained and the layout gives it room.
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
  const scrollTo = (section: string) => {
    track("cta_click", { cta: ctaLabel, section });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="bg-white pb-12 pt-8 lg:pb-20 lg:pt-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center lg:gap-16">
          <div>
            <DeadlineChip deadline={deadline} />

            <h1 className="mt-5 text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-ink sm:text-[40px] lg:text-[46px]">
              {biz ? hero.h1WithBiz(biz) : hero.h1}
            </h1>

            <p className="measure mt-4 text-body text-ink-soft">{hero.sub}</p>

            {/* Counter sits directly under the promise on mobile, where it
                does the most work; it moves alongside on wide screens. */}
            <div className="mt-8 lg:hidden">
              <RatingCounter businessName={biz} />
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => scrollTo("hero")}
                className="flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto sm:self-start"
              >
                {ctaLabel}
              </button>

              <button
                type="button"
                onClick={() => {
                  track("cta_click", { cta: "demo", section: "hero" });
                  document
                    .getElementById("demo")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="self-start text-body font-semibold text-fynd-blue underline-offset-4 hover:underline"
              >
                {hero.demoLink}
              </button>
            </div>

            <PriceBlock className="mt-8" />
          </div>

          <div className="hidden lg:block">
            <RatingCounter businessName={biz} />
          </div>
        </div>
      </Container>
    </section>
  );
}
