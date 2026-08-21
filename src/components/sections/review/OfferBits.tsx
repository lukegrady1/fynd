"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { offer } from "@/content/copy";
import type { Deadline } from "@/lib/offer";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Deadline chip.
 *
 * Renders the server-formatted date string on first paint so SSR and hydration
 * agree, then upgrades to a live countdown only once under 24 hours remain.
 * Never renders negative time; when the deadline passes the chip disappears
 * rather than resetting the clock.
 *
 * Fynd Orange fails contrast as small text on white (design.md §13), so on
 * light surfaces the alert colour carries the border, tint and icon while the
 * text stays navy. On navy the orange text passes and is used directly.
 */
export function DeadlineChip({
  deadline,
  tone = "light",
  className,
}: {
  deadline: Deadline;
  tone?: "light" | "dark";
  className?: string;
}) {
  const label = useCountdownLabel(deadline);
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-small font-semibold tabular-nums",
        tone === "light"
          ? "border-fynd-orange/40 bg-fynd-orange/8 text-ink"
          : "border-fynd-orange/40 bg-fynd-orange/12 text-fynd-orange",
        className,
      )}
    >
      <Clock
        aria-hidden="true"
        strokeWidth={2}
        className="h-4 w-4 shrink-0 text-fynd-orange"
      />
      {label}
    </span>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Reads the clock via useSyncExternalStore rather than an effect + setState:
 * the server snapshot is `null`, so SSR and the hydrating render both use the
 * pre-formatted date and can't mismatch.
 *
 * The snapshot is bucketed so it only changes when the rendered label would —
 * a deadline days away returns a constant and never re-renders the chip.
 */
function useCountdownLabel(deadline: Deadline): string | null {
  const dateLabel = `$${offer.priceNow} rate held until ${deadline.formatted}`;

  const store = useMemo(() => {
    const at = deadline.at;

    const getSnapshot = () => {
      const remaining = at - Date.now();
      if (remaining <= 0) return -1; // expired
      if (remaining >= DAY_MS) return 0; // show the date, not a timer
      return Math.floor(remaining / 1000);
    };

    return {
      subscribe: (onChange: () => void) => {
        const id = setInterval(onChange, 1000);
        return () => clearInterval(id);
      },
      getSnapshot,
      getServerSnapshot: (): number | null => null,
    };
  }, [deadline.at]);

  const secondsLeft = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  // First render (server and hydration): show the date string.
  if (secondsLeft === null || secondsLeft === 0) return dateLabel;
  if (secondsLeft < 0) return null;

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return `$${offer.priceNow} rate expires in ${h}:${pad(m)}:${pad(s)}`;
}

/**
 * Price block. The struck-through $197 needs a reason or it reads as a fake
 * anchor, so the founding-rate line sits directly beneath it.
 */
export function PriceBlock({
  tone = "light",
  showReason = true,
  className,
}: {
  tone?: "light" | "dark";
  showReason?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div className={className}>
      <p className="flex items-baseline gap-2.5">
        <span
          className={cn(
            "text-[13px] font-medium tabular-nums line-through decoration-fynd-orange decoration-2",
            dark ? "text-white/55" : "text-ink-soft",
          )}
        >
          ${offer.priceLater}/mo
        </span>
        <span
          className={cn(
            "text-[28px] font-bold leading-none tabular-nums",
            dark ? "text-white" : "text-ink",
          )}
        >
          ${offer.priceNow}
          <span
            className={cn(
              "ml-0.5 text-body font-medium",
              dark ? "text-white/72" : "text-ink-soft",
            )}
          >
            /mo
          </span>
        </span>
      </p>
      <p
        className={cn(
          "mt-1.5 text-small",
          dark ? "text-white/72" : "text-ink-soft",
        )}
      >
        {offer.terms}
      </p>
      {showReason && (
        <p
          className={cn(
            "mt-1 text-small",
            dark ? "text-white/55" : "text-ink-soft",
          )}
        >
          {offer.priceReason}
        </p>
      )}
    </div>
  );
}

/** Real capacity limit — driven by a hand-set number, never a live counter. */
export function CapacityLine({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { perMonth, month } = offer.capacity;
  const spotsLeft: number = offer.capacity.spotsLeft;
  if (spotsLeft <= 0) return null;

  return (
    <p
      className={cn(
        "text-small",
        tone === "dark" ? "text-white/72" : "text-ink-soft",
        className,
      )}
    >
      {`I take ${perMonth} new accounts a month so setup stays hands-on. `}
      <span
        className={cn(
          "font-semibold",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {`${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left in ${month}.`}
      </span>
    </p>
  );
}
