import { Check, Hand, ListChecks, MessageCircle, Plus, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { watch } from "@/content/copy";
import type { Widen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { Reveal } from "./Reveal";

/**
 * How the Review System works. The heading, then the three "what
 * about…" blocks as icon cards in a row (the /optimize ranking-factor
 * card: a 48px ring in the icon's colour, the title, the text; a row
 * with the icon beside the text on a phone), then one navy band: the
 * to-do list in two columns on the right, the three figures stacked
 * down the left, the "if we need you" lines under a rule. Then the
 * button. Reads `watch.busy`. Third layout for this copy: /manage's
 * two cards, then a you/us ledger Luke didn't like (Nov 3, 2026).
 */
export type HowItWorksCopy = Widen<typeof watch.busy>;

export function WatchHowItWorks({ targetId = "convert", copy = watch.busy }: { targetId?: string; copy?: HowItWorksCopy } = {}) {

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <p className="text-micro uppercase text-fynd-green-text">{copy.eyebrow}</p>
          <h2 className="mt-3 text-h1 text-ink">{copy.heading}</h2>
          <p className="mx-auto mt-4 max-w-[720px] text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">
            {copy.sub}
          </p>
        </Reveal>

        {/* The three blocks as icon cards. */}
        <ul className="mx-auto mt-10 grid max-w-[1120px] gap-4 md:grid-cols-3 md:gap-6 lg:mt-14">
          {copy.blocks.map((block, i) => {
            const look = looks[i] ?? looks[0];
            return (
              <li key={block.title} className="flex">
                <Reveal
                  delay={i * 0.08}
                  className="flex w-full gap-4 rounded-md border border-line bg-white p-5 shadow-sm md:flex-col md:p-6 lg:p-7"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] md:h-12 md:w-12",
                      look.ring,
                    )}
                  >
                    <look.Icon strokeWidth={1.75} className={cn("h-5 w-5", look.icon)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-h3 text-ink md:mt-5">{block.title}</h3>
                    <p className="mt-1.5 text-small font-medium text-ink-soft md:mt-2 md:text-body">{block.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* The band: the figures, the list, the reach-out lines. */}
        <Reveal className="relative mx-auto mt-6 max-w-[1120px] overflow-hidden rounded-lg bg-navy p-6 text-white shadow-lg sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-fynd-blue/20 blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            <div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fynd-blue text-white">
                  <Sparkles aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-h3 text-white">{copy.todo.title}</h3>
                  <p className="mt-0.5 text-small text-white/70">{copy.todo.sub}</p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-3 lg:grid-cols-1 lg:divide-y lg:divide-white/10">
                {copy.stats.map((stat) => (
                  <div key={stat.label} className="lg:py-4 lg:first:pt-0 lg:last:pb-0">
                    <dt className="text-[26px] font-bold leading-none tabular-nums text-fynd-green sm:text-data">{stat.value}</dt>
                    <dd className="mt-1.5 text-[12px] leading-tight text-white/70 sm:text-small">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {copy.todo.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/20">
                      <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green" />
                    </span>
                    <span className="text-small font-medium text-white sm:text-body">{item}</span>
                  </li>
                ))}
              </ul>

              {/* The reach-out lines: open from md, a closed <details> on
                  phones so the band ends at the list (mobile pass, Nov 3,
                  2026). Two renderings because `open` can't be set per
                  breakpoint. */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <details className="group md:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <span className="text-small font-semibold text-white">{copy.reach.title}</span>
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-4 w-4 shrink-0 text-[#8FA0FF] transition-transform duration-250 ease-fynd group-open:rotate-45" />
                  </summary>
                  <ReachList items={copy.reach.items} />
                </details>
                <div className="hidden md:block">
                  <p className="text-small font-semibold text-white">{copy.reach.title}</p>
                  <ReachList items={copy.reach.items} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-8 flex max-w-[720px] flex-col items-center gap-5 text-center">
          <p className="text-small text-ink-soft">{copy.note}</p>
          <ScrollButton targetId={targetId} label={copy.cta} section="how_it_works" />
        </Reveal>
      </Container>
    </section>
  );
}

function ReachList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2.5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <MessageCircle aria-hidden="true" strokeWidth={2} className="mt-1 h-3.5 w-3.5 shrink-0 text-[#8FA0FF]" />
          <span className="text-small text-white/70">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** One look per block, in order: the list, what's still yours, the bad review. */
const looks: { Icon: LucideIcon; ring: string; icon: string }[] = [
  { Icon: ListChecks, ring: "border-fynd-blue/40 bg-fynd-blue/5", icon: "text-fynd-blue" },
  { Icon: Hand, ring: "border-fynd-orange/50 bg-fynd-orange/5", icon: "text-fynd-orange" },
  { Icon: ShieldCheck, ring: "border-fynd-green/50 bg-fynd-green/5", icon: "text-fynd-green-text" },
];
