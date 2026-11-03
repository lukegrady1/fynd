"use client";

import { Plus } from "lucide-react";
import { manage } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";

/**
 * The FAQ in the platform's shape: eyebrow, heading and sub down the
 * left, the questions numbered down the right in one bordered card.
 * Native <details>, like the other FAQs on the site: keyboard and
 * screen-reader semantics for free, readable without JavaScript. Which
 * question gets opened is tracked.
 */
export type FaqCopy = {
  eyebrow: string;
  heading: string;
  sub: string;
  items: readonly { q: string; a: string }[];
};

/** `copy` defaults to /manage's; /watch passes `watchFaq`. */
export function ManageFaq({
  copy = manage.faq,
  tone = "dark",
}: {
  copy?: FaqCopy;
  /** "dark" is /manage's navy; "light" is /watch's Fynd Gray with a white card. */
  tone?: "dark" | "light";
} = {}) {
  const dark = tone === "dark";

  return (
    <section className={cn("py-12 lg:py-20", dark ? "bg-navy text-white" : "bg-fynd-gray text-ink")}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className={cn("text-micro uppercase", dark ? "text-[#8FA0FF]" : "text-fynd-green-text")}>{copy.eyebrow}</p>
            <h2 className={cn("mt-3 text-h1 lg:text-[44px] lg:leading-[1.15]", dark ? "text-white" : "text-ink")}>{copy.heading}</h2>
            <p className={cn("mt-4 text-body", dark ? "text-white/75" : "text-ink-soft")}>{copy.sub}</p>
          </div>

          <div
            className={cn(
              "divide-y overflow-hidden rounded-lg",
              dark ? "divide-white/10 bg-navy-card text-white shadow-lg ring-1 ring-white/10" : "divide-line bg-white text-ink shadow-sm ring-1 ring-line",
            )}
          >
            {copy.items.map((item, i) => (
              <details
                key={item.q}
                className="group"
                onToggle={(e) => {
                  if (e.currentTarget.open) track("faq_open", { question: item.q });
                }}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden sm:px-6">
                  <span className={cn("w-6 shrink-0 text-[12px] font-bold tabular-nums", dark ? "text-[#8FA0FF]" : "text-fynd-blue")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("flex-1 text-h3", dark ? "text-white" : "text-ink")}>{item.q}</span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-250 ease-fynd group-open:rotate-45 group-open:bg-fynd-blue group-open:text-white",
                      dark ? "bg-fynd-blue/25 text-[#8FA0FF]" : "bg-fynd-blue/10 text-fynd-blue",
                    )}
                  >
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
                  </span>
                </summary>
                <p className={cn("px-5 pb-6 text-body sm:pl-16 sm:pr-16", dark ? "text-white/70" : "text-ink-soft")}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
