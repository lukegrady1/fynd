import { heroFlow, mechanism } from "@/content/copy";

/**
 * The hero composition, read left to right: the trigger, then Fynd, then what
 * the business gets out of it.
 *
 * The phone is the white block in the middle deliberately — it is the only
 * light surface in a dark section, so the eye lands there first and the arrow
 * pointing into it makes the direction of the sentence unmistakable. The
 * right-hand column is outcomes, not features.
 *
 * Laid out on an 820x560 design canvas with percentage offsets inside an
 * aspect-ratio box, and type in container-query units, so the whole thing
 * scales as one piece at any width. The connector SVG shares the canvas
 * viewBox and stays welded to the cards.
 *
 * All copy comes from content/copy.ts.
 */

const CANVAS = { w: 820, h: 700 };

/** Card centres on the right rail are arithmetic — see the rail below. */
const OUTCOME_Y = [118, 350, 582] as const;

const fluid = {
  "--hc-micro": "1.22cqw",
  "--hc-body": "1.71cqw",
  "--hc-title": "2.2cqw",
  "--hc-pad": "2cqw",
  "--hc-gap": "1.2cqw",
  "--hc-icon": "4.8cqw",
} as React.CSSProperties;

export function HeroCollage({ business }: { business?: string }) {
  return (
    <div
      style={{ containerType: "inline-size" }}
      className="relative -mx-4 w-[calc(100%+2rem)] max-w-[820px] sm:mx-auto sm:w-full"
    >
      <div style={fluid} className="relative aspect-[820/700] w-full">
        <Glow />
        <Connectors />

        <Trigger />
        <Phone business={business} />

        {/* The three outcomes. Fixed-height rail with flex-1 children, so the
            centres stay at OUTCOME_Y however the copy wraps. */}
        <div className="absolute right-0 top-[1%] flex h-[98%] w-[28%] flex-col gap-[1.6%]">
          {heroFlow.outcomes.map((outcome) => (
            <OutcomeCard key={outcome.n} outcome={outcome} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Glow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-[34%] top-[8%] h-[70%] w-[46%] rounded-full bg-fynd-blue/12 blur-[110px]" />
      <span className="absolute right-[4%] top-[30%] h-[50%] w-[36%] rounded-full bg-fynd-green/10 blur-[110px]" />
    </div>
  );
}

/**
 * Wiring. The arrow into the phone is the one piece that carries meaning
 * rather than decoration, so it gets a head and a heavier stroke.
 */
function Connectors() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <defs>
        <linearGradient id="hc-wire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-fynd-blue)" />
          <stop offset="100%" stopColor="var(--color-fynd-green)" />
        </linearGradient>
        <marker
          id="hc-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-fynd-blue)" />
        </marker>
        <filter id="hc-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* trigger -> Fynd.
          No glow filter on this one. The path is perfectly horizontal, so its
          bounding box has zero height, and an SVG filter region defaults to a
          percentage of that box — the filter resolves to an empty region and
          the line disappears entirely. The curved wires below have real bbox
          height, so the glow is safe there. */}
      <path
        d="M204 300 H276"
        stroke="var(--color-fynd-blue)"
        strokeWidth="3.5"
        strokeLinecap="round"
        markerEnd="url(#hc-arrow)"
      />

      {/* Fynd -> each outcome */}
      {OUTCOME_Y.map((y) => (
        <path
          key={y}
          d={`M533 315 C563 315 563 ${y} 586 ${y}`}
          stroke="url(#hc-wire)"
          strokeWidth="2"
          opacity="0.85"
          filter="url(#hc-glow)"
        />
      ))}

      {OUTCOME_Y.map((y) => (
        <circle key={`n${y}`} cx={586} cy={y} r="4" fill="var(--color-fynd-green)" />
      ))}
      <circle cx={204} cy={300} r="4" fill="var(--color-fynd-blue)" />
    </svg>
  );
}

function Trigger() {
  const { trigger } = heroFlow;

  return (
    <div className="absolute left-0 top-[30%] z-10 w-[24%] rounded-lg border border-white/10 bg-white/[0.04] p-[var(--hc-pad)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <span className="flex h-[var(--hc-icon)] w-[var(--hc-icon)] items-center justify-center rounded-full bg-gradient-to-br from-fynd-blue to-fynd-blue2 text-white shadow-lg shadow-fynd-blue/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[50%] w-[50%]"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>
      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-title)] font-semibold leading-tight text-white">
        {trigger.title}
      </p>
      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-body)] leading-relaxed text-white/60">
        {trigger.body}
      </p>
    </div>
  );
}

function Phone({ business }: { business?: string }) {
  const { sms } = mechanism;

  return (
    <div className="absolute left-[35%] top-[10%] z-20 h-[70%] w-[30%]">
      <div className="relative h-full w-full -rotate-[2deg] rounded-[9%/5.5%] border-[6px] border-navy bg-navy shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-[2px] flex flex-col overflow-hidden rounded-[8%/5%] bg-white">
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

          {/* Explicit bg-white: the phone body is rotated, and axe stops
              resolving background through the transform and falls back to the
              navy section behind it, so small ink-soft text reads as a
              contrast failure it is not. */}
          <div className="flex flex-col gap-[5%] bg-white px-[7%] py-[6%]">
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

          {/* Fynd's name on the white block, so the middle of the sentence
              reads as us rather than as a generic phone. */}
          <p className="mt-auto border-t border-line px-[7%] py-[4%] text-center text-[length:var(--hc-micro)] font-semibold uppercase tracking-[0.14em] text-fynd-blue">
            {heroFlow.brand.label}
          </p>
        </div>
      </div>
    </div>
  );
}

function OutcomeCard({
  outcome,
}: {
  outcome: (typeof heroFlow.outcomes)[number];
}) {
  const tones: Record<string, { icon: string; n: string }> = {
    blue: { icon: "bg-fynd-blue/20 text-fynd-blue", n: "text-fynd-blue" },
    green: { icon: "bg-fynd-green/20 text-fynd-green", n: "text-fynd-green" },
    orange: {
      icon: "bg-fynd-orange/20 text-fynd-orange",
      n: "text-fynd-orange",
    },
  };
  const tone = tones[outcome.tone] ?? tones.blue;

  return (
    <div className="z-10 flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-[var(--hc-pad)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-[var(--hc-icon)] w-[var(--hc-icon)] shrink-0 items-center justify-center rounded-full ${tone.icon}`}
        >
          <OutcomeIcon name={outcome.icon} />
        </span>
        <span
          className={`text-[length:var(--hc-body)] font-semibold tabular-nums ${tone.n}`}
        >
          {outcome.n}
        </span>
      </div>
      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-title)] font-semibold leading-tight text-white">
        {outcome.title}
      </p>
      <p className="mt-[var(--hc-gap)] text-[length:var(--hc-body)] leading-relaxed text-white/60">
        {outcome.body}
      </p>
    </div>
  );
}

function OutcomeIcon({ name }: { name: string }) {
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

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

function Star({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
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
