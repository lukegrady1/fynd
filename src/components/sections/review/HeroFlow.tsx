import { Check, CornerDownLeft, Send, Star, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { heroFlow, mechanism } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Bubble, PhoneFrame } from "./PhoneFrame";

/**
 * The hero composition: the phone with the real message, the four steps of the
 * automation arranged beside it, and a small reputation panel underneath.
 *
 * A dashboard shows what the product looks like; this shows what it does.
 */
export function HeroFlow({ business }: { business?: string }) {
  const { sms } = mechanism;

  return (
    <div className="relative">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,250px)_1fr] sm:items-start sm:gap-5">
        <PhoneFrame
          business={business ?? sms.business}
          statusTime={sms.statusTime}
          className="max-w-[250px]"
        >
          <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>

          <div className="flex flex-col items-start">
            <div className="w-[92%] rounded-[18px] rounded-bl-[5px] border border-line bg-white p-3 shadow-sm">
              <p className="text-[13px] font-semibold text-ink">
                {sms.prompt.title}
              </p>
              <p className="mt-0.5 text-[11px] font-normal text-ink-soft">
                {sms.prompt.subtitle}
              </p>
              <div className="mt-2.5 flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="h-5 w-5 fill-fynd-green/15 text-fynd-green"
                  />
                ))}
              </div>
            </div>
            <span className="mt-1 px-1 text-[10px] font-normal tabular-nums text-ink-soft">
              {sms.prompt.time}
            </span>
          </div>
        </PhoneFrame>

        <ol className="flex flex-col gap-3">
          {heroFlow.steps.map((step) => (
            <li key={step.n}>
              <StepCard step={step} />
            </li>
          ))}
        </ol>
      </div>

      <Reputation />
    </div>
  );
}

function StepCard({
  step,
}: {
  step: { n: string; icon: string; tone: string; title: string; body: string };
}) {
  const tones: Record<string, string> = {
    blue: "bg-fynd-blue/15 text-fynd-blue",
    orange: "bg-fynd-orange/15 text-fynd-orange",
    green: "bg-fynd-green/15 text-fynd-green",
  };

  return (
    <div className="rounded-lg border border-white/10 bg-navy-card/80 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            tones[step.tone] ?? tones.blue,
          )}
        >
          <StepIcon name={step.icon} />
        </span>
        <span className="text-micro tabular-nums text-white/30">{step.n}</span>
      </div>
      <p className="mt-3 text-[15px] font-semibold text-white">{step.title}</p>
      <p className="mt-1 text-small leading-snug text-white/60">{step.body}</p>
    </div>
  );
}

/** Rating and review count, with the trend line that produced them. */
function Reputation() {
  const { reputation } = heroFlow;

  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-navy-card/80 p-4 backdrop-blur-sm lg:p-5">
      <p className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-white">
          {reputation.label}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-fynd-green/15 px-2 py-0.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fynd-green"
          />
          <span className="text-micro uppercase text-fynd-green">
            {reputation.live}
          </span>
        </span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {reputation.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-white/10 bg-white/[0.03] p-3"
          >
            <p className="text-small text-white/55">{kpi.label}</p>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[26px] font-bold leading-none tabular-nums text-white">
                {kpi.value}
              </span>
              {"stars" in kpi && kpi.stars && <MiniStars />}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-small">
              <span className="flex items-center gap-1 font-semibold text-fynd-green">
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

function Sparkline() {
  const values = heroFlow.reputation.spark;
  const w = 480;
  const h = 46;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 8) - 4;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-auto w-full"
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

const iconProps = {
  strokeWidth: 2,
  className: "h-4 w-4",
  "aria-hidden": true as const,
};

function StepIcon({ name }: { name: string }) {
  const map: Record<string, ReactNode> = {
    check: <Check {...iconProps} strokeWidth={3} />,
    send: <Send {...iconProps} />,
    star: <Star {...iconProps} />,
    reply: <CornerDownLeft {...iconProps} />,
  };
  return <>{map[name] ?? map.check}</>;
}

function MiniStars() {
  return (
    <span className="flex gap-px" aria-hidden="true">
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
