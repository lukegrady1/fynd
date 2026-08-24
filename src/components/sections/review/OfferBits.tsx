"use client";

import { useOfferWindow } from "@/lib/use-offer-window";
import { cn } from "@/lib/utils";
import { offer, offerWindow } from "@/content/copy";

/**
 * Price block.
 *
 * Mirrors the pricing section's two states. While the claim window is open,
 * management reads $0 against the software cost. Once it closes, management
 * is priced at its real rate and the reason line changes with it — otherwise
 * the calendar and the final CTA would still be advertising free management
 * after the price had already moved.
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
  const claim = useOfferWindow();
  // `unknown` (server render, first paint, no JS) shows the open state — see
  // the same reasoning in PricingSection.
  const managementFree = claim.state !== "closed";

  return (
    <div className={className}>
      <dl className="flex flex-col gap-2">
        <Row
          dark={dark}
          label={
            managementFree
              ? offer.labels.management
              : offerWindow.managementLabelClosed
          }
          value={
            managementFree
              ? offer.labels.free
              : `$${offer.managed - offer.software}`
          }
          suffix={managementFree ? undefined : "/mo"}
          accent={managementFree}
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
          {managementFree ? offer.angle : offerWindow.closedReason}
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
