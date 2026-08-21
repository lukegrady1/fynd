"use client";

import { useEffect, useState } from "react";
import { offer } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { Deadline } from "@/lib/offer";
import { cn } from "@/lib/utils";
import { DeadlineChip } from "./OfferBits";

/**
 * The highest-leverage element on the page: the CTA is never more than one
 * thumb-tap away.
 *
 * Desktop pins to the top and fades in once the hero leaves the viewport.
 * Mobile pins to the bottom and is always present — waiting for a scroll
 * threshold on a phone just means the CTA is missing when they land.
 */
export function StickyOfferBar({
  ctaLabel,
  targetId,
  deadline,
}: {
  ctaLabel: string;
  /** Element to scroll to — the checkout card or the calendar. */
  targetId: string;
  deadline: Deadline;
}) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Both funnel pages render #hero. If it's absent the desktop bar simply
    // stays hidden rather than flashing in and out.
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "sticky_bar" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-40 border-white/10 bg-navy/95 backdrop-blur-sm",
        // Bottom on mobile (thumb reach), top on desktop.
        "bottom-0 border-t pb-[env(safe-area-inset-bottom)]",
        "lg:bottom-auto lg:top-0 lg:border-b lg:border-t-0",
        "transition-opacity duration-250 ease-fynd",
        // Mobile: always available. Desktop: fades in after the hero exits.
        pastHero
          ? "opacity-100"
          : "opacity-100 lg:pointer-events-none lg:opacity-0",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <p className="flex shrink-0 items-baseline gap-2">
            <span className="text-small tabular-nums text-white/55 line-through decoration-fynd-orange decoration-2">
              ${offer.priceLater}/mo
            </span>
            <span className="text-h3 font-bold tabular-nums text-white">
              ${offer.priceNow}/mo
            </span>
            <span className="text-small text-white/72">· no contract</span>
          </p>
          <DeadlineChip deadline={deadline} tone="dark" className="shrink-0" />
        </div>

        {/* Mobile: price stays compact so the button keeps its full width. */}
        <p className="flex shrink-0 items-baseline gap-1.5 lg:hidden">
          <span className="text-[13px] tabular-nums text-white/55 line-through decoration-fynd-orange decoration-2">
            ${offer.priceLater}
          </span>
          <span className="text-body font-bold tabular-nums text-white">
            ${offer.priceNow}
            <span className="text-small font-medium text-white/72">/mo</span>
          </span>
        </p>

        <button
          type="button"
          onClick={handleClick}
          className="ml-auto h-12 shrink-0 rounded-sm bg-fynd-blue px-5 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.98] lg:h-11"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
