"use client";

import { Plus } from "lucide-react";
import { faq, faqExtra } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

/**
 * Native <details>/<summary>: keyboard navigation and screen-reader semantics
 * come for free, and the answers stay readable with JavaScript disabled.
 * Which question gets opened is tracked — it reveals the real objections.
 */
export function ObjectionFaq() {
  // The six from the phone come first — they're the real objections; the rest
  // are implementation questions people scroll for.
  const items = [...faq.items, ...faqExtra];

  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-h2 text-ink">{faq.heading}</h2>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <details
                key={item.q}
                className="group"
                onToggle={(e) => {
                  if (e.currentTarget.open) {
                    track("faq_open", { question: item.q });
                  }
                }}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-h3 text-ink">{item.q}</span>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-transform duration-250 ease-fynd group-open:rotate-45">
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="measure pb-5 text-body text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
