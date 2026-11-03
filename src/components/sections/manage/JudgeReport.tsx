import {
  ArrowRight,
  Check,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  MousePointer2,
  Phone,
  Scissors,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * "What you can judge in 3 days, and what takes longer", for a paid
 * first week: a left-aligned heading, two cards with a coloured top
 * edge (blue for the first week, orange for the months after), and
 * under them the sample monthly report drawn as the platform draws it —
 * three counts, two maps side by side, the work done, an AI line — with
 * its caption saying the numbers are made up.
 *
 * Ranks on the maps: 1–3 green, 4–10 orange, 11–20 a faint orange with
 * dark numerals, not found a hollow ring. No red anywhere, so "not
 * found" is the absence of colour rather than a warning colour.
 */
export function JudgeReport() {
  const copy = manage.judge;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <Reveal className="max-w-[760px]">
          <h2 className="text-h1 text-white lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
          <p className="mt-4 text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
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
                  "rounded-lg border-t-4 bg-navy-card ring-1 ring-white/10 p-6 text-white shadow-lg lg:p-7",
                  orange ? "border-fynd-orange" : "border-fynd-blue",
                )}
              >
                <p className="flex items-center gap-2 text-micro uppercase text-white/70">
                  <span
                    aria-hidden="true"
                    className={cn("h-2 w-2 rounded-full", orange ? "bg-fynd-orange" : "bg-fynd-blue")}
                  />
                  {card.label}
                </p>
                <h3 className="mt-2 text-h2 text-white">{card.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body text-white">
                      <Check
                        aria-hidden="true"
                        strokeWidth={3}
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0",
                          orange ? "text-fynd-orange" : "text-[#8FA0FF]",
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

        <SampleReport />
        <p className="mt-4 text-center text-small text-white/60">{copy.report.caption}</p>
      </Container>
    </section>
  );
}

const TOP3 = 3;
const PAGE1 = 10;
const FOUND = 20;

function SampleReport() {
  const r = manage.judge.report;

  return (
    <Reveal className="mx-auto mt-8 max-w-[1000px] rounded-lg bg-white p-4 text-ink shadow-lg sm:p-6 lg:p-8">
      <p className="sr-only">{r.sr}</p>

      <div aria-hidden="true">
        {/* Letterhead */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-fynd-blue/10 text-fynd-blue">
              <Scissors strokeWidth={1.75} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-body font-semibold leading-snug text-ink sm:text-h3">{r.business}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft sm:text-micro">{r.tagline}</p>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft sm:text-micro">
            {r.badge}
          </span>
        </div>

        <p className="mt-6 text-h3 text-ink sm:text-h2">{r.title}</p>
        <p className="mt-1 text-small text-ink-soft">{r.sub}</p>

        {/* Three counts */}
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {r.stats.map((stat) => {
            const Icon = statIcon[stat.icon] ?? Phone;
            return (
              <li key={stat.label} className="flex flex-col gap-2 rounded-md border border-line p-2.5 sm:flex-row sm:gap-3 sm:p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-blue/10 text-fynd-blue sm:h-10 sm:w-10">
                  <Icon strokeWidth={1.75} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </span>
                <div>
                  <p className="text-[11px] leading-tight text-ink-soft sm:text-small">{stat.label}</p>
                  <p className="text-[20px] font-bold leading-tight tabular-nums text-ink sm:text-[24px]">{stat.value}</p>
                  <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-fynd-green-text sm:text-[12px]">
                    <TrendingUp strokeWidth={2.5} className="hidden h-3 w-3 sm:block" />
                    {stat.delta}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Two maps */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RankMap grid={r.beforeGrid} day={r.before} />
          <RankMap grid={r.afterGrid} day={r.after} />
        </div>

        {/* Work done */}
        <div className="mt-3 rounded-md border border-line p-4">
          <p className="text-small font-semibold text-ink">{r.work.title}</p>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {r.work.items.map((item) => {
              const Icon = workIcon[item.icon] ?? FileText;
              return (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-fynd-gray text-fynd-blue">
                    <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-h3 leading-tight tabular-nums text-ink">{item.value}</p>
                    <p className="text-[12px] font-medium leading-tight text-ink-soft">{item.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* AI line */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md bg-fynd-blue/[0.06] px-4 py-3">
          <span className="flex items-center gap-2 text-small font-semibold text-ink">
            <Sparkles strokeWidth={1.75} className="h-4 w-4 text-fynd-blue" />
            {r.ai.label}
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span className="text-small text-ink-soft">
            {r.ai.lead} <strong className="font-semibold text-ink">{r.ai.strong}</strong> {r.ai.tail}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-fynd-blue/40 px-3 py-1 text-[12px] font-semibold text-fynd-blue">
            {r.ai.link}
            <ArrowRight strokeWidth={2} className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function RankMap({ grid, day }: { grid: readonly (readonly number[])[]; day: string }) {
  const r = manage.judge.report;
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="flex items-baseline justify-between gap-3 bg-fynd-gray px-3 py-2">
        <p className="text-small text-ink">
          {r.keywordLabel} <strong className="font-semibold text-fynd-blue">{r.keyword}</strong>
        </p>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{day}</p>
      </div>
      <div className="relative bg-[#f6f7f9] p-4">
        <Streets />
        <div className="relative mx-auto grid max-w-[220px] grid-cols-5 gap-2">
          {grid.flatMap((row, i) =>
            row.map((rank, j) => (
              <span
                key={`${i}-${j}`}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full text-[12px] font-bold tabular-nums",
                  rankClass(rank),
                )}
              >
                {rank > FOUND ? r.notFound : rank}
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

function rankClass(rank: number) {
  if (rank <= TOP3) return "bg-fynd-green text-navy";
  if (rank <= PAGE1) return "bg-fynd-orange text-navy";
  if (rank <= FOUND) return "bg-fynd-orange/25 text-ink";
  return "bg-white text-ink-soft ring-1 ring-inset ring-line";
}

/** Faint streets under the circles, so the grid reads as a map. */
function Streets() {
  return (
    <svg
      viewBox="0 0 300 300"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-ink/[0.07]"
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth="5">
        <path d="M0 110 H300" />
        <path d="M0 200 H300" />
        <path d="M95 0 V300" />
        <path d="M215 0 V300" />
      </g>
      <g strokeWidth="2">
        <path d="M0 50 H300" />
        <path d="M0 255 H300" />
        <path d="M40 0 V300" />
        <path d="M155 0 V300" />
        <path d="M270 0 V300" />
        <path d="M0 300 L300 0" />
      </g>
    </svg>
  );
}

const statIcon: Record<string, LucideIcon> = {
  phone: Phone,
  map: MapPin,
  pointer: MousePointer2,
};

const workIcon: Record<string, LucideIcon> = {
  post: FileText,
  reply: MessageSquare,
  image: ImageIcon,
  video: Video,
};
