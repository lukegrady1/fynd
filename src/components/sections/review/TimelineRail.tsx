"use client";

import { useEffect, useRef } from "react";

/**
 * The line down the left of the trial timeline, driven by scroll: the
 * green fill grows from the first dot toward the last as the list moves
 * up the viewport, and each step's dot is marked `data-reached` the
 * moment the fill passes it (the dot turns green and its check appears;
 * see `WatchTrialTimeline`). The vertical sibling of /manage's
 * `ProgressRail`.
 *
 * Progress runs from the list's top crossing 85% of the way down the
 * viewport (0) to its bottom crossing 40% (1): the fill spends the
 * list's height plus almost half a screen of scrolling getting to the
 * bottom, so it keeps pace with reading rather than racing ahead
 * (Luke, Nov 3, 2026: the first cut "goes too quick"). The height
 * change is eased over 500ms on top of that. Dots
 * are the `[data-dot]` elements in the same list; this marks them
 * rather than rendering them, so the list stays server-rendered.
 *
 * Progressive enhancement: before this runs the fill is empty and the
 * first dot is already reached (set in the markup).
 */
export function TimelineRail() {
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = fill.current;
    const list = el?.closest("ol");
    if (!el || !list) return;

    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85; // list top crossing here: 0
      const end = vh * 0.4; // list bottom crossing here: 1
      const travelled = start - rect.top;
      const total = start - end + rect.height;
      const p = Math.min(1, Math.max(0, travelled / total));
      const px = p * rect.height;
      el.style.height = `${px}px`;

      dots.forEach((dot, i) => {
        const d = dot.getBoundingClientRect();
        const centre = d.top + d.height / 2 - rect.top;
        dot.toggleAttribute("data-reached", i === 0 || px >= centre);
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
  }, []);

  return (
    <span
      ref={fill}
      aria-hidden="true"
      className="absolute left-[11px] top-3 w-px bg-gradient-to-b from-fynd-blue to-fynd-green transition-[height] duration-500 ease-out"
      style={{ height: 0 }}
    />
  );
}
