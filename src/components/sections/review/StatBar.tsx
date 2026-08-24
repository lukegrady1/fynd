import { suppliedStats } from "@/content/stats";
import type { Stat } from "@/content/stats";

/**
 * The trust bar: third-party review statistics, scrolling.
 *
 * Pure CSS marquee rather than a JS ticker — no hydration surface, nothing on
 * the critical path, and `prefers-reduced-motion` simply stops it and leaves a
 * readable row. The track is rendered twice so the loop has no visible seam;
 * the duplicate is aria-hidden so a screen reader hears each stat once.
 *
 * Renders nothing until content/stats.ts holds entries, and every entry must
 * carry a named source — see the note at the top of that file. A trust bar
 * built on figures nobody can point at is the opposite of a trust bar.
 */
export function StatBar() {
  const items = suppliedStats();
  if (items.length === 0) return null;

  return (
    <section className="border-y border-white/10 bg-navy py-5">
      <div className="marquee">
        <ul className="marquee-track">
          {items.map((stat) => (
            <StatPill key={stat.value + stat.body} stat={stat} />
          ))}
        </ul>
        <ul className="marquee-track" aria-hidden="true">
          {items.map((stat) => (
            <StatPill key={`dup-${stat.value}${stat.body}`} stat={stat} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatPill({ stat }: { stat: Stat }) {
  return (
    <li className="flex shrink-0 items-baseline gap-2.5 px-7">
      <span className="text-h2 font-bold leading-none tabular-nums text-fynd-green">
        {stat.value}
      </span>
      <span className="text-body text-white/80">{stat.body}</span>
      <span className="text-small text-white/40">{stat.source}</span>
    </li>
  );
}
