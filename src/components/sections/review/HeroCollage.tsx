import { heroFlow, mechanism } from "@/content/copy";

/**
 * The hero composition: a phone showing the review text, four numbered steps
 * orbiting it on glowing connectors, and the reputation panel below.
 *
 * It renders at every width and scales as a single piece. Laid out on an
 * 820x720 design canvas with percentage offsets inside an aspect-ratio box, so
 * the geometry is resolution-independent; type and padding are in container
 * query units (cqw), so a glyph occupies the same fraction of the composition
 * at 350px as it does at 820px. The connector SVG shares the canvas viewBox
 * and therefore stays welded to the cards at any size.
 *
 * Below xl the hero is a single column and this sits under the copy, where it
 * gets the full container width. Note that the baked-in labels are genuinely
 * small on a phone — the composition reads as a diagram of the flow there, not
 * as something to be read word by word. The same four steps are spelled out at
 * readable size in the Mechanism section further down the page.
 *
 * All copy comes from content/copy.ts, so the studio/salon positioning stays
 * in one place.
 */

const CANVAS = { w: 820, h: 720 };

/**
 * Connector geometry, in canvas coordinates. The right-hand rail is a fixed
 * height flex column of three equal cards, so its card centres are arithmetic
 * (140 / 360 / 580) rather than measured — the wires stay attached no matter
 * how the copy wraps.
 */
const WIRES = [
  "M197 305 C222 305 240 300 240 258",
  "M510 200 C548 200 548 145 578 145",
  "M510 340 C548 340 548 360 578 360",
  "M510 385 C548 385 548 580 578 580",
  "M390 416 V434",
] as const;

const NODES = [
  [240, 258],
  [578, 145],
  [578, 360],
  [578, 580],
  [390, 434],
] as const;

/**
 * Design sizes from the 820px canvas, expressed in container-query units so
 * every glyph and gutter scales with the composition instead of the viewport.
 * 1cqw = 8.2px at full size, so e.g. 14px design type is 14/820*100 = 1.71cqw.
 */
const fluid = {
  "--hc-micro": "1.22cqw",
  "--hc-body": "1.71cqw",
  "--hc-title": "2.2cqw",
  "--hc-kpi": "3.66cqw",
  "--hc-pad": "2.44cqw",
  "--hc-gap": "1.5cqw",
  "--hc-icon": "5.85cqw",
} as React.CSSProperties;

export function HeroCollage({ business }: { business?: string }) {
  return (
    <div
      style={{ containerType: "inline-size" }}
      className="relative -mx-4 w-[calc(100%+2rem)] max-w-[820px] sm:mx-auto sm:w-full"
    >
      <div style={fluid} className="relative aspect-[820/720] w-full">
        <Glow />
        <Connectors />

        {/* 01 — left */}
        <StepCard
          step={heroFlow.steps[0]}
          className="absolute left-0 top-[26.4%] w-[24%]"
        />

        <Phone business={business} />

        {/* 02 / 03 / 04 — the right rail. Fixed height with three flex-1
            children, so the cards share the space evenly and can never
            overlap each other however the copy wraps. */}
        <div className="absolute right-0 top-[5%] flex h-[90%] w-[29.5%] flex-col gap-[1.7%]">
          {heroFlow.steps.slice(1).map((step) => (
            <StepCard key={step.n} step={step} className="flex-1" />
          ))}
        </div>

        <Reputation />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Soft coloured light behind the composition, in brand hues. */
function Glow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-[38%] top-[10%] h-[58%] w-[51%] rounded-full bg-fynd-blue/12 blur-[110px]" />
      <span className="absolute right-[5%] top-[34%] h-[44%] w-[39%] rounded-full bg-fynd-green/10 blur-[110px]" />
      <span className="absolute bottom-[5%] left-[35%] h-[36%] w-[32%] rounded-full bg-fynd-blue2/10 blur-[90px]" />
    </div>
  );
}

