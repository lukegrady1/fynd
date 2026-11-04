import {
  Check,
  Inbox,
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
import type { Widen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { NumbersPanel } from "./NumbersPanel";
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
export type ProofCopy = Widen<typeof watch.judge>;

export function WatchProof({ targetId = "convert", copy = watch.judge }: { targetId?: string; copy?: ProofCopy } = {}) {
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

        <NumbersPanel copy={n} />

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <ScrollButton targetId={targetId} label={copy.cta} section="proof" />
          <p className="text-small text-ink-soft">{copy.ctaNote}</p>
        </div>
      </Container>
    </section>
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
