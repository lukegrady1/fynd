"use client";

import { Clock } from "lucide-react";
import { offerWindow } from "@/content/copy";
import { useOfferWeek } from "@/lib/use-offer-window";
import { cn } from "@/lib/utils";

/**
 * The offer flag: a solid label tag, then the countdown.
 *
 * One component for both placements — the hero flag and the pricing card — so
 * the two can never show different deadlines. Read the note in
 * lib/use-offer-window.ts before treating this as a real deadline.
 *
 * Split into two fields rather than one flat pill because they are doing two
 * different jobs: the tag says what this is and never changes, the digits are
 * the part that moves and wants the eye. Run together at one weight they read
 * as a sentence and the number stops registering as a clock.
 *
 * The tag renders from the server; only the digits wait for the client. The
 * old version withheld the whole thing until the clock was known, which was
 * fine buried in the pricing card but would shove the h1 down a line on first
 * paint in the hero. Holding the shell and filling in the number keeps the
 * "never flash a wrong time" property without the layout shift.
 */
export function OfferClock({
  tone = "light",
  size = "md",
  className,
}: {
  /** "dark" sits on navy, "light" on white or Fynd Gray. */
  tone?: "dark" | "light";
  /**
   * "sm" is the hero's. Real type and padding steps rather than a transform:
   * scaling the whole flag down would soften the digits and leave the border
   * a fractional hairline.
   */
  size?: "sm" | "md";
  className?: string;
}) {
  const week = useOfferWeek();
  const dark = tone === "dark";
  const sm = size === "sm";

  return (
    <span
      className={cn(
        // flex-wrap, not a breakpoint: the two placements sit in containers of
        // very different widths — the hero gets the full column, the pricing
        // card only ~240px at 320px wide. Letting the zones stack when they
        // don't fit handles both without guessing where the cut is. Each zone
        // keeps its own nowrap so the label never breaks mid-phrase.
        "inline-flex flex-wrap items-stretch overflow-hidden rounded-sm border border-fynd-orange/45",
        dark ? "bg-navy-card" : "bg-white",
        className,
      )}
    >
      {/* Navy on orange, never white: #ff8a1f fails AA against white.
          The icon is hidden on the narrowest screens — with it the label wraps
          to two lines at 320px, which leaves the tag taller than the digits
          beside it. The words matter more than the glyph. */}
      <span
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap bg-fynd-orange uppercase tracking-[0.04em] text-navy sm:tracking-[0.08em]",
          // leading is explicit on the small one: the label is a bare text
          // node, so it becomes an anonymous flex item carrying the inherited
          // 24px line-height. Without this the padding shrinks but the flag
          // does not.
          sm
            ? "px-1.5 py-0.5 text-[10px] leading-[17px]"
            : "px-2 py-1.5 text-micro sm:px-2.5",
        )}
      >
        <Clock
          aria-hidden="true"
          strokeWidth={2.5}
          className={cn(
            "hidden min-[360px]:block",
            sm ? "h-2.5 w-2.5" : "h-3.5 w-3.5",
          )}
        />
        {offerWindow.label}
      </span>

      {week.state !== "unknown" && (
        <span
          className={cn(
            "flex items-center gap-1.5",
            // Same reason as the tag: both zones are stretched to the taller
            // one, so leaving either on the inherited 24px line-height keeps
            // the whole flag at its old height.
            sm
              ? "px-1.5 py-0.5 leading-[17px]"
              : "px-2.5 py-1.5 sm:gap-2 sm:px-3",
            dark ? "text-white" : "text-ink",
          )}
        >
          <Unit value={week.days} unit="d" dark={dark} sm={sm} />
          <Unit value={week.hours} unit="h" dark={dark} sm={sm} />
          <Unit value={week.minutes} unit="m" dark={dark} sm={sm} />
          <Unit value={week.seconds} unit="s" dark={dark} sm={sm} />
        </span>
      )}
    </span>
  );
}

/**
 * One time unit. tabular-nums is load-bearing: without it the whole row
 * reflows every second as the digits change width.
 */
function Unit({
  value,
  unit,
  dark,
  sm,
}: {
  value: number;
  unit: string;
  dark: boolean;
  sm: boolean;
}) {
  return (
    <span
      className={cn(
        "font-bold tabular-nums leading-none",
        sm ? "text-[12px]" : "text-small",
      )}
    >
      {String(value).padStart(2, "0")}
      <span
        className={cn(
          "ml-px font-semibold",
          sm ? "text-[9px]" : "text-[11px]",
          dark ? "text-white/45" : "text-ink-soft",
        )}
      >
        {unit}
      </span>
    </span>
  );
}
