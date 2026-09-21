"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { faq } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

const defaultItems = faq.items;

type FaqItem = {
  q: string;
  a: string;
  /** An optional link after the answer, for the one question that needs it. */
  link?: { label: string; href: string };
};

/**
 * Native <details>/<summary>: keyboard navigation and screen-reader semantics
 * come for free, and the answers stay readable with JavaScript disabled.
 * Which question gets opened is tracked — it reveals the real objections.
 */
export function ObjectionFaq({
  heading = faq.heading,
  items = defaultItems,
}: {
  heading?: string;
  /** Another page's questions. Defaults to the review system's. */
  items?: readonly FaqItem[];
} = {}) {

  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-h2 text-ink">{heading}</h2>

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
                  {item.link && (
                    <>
                      {" "}
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-fynd-blue underline decoration-fynd-blue/40 underline-offset-4 transition-colors duration-150 hover:decoration-fynd-blue"
                      >
                        {item.link.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-0.5 inline h-3.5 w-3.5 align-[-2px]"
                        />
                      </a>
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
