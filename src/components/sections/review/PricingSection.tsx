"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { checkout, demoCta, offer, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { CancelPath } from "@/lib/stripe-plans";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { useDemoHref } from "./DemoCta";
import { OfferClock } from "./OfferClock";
import { CheckoutButton, checkoutButtonClass } from "./CheckoutButton";

/**
 * Pricing — and, on /start, the only conversion module on the page.
 *
 * One number: $197 struck through, $97 charged, everything included. The
 * software/management split is gone from the site; that framing is an SMS-only
 * pitch now.
 *
 * The clock beside the price counts to Sunday and then rolls over. It does not
 * change the price — see the note in lib/use-offer-window.ts.
 */
export function PricingSection(
  props: (
    | {
        /** The button runs Stripe checkout. */
        mode: "checkout";
        cid?: string;
        cancelled: boolean;
      }
    | {
        /** The button scrolls to another module. */
        mode: "scroll";
        ctaLabel: string;
        targetId: string;
      }
  ),
) {
  return (
    <section
      id={props.mode === "checkout" ? "convert" : undefined}
      className="scroll-mt-20 bg-white py-16 lg:py-24"
    >
      <Container>
        <Reveal className="mx-auto max-w-[560px] text-center">
          <Eyebrow variant="pill">{pricing.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">{pricing.heading}</h2>

          {props.mode === "checkout" && props.cancelled && (
            <CancelledNote className="bg-fynd-gray" />
          )}

          <ReviewPlanCard
            className="mt-8"
            action={
              props.mode === "checkout" ? (
                <CheckoutButton
                  plan="review-system"
                  cid={props.cid}
                  label={pricing.cta}
                />
              ) : (
                <ScrollButton
                  label={props.ctaLabel}
                  targetId={props.targetId}
                />
              )
            }
            secure={props.mode === "checkout"}
          />

          <DemoLine />
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The $97 card itself, without the section around it, so the plan picker on
 * /watch can show the same card the homepage does. `action` is the button
 * slot: checkout here and on /watch, a scroll on the page that uses this in
 * scroll mode.
 */
export function ReviewPlanCard({
  action,
  secure = true,
  className,
}: {
  action: ReactNode;
  /** The "Secure checkout by Stripe" line — off when the button isn't one. */
  secure?: boolean;
  className?: string;
}) {
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

      {/* Same label the $249 card carries, so the two read as siblings in
          the plan picker and the name is on the card, not just the tab. */}
      <p className="mt-5 text-micro uppercase text-ink-soft">{pricing.planName}</p>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <s className="text-h3 font-semibold tabular-nums text-ink-muted decoration-2">
          <span className="sr-only">{pricing.strikeLabel} </span>$
          {offer.regular}
        </s>
        <span className="text-[56px] font-bold leading-none tabular-nums text-ink">
          ${offer.price}
        </span>
        <span className="text-h3 font-medium text-ink-soft">/mo</span>
      </p>

      <p className="mt-2 text-small text-ink-soft">{pricing.nowLabel}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-2.5">
        {pricing.clears.map((item) => (
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

      {action}

      {/* The NFC review card add-on is off the card for now. `AddOn` below
          and `pricing.addOn` in copy.ts are kept so it can come back. */}
      {/* <AddOn /> */}

      {secure && <SecureLine />}
    </div>
  );
}

/** The $97 checkout button, for pages that hand the card their own context. */
export function ReviewCheckout({
  cid,
  section,
  cancelPath,
}: {
  cid?: string;
  section?: string;
  cancelPath?: CancelPath;
}) {
  return (
    <CheckoutButton
      plan="review-system"
      cid={cid}
      label={pricing.cta}
      section={section}
      cancelPath={cancelPath}
    />
  );
}

/** "Secure checkout by Stripe", under either card's button. */
export function SecureLine() {
  return (
    <p className="mt-4 flex items-center justify-center gap-1.5 text-small text-ink-soft">
      <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {checkout.secure}
    </p>
  );
}

/**
 * Shown above the card when Stripe sent someone back with ?cancelled=1. The
 * background is a prop because the note sits on white on one page and on
 * Fynd Gray on another, and it needs to differ from whichever it is on.
 */
export function CancelledNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "mt-6 rounded-sm border border-line px-4 py-3 text-left text-small text-ink-soft",
        className,
      )}
    >
      {checkout.cancelledNote.lead}{" "}
      <Link
        href="/demo"
        className="font-semibold text-fynd-blue underline-offset-4 hover:underline"
      >
        {checkout.cancelledNote.linkLabel} &rarr;
      </Link>
    </p>
  );
}

/**
 * The softer ask, under the card.
 *
 * A sentence with one linked noun rather than a second button: inside the card
 * a competing button undercuts the thing the card is for, and directly beneath
 * it a full-weight CTA does the same. This reads as an aside, which is what it
 * is. Opens in a new tab like every other route to /demo, and carries the
 * prefill params across.
 */
function DemoLine() {
  const demoHref = useDemoHref();

  return (
    <p className="mt-5 text-small text-ink-soft">
      {pricing.demoLine.lead}{" "}
      <a
        href={demoHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track("cta_click", { cta: demoCta.label, section: "pricing_line" })
        }
        className="font-semibold text-fynd-blue underline decoration-fynd-blue/40 underline-offset-4 transition-colors duration-150 hover:decoration-fynd-blue"
      >
        {pricing.demoLine.linkLabel}
        <span className="sr-only"> ({demoCta.newTabHint})</span>
      </a>
      {pricing.demoLine.tail}
    </p>
  );
}

// The NFC card. A one-off, so it sits apart from the monthly figure.
//
// Commented out rather than deleted: it is off the card for now, not gone.
// To bring it back, uncomment this, the `<AddOn />` in ReviewPlanCard, and
// add `Nfc` back to the lucide import.
//
// function AddOn() {
//   return (
//     /**
//      * A grid, not a wrapping flex row. Flex made the tag a sibling of the
//      * whole text block, so once the two no longer fit on a line the tag wrapped
//      * underneath and landed bottom-right — on every phone. Here the tag has its
//      * own cell in row one and the note drops to row two beneath it, which puts
//      * the tag top-right at any width without squeezing the copy into a column.
//      */
//     <p className="mt-4 grid grid-cols-[auto_1fr_auto] items-start gap-x-2.5 gap-y-1 rounded-md border border-line bg-fynd-gray px-3.5 py-3">
//       <Nfc
//         aria-hidden="true"
//         strokeWidth={1.75}
//         className="mt-0.5 h-4 w-4 shrink-0 text-fynd-blue"
//       />
//
//       <span className="min-w-0 text-small text-ink">
//         <span className="font-semibold">{pricing.addOn.label}</span>{" "}
//         <span className="tabular-nums">{pricing.addOn.price}</span>
//       </span>
//
//       {/* text-ink-soft, not text-muted — muted fails AA on Fynd Gray. */}
//       <span className="shrink-0 rounded-full border border-line bg-white px-2 py-px text-micro uppercase tracking-[0.08em] text-ink-soft">
//         {pricing.addOn.tag}
//       </span>
//
//       {/* Starts under the label rather than the icon, and runs beneath the tag
//           — nothing sits to its right, so it keeps the full measure. */}
//       <span className="col-start-2 col-end-4 text-small text-ink-soft">
//         {pricing.addOn.note}
//       </span>
//     </p>
//   );
// }

function ScrollButton({
  label,
  targetId,
}: {
  label: string;
  targetId: string;
}) {
  const handleClick = () => {
    track("cta_click", { cta: label, section: "pricing" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button type="button" onClick={handleClick} className={buttonClass}>
      {label}
    </button>
  );
}

const buttonClass = checkoutButtonClass;
