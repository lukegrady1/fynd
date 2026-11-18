import type { Metadata } from "next";
import type { ReactNode } from "react";

import { createProfilePage as copy } from "@/content/onboarding-steps";
import { Container } from "@/components/ui/Layout";
import { FunnelFooter, FunnelHeader } from "@/components/sections/review/PageChrome";

/**
 * /onboarding/google-profile — how to create and verify a Google Business
 * Profile.
 *
 * Linked from the Google access step on /onboarding, opened in a new tab so
 * the setup page stays open behind it (hence no back link). Plain
 * instructions, no session: there's nothing private on it. The content is
 * Luke's setup guide made general; see `createProfilePage`.
 */
export const metadata: Metadata = {
  title: `${copy.title} · Fynd`,
  robots: { index: false, follow: false },
};

/** `**bold**` → <strong>, and the business.google.com mention → a link. */
function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return [<strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>];
    }
    const at = part.indexOf(copy.linkText);
    if (at === -1) return [part];
    return [
      part.slice(0, at),
      <a
        key={`${i}-link`}
        href={copy.linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-fynd-blue underline underline-offset-4 hover:no-underline"
      >
        {copy.linkText}
      </a>,
      part.slice(at + copy.linkText.length),
    ];
  });
}

function Steps({ items }: { items: readonly string[] }) {
  return (
    <ol className="mt-5 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-body text-ink-soft">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fynd-blue text-small font-semibold text-white"
          >
            {i + 1}
          </span>
          <span>{rich(item)}</span>
        </li>
      ))}
    </ol>
  );
}

function Callout({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="mt-6 rounded-md border-l-4 border-fynd-orange bg-fynd-gray p-5">
      <p className="text-body font-semibold text-ink">{heading}</p>
      <p className="mt-1 text-body text-ink-soft">{body}</p>
    </div>
  );
}

function Part({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-h2 text-ink">{heading}</h2>
      {children}
    </section>
  );
}

export default function GoogleProfilePage() {
  const { create, process, video } = copy;

  return (
    <>
      <FunnelHeader />
      <main className="flex-1 bg-white py-12 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <h1 className="text-h1 text-ink">{copy.title}</h1>
            <p className="mt-3 text-body text-ink-soft">{copy.intro}</p>
            <p className="mt-6 text-body text-ink-soft">{rich(copy.needs)}</p>
            <Callout heading={copy.first.heading} body={copy.first.body} />

            <Part heading={create.heading}>
              <Steps items={create.steps} />
            </Part>

            <Part heading={process.heading}>
              <p className="mt-3 text-body text-ink-soft">{process.intro}</p>
              <Steps items={process.steps} />
              <Callout heading={process.wait.heading} body={process.wait.body} />
            </Part>

            <Part heading={video.heading}>
              <p className="mt-3 text-body text-ink-soft">{video.intro}</p>
              <dl className="mt-5 space-y-3">
                {video.proof.map((p, i) => (
                  <div key={p.what} className="rounded-lg border border-line p-4">
                    <dt className="text-body font-semibold text-ink">
                      {i + 1}. {p.what}
                    </dt>
                    <dd className="mt-1 text-body text-ink-soft">{p.show}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-10 text-h3 text-fynd-blue">{video.recordHeading}</h3>
              <Steps items={video.record} />

              <h3 className="mt-10 text-h3 text-fynd-blue">{video.routeHeading}</h3>
              <Steps items={video.route} />

              <Callout heading={video.rejected.heading} body={video.rejected.body} />
            </Part>

            <div className="mt-12 rounded-md bg-fynd-gray p-5">
              <p className="text-body text-ink">{copy.after}</p>
            </div>

            <p className="mt-6 text-body text-ink">{copy.help}</p>
            <p className="mt-3 text-small text-ink-soft">{copy.interfaceNote}</p>
          </div>
        </Container>
      </main>
      <FunnelFooter />
    </>
  );
}
