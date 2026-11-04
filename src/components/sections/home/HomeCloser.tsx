import { home } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DotGrid } from "@/components/textures/Textures";
import { MarkerUnderline } from "@/components/sections/review/MarkerUnderline";

/**
 * The homepage closer: `FinalCta`'s dark band with its drawn underline,
 * but with links instead of a scroll, because this page has no checkout
 * of its own. The call first, the Review System beside it.
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
            <ButtonLink href={copy.primary.href} size="lg" arrow className="w-full sm:w-auto">
              {copy.primary.label}
            </ButtonLink>
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
