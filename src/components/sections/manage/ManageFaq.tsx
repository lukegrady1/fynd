"use client";

import { Plus } from "lucide-react";
import { manage } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

/**
 * The FAQ in the platform's shape: eyebrow, heading and sub down the
 * left, the questions numbered down the right in one bordered card.
 * Native <details>, like the other FAQs on the site: keyboard and
 * screen-reader semantics for free, readable without JavaScript. Which
 * question gets opened is tracked.
 */
export function ManageFaq() {
  const copy = manage.faq;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow}</p>
            <h2 className="mt-3 text-h1 text-white lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
            <p className="mt-4 text-body text-white/75">{copy.sub}</p>
          </div>

          <div className="divide-y divide-white/10 overflow-hidden rounded-lg bg-navy-card ring-1 ring-white/10 text-white shadow-lg">
            {copy.items.map((item, i) => (
              <details
                key={item.q}
                className="group"
                onToggle={(e) => {
                  if (e.currentTarget.open) track("faq_open", { question: item.q });
                }}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden sm:px-6">
                  <span className="w-6 shrink-0 text-[12px] font-bold tabular-nums text-[#8FA0FF]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-h3 text-white">{item.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-blue/25 text-[#8FA0FF] transition-all duration-250 ease-fynd group-open:rotate-45 group-open:bg-fynd-blue group-open:text-white">
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
                  </span>
                </summary>
                <p className="px-5 pb-6 text-body text-white/70 sm:pl-16 sm:pr-16">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
