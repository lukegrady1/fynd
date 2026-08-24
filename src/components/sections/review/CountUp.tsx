"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a figure up when it scrolls into view.
 *
 * The final value is what renders on the server, so with JavaScript off — or
 * before hydration — the reader sees "92%" rather than a stuck zero. The
 * count only exists client-side.
 *
 * Two things it deliberately refuses to do:
 *  - If the element is already on screen when this mounts, the final value has
 *    already been painted. Resetting it to zero to animate would read as a
 *    glitch, so it just stays put.
 *  - Under prefers-reduced-motion it does nothing at all.
 *
 * The frame loop writes textContent directly instead of going through state.
 * A setState per frame would re-render the tree sixty times a second, and the
 * project's lint rules ban setState inside an effect anyway.
 */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const DURATION_MS = 1100;

export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Split "92%" into "", "92", "%" so any prefix or suffix survives.
    const parts = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!parts) return;

    const [, prefix, digits, suffix] = parts;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = (digits.split(".")[1] ?? "").length;

    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    const paint = (n: number) => {
      el.textContent = `${prefix}${n.toFixed(decimals)}${suffix}`;
    };
    paint(0);

    let frame = 0;
    let startedAt = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const step = (now: number) => {
          if (!startedAt) startedAt = now;
          const t = Math.min(1, (now - startedAt) / DURATION_MS);
          if (t < 1) {
            paint(target * easeOutCubic(t));
            frame = requestAnimationFrame(step);
          } else {
            // Land on the authored string so formatting is exact.
            el.textContent = value;
          }
        };

        frame = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
