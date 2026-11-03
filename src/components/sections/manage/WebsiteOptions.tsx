"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * The two website options under the drawn site: have us build one
 * (featured) and keep yours (warned off). From lg they sit side by
 * side. On a phone two stacked cards were a screen and a half, so
 * there a two-cell toggle shows one at a time (Luke, Nov 3, 2026) —
 * the same strip as /watch's plan picker, drawn for navy: one white
 * fill sliding between the cells, the card rising in on each switch.
 *
 * Both cards stay mounted; the one not showing is `hidden` below lg
 * only, so desktop never depends on the state and the no-JS page
 * still renders both.
 */
export function WebsiteOptions() {
  const copy = manage.website;
  const [active, setActive] = useState(0);

  return (
    <div className="mt-12 lg:mt-16">
      <div
        role="tablist"
        aria-label={copy.pickerLabel}
        className="relative grid grid-cols-2 gap-1 rounded-md border border-white/15 bg-white/5 p-1 lg:hidden"
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-sm bg-white shadow-md",
            "transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.3,0.64,1)]",
            active === 0 ? "translate-x-0" : "translate-x-[calc(100%+0.25rem)]",
          )}
        />
        {copy.options.map((opt, i) => {
          const selected = active === i;
          return (
            <button
              key={opt.label}
              type="button"
              role="tab"
              id={`website-tab-${i}`}
              aria-selected={selected}
              aria-controls={`website-option-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex min-h-[56px] flex-col items-start justify-center rounded-sm px-3 py-2 text-left transition-colors duration-300 ease-fynd active:scale-[0.99]",
                selected ? "text-navy" : "text-white hover:bg-white/5",
              )}
            >
              <span className={cn("text-micro uppercase", selected ? "text-ink-soft" : "text-white/60")}>
                {opt.label}
              </span>
              <span className="mt-0.5 text-small font-semibold leading-tight">{opt.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-5 lg:mt-0 lg:grid-cols-[1.35fr_1fr]">
        {copy.options.map((opt, i) => {
          const featured = i === 0;
          const warn = "tone" in opt && opt.tone === "warn";
          const showing = active === i;
          return (
            <div
              key={opt.label}
              id={`website-option-${i}`}
              role="tabpanel"
              aria-labelledby={`website-tab-${i}`}
              className={cn(
                showing ? "block max-lg:motion-safe:animate-[fynd-panel_260ms_var(--ease-fynd)_both]" : "hidden lg:block",
              )}
            >
              <Reveal
                delay={i * 0.08}
                className={cn(
                  "h-full rounded-lg border p-6 lg:p-7",
                  featured && "border-fynd-blue/60 bg-white/[0.04]",
                  warn && "border-dashed border-white/15 bg-transparent",
                  !featured && !warn && "border-white/15 bg-white/[0.02]",
                )}
              >
                <p className="text-micro uppercase text-white/60">{opt.label}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className={cn("text-h3 lg:text-[22px]", warn ? "text-white/80" : "text-white")}>
                    {opt.title}
                  </h3>
                  {"pill" in opt && (
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] font-semibold",
                        featured && "bg-fynd-green/20 text-fynd-green",
                        warn && "bg-fynd-orange/15 text-fynd-orange",
                        !featured && !warn && "bg-white/15 text-white",
                      )}
                    >
                      {opt.pill}
                    </span>
                  )}
                </div>
                <ul className={cn("mt-4 grid gap-2.5", featured && "sm:grid-cols-2")}>
                  {opt.items.map((item) => (
                    <li
                      key={item}
                      className={cn("flex items-start gap-2.5 text-body", warn ? "text-white/65" : "text-white/90")}
                    >
                      {warn ? (
                        <X aria-hidden="true" strokeWidth={3} className="mt-1 h-4 w-4 shrink-0 text-fynd-orange" />
                      ) : (
                        <Check aria-hidden="true" strokeWidth={3} className="mt-1 h-4 w-4 shrink-0 text-fynd-green" />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
                {"note" in opt && (
                  <p className="mt-5 border-t border-white/10 pt-4 text-small font-semibold text-white">
                    {opt.note}
                  </p>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
