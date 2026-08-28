import type { Metadata } from "next";
import { welcome } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { Container } from "@/components/ui/Layout";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { ensureSubscription } from "@/lib/stripe";
import { OnboardingForm } from "@/components/sections/onboarding/OnboardingForm";
import { inviteEmail, oauthReadiness } from "@/lib/connect";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "You're in — Fynd",
  robots: { index: false, follow: false },
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);
  const raw = await searchParams;

  // Backstop for the webhook. The customer paid in `payment` mode and the
  // subscription is a second, separate operation; the webhook is the reliable
  // path, this catches it being slow or not yet pointed at this deploy.
  // Idempotent, so racing the webhook is fine — see ensureSubscription.
  //
  // Deliberately not gating the page on the result. Nothing here is worth
  // protecting yet, and a Stripe outage should not leave a paying customer
  // staring at an error instead of the onboarding form.
  const sessionId = typeof raw.session_id === "string" ? raw.session_id : null;

  if (sessionId) {
    const result = await ensureSubscription(sessionId);
    if (result.status === "error") {
      console.error("[welcome] subscription not created:", result.message);
    }
  }

  return (
    <>
      <PageTracking page="welcome" cid={params.cid} />
      <FunnelHeader />

      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[620px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fynd-green/15">
              <Check
                aria-hidden="true"
                strokeWidth={2.5}
                className="h-6 w-6 text-[#0F8F6E]"
              />
            </span>

            <h1 className="mt-5 text-h1 text-ink">{welcome.heading}</h1>
            <p className="mt-3 text-body text-ink-soft">{welcome.sub}</p>

            <ol className="mt-8 divide-y divide-line border-y border-line">
              {welcome.steps.map((step) => (
                <li key={step.when} className="flex gap-5 py-5">
                  <span className="w-28 shrink-0 text-small font-semibold text-fynd-blue">
                    {step.when}
                  </span>
                  <span className="text-body text-ink">{step.body}</span>
                </li>
              ))}
            </ol>

            {/* Built in-app rather than embedded from GHL. The GHL v2 Forms
                API is read-only, and a GHL form cannot reorder its options off
                an earlier answer or hand off to a platform OAuth screen —
                which is most of what this flow does. Submissions still reach
                GHL, via the webhook in `src/lib/ghl.ts`. */}
            <section className="mt-10 rounded-lg border border-line bg-fynd-gray p-6 lg:p-8">
              <h2 className="text-h2 text-ink">{welcome.formHeading}</h2>
              <p className="mt-2 text-body text-ink-soft">{welcome.formBody}</p>
              <div className="mt-5">
                <OnboardingForm
                  cid={params.cid}
                  prefill={{
                    ownerName: params.firstName,
                    businessName: params.biz,
                    email: params.email,
                    phone: params.phone,
                  }}
                  oauthReady={oauthReadiness()}
                  inviteEmail={inviteEmail()}
                />
              </div>
            </section>
          </div>
        </Container>
      </main>

      <FunnelFooter />
    </>
  );
}
