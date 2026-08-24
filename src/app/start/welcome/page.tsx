import type { Metadata } from "next";
import { welcome } from "@/content/copy";
import { parseParams, type SearchParams } from "@/lib/params";
import { Container } from "@/components/ui/Layout";
import {
  FunnelHeader,
  FunnelFooter,
} from "@/components/sections/review/PageChrome";
import { PageTracking } from "@/components/sections/review/PageTracking";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "You're in — Fyne",
  robots: { index: false, follow: false },
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseParams(await searchParams);

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

            {/* TODO(integration): embed the GHL onboarding form here —
                business name, Google Business Profile URL, CRM, who to contact. */}
            <section className="mt-10 rounded-lg border border-line bg-fynd-gray p-6 lg:p-8">
              <h2 className="text-h2 text-ink">{welcome.formHeading}</h2>
              <p className="mt-2 text-body text-ink-soft">{welcome.formBody}</p>
              <div className="mt-5 min-h-[420px] rounded-sm border border-line bg-white p-5">
                <p className="text-small text-ink-soft">
                  Onboarding form not configured — embed the GHL form here.
                </p>
              </div>
            </section>

            {/* TODO(integration): 15-min setup call calendar embed. */}
            <section className="mt-6 rounded-lg border border-line bg-white p-6 lg:p-8">
              <h2 className="text-h2 text-ink">{welcome.callHeading}</h2>
              <p className="mt-2 text-body text-ink-soft">{welcome.callBody}</p>
              <div className="mt-5 min-h-[420px] rounded-sm border border-line bg-fynd-gray p-5">
                <p className="text-small text-ink-soft">
                  Setup-call calendar not configured — set
                  NEXT_PUBLIC_GHL_CALENDAR_ID.
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>

      <FunnelFooter />
    </>
  );
}
