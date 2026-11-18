import type { Metadata } from "next";

import { onboardingPage, onboardingSteps } from "@/content/onboarding-steps";
import { isOnboardingService, serviceFromMetadata, type OnboardingService } from "@/lib/services";
import { ensureSubscription, readCheckoutIdentity } from "@/lib/stripe";
import { gbpAccessUrl, onboardingFormId } from "@/lib/connect";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { FunnelFooter, FunnelHeader } from "@/components/sections/review/PageChrome";
import { OnboardingSteps } from "@/components/sections/onboarding/OnboardingSteps";

/**
 * /onboarding — where every checkout lands.
 *
 * One page for all six services: Stripe tells us what was bought (the
 * session's metadata) and the page shows that service's steps from
 * `onboarding-steps.ts`. The session id in the URL is the credential; it is
 * in the success redirect and in the email we send, and a stray or unpaid id
 * gets "we couldn't find that payment", not the steps.
 *
 * Also the backstop to the Stripe webhook, as /start/welcome and
 * /manage/welcome were: `ensureSubscription` runs here too, so a customer
 * who paid in `payment` mode gets their subscription even if the webhook is
 * late. Not gated on its result: a Stripe hiccup must not leave a paying
 * customer on an error.
 */
export const metadata: Metadata = {
  title: `${onboardingPage.title} · Fynd`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const preview = previewService(raw.preview);
  const sessionId = preview
    ? `preview_${preview}`
    : typeof raw.session_id === "string"
      ? raw.session_id
      : null;

  const identity = preview
    ? ({ status: "ok", email: "preview@example.com", name: "Preview Person", phone: null, metadata: {} } as const)
    : sessionId
      ? await readCheckoutIdentity(sessionId)
      : null;

  if (!sessionId || !identity || identity.status !== "ok") {
    if (identity?.status === "error") {
      console.error("[onboarding] could not read session", sessionId, identity.message);
    }
    return (
      <Shell>
        <h1 className="text-h1 text-ink">{onboardingPage.unpaid.heading}</h1>
        <p className="mt-3 text-body text-ink-soft">{onboardingPage.unpaid.sub}</p>
        <div className="mt-8">
          <ButtonLink href={onboardingPage.unpaid.href}>{onboardingPage.unpaid.cta}</ButtonLink>
        </div>
      </Shell>
    );
  }

  if (!preview) {
    const subscription = await ensureSubscription(sessionId);
    if (subscription.status === "error") {
      console.error("[onboarding] subscription not created:", subscription.message);
    }
  }

  const service = preview ?? serviceFromMetadata(identity.metadata);

  return (
    <Shell>
      <OnboardingSteps
        sessionId={sessionId}
        content={onboardingSteps[service]}
        gbpAccessUrl={gbpAccessUrl()}
        formId={onboardingFormId()}
        prefill={{ email: identity.email, name: identity.name, phone: identity.phone }}
      />
    </Shell>
  );
}

/**
 * `?preview=<service>` renders that service's steps with a stand-in
 * customer, in local dev only, so each one can be looked at without a
 * checkout. Never in production: there it is ignored and the page asks for a
 * session like any other visit.
 */
const previewService = (value: unknown): OnboardingService | null =>
  process.env.NODE_ENV === "development" && isOnboardingService(value) ? value : null;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FunnelHeader />
      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[620px]">{children}</div>
        </Container>
      </main>
      <FunnelFooter />
    </>
  );
}
