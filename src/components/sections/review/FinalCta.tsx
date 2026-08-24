"use client";

import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { DotGrid } from "@/components/textures/Textures";

/**
 * Dark closer. One line, one button, back to pricing. Everything else was
 * stripped on purpose — restating the offer here competed with the ask.
 */
export function FinalCta({
  heading,
  ctaLabel,
  targetId,
}: {
  heading: string;
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
    <section className="relative isolate overflow-hidden bg-navy py-16 lg:py-24">
      <DotGrid tone="dark" />
      <Container className="relative">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <h2 className="text-h1 text-white">{heading}</h2>

          <button
            type="button"
            onClick={handleClick}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
          >
            {ctaLabel}
          </button>
        </div>
      </Container>
    </section>
  );
}
