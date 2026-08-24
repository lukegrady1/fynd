import { suppliedStats } from "@/content/stats";
import type { Stat } from "@/content/stats";
import { Container } from "@/components/ui/Layout";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

/**
 * The trust bar: three third-party statistics, all visible at once.
 *
 * Three across from sm up, stacked on a phone. The figure carries the row and
 * the sentence sits under it at body size, so the bar reads as three numbers
 * first and three claims second.
 *
 * Renders nothing until content/stats.ts holds entries. Each entry can carry
 * a source, shown under the sentence; see the note at the top of that file
 * for why the current three still need theirs.
 */
export function StatBar() {
  const items = suppliedStats();
  if (items.length === 0) return null;

  return (
    <section className="border-y border-white/10 bg-navy py-12 lg:py-16">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {items.map((stat, i) => (
            <li key={stat.value + stat.body}>
              <Reveal delay={i * 0.08}>
                <StatItem stat={stat} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  return (
    <div className="text-center">
      <p className="text-[44px] font-bold leading-none tabular-nums tracking-[-0.02em] text-fynd-green lg:text-[56px]">
        <CountUp value={stat.value} />
      </p>
      <p className="measure-tight mx-auto mt-4 text-body text-white/75">
        {stat.body}
      </p>
      {stat.source && (
        <p className="mt-2 text-small text-white/40">{stat.source}</p>
      )}
    </div>
  );
}
