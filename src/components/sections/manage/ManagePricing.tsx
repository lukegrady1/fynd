"use client";

import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { manage } from "@/content/copy";
import type { CancelPath, Purchasable } from "@/lib/stripe-plans";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { CheckoutButton } from "@/components/sections/review/CheckoutButton";

export type PricingCopy = {
  kicker: string;
  lead: string;
  accent: string;
  sub: string;
  card: {
    label: string;
    per: string;
    perNote: string;
    pill: string;
    /** The paragraph under the pill; /watch has none. */
    explain?: string;
    allIn: { title: string; body: string };
    includedLine: { label: string; text: string };
    checks: readonly string[];
    cta: string;
    ctaNote: string;
    /** The second line under the button; /watch has none. */
    anchorNote?: string;
    /** The quiet link under the price; /manage points at the $99. */
    onceLine?: { lead: string; label: string; href: string };
  };
};

/**
 * "Every day you wait, a competitor gets the call." and the price card —
 * the conversion module on /manage, at #convert.
 *
 * Navy, the line and the paragraph centred, then the card: the price
 * and what a profile is on the left, the all-in note, the included line,
 * four checks and the button on the right. The platform's card has a
 * location stepper; checkout here is one profile, so the card says
 * "each profile is $297" instead. The button runs the normal
 * subscription checkout — a month paid today, then $297/month from the
 * anchor — see `createCheckoutSession` and the `gbp-management` plan.
 */
/**
 * `copy`, `plan` and `price` default to /manage's; /watch passes its own
 * (`watch.pricing`, the `review-trial` plan, $97) and gets the same card.
 */
export function ManagePricing({
  cid,
  copy = manage.pricing,
  plan = "gbp-management",
  price = manage.price,
  section = "manage_pricing",
  cancelPath,
}: {
  cid?: string;
  copy?: PricingCopy;
  plan?: Purchasable;
  price?: number;
  /** For analytics, so the two cards can be told apart. */
  section?: string;
  cancelPath?: CancelPath;
}) {
  const card = copy.card;

  return (
    <section
      id="convert"
      className="relative isolate scroll-mt-20 overflow-hidden border-t border-white/10 bg-navy py-16 text-white lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(76,91,255,0.3),transparent_60%)]"
      />

      <Container>
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-micro uppercase text-white/60">{copy.kicker}</p>
          <h2 className="mt-4 text-h1 lg:text-[58px] lg:leading-[1.06] lg:tracking-[-0.02em]">
            {copy.lead} <span className="text-fynd-green">{copy.accent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
            {copy.sub}
          </p>
        </div>

        <Reveal className="mx-auto mt-10 max-w-[1000px] rounded-lg border border-fynd-blue/50 bg-navy-card p-6 shadow-lg sm:p-8 lg:mt-12 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            {/* The price */}
            <div>
              <p className="text-micro uppercase text-white/60">{card.label}</p>
              <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[72px] font-bold leading-none tabular-nums tracking-[-0.03em] text-fynd-green">
                  ${price}
                </span>
                <span className="text-h3 font-medium text-white/80">{card.per}</span>
              </p>
              <p className="mt-3 text-body text-white">{card.perNote}</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-fynd-green/15 px-3 py-1.5 text-small font-semibold text-fynd-green">
                <Check aria-hidden="true" strokeWidth={3} className="h-3.5 w-3.5" />
                {card.pill}
              </span>
              {card.explain && <p className="mt-5 text-small text-white/70">{card.explain}</p>}
              {card.onceLine && (
                <p className="mt-4 text-small text-white/70">
                  {card.onceLine.lead}{" "}
                  <Link
                    href={card.onceLine.href}
                    className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:decoration-white"
                  >
                    {card.onceLine.label} &rarr;
                  </Link>
                </p>
              )}
            </div>

            {/* What's in it, and the ask */}
            <div>
              <div className="flex gap-4 rounded-md bg-white/[0.05] p-5 ring-1 ring-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fynd-green/20 text-fynd-green">
                  <ShieldCheck aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-body font-semibold text-white">{card.allIn.title}</p>
                  <p className="mt-1 text-small text-white/70">{card.allIn.body}</p>
                </div>
              </div>

              <p className="mt-5 text-small text-white/80">
                <strong className="font-semibold text-white">{card.includedLine.label}</strong>{" "}
                {card.includedLine.text}
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                {card.checks.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fynd-blue/40 text-white">
                      <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3" />
                    </span>
                    <span className="text-body text-white">{item}</span>
                  </li>
                ))}
              </ul>

              <CheckoutButton
                plan={plan}
                cid={cid}
                label={card.cta}
                section={section}
                cancelPath={cancelPath}
              />
              <p className="mt-3 text-center text-small text-white/60">{card.ctaNote}</p>
              {card.anchorNote && <p className="mt-3 text-center text-small text-white/60">{card.anchorNote}</p>}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
