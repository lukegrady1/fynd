"use client";

import { Check } from "lucide-react";
import { offer, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Pricing, kept small on purpose. The features section states what's included,
 * so this only has to name the number and clear the three standard objections.
 *
 * The button scrolls to the conversion module rather than duplicating it, so
 * there is still exactly one checkout and one calendar on the page.
 */
export function PricingSection({
  ctaLabel,
  targetId,
}: {
  ctaLabel: string;
  targetId: string;
}) {
  const handleClick = () => {
    track("cta_click", { cta: ctaLabel, section: "pricing" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[560px] text-center">
          <Eyebrow variant="pill">{pricing.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">{pricing.heading}</h2>

          <p className="mt-8 flex items-baseline justify-center gap-2">
            <span className="text-[64px] font-bold leading-none tabular-nums text-ink">
              ${offer.software}
            </span>
            <span className="text-h3 font-medium text-ink-soft">/mo</span>
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {pricing.clears.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                  <Check
                    aria-hidden="true"
                    strokeWidth={3}
                    className="h-2.5 w-2.5 text-[#0F8F6E]"
                  />
                </span>
                <span className="text-body text-ink">{item}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleClick}
            className="mt-9 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:mx-auto sm:w-auto"
          >
            {ctaLabel}
          </button>

          <p className="mt-5 text-small text-ink-soft">{pricing.reassure}</p>
        </Reveal>
      </Container>
    </section>
  );
}