/** The wiring between the phone and the four cards. Decorative. */
function Connectors() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <defs>
        <linearGradient id="hc-wire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-fynd-blue)" />
          <stop offset="100%" stopColor="var(--color-fynd-green)" />
        </linearGradient>
        <filter id="hc-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {WIRES.map((d) => (
        <path
          key={d}
          d={d}
          stroke="url(#hc-wire)"
          strokeWidth="2"
          opacity="0.85"
          filter="url(#hc-glow)"
        />
      ))}

      {NODES.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}`}>
          {/* Slow outward pulse — the only motion in the composition. */}
          <circle
            cx={cx}
            cy={cy}
            r="4"
            fill="var(--color-fynd-green)"
            className="hc-node"
            style={{ animationDelay: `${i * 0.6}s`, transformOrigin: `${cx}px ${cy}px` }}
          />
          <circle cx={cx} cy={cy} r="4" fill="var(--color-fynd-green)" />
        </g>
      ))}
    </svg>
  );
}

function Phone({ business }: { business?: string }) {
  const { sms } = mechanism;

  return (
    <div className="absolute left-[29.9%] top-[3.5%] z-20 h-[54%] w-[32.3%]">
      <div className="relative h-full w-full -rotate-[2deg] rounded-[9%/5.5%] border-[6px] border-navy bg-navy shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-[2px] overflow-hidden rounded-[8%/5%] bg-white">
          <div className="relative flex h-[7%] items-center justify-between px-[7%] text-[length:var(--hc-micro)] font-semibold text-ink">
            <span className="tabular-nums">{sms.statusTime}</span>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[18%] h-[62%] w-[30%] -translate-x-1/2 rounded-full bg-navy"
            />
            <SignalBars />
          </div>

          <div className="border-b border-line px-3 pb-[3%] pt-[1%] text-center">
            <p className="text-[length:var(--hc-body)] font-semibold text-ink">
              {business ?? sms.business}
            </p>
            <p className="mt-0.5 text-[length:var(--hc-micro)] text-ink-soft">
              Text message
            </p>
          </div>

          <div className="flex flex-col gap-[5%] px-[7%] py-[6%]">
            <p className="max-w-[85%] rounded-[16px] rounded-tl-[4px] bg-fynd-gray px-[7%] py-[5%] text-[length:var(--hc-micro)] leading-snug text-ink">
              {sms.outbound.body}
            </p>

            <div className="rounded-[16px] border border-line bg-white px-[7%] py-[6%] shadow-sm">
              <p className="text-[length:var(--hc-micro)] font-semibold text-ink">
                {sms.prompt.title}
              </p>
              <p className="mt-1 text-[length:var(--hc-micro)] text-ink-soft">
                {sms.prompt.subtitle}
              </p>
              <div className="mt-2 flex gap-[4%] text-fynd-green">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-auto w-[15%]" />
                ))}
              </div>
            </div>

            <p className="text-[length:var(--hc-micro)] tabular-nums text-ink-soft">
              {sms.outbound.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  className,
}: {
  step: (typeof heroFlow.steps)[number];
  className: string;
}) {
  const tones: Record<string, { icon: string; n: string }> = {
    blue: { icon: "bg-fynd-blue/20 text-fynd-blue", n: "text-fynd-blue" },
    orange: { icon: "bg-fynd-orange/20 text-fynd-orange", n: "text-fynd-orange" },
    green: { icon: "bg-fynd-green/20 text-fynd-green", n: "text-fynd-green" },
  };
  const tone = tones[step.tone] ?? tones.blue;

  return (
    <div
      className={`z-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-[var(--hc-pad)] shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-[var(--hc-icon)] w-[var(--hc-icon)] shrink-0 items-center justify-center rounded-full ${
            step.n === "01"
              ? "bg-gradient-to-br from-fynd-blue to-fynd-blue2 text-white shadow-lg shadow-fynd-blue/30"
              : tone.icon
          }`}
        >
          <StepIcon name={step.icon} />
        </span>
        <span
          className={`text-[length:var(--hc-body)] font-semibold tabular-nums ${tone.n}`}
        >
          {step.n}
        </span>
      </div>

      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-title)] font-semibold leading-tight text-white">
        {step.title}
      </p>
      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-body)] leading-relaxed text-white/60">
        {step.body}
      </p>
    </div>
  );
}

function Reputation() {
  const { reputation } = heroFlow;

  return (
    <div className="absolute bottom-[1.1%] left-[5%] top-[61%] z-10 flex w-[57%] flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-[var(--hc-gap)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <p className="flex items-center gap-2">
        <span className="text-[length:var(--hc-title)] font-semibold text-white">
          {reputation.label}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/10 px-2 py-0.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fynd-green"
          />
          <span className="text-[length:var(--hc-micro)] font-semibold text-fynd-green">
            {reputation.live}
          </span>
        </span>
      </p>

      <div className="mt-[var(--hc-gap)] grid grid-cols-2 gap-[var(--hc-gap)]">
        {reputation.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-md bg-navy/40 p-[var(--hc-gap)]">
            <p className="text-[length:var(--hc-body)] text-white/55">
              {kpi.label}
            </p>
            <p className="mt-1.5 flex items-center gap-2">
              <span className="text-[length:var(--hc-kpi)] font-bold leading-none tabular-nums tracking-tight text-white">
                {kpi.value}
              </span>
              {"stars" in kpi && kpi.stars && (
                <span aria-hidden="true" className="flex gap-0.5 text-fynd-green">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled className="h-2.5 w-2.5" />
                  ))}
                </span>
              )}
            </p>
            <p className="mt-[var(--hc-gap)] text-[length:var(--hc-micro)] text-white/55">
              <span className="font-semibold text-fynd-green">
                &uarr; {kpi.delta}
              </span>{" "}
              {kpi.note}
            </p>
          </div>
        ))}
      </div>

      <Sparkline />
    </div>
  );
}

/** Drawn from the real series in copy.ts so the chart can't drift from it. */
function Sparkline() {
  const values = heroFlow.reputation.spark;
  const w = 400;
  const h = 76;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = 5 + (i / (values.length - 1)) * (w - 10);
    const y = h - ((v - min) / span) * (h - 16) - 8;
    return [x, y] as const;
  });

  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-[var(--hc-gap)] h-auto w-full shrink-0"
      role="img"
      aria-label={`Total reviews rising from ${min} to ${max} over the last six months`}
    >
      <defs>
        <linearGradient id="hc-chart" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-fynd-green2)" />
          <stop offset="100%" stopColor="var(--color-fynd-green)" />
        </linearGradient>
      </defs>

      {/* pathLength normalises the dash math regardless of point count */}
      <path
        d={d}
        fill="none"
        stroke="url(#hc-chart)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="hc-chart-line"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3.5"
          fill="var(--color-fynd-green)"
          className="hc-chart-dot"
          style={{ animationDelay: `${0.5 + i * 0.075}s` }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function StepIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[50%] w-[50%]",
    "aria-hidden": true as const,
  };

  if (name === "send") {
    return (
      <svg {...common}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }
  if (name === "star") return <Star filled className="h-[50%] w-[50%]" />;
  if (name === "reply") {
    return (
      <svg {...common}>
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
        <path d="M21 12c0 4.418-4.03 8-9 8a10.6 10.6 0 0 1-4-.76L3 21l1.37-3.2A7.5 7.5 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
      </svg>
    );
  }
  return (
    <svg {...common} strokeWidth={2.5}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Star({
  filled = false,
  className = "h-4 w-4",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="m12 2.7 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.3l6.2-.9L12 2.7Z" />
    </svg>
  );
}

function SignalBars() {
  return (
    <span aria-hidden="true" className="flex items-end gap-[2px]">
      {[3, 5, 7, 9].map((hgt) => (
        <span
          key={hgt}
          style={{ height: `${hgt}px` }}
          className="w-[2px] rounded-[1px] bg-ink"
        />
      ))}
    </span>
  );
}
