"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { ratingDemo, profileCard } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The hero's Google Business Profile card.
 *
 * The reference this was modelled on centres a "local map position #2" panel.
 * That is swapped for review volume here, because the product is reviews, not
 * search position — and a map-rank readout would promise something the system
 * doesn't sell. The rating and review count still animate up once on load;
 * that count-up is the signature moment on the page.
 *
 * Sample figures throughout, labelled as such on the card.
 */

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function ProfileCard({
  businessName,
  className,
}: {
  businessName?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { from, to } = ratingDemo;

  const [animated, setAnimated] = useState<{ rating: number; reviews: number }>(
    () => ({ ...from }),
  );
  const frame = useRef<number | null>(null);
  const value = reduced ? to : animated;

  useEffect(() => {
    if (reduced) return;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / DURATION, 1);
      const eased = easeOut(t);
      setAnimated({
        rating: from.rating + (to.rating - from.rating) * eased,
        reviews: Math.round(from.reviews + (to.reviews - from.reviews) * eased),
      });
      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [reduced, from, to]);

  const added = to.reviews - from.reviews;

  return (
    <div className={className}>
      {/* Positioning context for the floating chips. The footnote must stay
          OUTSIDE it, or -bottom-4 anchors below the footnote instead of the
          card and the chip lands on top of the text. */}
      <div className="relative">
        <div className="rounded-lg border border-line bg-white p-5 shadow-lg lg:p-6">
          {/* header */}
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <span className="flex items-center gap-2">
              <GoogleG />
              <span className="text-[13px] font-semibold text-ink">
                {profileCard.header}
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/12 px-2.5 py-1">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-fynd-green"
              />
              <span className="text-micro uppercase text-[#0F8F6E]">
                {profileCard.live}
              </span>
            </span>
          </div>

          {/* business + rating */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <div className="min-w-0">
              <p className="truncate text-h3 text-ink">
                {businessName ?? ratingDemo.businessName}
              </p>
              <p className="mt-0.5 text-small text-ink-soft">
                {ratingDemo.category}
              </p>
            </div>
            <div className="shrink-0 text-right" aria-hidden="true">
              <p className="text-[34px] font-bold leading-none tabular-nums text-ink">
                {value.rating.toFixed(1)}
              </p>
              <Stars rating={value.rating} className="mt-1.5 justify-end" />
            </div>
          </div>

          {/* the panel — reviews, not map position */}
          <div className="mt-5 rounded-md bg-navy p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-micro uppercase text-white/60">
                  {profileCard.panelLabel}
                </p>
                <p
                  className="mt-1.5 text-[40px] font-bold leading-none tabular-nums text-fynd-green"
                  aria-hidden="true"
                >
                  {value.reviews}
                </p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1.5 text-small font-semibold text-fynd-green">
                  <TrendingUp aria-hidden="true" className="h-4 w-4" />
                  {profileCard.trend}
                </p>
                <p className="mt-1 text-micro uppercase text-white/60">
                  {profileCard.panelHint}
                </p>
              </div>
            </div>

            {/* monthly review volume */}
            <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
              {profileCard.months.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${Math.max(h, 8)}px`,
                    background:
                      i >= profileCard.months.length - 2
                        ? colors.green
                        : "rgba(255,255,255,0.16)",
                  }}
                />
              ))}
            </div>
          </div>

          <p className="sr-only">
            {`Business profile preview: rating ${to.rating.toFixed(1)} out of 5, from ${to.reviews} Google reviews.`}
          </p>
        </div>

        {/* floating chips, echoing the reference's layered badges */}
        <span className="absolute -right-2 -top-3 flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 shadow-md lg:-right-4">
          <TrendingUp
            aria-hidden="true"
            className="h-3.5 w-3.5 text-fynd-green"
          />
          <span className="text-micro uppercase tabular-nums text-white">
            {`+${added} reviews`}
          </span>
        </span>

        <span className="absolute -bottom-4 -left-2 flex flex-col gap-1 rounded-md bg-navy px-3 py-2 shadow-md lg:-left-5">
          <Stars rating={5} small />
          <span className="text-micro uppercase text-white/72">
            {profileCard.newReview}
          </span>
        </span>
      </div>

      <p className="mt-10 text-small text-white/60">{profileCard.footnote}</p>
    </div>
  );
}

function Stars({
  rating,
  className,
  small,
}: {
  rating: number;
  className?: string;
  small?: boolean;
}) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;
  const size = small ? "h-3 w-3" : "h-[18px] w-[18px]";

  return (
    <span className={cn("relative inline-flex", className)} aria-hidden="true">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} color={colors.line} className={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} color={colors.green} className={size} />
          ))}
        </span>
      </span>
    </span>
  );
}

function Star({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("shrink-0", className)} fill={color}>
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}

/** Small "G" so the card reads as a business profile. */
function GoogleG() {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[11px] font-bold text-ink-soft"
    >
      G
    </span>
  );
}
