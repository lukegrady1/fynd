"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Section reveal — fade + 12px rise on scroll into view, once, 300ms.
 *
 * Progressive enhancement, deliberately: the markup renders VISIBLE. The
 * hidden start state lives behind `@media (scripting: enabled)` in globals.css,
 * so with JavaScript disabled — or if this component never hydrates — the copy
 * is simply there, which the spec requires. No inline script, so no hydration
 * mismatch; no framer-motion, so nothing extra on the critical path for LCP.
 */
export function Reveal({
  children,
  delay = 0,
  from,
  offset = 60,
  className,
}: {
  children: ReactNode;
  delay?: number;
  /**
   * Direction to arrive from, on phones only — see the note in globals.css.
   * Omit for the default rise.
   */
  from?: "left" | "right";
  /**
   * How far into the viewport the element has to travel before it fires, in
   * px from the bottom edge. Raise it when a stack should arrive one at a
   * time rather than all at once: with the default, four short items are all
   * inside the viewport together and reveal as a single group.
   */
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in view on load, or the browser can't observe: show immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px -${offset}px 0px` },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [offset]);

  return (
    <div
      ref={ref}
      className={cn("js-reveal", from && `js-reveal-${from}`, className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
