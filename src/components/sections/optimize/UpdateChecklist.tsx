import { optimize } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * Everything on the profile to update, with why Google cares about each —
 * and deliberately not what to write in any of it. The list is the free
 * value; the writing is the $99 that follows.
 *
 * Fourteen items in four groups, each group a gray panel with its own
 * title, two panels across from md. The numbers run straight through the
 * groups so "start at the top" still means something and the $99 card can
 * say "all fourteen".
 */
export function UpdateChecklist() {
  const copy = optimize.checklist;
  // Where each group's numbering starts: 1, then one past the last of the
  // group before it.
  const starts = copy.groups.reduce<number[]>(
    (acc, group, i) => [...acc, i === 0 ? 1 : acc[i - 1] + copy.groups[i - 1].items.length],
    [],
  );

  return (
    <section id="how" className="scroll-mt-20 bg-white py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <h2 className="text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
          <p className="measure mx-auto mt-4 text-body text-ink-soft">
            {copy.sub}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-2 md:gap-6 lg:mt-14">
          {copy.groups.map((group, g) => {
            const first = starts[g];
            return (
              <Reveal
                key={group.title}
                delay={(g % 2) * 0.08}
                className="rounded-lg bg-fynd-gray p-6 lg:p-8"
              >
                <h3 className="text-h3 text-ink">{group.title}</h3>
                <p className="mt-1 text-small font-medium text-ink-soft">
                  {group.blurb}
                </p>

                <ol
                  start={first}
                  className="mt-6 flex flex-col divide-y divide-line border-t border-line"
                >
                  {group.items.map((item, i) => (
                    <li key={item.title} className="flex gap-4 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-micro tabular-nums text-fynd-green-text ring-1 ring-line">
                        {String(first + i).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-body font-semibold text-ink">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-small font-medium text-ink-soft">
                          {item.why}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-12 max-w-[640px] text-center lg:mt-16">
          <p className="text-h3 text-ink">{copy.outro}</p>
        </Reveal>
      </Container>
    </section>
  );
}
