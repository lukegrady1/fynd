"use client";

import { Check, ClipboardCheck, CreditCard, KeyRound } from "lucide-react";
import { optimize } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { CheckoutButton } from "@/components/sections/review/CheckoutButton";
import { CancelledNote } from "@/components/sections/review/PricingSection";

/**
 * The $99 card — the conversion module on /optimize, at #convert — and the
 * three steps that follow it.
 *
 * Deliberately not the blue-bordered card the two plans use: this is one
 * price, once, and it gets a wide navy panel of its own. Price and button
 * on the left, what's included on the right; on a phone the list sits
 * between the price and the button so the ask comes after the case for it.
 * No offer clock (no deal attached) and no "secure checkout" line. Under
 * the button it says in plain words that this is a one-time update, then
 * hands anyone who wants it kept up to the managed section. The button
 * runs a plain payment session — see `createOneTimeCheckoutSession`.
 *
 * The steps sit under the card, not in it: the card is the ask, and what
 * happens after someone says yes is the reassurance that follows.
 */
export function OptimizePricing({
  cid,
  cancelled,
  managedId,
}: {
  cid?: string;
  cancelled: boolean;
  /** The managed-plan section the hand-off link scrolls to. */
  managedId: string;
}) {
  const copy = optimize.pricing;

  return (
    <section id="convert" className="scroll-mt-20 bg-white py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[960px]">
          <div className="mx-auto max-w-[560px] text-center">
            <h2 className="text-h1 text-ink">{copy.heading}</h2>
            <p className="measure mx-auto mt-4 text-body text-ink-soft">
              {copy.sub}
            </p>
            {cancelled && <CancelledNote className="bg-fynd-gray" />}
          </div>

          <div className="mt-10 grid overflow-hidden rounded-lg bg-navy text-white shadow-lg md:grid-cols-[1fr_1.15fr] md:grid-rows-[auto_auto] lg:mt-12">
            {/* Price */}
            <div className="p-7 pb-0 md:col-start-1 md:row-start-1 lg:p-10 lg:pb-0">
              <p className="text-micro uppercase text-white/60">
                {optimize.name}
              </p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[64px] font-bold leading-none tabular-nums tracking-[-0.02em] text-white">
                  ${optimize.price}
                </span>
                <span className="text-h3 font-medium text-white/70">
                  {copy.onceLabel}
                </span>
              </p>
              <p className="mt-3 text-body text-white/75">{copy.nowLabel}</p>
            </div>

            {/* What's included */}
            <div className="mt-7 border-t border-white/10 bg-white/[0.04] p-7 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-l md:border-t-0 lg:p-10">
              <p className="text-micro uppercase text-white/60">
                {copy.includedLabel}
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {copy.clears.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/20">
                      <Check
                        aria-hidden="true"
                        strokeWidth={3}
                        className="h-3 w-3 text-fynd-green"
                      />
                    </span>
                    <span className="text-body text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The ask */}
            <div className="p-7 pt-0 md:col-start-1 md:row-start-2 lg:p-10 lg:pt-0">
              <CheckoutButton
                plan="gbp-optimization"
                cid={cid}
                label={copy.cta}
                section="optimize_pricing"
              />
              <p className="mt-4 flex items-center gap-2 text-small text-white/60">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="h-4 w-4 shrink-0 text-fynd-green"
                />
                {copy.needLine}
              </p>
              <p className="mt-5 border-t border-white/10 pt-5 text-small text-white/75">
                {copy.oneTimeNote}
              </p>
              <a
                href={`#${managedId}`}
                className="mt-2 inline-block text-small font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:decoration-white"
              >
                {copy.managedLead} &rarr;
              </a>
            </div>
          </div>
        </Reveal>

        {/* How it works: three steps, numbered, after the ask. */}
        <div className="mx-auto mt-12 max-w-[960px] lg:mt-16">
          <Reveal>
            <p className="text-center text-micro uppercase text-ink-soft">
              {copy.stepsLabel}
            </p>
          </Reveal>
          <ol className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
            {copy.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={step.title} className="flex">
                  <Reveal
                    delay={i * 0.08}
                    className="flex w-full gap-4 rounded-md border border-line bg-white p-5 shadow-sm md:flex-col md:gap-0 md:p-6"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-fynd-blue/40 bg-fynd-blue/5 text-fynd-blue"
                    >
                      <Icon strokeWidth={1.75} className="h-5 w-5" />
                    </span>
                    <div className="md:mt-5">
                      <p className="text-micro uppercase text-fynd-green-text">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-body font-semibold text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-small font-medium text-ink-soft">
                        {step.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/** One icon per step, in step order: pay, access, done. */
const stepIcons = [CreditCard, KeyRound, ClipboardCheck] as const;
