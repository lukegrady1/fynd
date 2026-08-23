import { Check, CornerDownLeft } from "lucide-react";
import { heroFlow, mechanism } from "@/content/copy";
import { colors } from "@/lib/brand";

/**
 * The hero visual: the automation running end to end.
 *
 * A dashboard shows what the product looks like; this shows what it does. The
 * timestamps run 9:41 to 9:48 on purpose — the whole sequence finishes while
 * the owner is already on the next job.
 */
export function HeroFlow({ business }: { business?: string }) {
  const name = business ?? heroFlow.job.business;

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <ol className="flex flex-col">
        <Step>
          <Card label={heroFlow.job.label} time={heroFlow.job.time}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fynd-green">
                <Check
                  aria-hidden="true"
                  strokeWidth={3}
                  className="h-4 w-4 text-navy"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-white">
                  {name}
                </p>
                <p className="text-small text-white/60">
                  {heroFlow.job.detail}
                </p>
              </div>
            </div>
          </Card>
        </Step>

        <Connector />

        <Step>
          <Card
            label={mechanism.sms.business ? "Text sent" : "Text sent"}
            time={mechanism.sms.outbound.time}
          >
            <div className="rounded-[14px] rounded-bl-[4px] bg-white/8 px-3.5 py-2.5">
              <p className="text-small leading-[1.4] text-white/90">
                {mechanism.sms.outbound.body}
              </p>
            </div>
          </Card>
        </Step>

        <Connector />

        <Step>
          <Card label={heroFlow.review.label} time={heroFlow.review.time}>
            <div className="flex items-start gap-3">
              <GoogleG />
              <div className="min-w-0">
                <Stars />
                <p className="mt-2 text-small text-white/90">
                  {heroFlow.review.quote}
                </p>
                <p className="mt-1.5 text-small text-white/50">
                  {heroFlow.review.name}
                </p>
              </div>
            </div>
          </Card>
        </Step>

        <Connector />

        <Step>
          <Card label={heroFlow.reply.label} time={heroFlow.reply.time}>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                <CornerDownLeft
                  aria-hidden="true"
                  strokeWidth={2}
                  className="h-4 w-4 text-fynd-green"
                />
              </span>
              <div className="min-w-0">
                <p className="text-small text-white/90">{heroFlow.reply.body}</p>
                <p className="mt-1.5 text-small text-white/50">
                  {heroFlow.reply.business}
                </p>
              </div>
            </div>
          </Card>
        </Step>
      </ol>

      <p className="mt-5 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-fynd-green/30 bg-fynd-green/10 px-3.5 py-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fynd-green"
          />
          <span className="text-micro uppercase text-fynd-green">
            {heroFlow.autopilot}
          </span>
        </span>
      </p>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

function Card({
  label,
  time,
  children,
}: {
  label: string;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-card/90 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-micro uppercase text-white/45">{label}</span>
        <span className="text-[11px] tabular-nums text-white/35">{time}</span>
      </div>
      {children}
    </div>
  );
}

/** Vertical link between the cards, with the flow direction marked. */
function Connector() {
  return (
    <li aria-hidden="true" className="flex justify-center py-2">
      <span className="relative flex h-6 w-px justify-center bg-gradient-to-b from-fynd-green/60 to-fynd-green/20">
        <span className="absolute -bottom-0.5 h-1.5 w-1.5 -translate-x-[3px] rotate-45 border-b border-r border-fynd-green/60" />
      </span>
    </li>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill={colors.green}
        >
          <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[13px] font-bold text-white/70"
    >
      G
    </span>
  );
}
