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
  className,
}: {
  /** "dark" sits on navy, "light" on white or Fynd Gray. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const week = useOfferWeek();
  const dark = tone === "dark";

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
      <span className="flex items-center gap-1.5 whitespace-nowrap bg-fynd-orange px-2 py-1.5 text-micro uppercase tracking-[0.04em] text-navy sm:px-2.5 sm:tracking-[0.08em]">
        <Clock
          aria-hidden="true"
          strokeWidth={2.5}
          className="hidden h-3.5 w-3.5 min-[360px]:block"
        />
        {offerWindow.label}
      </span>

      {week.state !== "unknown" && (
        <span
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 sm:gap-2 sm:px-3",
            dark ? "text-white" : "text-ink",
          )}
        >
          <Unit value={week.days} unit="d" dark={dark} />
          <Unit value={week.hours} unit="h" dark={dark} />
          <Unit value={week.minutes} unit="m" dark={dark} />
          <Unit value={week.seconds} unit="s" dark={dark} />
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
}: {
  value: number;
  unit: string;
  dark: boolean;
}) {
  return (
    <span className="text-small font-bold tabular-nums leading-none">
      {String(value).padStart(2, "0")}
      <span
        className={cn(
          "ml-px text-[11px] font-semibold",
          dark ? "text-white/45" : "text-ink-soft",
        )}
      >
        {unit}
      </span>
    </span>
  );
}
