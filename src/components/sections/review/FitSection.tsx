import { Check, Plug } from "lucide-react";
import { fit } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * "Will this work with what I already use, and is it built for my trade?"
 *
 * Purely about fit: what it connects to, and who it's built for. The
 * onboarding sequence lives in QuickWins.
 */
export function FitSection() {
  return (
    <section className="bg-navy py-14 text-white lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">{fit.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-white">{fit.heading}</h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Integrations />
          </Reveal>
          <Reveal delay={0.06}>
            <Verticals />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Integrations() {
  const { heading, sub, items, fallback } = fit.integrations;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-h3 text-white">
        <Plug
          aria-hidden="true"
          strokeWidth={1.75}
          className="h-5 w-5 text-fynd-green"
        />
        {heading}
      </h3>
      <p className="mt-2 text-body text-white/75">{sub}</p>

      <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <span className="text-body font-semibold text-white">
              {item.name}
            </span>
            <span className="text-right text-small text-white/72">
              {item.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-sm border-l-2 border-fynd-orange bg-white/5 px-4 py-3 text-small text-white/90">
        {fallback}
      </p>
    </div>
  );
}

function Verticals() {
  const { heading, sub, items, other } = fit.verticals;

  return (
    <div>
      <h3 className="text-h3 text-white">{heading}</h3>
      <p className="mt-2 text-body text-white/75">{sub}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((trade) => (
          <li
            key={trade}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-small text-white"
          >
            <Check
              aria-hidden="true"
              strokeWidth={2.5}
              className="h-3 w-3 shrink-0 text-fynd-green"
            />
            {trade}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-small text-white/72">{other}</p>
    </div>
  );
}
