import { ArrowRight, Lock, Star } from "lucide-react";
import { mechanism } from "@/content/copy";
import { colors } from "@/lib/brand";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Bubble, PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";

/**
 * The mechanism, shown rather than described: the real SMS on a real phone,
 * then the fork that decides where the tap lands. This replaces the generic
 * three-card "how it works" — the artifact does the explaining.
 *
 * Navy ground so it reads as a distinct chapter and the white phone pops.
 */
export function Mechanism() {
  const { sms, steps } = mechanism;

  return (
    <section className="bg-navy py-14 text-white lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">{mechanism.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-white">{mechanism.heading}</h2>
          <p className="mt-3 text-body text-white/75">{mechanism.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-16">
          {/* The artifact */}
          <Reveal>
            <PhoneFrame business={sms.business} statusTime={sms.statusTime}>
              <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>

              {/* The one-tap star widget, as the customer sees it. */}
              <div className="flex flex-col items-start">
                <div className="w-[85%] rounded-[18px] rounded-bl-[5px] border border-line bg-white p-3 shadow-sm">
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
                <span className="mt-1 px-1 text-[10px] font-normal text-ink-soft tabular-nums">
                  {sms.prompt.time}
                </span>
              </div>

              <Bubble side="out" time={sms.inbound.time}>
                {sms.inbound.body}
              </Bubble>
            </PhoneFrame>

            <p className="mt-5 text-center text-small text-white/72">
              {sms.footnote}
            </p>
          </Reveal>

          {/* The steps, then the fork */}
          <div>
            <ol className="border-t border-white/10">
              {steps.map((step, i) => (
                <li key={step.n}>
                  <Reveal
                    delay={i * 0.06}
                    className="flex gap-5 border-b border-white/10 py-5"
                  >
                    <span className="w-9 shrink-0 pt-0.5 text-h3 font-bold tabular-nums text-white/25">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-h3 text-white">{step.title}</h3>
                        <span
                          className={
                            step.actor === "You"
                              ? "rounded-full border border-fynd-orange/50 px-2 py-0.5 text-micro uppercase text-fynd-orange"
                              : "rounded-full border border-white/20 px-2 py-0.5 text-micro uppercase text-white/60"
                          }
                        >
                          {step.actor}
                        </span>
                      </div>
                      <p className="mt-1.5 text-body text-white/75">
                        {step.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal className="mt-10">
              <RoutingFork />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The objection-killer, drawn. One input, two destinations — the asymmetry is
 * the whole point, so the two branches are styled differently rather than as a
 * matched pair of cards.
 */
function RoutingFork() {
  const { routing } = mechanism;

  return (
    <div className="rounded-lg border border-white/10 bg-navy-card p-6 lg:p-8">
      <h3 className="text-h3 text-white">{routing.heading}</h3>

      {/* trigger */}
      <div className="mt-5 flex items-center gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3">
        <span className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              strokeWidth={1.5}
              className="h-3.5 w-3.5 text-white/50"
            />
          ))}
        </span>
        <span className="text-small font-semibold text-white">
          {routing.trigger}
        </span>
      </div>

      {/* Connector. The branches sit side by side from sm up and stack below
          it, so the fork only makes sense at sm+ — mobile gets a plain stem. */}
      <svg
        viewBox="0 0 240 34"
        className="hidden h-8 w-full sm:block"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M120 0 V12 Q120 18 112 18 H68 Q60 18 60 24 V34"
          fill="none"
          stroke={colors.green}
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <path
          d="M120 0 V12 Q120 18 128 18 H172 Q180 18 180 24 V34"
          fill="none"
          stroke={colors.orange}
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
      </svg>
      <span
        aria-hidden="true"
        className="mx-auto block h-6 w-px bg-white/20 sm:hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Branch
          label={routing.high.label}
          title={routing.high.title}
          body={routing.high.body}
          accent="green"
        />
        <Branch
          label={routing.low.label}
          title={routing.low.title}
          body={routing.low.body}
          accent="orange"
        />
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-small text-white/72">
        {routing.footnote}
      </p>
    </div>
  );
}

function Branch({
  label,
  title,
  body,
  accent,
}: {
  label: string;
  title: string;
  body: string;
  accent: "green" | "orange";
}) {
  const green = accent === "green";

  return (
    <div
      className="rounded-sm border-l-2 bg-white/5 p-4"
      style={{ borderLeftColor: green ? colors.green : colors.orange }}
    >
      <p
        className="text-micro uppercase"
        style={{ color: green ? colors.green : colors.orange }}
      >
        {label}
      </p>
      <h4 className="mt-2 flex items-center gap-1.5 text-[15px] font-semibold text-white">
        {green ? (
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        ) : (
          <Lock aria-hidden="true" className="h-4 w-4 shrink-0" />
        )}
        {title}
      </h4>
      <p className="mt-1.5 text-small text-white/72">{body}</p>
    </div>
  );
}
