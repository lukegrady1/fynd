"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { profileSwap } from "@/content/copy";

/**
 * One Google Business Profile card that swaps from a dim 4.2 to a bright 4.8
 * when it scrolls into view.
 *
 * Both states occupy the same grid cell rather than being absolutely
 * positioned, so the card is as tall as the taller state and the swap causes
 * no layout shift.
 *
 * Progressive enhancement, same rule as Reveal: the markup renders the AFTER
 * state, so with JavaScript off the reader sees the finished profile rather
 * than a permanently dim one. The before-state and the transition only exist
 * behind `@media (scripting: enabled)` in globals.css.
 */
export function ProfileSwap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-swapped");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // A beat on the "before" state, or the swap has happened before the
        // reader has registered what they are looking at.
        const timer = setTimeout(() => el.classList.add("is-swapped"), 900);
        el.dataset.timer = String(timer);
      },
      { rootMargin: "0px 0px -120px 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (el.dataset.timer) clearTimeout(Number(el.dataset.timer));
    };
  }, []);

  return (
    <div ref={ref} className="js-swap relative">
      <div className="grid overflow-hidden rounded-lg border border-white/10 bg-navy-card">
        <ProfileCard state="before" />
        <ProfileCard state="after" />
      </div>

      <p className="swap-elapsed mt-4 flex items-center justify-center gap-2 text-small text-white/70">
        <span
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-r from-transparent to-fynd-green"
        />
        {profileSwap.elapsed}
        <span
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-l from-transparent to-fynd-green"
        />
      </p>
    </div>
  );
}

function ProfileCard({ state }: { state: "before" | "after" }) {
  const data = profileSwap[state];
  const after = state === "after";

  return (
    <div
      className={`col-start-1 row-start-1 p-5 lg:p-6 ${
        after ? "swap-after" : "swap-before"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-h3 text-white">{profileSwap.business}</p>
          <p className="mt-0.5 text-small text-white/55">
            {profileSwap.category}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em] ${
            after
              ? "bg-fynd-green/15 text-fynd-green"
              : "bg-white/8 text-white/50"
          }`}
        >
          {data.label}
        </span>
      </div>

      <p className="mt-5 flex items-center gap-3">
        <span
          className={`text-[40px] font-bold leading-none tabular-nums ${
            after ? "text-white" : "text-white/45"
          }`}
        >
          {data.rating}
        </span>
        <span className="flex flex-col gap-1">
          <Stars rating={Number(data.rating)} dim={!after} />
          <span
            className={`text-small tabular-nums ${
              after ? "text-white/75" : "text-white/40"
            }`}
          >
            {data.reviews}
          </span>
        </span>
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {profileSwap.actions.map((action) => (
          <li
            key={action}
            className={`rounded-full border px-3 py-1 text-small ${
              after
                ? "border-white/15 text-white/75"
                : "border-white/8 text-white/35"
            }`}
          >
            {action}
          </li>
        ))}
      </ul>

      <p
        className={`mt-5 border-t pt-4 text-small ${
          after ? "border-white/10 text-white/70" : "border-white/5 text-white/40"
        }`}
      >
        {data.note}
      </p>
    </div>
  );
}

/** Whole and half stars, so 4.2 doesn't round up to a clean five. */
function Stars({ rating, dim }: { rating: number; dim: boolean }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating - i >= 0.75;
        const half = !filled && rating - i >= 0.25;
        return (
          <Star
            key={i}
            strokeWidth={1.5}
            className={`h-4 w-4 ${
              dim ? "text-white/30" : "text-fynd-orange"
            } ${filled ? "fill-current" : half ? "fill-current opacity-60" : ""}`}
          />
        );
      })}
    </span>
  );
}
