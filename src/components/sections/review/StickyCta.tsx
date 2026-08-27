"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { demoCta, offer } from "@/content/copy";
import { useDemoHref } from "./DemoCta";
import { cn } from "@/lib/utils";

/**
 * A small pill that appears only once the visitor has scrolled past the
 * conversion module.
 *
 * The full-width bar it replaces sat over ~70px of every viewport for the
 * entire page, which reads as shouting at someone who already knows you. This
 * stays out of the way until they have passed the ask without taking it.
 */
export function StickyCta({
  ctaLabel,
  targetId,
  withDemo,
}: {
  ctaLabel: string;
  targetId: string;
  /** Adds a second, quieter pill beside the primary one. */
  withDemo?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const demoHref = useDemoHref();

  useEffect(() => {
    // A scroll handler rather than IntersectionObserver: the observer only
    // fires on threshold crossings, so a programmatic jump past the target and
    // back left the pill stuck visible. Reading position directly is
    // deterministic at any scroll offset.
    let frame = 0;

    const update = () => {
      frame = 0;
      const target = document.getElementById(targetId);
      if (!target) return;
      setVisible(target.getBoundingClientRect().bottom < 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);


  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "sticky_pill" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-5 z-40 flex justify-center gap-2 px-4",
        "transition-all duration-250 ease-fynd",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className="flex h-10 items-center gap-2 rounded-full bg-navy px-3.5 shadow-lg ring-1 ring-white/10 transition-colors duration-150 hover:bg-navy-card sm:h-12 sm:gap-3 sm:px-5"
      >
        {/* The price is the first thing dropped when the row runs out of
            room. Below 360px the two pills cannot both fit with it, and a
            truncated "Book a De…" costs more than a hidden number — the price
            is on the card these buttons scroll to. */}
        <span className="hidden text-[13px] font-bold tabular-nums text-white min-[360px]:inline sm:text-small">
          ${offer.price}/mo
        </span>
        <span
          aria-hidden="true"
          className="hidden h-4 w-px bg-white/20 min-[360px]:block"
        />
        <span className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-fynd-green sm:text-small">
          {ctaLabel}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      </button>

      {/* No price on this one — it is the ask for people who did not want the
          price. */}
      {withDemo && (
        <a
          href={demoHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("cta_click", { cta: demoCta.label, section: "sticky_pill" })
          }
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          className="flex h-10 shrink-0 items-center rounded-full bg-navy px-3.5 shadow-lg ring-1 ring-white/10 transition-colors duration-150 hover:bg-navy-card sm:h-12 sm:px-5"
        >
          <span className="whitespace-nowrap text-[13px] font-semibold text-white sm:text-small">
            {demoCta.label}
          </span>
          <span className="sr-only"> ({demoCta.newTabHint})</span>
        </a>
      )}
    </div>
  );
}
