"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { bundle, checkout, demoCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { useDemoHref } from "./DemoCta";
import { CheckoutButton } from "./CheckoutButton";

/**
 * The $249 card — the conversion module on /website, at #convert.
 *
 * Same card as the $97 one, without the strikethrough or the offer clock:
 * there is no "regular price" for this plan to be discounted from, and a
 * countdown next to a number that doesn't change would be the kind of urgency
 * the build spec forbids.
 */
export function BundlePricing({
  cid,
  cancelled,
}: {
  cid?: string;
  cancelled: boolean;
}) {
  const copy = bundle.pricing;

  return (
    <section id="convert" className="scroll-mt-20 bg-fynd-gray py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[560px] text-center">
          <Eyebrow variant="pill">{copy.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">{copy.heading}</h2>

          {cancelled && (
            <p className="mt-6 rounded-sm border border-line bg-white px-4 py-3 text-left text-small text-ink-soft">
              {checkout.cancelledNote.lead}{" "}
              <Link
                href="/call"
                className="font-semibold text-fynd-blue underline-offset-4 hover:underline"
              >
                {checkout.cancelledNote.linkLabel} &rarr;
              </Link>
            </p>
          )}

          <div className="mt-8 rounded-lg border-2 border-fynd-blue bg-white p-6 text-left lg:p-8">
            <p className="text-micro uppercase text-ink-soft">{bundle.name}</p>

            <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[56px] font-bold leading-none tabular-nums text-ink">
                ${bundle.price}
              </span>
              <span className="text-h3 font-medium text-ink-soft">/mo</span>
            </p>

            <p className="mt-2 text-small text-ink-soft">{copy.nowLabel}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {copy.clears.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                    <Check
                      aria-hidden="true"
                      strokeWidth={3}
                      className="h-2.5 w-2.5 text-fynd-green-text"
                    />
                  </span>
                  <span className="text-body text-ink">{item}</span>
                </li>
              ))}
            </ul>

            <CheckoutButton
              plan="website-reviews"
              cid={cid}
              label={bundle.hero.cta}
              section="bundle_pricing"
            />

            <p className="mt-4 flex items-center justify-center gap-1.5 text-small text-ink-soft">
              <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              {checkout.secure}
            </p>
          </div>

          <DemoLine />
        </Reveal>
      </Container>
    </section>
  );
}

function DemoLine() {
  const demoHref = useDemoHref();
  const copy = bundle.pricing.demoLine;

  return (
    <p className="mt-5 text-small text-ink-soft">
      {copy.lead}{" "}
      <a
        href={demoHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track("cta_click", { cta: demoCta.label, section: "bundle_pricing_line" })
        }
        className="font-semibold text-fynd-blue underline decoration-fynd-blue/40 underline-offset-4 transition-colors duration-150 hover:decoration-fynd-blue"
      >
        {copy.linkLabel}
        <span className="sr-only"> ({demoCta.newTabHint})</span>
      </a>
      {copy.tail}
    </p>
  );
}
