import { Check, CornerDownLeft, Send, Star, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { heroFlow, mechanism } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Bubble, PhoneFrame } from "./PhoneFrame";

/**
 * The hero composition.
 *
 * From lg up this is a staggered collage: the phone sits centre, the four
 * steps scatter around it, the reputation panel tucks under the left, and thin
 * connector lines run between them. Below lg that arrangement has nowhere to
 * go, so the same pieces stack in reading order instead.
 */
export function HeroFlow({ business }: { business?: string }) {
  return (
    <>
      <div className="lg:hidden">
        <Stacked business={business} />
      </div>
      <div className="hidden lg:block">
        <Collage business={business} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop collage                                                      */
/* ------------------------------------------------------------------ */

function Collage({ business }: { business?: string }) {
  const [s1, s2, s3, s4] = heroFlow.steps;

  return (
    // Height and offsets are set against the phone's real rendered height
    // (460px). The reputation panel starts below it so its content is never
    // hidden — only the panel's top padding tucks behind the handset.
    <div className="relative mx-auto h-[700px] w-full max-w-[660px]">
      <Connectors />

      <div className="absolute left-[30%] top-0 z-20 w-[210px]">
        <Phone business={business} compact />
      </div>

      <div className="absolute left-0 top-[100px] z-30 w-[178px]">
        <StepCard step={s1} tight />
      </div>

      <div className="absolute right-0 top-0 z-30 w-[196px]">
        <StepCard step={s2} tight />
      </div>

      <div className="absolute right-0 top-[210px] z-30 w-[196px]">
        <StepCard step={s3} tight />
      </div>

      <div className="absolute right-0 top-[470px] z-30 w-[196px]">
        <StepCard step={s4} tight />
      </div>

      <div className="absolute left-0 top-[450px] z-10 w-[350px]">
        <Reputation />
      </div>
    </div>
  );
}

/** Thin glowing lines linking the phone to each card. */
function Connectors() {
  return (
    <svg
      viewBox="0 0 660 700"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fynd-hero-wire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.blue} stopOpacity="0.08" />
          <stop offset="55%" stopColor={colors.green} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.blue} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {[
        "M197 205 H192 Q186 205 186 197 V184",
        "M419 92 H436 Q446 92 446 80 V70 H455",
        "M419 272 H436 Q446 272 446 284 V294 H455",
        "M419 400 H436 Q446 400 446 412 V544 Q446 554 456 554 H455",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="url(#fynd-hero-wire)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {[
        [186, 184],
        [455, 70],
        [455, 294],
        [455, 554],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={colors.green} opacity="0.75" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile stack                                                         */
/* ------------------------------------------------------------------ */

function Stacked({ business }: { business?: string }) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <Phone business={business} />
      <ol className="mt-5 flex flex-col gap-2.5">
        {heroFlow.steps.map((step) => (
          <li key={step.n}>
            <StepCard step={step} />
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <Reputation />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                               */
/* ------------------------------------------------------------------ */

function Phone({
  business,
  compact,
}: {
  business?: string;
  compact?: boolean;
}) {
  const { sms } = mechanism;

  return (
    <PhoneFrame
      business={business ?? sms.business}
      statusTime={sms.statusTime}
      className={compact ? "max-w-[210px]" : "max-w-[250px]"}
    >
      <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>

      <div className="flex flex-col items-start">
        <div className="w-[94%] rounded-[16px] rounded-bl-[4px] border border-line bg-white p-2.5 shadow-sm">
          <p className="text-[12px] font-semibold text-ink">
            {sms.prompt.title}
          </p>
          <p className="mt-0.5 text-[10px] font-normal text-ink-soft">
            {sms.prompt.subtitle}
          </p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                strokeWidth={1.5}
                className="h-4 w-4 fill-fynd-green/15 text-fynd-green"
              />
            ))}
          </div>
        </div>
        <span className="mt-1 px-1 text-[10px] font-normal tabular-nums text-ink-soft">
          {sms.prompt.time}
        </span>
      </div>
    </PhoneFrame>
  );
}

function StepCard({
  step,
  tight,
}: {
  step: { n: string; icon: string; tone: string; title: string; body: string };
  tight?: boolean;
}) {
  const tones: Record<string, string> = {
    blue: "bg-fynd-blue/15 text-fynd-blue",
    orange: "bg-fynd-orange/15 text-fynd-orange",
    green: "bg-fynd-green/15 text-fynd-green",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-navy-card/90 backdrop-blur-sm",
        tight ? "p-3" : "p-3.5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full",
            tight ? "h-7 w-7" : "h-8 w-8",
            tones[step.tone] ?? tones.blue,
          )}
        >
          <StepIcon name={step.icon} tight={tight} />
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-white/30">
          {step.n}
        </span>
      </div>
      <p
        className={cn(
          "mt-2.5 font-semibold text-white",
          tight ? "text-[13px]" : "text-[15px]",
        )}
      >
        {step.title}
      </p>
      <p
        className={cn(
          "mt-1 leading-snug text-white/60",
          tight ? "text-[11px]" : "text-small",
        )}
      >
        {step.body}
      </p>
    </div>
  );
}

function Reputation() {
  const { reputation } = heroFlow;

  return (
    <div className="rounded-lg border border-white/10 bg-navy-card/90 p-4 backdrop-blur-sm">
      <p className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-white">
          {reputation.label}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/15 px-2 py-0.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fynd-green"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-fynd-green">
            {reputation.live}
          </span>
        </span>
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {reputation.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-white/10 bg-white/[0.03] p-2.5"
          >
            <p className="text-[11px] text-white/55">{kpi.label}</p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold leading-none tabular-nums text-white">
                {kpi.value}
              </span>
              {"stars" in kpi && kpi.stars && <MiniStars />}
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px]">
              <span className="flex items-center gap-0.5 font-semibold text-fynd-green">
                <TrendingUp aria-hidden="true" className="h-3 w-3" />
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

function Sparkline() {
  const values = heroFlow.reputation.spark;
  const w = 400;
  const h = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 8) - 4;
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-auto w-full"
      role="img"
      aria-label={`Reviews rising from ${min} to ${max}`}
      preserveAspectRatio="none"
    >
      <path
        d={line}
        fill="none"
        stroke={colors.green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={colors.green} />
      ))}
    </svg>
  );
}

function StepIcon({ name, tight }: { name: string; tight?: boolean }) {
  const props = {
    strokeWidth: 2,
    className: tight ? "h-3.5 w-3.5" : "h-4 w-4",
    "aria-hidden": true as const,
  };
  const map: Record<string, ReactNode> = {
    check: <Check {...props} strokeWidth={3} />,
    send: <Send {...props} />,
    star: <Star {...props} />,
    reply: <CornerDownLeft {...props} />,
  };
  return <>{map[name] ?? map.check}</>;
}

function MiniStars() {
  return (
    <span className="flex gap-px" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-2.5 w-2.5" fill={colors.green}>
          <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}
