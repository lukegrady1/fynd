import { Check, Wrench } from "lucide-react";
import { home } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DotGrid } from "@/components/textures/Textures";
import { Reveal } from "@/components/sections/review/Reveal";
import { WatchJudgeDemo } from "@/components/sections/review/WatchJudgeDemo";
import { SiteMock } from "@/components/sections/manage/WebsiteSection";
import { BusinessCard } from "@/components/sections/manage/Everywhere";

/**
 * The three services, one row each, the illustration and the words
 * swapping sides row by row: the reviews dashboard running (the /watch
 * and /reviews stageshow demo, reviews landing for as long as it is on
 * screen), the drawn salon site from /manage and /website, and the
 * business card with the live storefront from /manage's channel ring.
 * Each row ends on a link to the page that sells it; the price sits as a
 * quiet line over the button, not as a headline. Then the $99 as one
 * slim band under the three: present, not pitched.
 *
 * The site and the storefront were drawn for navy, so each illustration
 * sits on a navy plate with the dot grid; the dashboard sits on the same
 * plate so the three rows read as one set. Every illustration is
 * fictional and captioned as such.
 */
export function HomeServices({ id }: { id: string }) {
  const copy = home.services;

  return (
    <section id={id} className="scroll-mt-16 bg-white py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <Eyebrow variant="pill" className="mx-auto">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-ink lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
          <p className="mt-4 text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">{copy.sub}</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 lg:mt-20 lg:gap-24">
          {copy.items.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={item.key}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* The illustration, on its plate. */}
                <Reveal className={cn("min-w-0", flip && "lg:order-2")}>
                  <figure className="min-w-0">
                    <div className="relative isolate overflow-hidden rounded-lg bg-navy shadow-lg">
                      <DotGrid tone="dark" />
                      <Illustration item={item.key} />
                    </div>
                    <figcaption className="mt-3 text-[12px] text-ink-soft">{item.caption}</figcaption>
                  </figure>
                </Reveal>

                {/* The words. */}
                <Reveal delay={0.08} className={cn(flip && "lg:order-1")}>
                  <p className="text-micro uppercase text-fynd-green-text">{item.eyebrow}</p>
                  <h3 className="mt-3 text-h1 text-ink lg:text-[36px] lg:leading-[1.15]">{item.title}</h3>
                  <p className="mt-4 text-body text-ink-soft lg:text-[17px] lg:leading-[27px]">{item.body}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                          <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green-text" />
                        </span>
                        <span className="text-body text-ink">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-small font-semibold text-ink-soft">{item.price}</p>
                  <ButtonLink href={item.href} arrow className="mt-3 w-full sm:w-auto">
                    {item.cta}
                  </ButtonLink>
                </Reveal>
              </article>
            );
          })}
        </div>

        {/* The $99, as one band. */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="flex flex-col gap-5 rounded-lg border border-line bg-fynd-gray p-6 sm:flex-row sm:items-center sm:gap-6 lg:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-fynd-orange/40 bg-fynd-orange/10 text-fynd-orange">
              <Wrench aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-micro uppercase text-ink-soft">{copy.optimize.eyebrow}</p>
              <h3 className="mt-1 text-h3 text-ink">{copy.optimize.title}</h3>
              <p className="mt-1 text-small text-ink-soft">{copy.optimize.body}</p>
            </div>
            <ButtonLink href={copy.optimize.href} variant="outline" arrow className="w-full shrink-0 sm:w-auto">
              {copy.optimize.cta}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The three illustrations, each on the plate at the size it was drawn
 * for. The dashboard scales itself (Stage); the site and the card are
 * fixed-width drawings, centred with room to breathe.
 */
function Illustration({ item }: { item: "reviews" | "website" | "manage" }) {
  if (item === "reviews") {
    // No inset: the stage is its own crop (the window runs off its foot),
    // and at half width every pixel goes to the pair.
    return (
      <div className="relative">
        <WatchJudgeDemo compactBelow={480} />
      </div>
    );
  }
  if (item === "website") {
    return (
      <div className="relative px-5 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-12">
        <SiteMock />
      </div>
    );
  }
  return (
    <div className="relative flex justify-center px-6 py-12 sm:py-16">
      <BusinessCard className="relative" />
    </div>
  );
}
