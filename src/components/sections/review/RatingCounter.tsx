"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ratingDemo } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The signature element. A Google-business-profile-style card whose rating
 * ticks 4.2 → 4.8 and review count 31 → 94, once, on load. This single moment
 * is the product pitch — everything around it stays quiet so it lands.
 *
 * Reduced motion renders the end state immediately, no animation.
 */

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function RatingCounter({
  businessName,
  size = "md",
}: {
  businessName?: string;
  /** "lg" is the hero treatment — bigger numerals, more padding, delta chip. */
  size?: "md" | "lg";
}) {
  const lg = size === "lg";
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
    <div
      className={cn(
        "rounded-md border border-line bg-white shadow-sm",
        lg ? "rounded-lg p-6 lg:p-7" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-semibold text-ink",
              lg ? "text-h3" : "text-[15px]",
            )}
          >
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
      <div
        className={cn("flex items-end gap-3", lg ? "mt-6" : "mt-4")}
        aria-hidden="true"
      >
        <span
          className={cn(
            "font-bold leading-none tabular-nums text-ink",
            lg ? "text-[64px]" : "text-[44px]",
          )}
        >
          {value.rating.toFixed(1)}
        </span>
        <div className="pb-1">
          <Stars rating={value.rating} size={lg ? "lg" : "md"} />
          <p
            className={cn(
              "tabular-nums text-ink-soft",
              lg ? "mt-2 text-body" : "mt-1.5 text-small",
            )}
          >
            {value.reviews} Google reviews
          </p>
        </div>
      </div>

      {/* The delta the card just animated through — same figures, stated. */}
      {lg && (
        <p
          aria-hidden="true"
          className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-small"
        >
          <span className="rounded-full bg-fynd-green/15 px-2 py-1 text-micro text-[#0F8F6E]">
            {`+${to.reviews - from.reviews} reviews`}
          </span>
          <span className="text-ink-soft">
            {`from ${from.rating.toFixed(1)} in six months`}
          </span>
        </p>
      )}

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
function Stars({ rating, size = "md" }: { rating: number; size?: "md" | "lg" }) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;

  return (
    <span className="relative inline-block align-middle">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarGlyph key={i} filled={false} size={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarGlyph key={i} filled size={size} />
          ))}
        </span>
      </span>
    </span>
  );
}

function StarGlyph({ filled, size }: { filled: boolean; size: "md" | "lg" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn(
        "shrink-0",
        size === "lg" ? "h-6 w-6" : "h-[18px] w-[18px]",
      )}
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
