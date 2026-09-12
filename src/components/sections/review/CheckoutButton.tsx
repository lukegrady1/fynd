"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { Plan } from "@/lib/stripe-plans";

/**
 * The button that starts Stripe Checkout, shared by both pricing cards.
 *
 * `plan` is the only thing that differs between them: the route builds the
 * session for the plan it is handed, and everything after checkout — the
 * welcome page, the webhook, the subscription — reads the plan back off the
 * session's metadata rather than needing to be told.
 */
export function CheckoutButton({
  plan,
  cid,
  label,
  section = "pricing",
}: {
  plan: Plan;
  cid?: string;
  label: string;
  /** For analytics, so the two cards can be told apart. */
  section?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    track("checkout_started", { section, plan });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cid: cid ?? null, plan }),
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
        className={`${checkoutButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
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

export const checkoutButtonClass =
  "mt-7 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99]";
