"use client";

import { ArrowUpRight } from "lucide-react";
import { demoCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useDemoHref } from "@/components/sections/review/DemoCta";

/**
 * The quiet "book a call" text link beside a button, for whoever wants
 * to talk before paying. Opens the calendar in a new tab, like the
 * other funnel pages' demo links.
 */
export function CallLink({
  label,
  section,
  tone = "dark",
  className,
}: {
  label: string;
  section: string;
  /** "dark" is blue text on a light section; "light" is white on navy. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const href = useDemoHref();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("cta_click", { cta: label, section })}
      className={cn(
        "inline-flex items-center gap-1 text-body font-semibold underline-offset-4 transition-colors duration-150 hover:underline",
        tone === "dark" ? "text-fynd-blue" : "text-white/85 hover:text-white",
        className,
      )}
    >
      {label}
      <span className="sr-only"> ({demoCta.newTabHint})</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}
