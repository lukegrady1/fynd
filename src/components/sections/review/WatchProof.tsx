import {
  Check,
  Clock,
  Eye,
  Inbox,
  ListOrdered,
  MapPin,
  Plug,
  Repeat,
  Reply,
  Send,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { watch } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { Reveal } from "./Reveal";
import { WatchJudgeDemo } from "./WatchJudgeDemo";

/**
 * What to judge when, and the numbers, on white. The judge half is the
 * stageshow demo (`WatchJudgeDemo`: the reviews dashboard and the
 * owner's phone through the free week, animated) with the two lists
 * beside it from lg, under it below: a label, a day-range chip, the
 * items as icon rows (blue for the free week, orange for the months
 * after). (Plain lists, a time scale with header bands and two
 * notification feeds came first; Luke, Nov 3, 2026, asked for the demo.)
 * Then the numbers as a
 * two-column panel: the three figures down the left, each drawn as well
 * as stated (a hundred dots with that many lit for the percentages, a
 * sliver at the start of the three-month window for the hours; the dots
 * and the sliver grow in with the reveal, `.fynd-dot` / `.fynd-bar` in
 * globals.css), and the four survey facts on the right as a navy
 * card of icon tiles with the source under them. (It was two rows of
 * bare numbers first; Luke, Nov 3, 2026: "something a little bit cooler
 * and better designed".) Then the line saying the rates are
 * expectations, and the button. Reads `watch.judge`; see the note on
 * `watch.judge.numbers` for where every figure comes from.
 */
export function WatchProof({ targetId = "convert" }: { targetId?: string } = {}) {
  const copy = watch.judge;
  const n = copy.numbers;

  return (
    <section className="bg-white py-12 text-ink lg:py-20">
      <Container>
        <Reveal className="max-w-[760px]">
          <h2 className="text-h1 text-ink lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
          <p className="mt-4 text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">{copy.sub}</p>
        </Reveal>

        {/* The demo, and the two lists beside it. */}
        <div className="mt-6 grid gap-8 lg:mt-12 lg:grid-cols-[640px_1fr] lg:items-start lg:gap-12">
          {/* No Reveal around the stage: it carries its own motion, and a
              fade-in over a demo that has already started reads as a stall. */}
          <div className="min-w-0">
            <WatchJudgeDemo />
            <p className="mt-3 text-[12px] text-ink-soft">{copy.demoCaption}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 lg:gap-10">
            {copy.cards.map((card, i) => {
              const orange = card.tone === "orange";
              return (
                <Reveal key={card.label} delay={i * 0.08}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-micro uppercase text-ink-soft">
                      <span
                        aria-hidden="true"
                        className={cn("h-2 w-2 rounded-full", orange ? "bg-fynd-orange" : "bg-fynd-blue")}
                      />
                      {card.label}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                        orange ? "bg-fynd-orange/15 text-fynd-orange" : "bg-fynd-blue/10 text-fynd-blue",
                      )}
                    >
                      {card.span}
                    </span>
                  </div>
                  <h3 className="mt-2 text-h3 text-ink">{card.title}</h3>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {card.items.map((item) => {
                      const Icon = rowIcon[item.icon] ?? Check;
                      return (
                        <li key={item.text} className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                              orange ? "bg-fynd-orange/15 text-fynd-orange" : "bg-fynd-blue/10 text-fynd-blue",
                            )}
                          >
                            <Icon aria-hidden="true" strokeWidth={1.75} className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-small text-ink">{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* The numbers */}
        <Reveal className="mx-auto mt-14 max-w-[720px] text-center lg:mt-20">
          <p className="text-micro uppercase text-fynd-green-text">{n.eyebrow}</p>
          <h3 className="mt-3 text-h1 text-ink lg:text-[40px] lg:leading-[1.15]">{n.heading}</h3>
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
                  {tile.viz.kind === "grid" ? (
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

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <ScrollButton targetId={targetId} label={copy.cta} section="proof" />
          <p className="text-small text-ink-soft">{copy.ctaNote}</p>
        </div>
      </Container>
    </section>
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

const rowIcon: Record<string, LucideIcon> = {
  send: Send,
  repeat: Repeat,
  inbox: Inbox,
  star: Star,
  reply: Reply,
  plug: Plug,
  trend: TrendingUp,
  users: Users,
  map: MapPin,
};

const factIcon: Record<string, LucideIcon> = {
  eye: Eye,
  list: ListOrdered,
  star: Star,
  clock: Clock,
};
