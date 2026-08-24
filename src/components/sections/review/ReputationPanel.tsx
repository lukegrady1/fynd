import { TrendingUp } from "lucide-react";
import { heroFlow } from "@/content/copy";
import { colors } from "@/lib/brand";

/**
 * The live reputation readout: rating, review count, and the trend behind
 * them.
 *
 * This used to sit in the hero, where it competed with the flow for attention
 * and arrived before the reader had any reason to care about the numbers. It
 * belongs next to "behind the scenes" — by then the mechanism has been
 * explained and this is the payoff view.
 */
export function ReputationPanel({ className }: { className?: string }) {
  const { reputation } = heroFlow;

  return (
    <div
      className={`rounded-lg border border-white/10 bg-navy-card p-6 ${className ?? ""}`}
    >
      <p className="flex items-center gap-2">
        <span className="text-h3 text-white">{reputation.label}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/10 px-2 py-0.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fynd-green"
          />
          <span className="text-micro font-semibold uppercase tracking-[0.1em] text-fynd-green">
            {reputation.live}
          </span>
        </span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {reputation.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-white/10 bg-white/[0.03] p-3.5"
          >
            <p className="text-small text-white/55">{kpi.label}</p>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none tabular-nums text-white">
                {kpi.value}
              </span>
              {"stars" in kpi && kpi.stars && <MiniStars />}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-1 text-small">
              <span className="flex items-center gap-0.5 font-semibold text-fynd-green">
                <TrendingUp aria-hidden="true" className="h-3.5 w-3.5" />
                {kpi.delta}
              </span>
              <span className="text-white/45">{kpi.note}</span>
            </p>
          </div>
        ))}
      </div>

      <Sparkline />
    </div>
  );
}

/** Drawn from the series in copy.ts so the chart can't drift from the KPIs. */
function Sparkline() {
  const values = heroFlow.reputation.spark;
  const w = 400;
  const h = 64;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = 4 + (i / (values.length - 1)) * (w - 8);
    const y = h - ((v - min) / span) * (h - 14) - 7;
    return [x, y] as const;
  });

  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-5 h-auto w-full"
      role="img"
      aria-label={`Total reviews rising from ${min} to ${max} over the last six months`}
    >
      <path
        d={d}
        fill="none"
        stroke={colors.green}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={colors.green} />
      ))}
    </svg>
  );
}

function MiniStars() {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3 w-3"
          fill={colors.green}
        >
          <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}
