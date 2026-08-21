"use client";

import { Clock } from "lucide-react";
import { useOfferWindow } from "@/lib/use-offer-window";
import { cn } from "@/lib/utils";
import { offer, offerWindow } from "@/content/copy";

/**
 * Price block.
 *
 * The anchor is the free labour, not a struck-through price: management reads
 * $0 against the software cost they actually pay. A crossed-out "was $197" on
 * top of that would be a second, unexplained anchor — exactly the fake-anchor
 * problem the build spec warns about.
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
      <dl className="flex flex-col gap-2">
        <Row
          dark={dark}
          label={offer.labels.management}
          value={offer.labels.free}
          accent
        />
        <span
          aria-hidden="true"
          className={cn("h-px w-full", dark ? "bg-white/10" : "bg-line")}
        />
        <Row
          dark={dark}
          label={offer.labels.software}
          value={`$${offer.software}`}
          suffix="/mo"
        />
      </dl>

      <p
        className={cn(
          "mt-3 text-small",
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
          {offer.angle}
        </p>
      )}
    </div>
  );
}

function Row({
  dark,
  label,
  value,
  suffix,
  accent,
}: {
  dark: boolean;
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn("text-body", dark ? "text-white/72" : "text-ink-soft")}>
        {label}
      </dt>
      <dd
        className={cn(
          "text-h3 font-bold tabular-nums",
          accent
            ? dark
              ? "text-fynd-green"
              : "text-[#0F8F6E]"
            : dark
              ? "text-white"
              : "text-ink",
        )}
      >
        {value}
        {suffix && (
          <span
            className={cn(
              "text-body font-medium",
              dark ? "text-white/72" : "text-ink-soft",
            )}
          >
            {suffix}
          </span>
        )}
      </dd>
    </div>
  );
}

/**
 * The claim countdown. Ten minutes from first arrival, persisted so a reload
 * does not hand out a fresh window — see use-offer-window.ts.
 *
 * Renders nothing on the server and during hydration, because the start time
 * lives in the visitor's browser and guessing it would flash the wrong number.
 */
export function OfferCountdown({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const window = useOfferWindow();
  if (window.state === "unknown") return null;

  const closed = window.state === "closed";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-small font-semibold tabular-nums",
        closed
          ? tone === "dark"
            ? "border-white/15 bg-white/5 text-white/60"
            : "border-line bg-white text-ink-soft"
          : tone === "dark"
            ? "border-fynd-orange/40 bg-fynd-orange/12 text-fynd-orange"
            : "border-fynd-orange/40 bg-fynd-orange/8 text-ink",
        className,
      )}
    >
      <Clock
        aria-hidden="true"
        strokeWidth={2}
        className={cn(
          "h-4 w-4 shrink-0",
          closed ? "opacity-60" : "text-fynd-orange",
        )}
      />
      {closed ? (
        offerWindow.closedLabel
      ) : (
        <>
          <span>{`${offerWindow.label} — ${window.label}`}</span>
          <span className="hidden font-medium opacity-80 sm:inline">
            {offerWindow.claimBoth}
          </span>
        </>
      )}
    </span>
  );
}
