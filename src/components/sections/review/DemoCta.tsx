"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { demoCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * "Book a Demo" — the second ask, paired with every primary CTA.
 *
 * A link to /demo in a new tab, not a scroll. Someone who is not ready to put
 * a card in needs somewhere to go that isn't the back button, and opening the
 * booking page in its own tab means they keep the page that convinced them.
 *
 * Deliberately quieter than the primary: outlined, no fill. It is the fallback
 * ask, and giving two buttons equal weight makes the page ask nothing at all.
 * The arrow points up-and-out rather than right, because the destination is
 * not further down this page.
 *
 * `section` is passed through to analytics so each placement can be told apart
 * in the funnel — the same label fires from several different places.
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
  const href = useDemoHref();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("cta_click", { cta: demoCta.label, section })}
      className={cn(
        "group flex h-14 w-full items-center justify-center rounded-sm border px-8 text-body font-semibold transition-all duration-150 ease-fynd hover:-translate-y-px active:scale-[0.99] sm:w-auto",
        tone === "dark"
          ? "border-white/25 text-white hover:border-white/45 hover:bg-white/[0.06]"
          : "border-line text-ink hover:border-ink-soft hover:bg-fynd-gray",
        className,
      )}
    >
      {demoCta.label}
      <span className="sr-only"> ({demoCta.newTabHint})</span>
      <ArrowUpRight
        aria-hidden="true"
        className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
      />
    </a>
  );
}

/**
 * /demo, carrying the current query string.
 *
 * The funnel URLs arrive from SMS with ?firstName=, ?phone= and ?email= on
 * them, and the calendar prefills from those — dropping them at the link would
 * make someone retype their details on a phone keyboard. Rendered as the bare
 * path on the server and upgraded on mount, so the link is correct before
 * hydration and there is no mismatch.
 */
export function useBookingHref(path: string) {
  const [href, setHref] = useState<string>(path);

  useEffect(() => {
    const query = window.location.search;
    setHref(query.length > 1 ? `${path}${query}` : path);
  }, [path]);

  return href;
}

/** The /demo calendar. */
export const useDemoHref = () => useBookingHref(demoCta.href);
