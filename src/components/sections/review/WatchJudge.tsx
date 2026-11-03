import { Check } from "lucide-react";
import { watch } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { Reveal } from "./Reveal";

/**
 * "What you can judge in 7 days, and what takes longer" — /manage's
 * judge section, for reviews: the left-aligned heading, the two cards
 * with a coloured top edge (blue for the free week, orange for the
 * months after), and under them, where /manage draws its sample report,
 * the numbers: three tiles with the response rates the FAQ already tells
 * owners to expect, then the four survey facts the FAQ cites with the
 * source linked, and the line saying the rates are expectations, not a
 * guarantee. (The real Salt Salon before/after sat here first; Luke
 * swapped it for stats, Nov 3, 2026.) Every figure is real and sourced;
 * see the note on `watch.judge.numbers`.
 *
 * White, not navy: /watch alternates light and dark sections so it isn't
 * a copy of /manage (Luke, Nov 3, 2026). The cards are grey on white and
 * the numbers panel is the one navy block, so it pops. The section ends
 * on the trial button, like every section on the page.
 */
export function WatchJudge({ targetId = "convert" }: { targetId?: string } = {}) {
  const copy = watch.judge;

  return (
    <section className="bg-white py-12 text-ink lg:py-20">
      <Container>
        <Reveal className="max-w-[760px]">
          <h2 className="text-h1 text-ink lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
          <p className="mt-4 text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">
            {copy.sub}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {copy.cards.map((card, i) => {
            const orange = card.tone === "orange";
            return (
              <Reveal
                key={card.label}
                delay={i * 0.08}
                className={cn(
                  "rounded-lg border-t-4 bg-fynd-gray p-6 text-ink ring-1 ring-line lg:p-7",
                  orange ? "border-fynd-orange" : "border-fynd-blue",
                )}
              >
                <p className="flex items-center gap-2 text-micro uppercase text-ink-soft">
                  <span
                    aria-hidden="true"
                    className={cn("h-2 w-2 rounded-full", orange ? "bg-fynd-orange" : "bg-fynd-blue")}
                  />
                  {card.label}
                </p>
                <h3 className="mt-2 text-h2 text-ink">{card.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body text-ink">
                      <Check
                        aria-hidden="true"
                        strokeWidth={3}
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0",
                          orange ? "text-fynd-orange" : "text-fynd-blue",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Numbers />

        <div className="mt-8 flex flex-col items-center gap-3 text-center lg:mt-10">
          <ScrollButton targetId={targetId} label={copy.cta} section="judge" />
          <p className="text-small text-ink-soft">{copy.ctaNote}</p>
        </div>
      </Container>
    </section>
  );
}

/** The numbers under the cards: three tiles, four facts, the source. */
function Numbers() {
  const n = watch.judge.numbers;

  return (
    <Reveal className="relative mx-auto mt-8 max-w-[1000px] overflow-hidden rounded-lg bg-navy p-5 text-white shadow-lg sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-fynd-green/[0.12] blur-3xl"
      />

      <div className="relative mx-auto max-w-[720px] text-center">
        <p className="text-micro uppercase text-fynd-green">{n.eyebrow}</p>
        <h3 className="mt-3 text-h2 text-white lg:text-[32px] lg:leading-[1.15]">{n.heading}</h3>
        <p className="mt-4 text-body text-white/70">{n.sub}</p>
      </div>

      <ul className="relative mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {n.tiles.map((tile) => (
          <li
            key={tile.value}
            className="rounded-md bg-white/[0.05] p-5 text-center ring-1 ring-white/10 sm:p-6"
          >
            <p className="text-[40px] font-bold leading-none tabular-nums tracking-[-0.02em] text-fynd-green sm:text-[44px]">
              {tile.value}
            </p>
            <p className="mt-2 text-body font-semibold text-white">{tile.label}</p>
            <p className="mt-1.5 text-small text-white/60">{tile.basis}</p>
          </li>
        ))}
      </ul>

      <div className="relative mt-8 border-t border-white/10 pt-6">
        <p className="text-micro uppercase text-[#8FA0FF]">{n.whyLabel}</p>
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {n.facts.map((fact) => (
            <li key={fact.value} className="flex items-baseline gap-3">
              <span className="w-[3.25rem] shrink-0 text-h3 tabular-nums text-white">{fact.value}</span>
              <span className="text-small text-white/75 sm:text-body">{fact.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-white/60">
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

      <p className="relative mt-6 text-center text-small text-white/60">{n.note}</p>
    </Reveal>
  );
}
