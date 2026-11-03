import Image from "next/image";
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
 * its caption saying which numbers are made up.
 *
 * The two maps are the real thing: a salon's before/after heatmaps from
 * the platform's own results page (public/images/heatmap-salon-*.webp),
 * named as the platform's in the caption (the "Real salon" tag that sat
 * on the map header came off, Luke, Nov 3, 2026). They replaced a drawn 5x5 grid (Luke, Nov 3, 2026).
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
                  <p className="mt-0.5 text-[26px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink sm:text-[34px]">{stat.value}</p>
                  <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-fynd-green-text sm:text-[12px]">
                    <TrendingUp strokeWidth={2.5} className="hidden h-3 w-3 sm:block" />
                    {stat.delta}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* The two maps: real, so not inside the aria-hidden drawing's
            silence — each image carries its own alt. */}
        <div className="mt-3 overflow-hidden rounded-md border border-line">
          <div className="bg-fynd-gray px-3 py-2">
            <p className="text-small font-semibold text-ink">{r.heatmap.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line">
            {[r.heatmap.before, r.heatmap.after].map((map) => (
              <figure key={map.day} className="bg-white">
                <Image
                  src={map.src}
                  alt={map.alt}
                  width={560}
                  height={560}
                  sizes="(min-width: 1024px) 460px, 50vw"
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                  {map.day}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Work done */}
        <div className="mt-3 rounded-md border border-line p-4">
          <p className="text-small font-semibold text-ink">{r.work.title}</p>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {r.work.items.map((item) => {
              const Icon = workIcon[item.icon] ?? FileText;
              return (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-fynd-blue/10 text-fynd-blue">
                    <Icon strokeWidth={1.75} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink sm:text-[32px]">{item.value}</p>
                    <p className="mt-1 text-[12px] font-medium leading-tight text-ink-soft">{item.label}</p>
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
