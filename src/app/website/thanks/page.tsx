import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { bundle, meta } from "@/content/copy";
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
 * /website/thanks — after the $249 website build goes through (the
 * one-time product at fynnd.co/offer/website and on /manage).
 *
 * A clone of /optimize/thanks with the build's own steps: its own page
 * rather than /start/welcome, which opens the subscription onboarding
 * form, and rather than /optimize/thanks, whose steps are about profile
 * access. Backstops the webhook the same way: a paid session writes the
 * contact to GHL from here too, tagged `fynd-website-paid`. Idempotent.
 */
export const metadata: Metadata = {
  title: meta.websiteThanks.title,
  robots: { index: false, follow: false },
};

export default async function WebsiteThanksPage({
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
          "[website/thanks] customer not written to GHL:",
          JSON.stringify({ session: sessionId, written }),
        );
      }
    } else if (session.status === "error") {
      console.error("[website/thanks] session not read:", session.message);
    }
  }

  const copy = bundle.thanks;

  return (
    <>
      <PageTracking page="website-thanks" cid={params.cid} />
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
