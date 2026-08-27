"use client";

import { ArrowRight } from "lucide-react";
import { demoCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * "Book a Demo" — the second ask, paired with every primary CTA on the page.
 *
 * The page now carries two conversion modules, checkout and the calendar, and
 * a visitor who is not ready to put a card in needs somewhere to go that isn't
 * the back button. So every primary CTA gets this beside it rather than the
 * page relying on one calendar block far down the scroll.
 *
 * Deliberately quieter than the primary: outlined, no fill. It is the fallback
 * ask, and giving two buttons equal weight makes the page ask nothing at all.
 *
 * `section` is passed through to analytics so each placement can be told apart
 * in the funnel — the same label fires from five different places.
 */
export function DemoCta({
  section,
  tone = "dark",
  className,
}: {
  section: string;
  /** "dark" sits on navy, "light" on white or Fynd Gray. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const handleClick = () => {
    track("cta_click", { cta: demoCta.label, section });
    document
      .getElementById(demoCta.anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex h-14 w-full items-center justify-center rounded-sm border px-8 text-body font-semibold transition-all duration-150 ease-fynd hover:-translate-y-px active:scale-[0.99] sm:w-auto",
        tone === "dark"
          ? "border-white/25 text-white hover:border-white/45 hover:bg-white/[0.06]"
          : "border-line text-ink hover:border-ink-soft hover:bg-fynd-gray",
        className,
      )}
    >
      {demoCta.label}
      <ArrowRight
        aria-hidden="true"
        className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
      />
    </button>
  );
}
