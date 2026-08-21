import { whatYouGet } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

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
