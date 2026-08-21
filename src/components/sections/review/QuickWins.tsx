import { quickWins } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * The clock. Three milestones on a horizontal rail — the one place a rail
 * beats a list, because the whole claim is about elapsed time.
 */
export function QuickWins() {
  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{quickWins.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{quickWins.heading}</h2>
          <p className="measure mt-3 text-body text-ink-soft">
            {quickWins.sub}
          </p>
        </Reveal>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* The rail runs behind the markers on wide screens only; stacked
              on mobile it would just be a line through nothing. */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[7px] hidden h-px bg-line md:block"
          />

          {quickWins.steps.map((step, i) => (
            <li key={step.when} className="relative">
              <Reveal delay={i * 0.07}>
                <span
                  aria-hidden="true"
                  className="relative z-10 block h-[15px] w-[15px] rounded-full border-2 border-fynd-blue bg-white"
                />
                <p className="mt-4 text-micro uppercase text-fynd-blue">
                  {step.when}
                </p>
                <h3 className="mt-1.5 text-h3 text-ink">{step.title}</h3>
                <p className="measure mt-1.5 text-body text-ink-soft">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
