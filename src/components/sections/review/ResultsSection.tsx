"use client";

import { ChevronDown, TrendingUp } from "lucide-react";
import { results } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useLivePrice } from "@/lib/use-offer-window";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Results: the dashboard and the competitor comparison side by side, because
 * they answer the same question — what does this do to my reputation.
 *
 * Stays on navy so the hero, mechanism and results read as one dark chapter
 * rather than alternating light/dark blocks.
 */
export function ResultsSection({
  ctaLabel,
  targetId,
}: {
  ctaLabel?: string;
  targetId?: string;
}) {
  const label = useLivePrice().label(ctaLabel ?? results.cta);

  const handleClick = () => {
    if (!targetId) return;
    track("cta_click", { cta: label, section: "results" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-navy py-16 text-white lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
          <Reveal className="lg:self-start">
            <Eyebrow tone="light" variant="pill">
              {results.eyebrow}
            </Eyebrow>
            <h2 className="mt-5 text-h1 text-white lg:text-[38px] lg:leading-[1.12]">
              {results.heading}
            </h2>
            <p className="mt-4 text-body text-white/72">{results.sub}</p>

            {ctaLabel && targetId && (
              <button
                type="button"
                onClick={handleClick}
                className="mt-8 flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-7 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
              >
                {label}
              </button>
            )}
          </Reveal>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <Reveal>
              <Dashboard />
            </Reveal>
            <Reveal delay={0.08}>
              <Compare />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Dashboard() {
  const { dashboard } = results;

  return (
    <div className="rounded-lg border border-white/10 bg-navy-card p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-small text-white/60">{dashboard.label}</p>
          <p className="mt-0.5 flex items-center gap-2">
            <span className="text-h3 text-white">{dashboard.business}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/15 px-2 py-0.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-fynd-green"
              />
              <span className="text-micro uppercase text-fynd-green">
                {dashboard.live}
              </span>
            </span>
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-small text-white/72">
          {dashboard.range}
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {dashboard.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-white/10 bg-white/[0.03] p-4"
          >
            <p className="text-small text-white/60">{kpi.label}</p>
            <p className="mt-2 text-[28px] font-bold leading-none tabular-nums text-white">
              {kpi.value}
            </p>
            {"stars" in kpi && kpi.stars && (
              <span className="mt-2 block">
                <Stars rating={4.8} />
              </span>
            )}
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-small">
              {"delta" in kpi && kpi.delta && (
                <span className="flex items-center gap-1 font-semibold text-fynd-green">
                  <TrendingUp aria-hidden="true" className="h-3.5 w-3.5" />
                  {kpi.delta}
                </span>
              )}
              <span className="text-white/50">{kpi.note}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[13px] font-semibold text-white">
          {dashboard.chart.heading}
        </p>
        <LineChart />
      </div>
    </div>
  );
}

/** Review volume climbing month over month, drawn from the copy values. */
function LineChart() {
  const { months, values, tooltip } = results.dashboard.chart;
  const w = 560;
  const h = 150;
  const padL = 30;
  const padB = 22;
  const max = 100;

  const pts = values.map((v, i) => {
    const x = padL + (i / (values.length - 1)) * (w - padL - 12);
    const y = h - padB - (v / max) * (h - padB - 10);
    return [x, y] as const;
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - padB} L${padL},${h - padB} Z`;

  return (
    <div className="relative mt-3 pt-6">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Reviews rising from ${values[0]} to ${values[values.length - 1]} over six months`}
      >
        <defs>
          <linearGradient id="fynd-results-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.green} stopOpacity="0.28" />
            <stop offset="100%" stopColor={colors.green} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((tick) => {
          const y = h - padB - (tick / max) * (h - padB - 10);
          return (
            <g key={tick}>
              <line
                x1={padL}
                x2={w - 12}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-white/40 text-[9px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <path d={area} fill="url(#fynd-results-area)" />
        <path
          d={line}
          fill="none"
          stroke={colors.green}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={colors.green} />
        ))}

        {months.map((m, i) => (
          <text
            key={m}
            x={pts[i][0]}
            y={h - 6}
            textAnchor="middle"
            className="fill-white/40 text-[9px] uppercase"
          >
            {m}
          </text>
        ))}
      </svg>

      {/* Sits above the final point rather than on the line itself. */}
      <span className="absolute right-0 top-0 flex flex-col items-end rounded-md bg-fynd-green px-2.5 py-1 text-navy shadow-md">
        <span className="text-small font-bold leading-tight tabular-nums">
          {tooltip.value}
        </span>
        <span className="text-[9px] font-semibold uppercase leading-tight opacity-75">
          {tooltip.label}
        </span>
      </span>
    </div>
  );
}

function Compare() {
  const { compare } = results;

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-navy-card p-5 lg:p-6">
      <h3 className="text-h3 text-white">{compare.heading}</h3>
      <p className="mt-1 text-small text-white/60">{compare.sub}</p>

      <ol className="mt-5 flex flex-col gap-2.5">
        {compare.rows.map((row, i) => (
          <li
            key={row.name}
            className={cn(
              "flex items-center gap-3 rounded-md border p-3",
              row.you
                ? "border-fynd-green/40 bg-fynd-green/10"
                : "border-white/10 bg-white/[0.03]",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-micro tabular-nums",
                row.you
                  ? "bg-fynd-green text-navy"
                  : "bg-white/10 text-white/60",
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-semibold text-white">
                {row.name}
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span className="text-small font-bold tabular-nums text-white">
                  {row.rating.toFixed(1)}
                </span>
                <Stars rating={row.rating} dim={!row.you} />
              </p>
            </div>
            <span className="shrink-0 text-small tabular-nums text-white/60">
              {row.reviews} reviews
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-auto flex items-end justify-between gap-3 pt-5">
        <span className="text-small text-white/72">{compare.takeaway}</span>
        <TrendingUp
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-fynd-green"
        />
      </p>
    </div>
  );
}

function Stars({ rating, dim }: { rating: number; dim?: boolean }) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} color="rgba(255,255,255,0.18)" />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} color={dim ? "#FFB400" : colors.green} />
          ))}
        </span>
      </span>
    </span>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill={color}>
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}
