import { Check, Star } from "lucide-react";
import { bundle } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { SiteMock } from "@/components/sections/manage/WebsiteSection";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";

/**
 * /website hero in /manage's shape (Luke, Nov 3, 2026): navy over the
 * dotted map, the two-line headline with the payoff in green, then the
 * paragraph, three checks, the one big pill that scrolls to the price
 * card, the price line under it and the stars with the trust line on
 * the left; the drawn salon site from /manage's website section on the
 * right. No offer clock and no strikethrough: the price is the price.
 *
 * ILLUSTRATION: the salon and its site are fictional.
 */
export function WebsiteHero({ targetId }: { targetId: string }) {
  const copy = bundle.page.hero;

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-navy pb-14 pt-12 lg:pb-24 lg:pt-20">
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy"
      />

      <Container className="relative">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h1 className="text-hero text-white lg:text-[60px] lg:leading-[1.06]">
              <span className="block">{copy.lead}</span>
              <span className="block text-fynd-green">{copy.accent}</span>
            </h1>

            <p className="mt-6 text-body text-white/80 lg:text-[18px] lg:leading-[29px]">{copy.body}</p>

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

            <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <ScrollButton
                targetId={targetId}
                label={copy.cta}
                section="hero"
                className="h-14 w-full rounded-full text-[18px] sm:h-16 sm:w-full sm:text-[20px] lg:max-w-[440px]"
              />
              <p className="text-small text-white/60">{copy.ctaNote}</p>
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

          {/* The badges hang above the browser; the top padding is their room. */}
          <div className="min-w-0 pt-6">
            <SiteMock />
          </div>
        </div>
      </Container>
    </section>
  );
}
