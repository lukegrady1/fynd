"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * A marker smudge under whatever word it sits beneath.
 *
 * A filled shape rather than a stroke, so the band can vary in thickness the
 * way a felt-tip does, run through a turbulence + displacement filter that
 * chews the edges up. A clean stroke reads as a border-bottom; the roughened
 * fill reads as ink.
 *
 * Scales uniformly with the word's width instead of stretching to it — a
 * marker stroke that got wider without getting thicker would look like a
 * rubber band. The filter id is per-instance so two of these on one page
 * can't collide. The parent must be `relative inline-block`.
 */
export function MarkerUnderline({ className }: { className?: string }) {
  const filterId = `marker-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 26"
      fill="none"
      className={cn(
        "pointer-events-none absolute left-0 top-full w-full -translate-y-[0.1em] overflow-visible text-fynd-green",
        className,
      )}
    >
      <defs>
        <filter
          id={filterId}
          x="-10%"
          y="-80%"
          width="120%"
          height="260%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.55"
            numOctaves="3"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter={`url(#${filterId})`} fill="currentColor">
        {/* One pass only. A second, offset stroke underneath read as a drop
            shadow rather than as ink doubling back. */}
        <path d="M6 8c54-9 118-11 180-8 33 2 66 7 110 3l-3 16c-41 5-77 0-113-2-59-3-119-1-176 8z" />
      </g>
    </svg>
  );
}
