"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, Lock } from "lucide-react";
import { checkout, offer, offerWindow, pricing } from "@/content/copy";
import { track } from "@/lib/analytics";
import { useOfferWindow } from "@/lib/use-offer-window";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Pricing — and, on /start, the only conversion module on the page.
 *
 * The urgency here is real, which is the whole reason it is allowed to exist:
 * while the claim window is open management is free and checkout charges the
 * software rate; once it closes the displayed price becomes the managed rate
 * AND the checkout call is told to charge that instead. A timer whose expiry
 * changed nothing would be the exact pattern the build spec forbids.
 *
 * The window starts on first arrival and is persisted, so a reload does not
 * hand out a fresh five minutes — see lib/use-offer-window.ts.
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
  const claim = useOfferWindow();

  /**
   * `unknown` is the server render and the first client paint, before the
   * persisted start time can be read. Treat it as open: that is correct for
   * every first-time visitor, and it means a no-JS visitor — who can never
   * have a running timer — sees the better price rather than the worse one.
   */
  const managementFree = claim.state !== "closed";
  const price = managementFree ? offer.software : offer.managed;
  const state = managementFree ? pricing.open : pricing.closed;

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
            <ClaimChip open={managementFree} label={claimLabel(claim)} />

            <p className="mt-4 text-body text-ink-soft">{state.urgency}</p>

            <Price price={price} managementFree={managementFree} />

            <p className="mt-2 text-small text-ink-soft">{state.nowLabel}</p>

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
              <CheckoutButton
                cid={props.cid}
                managementFree={managementFree}
                label={state.cta}
              />
            ) : (
              <ScrollButton
                label={props.ctaLabel}
                targetId={props.targetId}
              />
            )}

            <p className="mt-4 text-small text-ink-soft">{state.note}</p>

            {props.mode === "checkout" && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-small text-ink-soft">
                <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {checkout.secure} &middot; {checkout.billing}
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

const claimLabel = (claim: ReturnType<typeof useOfferWindow>) =>
  claim.state === "open"
    ? `${offerWindow.label} — ${claim.label}`
    : claim.state === "closed"
      ? offerWindow.closedLabel
      : offerWindow.label;

function ClaimChip({ open, label }: { open: boolean; label: string }) {
  return (
    <span
      className={
        open
          ? "inline-flex items-center gap-2 rounded-sm border border-fynd-orange/40 bg-fynd-orange/8 px-3 py-1.5 text-small font-semibold tabular-nums text-ink"
          : "inline-flex items-center gap-2 rounded-sm border border-line bg-fynd-gray px-3 py-1.5 text-small font-semibold text-ink-soft"
      }
    >
      <Clock
        aria-hidden="true"
        strokeWidth={2}
        className={
          open ? "h-4 w-4 shrink-0 text-fynd-orange" : "h-4 w-4 shrink-0 opacity-60"
        }
      />
      {label}
    </span>
  );
}

/**
 * The struck-through figure is the genuine managed rate, not a decorative
 * anchor — it is what this same button charges once the window closes.
 */
function Price({
  price,
  managementFree,
}: {
  price: number;
  managementFree: boolean;
}) {
  return (
    <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {managementFree && (
        <s className="text-h3 font-semibold tabular-nums text-ink-muted decoration-2">
          <span className="sr-only">{pricing.open.strikeLabel} </span>$
          {offer.managed}
        </s>
      )}
      <span className="text-[56px] font-bold leading-none tabular-nums text-ink">
        ${price}
      </span>
      <span className="text-h3 font-medium text-ink-soft">/mo</span>
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

function CheckoutButton({
  cid,
  managementFree,
  label,
}: {
  cid?: string;
  managementFree: boolean;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    track("checkout_started", { section: "pricing", managementFree });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The server decides the real price from this flag — the displayed
        // number and the charged number have to come from the same source.
        body: JSON.stringify({
          cid: cid ?? null,
          plan: "review-system",
          managementFree,
        }),
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
