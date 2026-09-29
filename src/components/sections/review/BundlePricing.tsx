"use client";

import { Check } from "lucide-react";
import { bundle, demoCta, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { CancelPath } from "@/lib/stripe-plans";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { useDemoHref } from "./DemoCta";
import { CheckoutButton } from "./CheckoutButton";
import { OfferClock } from "./OfferClock";
import { CancelledNote, SecureLine } from "./PricingSection";

/**
 * The $249 card — the conversion module on /website, at #convert.
 *
 * Same card as the $97 one, with the same offer clock at the top. The
 * strikethrough sits on the monthly line, not the $249: the build is not
 * discounted from anything, but the Review System it continues into is the
 * same $197-struck-to-$97 deal the other card shows. The clock rolls over
 * every Sunday and the price does not move; see lib/use-offer-window.ts.
 *
 * Two numbers, deliberately unequal: $249 large with "today" beside it, and
 * "then $97/mo" as a line beneath. The first is what the button charges,
 * so it carries the weight; the second is the thing people would otherwise
 * assume was $249 too.
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

          {cancelled && <CancelledNote className="bg-white" />}

          <BundlePlanCard className="mt-8" cid={cid} section="bundle_pricing" />

          <DemoLine />
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The $249 card on its own, so the plan picker on /watch shows the same card
 * /website does.
 */
export function BundlePlanCard({
  cid,
  section,
  cancelPath,
  className,
}: {
  cid?: string;
  /** For analytics, so placements can be told apart. */
  section: string;
  cancelPath?: CancelPath;
  className?: string;
}) {
  const copy = bundle.pricing;

  return (
    <div
      className={cn(
        // A flex column with the list absorbing spare height: on its own
        // page the card is as tall as its content and this changes nothing;
        // in the plan picker, where both cards are held to one height, it
        // keeps the button at the bottom so the two line up.
        "flex flex-col rounded-lg border-2 border-fynd-blue bg-white p-6 text-left lg:p-8",
        className,
      )}
    >
      {/* self-start: the card is a flex column, and without it the pill
          stretches to the card's width with the border running past the digits. */}
      <OfferClock className="self-start" />

      <p className="mt-5 text-micro uppercase text-ink-soft">{bundle.name}</p>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[56px] font-bold leading-none tabular-nums text-ink">
          ${bundle.price}
        </span>
        <span className="text-h3 font-medium text-ink-soft">
          {copy.todayLabel}
        </span>
      </p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-h3 font-semibold tabular-nums">
        <span className="text-fynd-green-text">{copy.then.lead}</span>
        <s className="text-ink-muted decoration-2">
          <span className="sr-only">{pricing.strikeLabel} </span>
          {copy.then.regular}
        </s>
        <span className="text-fynd-green-text">{copy.then.price}</span>
      </p>

      <p className="mt-2 text-small text-ink-soft">{copy.nowLabel}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-2.5">
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
        section={section}
        cancelPath={cancelPath}
      />

      <SecureLine />
    </div>
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
