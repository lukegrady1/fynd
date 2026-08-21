"use client";

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
  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "sticky_bar" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95",
        "pb-[env(safe-area-inset-bottom)] backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <p className="flex shrink-0 items-baseline gap-2">
            <span className="text-small text-white/60">
              {offer.labels.management}
            </span>
            <span className="text-h3 font-bold text-fynd-green">
              {offer.labels.free}
            </span>
            <span className="text-small text-white/40">·</span>
            <span className="text-small text-white/60">
              {offer.labels.software}
            </span>
            <span className="text-h3 font-bold tabular-nums text-white">
              ${offer.software}/mo
            </span>
          </p>
          <DeadlineChip deadline={deadline} tone="dark" className="shrink-0" />
        </div>

        {/* Mobile: price stays compact so the button keeps its full width. */}
        <p className="flex shrink-0 flex-col leading-tight lg:hidden">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fynd-green">
            {`${offer.labels.management} ${offer.labels.free.toLowerCase()}`}
          </span>
          <span className="text-body font-bold tabular-nums text-white">
            ${offer.software}
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
