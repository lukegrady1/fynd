import { home } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { NumbersPanel } from "@/components/sections/review/NumbersPanel";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * The statistics: the same numbers panel /watch and /reviews carry (the
 * three figures drawn as dots and a sliver, the survey on navy beside
 * them, the line saying the rates are expectations), then one link to
 * the Review System, since the figures are its. Every figure's source
 * is documented on `watch.judge.numbers`.
 */
export function HomeNumbers() {
  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <NumbersPanel standalone />
        <Reveal className="mt-8 flex justify-center">
          <ButtonLink href={home.numbers.href} arrow className="w-full sm:w-auto">
            {home.numbers.cta}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
