"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { checkout, offer } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { CapacityLine, PriceBlock } from "./OfferBits";

/**
 * /start — instant checkout. Same card dimensions as the calendar module on
 * /call so the two pages feel like twins.
 */
export function CheckoutModule({
  cid,
  cancelled,
}: {
  cid?: string;
  cancelled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    track("checkout_started", { section: "checkout_module" });

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
    <section id="convert" className="scroll-mt-20 bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[520px]">
          {cancelled && (
            <p className="mb-4 rounded-sm border border-line bg-white px-4 py-3 text-small text-ink-soft">
              {checkout.cancelledNote.lead}{" "}
              <Link
                href="/call"
                className="font-semibold text-fynd-blue underline-offset-4 hover:underline"
              >
                {checkout.cancelledNote.linkLabel} →
              </Link>
            </p>
          )}

          <div className="rounded-lg border-2 border-fynd-blue bg-white p-6 lg:p-8">
            <h2 className="text-h2 text-ink">{checkout.heading}</h2>

            <PriceBlock className="mt-5" />

            <p className="mt-4 text-small text-ink-soft">{offer.lockLine}</p>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Starting…" : checkout.cta}
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
                  Book a call instead →
                </Link>
              </p>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-small text-ink-soft">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              {checkout.secure} · {checkout.billing}
            </p>
          </div>

          <CapacityLine className="mt-5 text-center" />
        </div>
      </Container>
    </section>
  );
}
