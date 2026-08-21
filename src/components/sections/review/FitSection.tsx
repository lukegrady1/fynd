import { Check, Plug, Zap } from "lucide-react";
import { fit } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * "Will this work for me, and what do I have to do?" — integrations, the
 * onboarding timeline, and the trades list.
 *
 * The timeline is a real vertical rail rather than another row of cards; it's
 * the one shape on the page that carries a sense of elapsed time.
 */
export function FitSection() {
  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{fit.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{fit.heading}</h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Integrations />
          </Reveal>
          <Reveal delay={0.06}>
            <Timeline />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <Trades />
        </Reveal>
      </Container>
    </section>
  );
}

function Integrations() {
  const { heading, sub, items, fallback } = fit.integrations;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-h3 text-ink">
        <Plug aria-hidden="true" strokeWidth={1.75} className="h-5 w-5 text-fynd-blue" />
        {heading}
      </h3>
      <p className="mt-2 text-body text-ink-soft">{sub}</p>

      <ul className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <span className="text-body font-semibold text-ink">{item.name}</span>
            <span className="text-right text-small text-ink-soft">
              {item.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-sm border-l-2 border-fynd-orange bg-fynd-orange/8 px-4 py-3 text-small text-ink">
        {fallback}
      </p>
    </div>
  );
}

function Timeline() {
  const { heading, steps } = fit.timeline;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-h3 text-ink">
        <Zap aria-hidden="true" strokeWidth={1.75} className="h-5 w-5 text-fynd-blue" />
        {heading}
      </h3>

      <ol className="relative mt-6">
        {/* the rail */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[7px] top-2 w-px bg-line"
        />

        {steps.map((step) => (
          <li key={step.when} className="relative flex gap-5 pb-6 last:pb-0">
            <span
              aria-hidden="true"
              className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-fynd-blue bg-white"
            />
            <div className="min-w-0">
              <p className="text-micro uppercase text-fynd-blue">{step.when}</p>
              <h4 className="mt-1 text-[15px] font-semibold text-ink">
                {step.title}
              </h4>
              <p className="mt-1 text-small text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Trades() {
  const { heading, sub, items, other } = fit.trades;

  return (
    <div className="rounded-lg bg-fynd-gray p-6 lg:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-h3 text-ink">{heading}</h3>
        <p className="text-small text-ink-soft">{sub}</p>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((trade) => (
          <li
            key={trade}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-small text-ink"
          >
            <Check
              aria-hidden="true"
              strokeWidth={2.5}
              className="h-3 w-3 shrink-0 text-[#0F8F6E]"
            />
            {trade}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-small text-ink-soft">{other}</p>
    </div>
  );
}
