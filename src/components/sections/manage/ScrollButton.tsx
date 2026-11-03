"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The one button this page repeats: a label, a scroll to an anchor, and
 * a tracked click. "primary" is Fynd Blue; "light" is white on navy, for
 * the buttons that sit inside dark cards.
 */
export function ScrollButton({
  targetId,
  label,
  section,
  variant = "primary",
  className,
}: {
  targetId: string;
  label: string;
  /** For analytics, so the page's buttons can be told apart. */
  section: string;
  variant?: "primary" | "light";
  className?: string;
}) {
  const scrollTo = () => {
    track("cta_click", { cta: label, section });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={scrollTo}
      className={cn(
        "group inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-sm px-6 text-body font-semibold transition-all duration-150 ease-fynd hover:-translate-y-px active:scale-[0.99] sm:h-14 sm:w-auto sm:px-9",
        variant === "primary"
          ? "bg-fynd-blue text-white shadow-blue hover:bg-[#3F4DF0]"
          : "bg-white text-navy shadow-md hover:bg-fynd-gray",
        className,
      )}
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
      />
    </button>
  );
}
