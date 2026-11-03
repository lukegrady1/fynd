"use client";

import { useEffect, useRef } from "react";

/**
 * The rail over the first-month steps, driven by scroll: the coloured
 * line grows from the first dot to the last as the list moves up the
 * viewport, and each step's dot fills when the line reaches it.
 *
 * Progress runs from the list entering the lower part of the viewport
 * (0) to its bottom edge passing the middle (1), so the line is complete
 * while the reader is still looking at the steps rather than after
 * they've gone. Dots are the `[data-dot]` elements in the same list,
 * `data-step` 0..n-1; this component marks them `data-reached` rather
 * than rendering them, so the list stays server-rendered markup.
 *
 * Progressive enhancement: before this runs, the line is one third
 * across and the first dot is filled, which is the static state the
 * section has always had.
 */
export function ProgressRail({ steps }: { steps: number }) {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = bar.current;
    const list = el?.closest("ol");
    if (!el || !list) return;

    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85; // list top crossing here: 0
      const end = vh * 0.5; // list bottom crossing here: 1
      const travelled = start - rect.top;
      const total = start - end + rect.height;
      const p = Math.min(1, Math.max(0, travelled / total));

      // From the first dot (1/6 across) to the last (5/6): 2/3 of the rail.
      el.style.width = `${(p * 200) / 3}%`;

      const reached = Math.floor(p * (steps - 1) + 1e-6);
      dots.forEach((dot) => {
        const i = Number(dot.dataset.step ?? 0);
        dot.toggleAttribute("data-reached", i <= reached);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [steps]);

  return (
    <span
      ref={bar}
      aria-hidden="true"
      className="absolute left-[16.66%] top-[9px] hidden h-[3px] w-[33.33%] rounded-full bg-gradient-to-r from-fynd-blue to-fynd-green md:block"
    />
  );
}
