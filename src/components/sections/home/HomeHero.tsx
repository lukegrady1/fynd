import { Check, Star } from "lucide-react";
import { home } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DottedWorldMap } from "@/components/textures/Textures";
import { SearchMock } from "@/components/sections/manage/ManageHero";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";

/**
 * The homepage hero, in /manage's shape: navy over the dotted map, the
 * three-line headline with the payoff in green, then two columns — the
 * paragraph, three checks (one per service), the scroll button with the
 * call beside it, and five stars with the trust line on the left; the
 * search result with the ringing "new customer" pill on the right (the
 * /manage hero's own card, so the visitor meets it again there).
 *
 * Nothing is for sale on this page: the button scrolls to the services
 * and each of those leads to the page that sells it.
 */
export function HomeHero({ targetId }: { targetId: string }) {
  const copy = home.hero;

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-navy pb-14 pt-12 lg:pb-24 lg:pt-20">
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy"
      />

      <Container className="relative">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <h1 className="text-hero text-white lg:text-[64px] lg:leading-[1.06]">
              <span className="block">{copy.lead}</span>
              <span className="block">{copy.mid}</span>
              <span className="block text-fynd-green">{copy.accent}</span>
            </h1>

            <p className="mt-6 max-w-[520px] text-body text-white/80 lg:text-[18px] lg:leading-[29px]">{copy.body}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {copy.checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/20">
                    <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green" />
                  </span>
                  <span className="text-body font-semibold text-white">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:gap-4">
                <ScrollButton
                  targetId={targetId}
                  label={copy.cta}
                  section="hero"
                  className="h-12 w-full whitespace-nowrap px-3 text-small sm:h-14 sm:w-auto sm:px-8 sm:text-body"
                />
                <ButtonLink
                  href={copy.call.href}
                  variant="outlineLight"
                  arrow
                  className="h-12 w-full whitespace-nowrap px-3 text-small sm:h-14 sm:w-auto sm:px-8 sm:text-body"
                >
                  {copy.call.label}
                </ButtonLink>
              </div>
              <p className="flex items-center gap-2.5 text-small font-semibold text-white/85">
                <span className="flex gap-0.5" role="img" aria-label={copy.trustSr}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} strokeWidth={0} className="h-4 w-4 fill-fynd-orange" />
                  ))}
                </span>
                {copy.trust}
              </p>
            </div>
          </div>

          <SearchMock />
        </div>
      </Container>
    </section>
  );
}
