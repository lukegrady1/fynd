"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, Lock, Nfc } from "lucide-react";
import { checkout, offer, offerWindow, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import { useOfferWeek } from "@/lib/use-offer-window";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

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
  props:
    | {
        /** /start — the button runs Stripe checkout. */
        mode: "checkout";
        cid?: string;
        cancelled: boolean;
      }
    | {
        /** /call — the button scrolls to the calendar. */
        mode: "scroll";
        ctaLabel: string;
        targetId: string;
      },
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
            <p className="mt-6 rounded-sm border border-line bg-fynd-gray px-4 py-3 text-left text-small text-ink-soft">
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
            <WeekClock />

            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
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

            <ul className="mt-6 flex flex-col gap-2.5">
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

            {props.mode === "checkout" ? (
              <CheckoutButton cid={props.cid} label={pricing.cta} />
            ) : (
              <ScrollButton label={props.ctaLabel} targetId={props.targetId} />
            )}

            <AddOn />

            {props.mode === "checkout" && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-small text-ink-soft">
                <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {checkout.secure}
              </p>
            )}
          </div>

          <p className="mt-5 text-small text-ink-soft">{pricing.reassure}</p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Renders nothing until the client knows the time, so no number flashes. */
function WeekClock() {
  const week = useOfferWeek();
  if (week.state === "unknown") return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-fynd-orange/40 bg-fynd-orange/8 px-3 py-1.5 text-small font-semibold text-ink">
      <Clock
        aria-hidden="true"
        strokeWidth={2}
        className="h-4 w-4 shrink-0 text-fynd-orange"
      />
      <span>{offerWindow.label}</span>
      <span className="tabular-nums">
        {week.label} {offerWindow.suffix}
      </span>
    </span>
  );
}

/** The NFC card. A one-off, so it sits apart from the monthly figure. */
function AddOn() {
  return (
    <p className="mt-4 flex items-start gap-2.5 rounded-md border border-line bg-fynd-gray px-3.5 py-3">
      <Nfc
        aria-hidden="true"
        strokeWidth={1.75}
        className="mt-0.5 h-4 w-4 shrink-0 text-fynd-blue"
      />
      <span className="text-small text-ink">
        <span className="font-semibold">{pricing.addOn.label}</span>{" "}
        <span className="tabular-nums">{pricing.addOn.price}</span>
        <span className="block text-ink-soft">{pricing.addOn.note}</span>
      </span>
    </p>
  );
}

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

function CheckoutButton({ cid, label }: { cid?: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    track("checkout_started", { section: "pricing" });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cid: cid ?? null, plan: "review-system" }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError(
        "Couldn't reach checkout. Check your connection and try again, or book a call.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loading ? "Starting…" : label}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-sm border border-fynd-orange/40 bg-fynd-orange/8 px-3 py-2 text-small text-ink"
        >
          {error}{" "}
          <Link
            href="/call"
            className="font-semibold text-fynd-blue underline-offset-4 hover:underline"
          >
            Book a call instead &rarr;
          </Link>
        </p>
      )}
    </>
  );
}

const buttonClass =
  "mt-7 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99]";
