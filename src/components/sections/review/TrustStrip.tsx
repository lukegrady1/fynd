import { Fragment } from "react";
import { trustStrip } from "@/content/copy";
import { Container } from "@/components/ui/Layout";

/**
 * A thin qualifying strip under the hero. Its job is to let the visitor
 * confirm "this is for me" in two seconds, not to sell anything.
 *
 * Two presentations of the same list. From `sm` up it wraps and centres. On a
 * phone seven industries wrap to three ragged lines, which reads as a block of
 * text to skim past rather than a list to check yourself against — so there it
 * scrolls as one continuous line instead.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-navy py-8">
      <Container>
        <p className="text-center text-small text-white/60">
          {trustStrip.lead}
        </p>

        <Marquee />

        <ul className="mt-4 hidden flex-wrap items-center justify-center gap-x-2.5 gap-y-2 sm:flex">
          {trustStrip.industries.map((industry, i) => (
            <li key={industry} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-white/20">
                  ·
                </span>
              )}
              <span className="text-small font-semibold text-white/85">
                {industry}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * The phone version: one line, scrolling.
 *
 * `-mx-4` cancels the Container's padding so the line runs edge to edge — a
 * marquee that stops short of the screen edge reads as a broken list rather
 * than a moving one. The mask fades both ends so items enter and leave instead
 * of being chopped off at a hard border.
 *
 * The track is the list twice over. The second copy is aria-hidden, so the
 * industries are announced once; the animation is attached with motion-safe:
 * so that under prefers-reduced-motion nothing moves and the strip becomes a
 * swipeable overflow-x-auto row instead — reachable either way.
 */
function Marquee() {
  const items = trustStrip.industries;

  return (
    <div
      className="mt-4 -mx-4 overflow-x-hidden motion-reduce:overflow-x-auto sm:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <ul className="flex w-max items-center motion-safe:animate-[fynd-marquee_26s_linear_infinite]">
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((industry) => (
              <li
                key={`${copy}-${industry}`}
                aria-hidden={copy === 1 ? "true" : undefined}
                className="flex shrink-0 items-center gap-3 pr-3"
              >
                {/* A separator before every item, not between them: the loop
                    has no first or last, so an i > 0 check would drop the dot
                    at the seam. */}
                <span aria-hidden="true" className="text-white/20">
                  ·
                </span>
                <span className="whitespace-nowrap text-small font-semibold text-white/85">
                  {industry}
                </span>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
