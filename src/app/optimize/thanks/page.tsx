import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { meta, optimize } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { oneTimeGhl, readOneTimeSession } from "@/lib/stripe";
import { recordOneTimeCustomer } from "@/lib/ghl-contacts";
import { Container } from "@/components/ui/Layout";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { PageTracking } from "@/components/sections/review/PageTracking";

/**
 * /optimize/thanks — after the $99 goes through.
 *
 * Its own page rather than /start/welcome: that page opens the onboarding
 * form for the subscription, which asks about booking software this customer
 * has no reason to answer. The one thing needed here is manager access to
 * the profile, and the receipt email carries those steps.
 *
 * Backstops the webhook the way /start/welcome does: if the session is paid,
 * the contact is written to GHL from here too. Idempotent (an upsert keyed
 * on email), so racing the webhook is fine.
 */
export const metadata: Metadata = {
  title: meta.optimizeThanks.title,
  robots: { index: false, follow: false },
};

export default async function OptimizeThanksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const params = parseParams(raw);
  const sessionId = typeof raw.session_id === "string" ? raw.session_id : null;

  // Shown unless the session is definitely not a paid one-time purchase. A
  // Stripe outage ("unconfigured", "error") still gets the steps: the
  // webhook will record them, and a paying customer should not be told
  // their payment is missing because our read failed.
  let paid = sessionId !== null;

  if (sessionId) {
    const session = await readOneTimeSession(sessionId);

    if (session.status === "unpaid" || session.status === "not-one-time") {
      paid = false;
    } else if (session.status === "paid" && session.email) {
      const written = await recordOneTimeCustomer({
        email: session.email,
        name: session.name,
        phone: session.phone,
        ...oneTimeGhl(session.product),
      });
      if (written.status !== "ok") {
        console.error(
          "[optimize/thanks] customer not written to GHL:",
          JSON.stringify({ session: sessionId, written }),
        );
      }
    } else if (session.status === "error") {
      console.error("[optimize/thanks] session not read:", session.message);
    }
  }

  const copy = optimize.thanks;

  return (
    <>
      <PageTracking page="optimize-thanks" cid={params.cid} />
      <FunnelHeader />

      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[620px]">
            {paid ? (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fynd-green/15">
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.5}
                    className="h-6 w-6 text-fynd-green-text"
                  />
                </span>

                <h1 className="mt-5 text-h1 text-ink">{copy.heading}</h1>
                <p className="mt-3 text-body text-ink-soft">{copy.sub}</p>

                <ol className="mt-8 divide-y divide-line border-y border-line">
                  {copy.steps.map((step) => (
                    <li key={step.when} className="flex gap-5 py-5">
                      <span className="w-28 shrink-0 text-small font-semibold text-fynd-blue">
                        {step.when}
                      </span>
                      <span className="text-body text-ink">{step.body}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-8 text-small text-ink-soft">{copy.helpLine}</p>
              </>
            ) : (
              <>
                <h1 className="text-h1 text-ink">{copy.unpaid.heading}</h1>
                <p className="mt-3 text-body text-ink-soft">{copy.unpaid.sub}</p>
                <Link
                  href={copy.unpaid.href}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0]"
                >
                  {copy.unpaid.cta}
                </Link>
              </>
            )}
          </div>
        </Container>
      </main>

      <FunnelFooter />
    </>
  );
}
