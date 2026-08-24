"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { profileSwap } from "@/content/copy";

/**
 * The real before/after Google Business Profile, crossfading when it scrolls
 * into view.
 *
 * Both screenshots share one grid cell rather than being absolutely
 * positioned, so the frame is as tall as the taller image and the swap causes
 * no layout shift. They are the same aspect ratio (0.934), so nothing shifts
 * or letterboxes mid-fade.
 *
 * Progressive enhancement, same rule as Reveal: the markup renders the AFTER
 * screenshot, so with JavaScript off the reader sees the finished profile
 * rather than a permanently stale one. The before state and the transition
 * only exist behind `@media (scripting: enabled)` in globals.css.
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

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // A beat on "before", or the change lands before the reader has
        // registered what they were looking at.
        timer = setTimeout(() => el.classList.add("is-swapped"), 900);
      },
      { rootMargin: "0px 0px -120px 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="js-swap mx-auto w-full max-w-[390px]">
      <div className="relative grid overflow-hidden rounded-lg border border-white/10 bg-navy-card shadow-2xl shadow-black/30">
        <Shot state="before" />
        <Shot state="after" />
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

function Shot({ state }: { state: "before" | "after" }) {
  const shot = profileSwap[state];
  const after = state === "after";

  return (
    <div
      className={`col-start-1 row-start-1 ${after ? "swap-after" : "swap-before"}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes="390px"
        className="h-auto w-full"
      />
      <span
        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em] ${
          after
            ? "bg-fynd-green text-navy"
            : "bg-navy/80 text-white/70 ring-1 ring-white/15"
        }`}
      >
        {shot.label}
      </span>
    </div>
  );
}
