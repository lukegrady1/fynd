import { problem, whyReviews } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Problem, then stakes — the two setup sections that earn the rest of the page.
 *
 * This used to be set typographically, on the argument that four icons in four
 * circles is the most templated pattern in the category. It is cards now, by
 * request. The templated version of that pattern is what is being avoided
 * instead: no icons, a counter rather than a glyph, and one accent colour
 * across all four rather than a rainbow — these are four faces of the same
 * pain, and colour-coding them as if they were features reads as celebration.
 *
 * Orange throughout because orange is this system's problem colour. It appears
 * on borders, the rule and the chip background only, never as text: #ff8a1f is
 * about 2.3:1 on white and fails AA even at display sizes. The numeral is ink.
 *
 * Motion is hover plus the existing staggered Reveal, nothing that depends on
 * JavaScript to become readable, and every transition opts out under
 * prefers-reduced-motion.
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

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {problem.items.map((item, i) => (
            <li key={item.title} className="flex">
              {/* h-full down the chain so a short card still matches the tall
                  one beside it — the grid stretches the li, not the card. */}
              <Reveal delay={i * 0.06} className="flex w-full">
                <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-line bg-white p-6 transition-all duration-250 ease-fynd hover:-translate-y-1 hover:border-fynd-orange/45 hover:shadow-lg hover:shadow-ink/[0.06] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-7">
                  {/* Not cursor-pointer and not a link: the card responds to
                      the pointer for emphasis, and nothing here is clickable. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-[3px] w-10 bg-fynd-orange transition-all duration-300 ease-fynd group-hover:w-24 motion-reduce:transition-none"
                  />

                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-fynd-gray text-h3 font-bold tabular-nums text-ink-soft transition-colors duration-250 ease-fynd group-hover:bg-fynd-orange/10 group-hover:text-ink motion-reduce:transition-none"
                  >
                    {i + 1}
                  </span>

                  <h3 className="mt-5 text-h3 text-ink">{item.title}</h3>
                  <p className="mt-2 text-body text-ink-soft">{item.body}</p>
                </article>
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
 *
 * On phones the four points arrive one at a time, sliding in from the left as
 * each scrolls up. Laying them out horizontally was the other option and does
 * not survive the arithmetic: four titles plus a sentence each across 358px is
 * ~85px per column. So the list stays vertical and the sequence is carried by
 * the entrance instead.
 *
 * `offset` is what makes them arrive separately. At the default 60px all four
 * are inside the viewport at once and reveal as a single group; firing them
 * only once they are ~40% up the screen means scrolling walks through them.
 * The stagger is a backstop for the two that are still on screen together.
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
                  delay={i * 0.08}
                  from="left"
                  offset={220}
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
