import { Check, Star } from "lucide-react";
import { reviews } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { ReviewPhone } from "./ReviewPhone";

/**
 * /reviews hero, in /manage's shape: navy, the two-line headline with the
 * payoff in green, then two columns — the paragraph, three checks, the big
 * pill to the price card, the price line, five stars and the trust line on
 * the left; on the right the thing itself, drawn: the customer's phone
 * with the review request as it lands (the same thread the homepage's
 * mechanism section draws, `mechanism.sms`).
 *
 * ILLUSTRATION: the studio and the customer are the site's fictional ones.
 */
export function ReviewsHero({ targetId }: { targetId: string }) {
  const copy = reviews.hero;

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-navy pb-14 pt-12 lg:pb-24 lg:pt-20">
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h1 className="text-hero text-white lg:text-[64px] lg:leading-[1.06]">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green">{copy.accent}</span>
          </h1>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1120px] items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-body text-white/80 lg:text-[18px] lg:leading-[29px]">
              {copy.body.lead}
              <strong className="font-bold text-white">{copy.body.strong}</strong>
              {copy.body.tail}
            </p>

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
                label={reviews.cta}
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

          <ReviewPhone className="mx-auto w-full max-w-[300px] lg:ml-auto lg:mr-0" />
        </div>
      </Container>
    </section>
  );
}
