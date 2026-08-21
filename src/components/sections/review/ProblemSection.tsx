import { problem, whyReviews } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Problem, then stakes — the two setup sections that earn the rest of the page.
 *
 * Deliberately typographic rather than icon-led: four icons in four circles is
 * the most templated pattern in this category, and the copy is doing the work
 * here anyway. Big muted numerals carry the rhythm instead.
 */
export function ProblemSection() {
  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{problem.heading}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{problem.sub}</p>
        </Reveal>

        <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {problem.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.05} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="w-8 shrink-0 text-h2 font-bold leading-none tabular-nums text-ink/15"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-h3 text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-body text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/**
 * The stakes. Navy so it lands as a turn in the argument rather than another
 * light section, and set as a rule-separated list rather than cards.
 */
export function WhyReviews() {
  return (
    <section className="bg-navy py-14 text-white lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="light">{whyReviews.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-h1 text-white">{whyReviews.heading}</h2>
          </Reveal>

          <ul className="border-t border-white/10">
            {whyReviews.items.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.05}
                  className="border-b border-white/10 py-5"
                >
                  <h3 className="text-h3 text-fynd-green">{item.title}</h3>
                  <p className="mt-1.5 text-body text-white/75">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
