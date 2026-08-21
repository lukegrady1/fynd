"use client";

import { finalCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DotGrid } from "@/components/textures/Textures";
import { CapacityLine, PriceBlock } from "./OfferBits";

/**
 * Dark closer. Restates the outcome and scrolls back to the conversion module.
 * No new information by design.
 */
export function FinalCta({
  heading,
  sub,
  ctaLabel,
  targetId,
}: {
  heading: string;
  sub: string;
  ctaLabel: string;
  targetId: string;
}) {
  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "final_cta" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative isolate overflow-hidden bg-navy py-14 lg:py-20">
      <DotGrid tone="dark" />
      <Container className="relative">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <h2 className="text-h1 text-white">{heading}</h2>
          <p className="mt-3 text-body text-white/75">{sub}</p>

          <PriceBlock tone="dark" showReason={false} className="mt-8" />

          <button
            type="button"
            onClick={handleClick}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
          >
            {ctaLabel}
          </button>

          <CapacityLine tone="dark" className="mt-6" />
        </div>
      </Container>
    </section>
  );
}

export { finalCta };
