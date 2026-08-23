import {
  Clock,
  Lock,
  Reply,
  Send,
  ShieldCheck,
  Star,
  User,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { mechanism } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Bubble, PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";

/**
 * The mechanism, told as one sequence: the phone holds position on the left
 * while the four steps run down the right, with the ambient details parked in
 * a separate panel so they don't compete with the story.
 *
 * The old routing fork is gone. Explaining that a rating decides where the
 * customer lands turned a compliance liability into a selling point.
 */
export function Mechanism() {
  const { sms, steps, behindScenes } = mechanism;

  return (
    <section className="bg-navy py-16 text-white lg:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light" variant="pill">
            {mechanism.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-white lg:text-[42px] lg:leading-[1.1]">
            {mechanism.heading}
          </h2>
          <p className="measure mt-4 text-body text-white/75">
            {mechanism.sub}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
          {/* The phone holds still while the steps scroll past it. */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <PhoneFrame business={sms.business} statusTime={sms.statusTime}>
              <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>

              <div className="flex flex-col items-start">
                <div className="w-[88%] rounded-[18px] rounded-bl-[5px] border border-line bg-white p-3 shadow-sm">
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
                        className="h-6 w-6 fill-fynd-green/15 text-fynd-green"
                      />
                    ))}
                  </div>
                </div>
                <span className="mt-1 px-1 text-[10px] font-normal tabular-nums text-ink-soft">
                  {sms.prompt.time}
                </span>
              </div>
            </PhoneFrame>
          </Reveal>

          <div className="grid gap-10 xl:grid-cols-[1fr_320px] xl:gap-12">
            <ol className="relative">
              {/* Rail linking the steps, stopping short of the last marker. */}
              <span
                aria-hidden="true"
                className="absolute bottom-12 left-[19px] top-5 w-px bg-gradient-to-b from-fynd-green/50 to-fynd-green/10"
              />

              {steps.map((step, i) => (
                <li key={step.title} className="relative">
                  <Reveal delay={i * 0.06} className="flex gap-5 pb-10 last:pb-0">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fynd-green/40 bg-navy text-fynd-green">
                      <StepIcon name={step.icon} />
                    </span>
                    <div className="min-w-0 pt-1">
                      <p className="flex items-baseline gap-3">
                        <span className="text-small font-bold tabular-nums text-fynd-green">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-h3 text-white">{step.title}</span>
                      </p>
                      <p className="measure mt-2 text-small text-white/65">
                        {step.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={0.1} className="xl:self-start">
              <div className="rounded-lg border border-white/10 bg-navy-card p-6">
                <h3 className="text-h3 text-white">{behindScenes.heading}</h3>
                <ul className="mt-5 flex flex-col gap-5">
                  {behindScenes.items.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 shrink-0 text-fynd-green">
                        <DetailIcon name={item.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-small text-white/60">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

const iconProps = {
  strokeWidth: 1.75,
  className: "h-[18px] w-[18px]",
  "aria-hidden": true as const,
};

function StepIcon({ name }: { name: string }) {
  const map: Record<string, ReactNode> = {
    wrench: <Wrench {...iconProps} />,
    send: <Send {...iconProps} />,
    star: <Star {...iconProps} />,
    reply: <Reply {...iconProps} />,
  };
  return <>{map[name] ?? map.wrench}</>;
}

function DetailIcon({ name }: { name: string }) {
  const map: Record<string, ReactNode> = {
    clock: <Clock {...iconProps} />,
    user: <User {...iconProps} />,
    shield: <ShieldCheck {...iconProps} />,
    lock: <Lock {...iconProps} />,
  };
  return <>{map[name] ?? map.clock}</>;
}
