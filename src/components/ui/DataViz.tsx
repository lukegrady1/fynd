import { cn } from "@/lib/utils";
import { colors } from "@/lib/brand";
import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * Circular donut ring, 10px stroke, green progress on an #E3E7EE track.
 * Color is never the only signal — the score and label are always rendered.
 */
export function ScoreGauge({
  score,
  max = 100,
  label,
  delta,
  className,
}: {
  score: number;
  max?: number;
  label: string;
  delta?: string;
  className?: string;
}) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score / max, 0), 1);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={colors.line}
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={colors.green}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[32px] font-bold leading-none text-ink">
            {score}
          </span>
          <span className="mt-1 text-micro uppercase text-ink-muted">
            {label}
          </span>
        </div>
      </div>
      {delta && <Delta value={delta} className="mt-4" />}
    </div>
  );
}

/** Positive deltas are green; negative uses Fyne Orange — never red. */
export function Delta({
  value,
  direction = "up",
  className,
}: {
  value: string;
  direction?: "up" | "down";
  className?: string;
}) {
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-small font-semibold",
        direction === "up" ? "text-[#0F8F6E]" : "text-fynd-orange",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
      {value}
    </span>
  );
}

/** Horizontal metric bar — 6px, fully rounded, cycling blue / green / orange. */
export function MetricBar({
  label,
  value,
  percent,
  index = 0,
  className,
}: {
  label: string;
  value: string;
  percent: number;
  index?: number;
  className?: string;
}) {
  const cycle = [colors.blue, colors.green, colors.orange];
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-small text-ink">{label}</span>
        <span className="text-small font-semibold text-ink">{value}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(Math.max(percent, 0), 100)}%`,
            background: cycle[index % cycle.length],
          }}
        />
      </div>
    </div>
  );
}

/** Big number with a delta pill beside it, metric name above in Small. */
export function KpiBlock({
  name,
  value,
  delta,
  direction = "up",
  tone = "light",
  className,
}: {
  name: string;
  value: string;
  delta?: string;
  direction?: "up" | "down";
  /** "dark" = sitting on a navy surface. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn("text-small", dark ? "text-white/72" : "text-ink-soft")}
      >
        {name}
      </span>
      <span className="mt-1 flex items-center gap-3">
        <span className={cn("text-data", dark ? "text-white" : "text-ink")}>
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-1 text-micro",
              direction === "up"
                ? dark
                  ? "bg-fynd-green/15 text-fynd-green"
                  : "bg-fynd-green/12 text-[#0F8F6E]"
                : "bg-fynd-orange/12 text-fynd-orange",
            )}
          >
            {direction === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
      </span>
    </div>
  );
}

/** 2px blue line with a soft area fill, horizontal gridlines only. */
export function LineChart({
  data,
  className,
  ariaLabel,
}: {
  data: number[];
  className?: string;
  ariaLabel: string;
}) {
  const w = 320;
  const h = 120;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / span) * (h - 16) - 8;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fynd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.blue} stopOpacity="0.22" />
          <stop offset="100%" stopColor={colors.blue} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1="0"
          x2={w}
          y1={h * g}
          y2={h * g}
          stroke={colors.line}
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#fynd-area)" />
      <path
        d={line}
        fill="none"
        stroke={colors.blue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
