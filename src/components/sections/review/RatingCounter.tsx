"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ratingDemo } from "@/content/copy";
import { colors } from "@/lib/brand";

/**
 * The signature element. A Google-business-profile-style card whose rating
 * ticks 4.2 → 4.8 and review count 31 → 94, once, on load. This single moment
 * is the product pitch — everything around it stays quiet so it lands.
 *
 * Reduced motion renders the end state immediately, no animation.
 */

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function RatingCounter({ businessName }: { businessName?: string }) {
  const reduced = useReducedMotion();
  const { from, to } = ratingDemo;

  const [animated, setAnimated] = useState<{ rating: number; reviews: number }>(
    () => ({ ...from }),
  );
  const frame = useRef<number | null>(null);

  // Reduced motion shows the end state directly — derived, never set in an
  // effect, so there's no cascading render.
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

  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">
            {businessName ?? ratingDemo.businessName}
          </p>
          <p className="mt-0.5 text-small text-ink-soft">
            {ratingDemo.category}
          </p>
        </div>
        <GoogleGlyph />
      </div>

      {/*
        aria-live is deliberately off: the number changes ~60x/sec during the
        animation. Screen readers get the settled value from the label below.
      */}
      <div className="mt-4 flex items-end gap-3" aria-hidden="true">
        <span className="text-[44px] font-bold leading-none tabular-nums text-ink">
          {value.rating.toFixed(1)}
        </span>
        <div className="pb-1">
          <Stars rating={value.rating} />
          <p className="mt-1.5 text-small tabular-nums text-ink-soft">
            {value.reviews} Google reviews
          </p>
        </div>
      </div>

      <p className="sr-only">
        {`Rating ${to.rating.toFixed(1)} out of 5, from ${to.reviews} Google reviews.`}
      </p>
    </div>
  );
}

/**
 * Five stars with a fractional fill. Gold is not in the Fynd palette, so stars
 * use Fynd Green — the palette's reserved "rating" colour.
 */
function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;

  return (
    <span className="relative inline-block align-middle">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarGlyph key={i} filled={false} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarGlyph key={i} filled />
          ))}
        </span>
      </span>
    </span>
  );
}

function StarGlyph({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[18px] w-[18px] shrink-0"
      fill={filled ? colors.green : "none"}
      stroke={filled ? colors.green : colors.line}
      strokeWidth={filled ? 0 : 1.75}
      strokeLinejoin="round"
    >
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}

/** Small "G" mark so the card reads as a business profile, not a generic stat. */
function GoogleGlyph() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-[13px] font-bold text-ink-soft"
    >
      G
    </span>
  );
}
