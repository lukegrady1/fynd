import type { Metadata } from "next";
import { Check } from "lucide-react";
import { manage, meta } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { ensureSubscription } from "@/lib/stripe";
import { Container } from "@/components/ui/Layout";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { PageTracking } from "@/components/sections/review/PageTracking";

/**
 * /manage/welcome — where the $297 checkout lands.
 *
 * Not /start/welcome: that page opens the review system's onboarding form
 * (booking software, review link), none of which applies here. Management
 * onboarding happens on the platform's own connect flow, which the customer
 * gets a link to by email, so this page is the steps and nothing to fill
 * in.
 *
 * Calls `ensureSubscription` as the backstop to the webhook, exactly as
 * /start/welcome does — the customer paid in `payment` mode and the
 * subscription is a separate, idempotent operation. Not gated on the
 * result: a Stripe hiccup should not leave a paying customer on an error.
 */
export const metadata: Metadata = {
  title: meta.manageWelcome.title,
  robots: { index: false, follow: false },
};

export default async function ManageWelcomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);
  const raw = await searchParams;
  const sessionId = typeof raw.session_id === "string" ? raw.session_id : null;

  if (sessionId) {
    const result = await ensureSubscription(sessionId);
    if (result.status === "error") {
      console.error("[manage/welcome] subscription not created:", result.message);
    }
  }

  const copy = manage.welcome;

  return (
    <>
      <PageTracking page="manage-welcome" cid={params.cid} />
      <FunnelHeader />

      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[620px]">
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
                  <span className="w-32 shrink-0 text-small font-semibold text-fynd-blue">
                    {step.when}
                  </span>
                  <span className="text-body text-ink">{step.body}</span>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-small text-ink-soft">{copy.helpLine}</p>
          </div>
        </Container>
      </main>

      <FunnelFooter />
    </>
  );
}
