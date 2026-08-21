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
  className,
}: {
  children: ReactNode;
  delay?: number;
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
      { rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("js-reveal", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
