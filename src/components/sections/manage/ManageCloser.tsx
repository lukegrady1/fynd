import Link from "next/link";
import { manage } from "@/content/copy";
import { LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { CallLink } from "./CallLink";
import { ScrollButton } from "./ScrollButton";

/**
 * The closer, in the platform page's shape: navy, the Fynd mark where
 * it has its glowing orb, the two-tone line, the button, the terms line
 * (the paragraph under the heading came out Nov 3, 2026: Luke, "unnecessary"), and the two quiet links for whoever isn't ready (the call, the
 * $99).
 *
 * The two-tone line is one line each on a phone (Luke, Nov 3, 2026):
 * 24px below sm, where h1's 30px would wrap both halves, and the lead
 * dropped "Google" so it fits at that size with room to spare.
 */
export function ManageCloser({ targetId }: { targetId: string }) {
  const copy = manage.finalCta;

  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,rgba(76,91,255,0.3),transparent_55%)]"
      />

      <Container>
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <LogoMark className="h-16" sizes="72px" />

          <h2 className="mt-8 text-h1 max-sm:text-[24px] max-sm:leading-[1.15] lg:text-[48px] lg:leading-[1.1] lg:tracking-[-0.02em]">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green">{copy.accent}</span>
          </h2>
          <ScrollButton targetId={targetId} label={copy.cta} section="final_cta" className="mt-8" />
          <p className="mt-4 text-small text-white/60">{copy.note}</p>

          <p className="mt-4 text-small text-white/70">
            {copy.notReady}{" "}
            <CallLink label={copy.callLink} section="final_cta" tone="light" className="text-small underline decoration-white/30" />
            <span className="px-2 text-white/30">·</span>
            {copy.once.lead}{" "}
            <Link
              href={copy.once.href}
              className="font-semibold text-white/85 underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white"
            >
              {copy.once.label}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
