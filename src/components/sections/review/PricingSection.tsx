"use client";

import { Check, Minus } from "lucide-react";
import { offer, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { PriceBlock } from "./OfferBits";
import { Reveal } from "./Reveal";

/**
 * Pricing.
 *
 * Deliberately one plan, not a tier ladder. Tiers would break the single-price
 * Stripe checkout and the founding-rate story, and "everything on one plan" is
 * the stronger position against competitors who split the useful parts across
 * three tiers and charge per seat.
 *
 * The button scrolls to the conversion module rather than duplicating it, so
 * there's still exactly one checkout and one calendar on the page.
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
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{pricing.heading}</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-body text-ink-soft">
            {pricing.sub}
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mx-auto mt-10 max-w-[760px]">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              {/* price side */}
              <div className="border-b border-line p-6 md:border-b-0 md:border-r lg:p-8">
                <h3 className="text-h3 text-ink">{pricing.planName}</h3>
                <PriceBlock className="mt-4" />
                <p className="mt-4 text-small text-ink-soft">
                  {offer.lockLine}
                </p>

                <button
                  type="button"
                  onClick={handleClick}
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.99]"
                >
                  {ctaLabel}
                </button>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-micro uppercase text-ink-soft">
                    {pricing.notIncludedHeading}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {pricing.notIncluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-small text-ink-soft"
                      >
                        <Minus
                          aria-hidden="true"
                          strokeWidth={2.5}
                          className="h-3.5 w-3.5 shrink-0 text-fynd-orange"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* included side */}
              <div className="p-6 lg:p-8">
                <p className="text-micro uppercase text-ink-soft">
                  {pricing.includedHeading}
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {pricing.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                        <Check
                          aria-hidden="true"
                          strokeWidth={3}
                          className="h-2.5 w-2.5 text-[#0F8F6E]"
                        />
                      </span>
                      <span className="text-small text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </Reveal>
      </Container>
    </section>
  );
}
