"use client";

import { compare } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Split section: argument on the left, a stacked comparison on the right.
 *
 * Ranked by REVIEW COUNT, not map position — the product is review volume, and
 * a "rank #1 on Maps" claim is one we can't make good on. Figures are sample
 * data and say so, consistent with the hero counter's end state.
 */
export function CompetitorCompare({
  ctaLabel,
  targetId,
}: {
  ctaLabel?: string;
  targetId?: string;
}) {
  const handleClick = () => {
    if (!targetId) return;
    track("cta_click", { cta: ctaLabel ?? compare.cta, section: "compare" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow variant="pill">{compare.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-h1 text-ink">{compare.heading}</h2>
            <p className="measure mt-4 text-body text-ink-soft">
              {compare.body}
            </p>

            {ctaLabel && targetId && (
              <button
                type="button"
                onClick={handleClick}
                className="mt-7 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
              >
                {ctaLabel}
              </button>
            )}
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-line bg-fynd-gray p-5 lg:p-6">
              <p className="text-micro uppercase text-ink-soft">
                {compare.cardHeading}
              </p>

              <ol className="mt-4 flex flex-col gap-3">
                {compare.rows.map((row, i) => (
                  <li key={row.name}>
                    <CompareRow row={row} position={i + 1} />
                  </li>
                ))}
              </ol>

              <p className="mt-4 text-small text-ink-soft">
                {compare.footnote}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function CompareRow({
  row,
  position,
}: {
  row: { name: string; rating: number; reviews: number; you: boolean };
  position: number;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-md border p-4",
        row.you
          ? "border-fynd-green/50 bg-fynd-green/8"
          : "border-line bg-white",
      )}
    >
      <span
        className={cn(
          "w-5 shrink-0 text-h3 font-bold tabular-nums",
          row.you ? "text-[#0F8F6E]" : "text-ink-muted",
        )}
      >
        {position}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[15px]",
            row.you ? "font-semibold text-ink" : "text-ink",
          )}
        >
          {row.name}
        </p>
        <p className="mt-1 flex items-center gap-2">
          <span className="text-body font-bold tabular-nums text-ink">
            {row.rating.toFixed(1)}
          </span>
          <Stars rating={row.rating} dim={!row.you} />
        </p>
      </div>

      <p className="shrink-0 text-right">
        <span
          className={cn(
            "block text-h3 font-bold tabular-nums",
            row.you ? "text-[#0F8F6E]" : "text-ink-soft",
          )}
        >
          {row.reviews}
        </span>
        <span className="block text-small text-ink-soft">reviews</span>
      </p>
    </div>
  );
}

function Stars({ rating, dim }: { rating: number; dim: boolean }) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;
  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} color={colors.line} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} color={dim ? colors.navy : colors.green} />
          ))}
        </span>
      </span>
    </span>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill={color}>
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}
