import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/copy";
import { AuditLink } from "@/components/sections/manage/AuditLink";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DotGrid } from "@/components/textures/Textures";
import { MarkerUnderline } from "@/components/sections/review/MarkerUnderline";

/**
 * The homepage closer: `FinalCta`'s dark band with its drawn underline,
 * but with links instead of a scroll, because this page has no checkout
 * of its own. The free audit first (it was the call until Nov 17, 2026),
 * full management beside it.
 */
export function HomeCloser() {
  const copy = home.closer;

  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 lg:py-24">
      <DotGrid tone="dark" />
      <Container className="relative">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <h2 className="text-h1 text-white">
            {copy.heading.lead}{" "}
            <span className="relative inline-block">
              {copy.heading.accent}
              <MarkerUnderline />
            </span>
            {copy.heading.tail}
          </h2>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <AuditLink
              section="home_closer"
              className="group inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-150 ease-fynd h-13 w-full bg-fynd-blue px-8 text-body text-white hover:-translate-y-px hover:bg-[#3F4DF0] hover:shadow-blue sm:h-12 sm:w-auto"
            >
              {copy.audit}
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={2}
                className="h-4 w-4 shrink-0 transition-transform duration-150 ease-fynd group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
              />
            </AuditLink>
            <ButtonLink href={copy.secondary.href} variant="outlineLight" size="lg" className="w-full sm:w-auto">
              {copy.secondary.label}
            </ButtonLink>
          </div>
          <p className="mt-4 text-small text-white/60">{copy.note}</p>
        </div>
      </Container>
    </section>
  );
}
