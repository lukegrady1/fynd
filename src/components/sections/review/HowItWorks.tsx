import { howItWorks, whatYouGet } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Numbered 01/02/03 because it's a genuine sequence, not decoration.
 * Step 3's second sentence is the objection-killer for "what if someone's
 * mad" — it stays.
 */
export function HowItWorks() {
  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <Reveal>
          <h2 className="text-h2 text-ink">{howItWorks.heading}</h2>
        </Reveal>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.n} className="bg-white">
              <Reveal delay={i * 0.06} className="h-full p-6 lg:p-8">
                <span className="text-small font-semibold tabular-nums text-fynd-blue">
                  {step.n}
                </span>
                <h3 className="mt-3 text-h3 text-ink">{step.title}</h3>
                <p className="mt-2 text-body text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Two-column checklist. No icon soup — one repeated check mark. */
export function WhatYouGet() {
  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal>
          <h2 className="text-h2 text-ink">{whatYouGet.heading}</h2>
        </Reveal>

        <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {whatYouGet.items.map((item, i) => (
            <li key={item}>
              <Reveal delay={i * 0.04} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.5}
                    className="h-3 w-3 text-[#0F8F6E]"
                  />
                </span>
                <span className="text-body text-ink">{item}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
