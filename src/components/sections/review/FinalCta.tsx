"use client";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { DotGrid } from "@/components/textures/Textures";
import { DemoCta } from "./DemoCta";
import { MarkerUnderline } from "./MarkerUnderline";

/**
 * Dark closer. One line, one button, back to pricing. Everything else was
 * stripped on purpose — restating the offer here competed with the ask.
 */

export function FinalCta({
  heading,
  ctaLabel,
  targetId,
  withDemo,
  note,
  compactOnMobile,
}: {
  heading: { lead: string; accent: string; tail: string };
  ctaLabel: string;
  targetId: string;
  withDemo?: boolean;
  /** One quiet line under the button — /watch's trial terms. */
  note?: string;
  /**
   * A smaller button on phones: 48px tall and shrink-to-fit instead of
   * 56px full width. /watch only (Luke, Nov 3, 2026); the other pages'
   * closers keep the full-size one.
   */
  compactOnMobile?: boolean;
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
              <MarkerUnderline />
            </span>
            {heading.tail}
          </h2>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleClick}
              className={cn(
                "flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto",
                compactOnMobile && "max-sm:h-12 max-sm:w-auto max-sm:self-center max-sm:px-7 max-sm:text-small",
              )}
            >
              {ctaLabel}
            </button>
            {withDemo && <DemoCta section="final_cta" />}
          </div>
          {note && <p className="mt-4 text-small text-white/60">{note}</p>}
        </div>
      </Container>
    </section>
  );
}
