import { watch } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { CalendarModule } from "./CalendarModule";
import { Reveal } from "./Reveal";

/**
 * The booking ask on /watch: a heading and the calendar.
 *
 * The section id lives on the calendar so every "Book a demo" on the page
 * lands with the time slots in view, not the heading.
 */
export function BookDemo({
  embedUrl,
  id,
}: {
  embedUrl: string | null;
  id: string;
}) {
  const copy = watch.book;

  return (
    <>
      <section className="bg-fynd-gray pt-12 lg:pt-20">
        <Container>
          <Reveal className="mx-auto max-w-[640px] text-center">
            <Eyebrow variant="pill" className="mx-auto">
              {copy.eyebrow}
            </Eyebrow>
            <h2 className="mt-5 text-h1 text-ink">
              <span className="block">{copy.lead}</span>
              <span className="block text-fynd-green-text">{copy.accent}</span>
            </h2>
          </Reveal>
        </Container>
      </section>

      <CalendarModule embedUrl={embedUrl} id={id} />
    </>
  );
}
