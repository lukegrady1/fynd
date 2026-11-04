import { Clock, Eye, ListOrdered, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { watch } from "@/content/copy";
import type { Widen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export type NumbersCopy = Widen<typeof watch.judge.numbers>;

/**
 * The numbers: the heading, then three figures down the left, each drawn
 * as well as stated (a hundred dots with that many lit, a sliver of the
 * three-month window; `.fynd-dot` and `.fynd-bar` in globals.css), and the
 * survey facts on navy to the right, with the line saying the rates are
 * expectations. Built for /watch's judge section; the homepage and
 * /reviews show the same panel. Every figure's source is on
 * `watch.judge.numbers`.
 */
export function NumbersPanel({
  copy: n = watch.judge.numbers,
  standalone = false,
}: {
  copy?: NumbersCopy;
  /** The panel as a section's whole content (the homepage): no top margin, an h2. */
  standalone?: boolean;
} = {}) {
  const Heading = standalone ? "h2" : "h3";
  return (
    <>
      {/* The numbers */}
      <Reveal className={cn("mx-auto max-w-[720px] text-center", !standalone && "mt-14 lg:mt-20")}>
        <p className="text-micro uppercase text-fynd-green-text">{n.eyebrow}</p>
        <Heading className="mt-3 text-h1 text-ink lg:text-[40px] lg:leading-[1.15]">{n.heading}</Heading>
        <p className="mt-4 text-body text-ink-soft">{n.sub}</p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-[1120px] gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* The three figures, each drawn. */}
        <Reveal className="flex flex-col divide-y divide-line rounded-lg border border-line bg-white p-2 shadow-sm">
          {n.tiles.map((tile) => (
            <div key={tile.value} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 lg:p-6">
              <p className="shrink-0 whitespace-nowrap text-[44px] font-bold leading-none tabular-nums tracking-[-0.03em] text-fynd-green-text sm:w-[9.5rem] sm:text-[48px]">
                {tile.value}
              </p>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-ink">{tile.label}</p>
                {"lit" in tile.viz ? (
                  <DotGrid lit={tile.viz.lit} legend={tile.viz.legend} />
                ) : (
                  <Span at={tile.viz.at} total={tile.viz.total} />
                )}
                <p className="mt-2 text-small text-ink-soft">{tile.basis}</p>
              </div>
            </div>
          ))}
          <p className="px-5 pb-4 pt-4 text-[12px] text-ink-soft lg:px-6">{n.tilesNote}</p>
        </Reveal>

        {/* Why it matters: the survey, as icon tiles on navy. */}
        <Reveal delay={0.08} className="relative overflow-hidden rounded-lg bg-navy p-6 text-white shadow-lg lg:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-fynd-blue/25 blur-3xl"
          />
          <div className="relative">
            <p className="text-micro uppercase text-[#8FA0FF]">{n.whyLabel}</p>
            <p className="mt-2 text-h3 text-white">{n.factsLead}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {n.facts.map((fact) => {
                const Icon = factIcon[fact.icon] ?? Star;
                return (
                  <li key={fact.value} className="rounded-md bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fynd-green/20 text-fynd-green">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-white sm:text-[32px]">
                      {fact.value}
                    </p>
                    <p className="mt-1.5 text-small text-white/70">{fact.text}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-[12px] text-white/60">
              <a
                href={n.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white"
              >
                {n.source.label}
              </a>
            </p>
          </div>
        </Reveal>
      </div>

      <p className="mx-auto mt-6 max-w-[720px] text-center text-small text-ink-soft">{n.note}</p>
    </>
  );
}

/**
 * A hundred dots, `lit` of them green: the figure as a crowd. The lit
 * ones fade in one after another as the card arrives, 45ms apart so the
 * crowd fills over about two seconds and a reader scrolling to it sees it
 * happen (Luke, Nov 3, 2026: the first cut was too quick to catch;
 * `.fynd-dot` in globals.css); without scripting they're simply lit.
 */
function DotGrid({ lit, legend }: { lit: number; legend: string }) {
  return (
    <div className="mt-2.5">
      <div aria-hidden="true" className="grid w-full max-w-[280px] grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px] sm:max-w-[320px]">
        {Array.from({ length: 100 }).map((_, i) => (
          <span
            key={i}
            style={i < lit ? { transitionDelay: `${300 + i * 45}ms` } : undefined}
            className={cn(
              "aspect-square w-full rounded-full",
              i < lit ? "fynd-dot bg-gradient-to-br from-fynd-blue to-fynd-green" : "bg-fynd-gray ring-1 ring-line",
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[12px] font-semibold text-fynd-green-text">{legend}</p>
    </div>
  );
}

/**
 * The window people look back over, as one long bar, with the first
 * review as a sliver at its very start. The sliver grows in with the
 * reveal (`.fynd-bar`); the bar is the three months, so a day on it is
 * about a hundredth and reads as "straight away".
 */
function Span({ at, total }: { at: string; total: string }) {
  return (
    <div className="mt-2.5">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-fynd-gray ring-1 ring-line">
        <span
          aria-hidden="true"
          className="fynd-bar absolute inset-y-0 left-0 w-[4%] min-w-[14px] rounded-full bg-gradient-to-r from-fynd-blue to-fynd-green"
        />
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-3 text-[12px]">
        <span className="font-semibold text-fynd-green-text">{at}</span>
        <span className="text-ink-soft">{total}</span>
      </div>
    </div>
  );
}

const factIcon: Record<string, LucideIcon> = {
  eye: Eye,
  list: ListOrdered,
  star: Star,
  clock: Clock,
};
