"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { manage } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";

/**
 * "The payoff": what full management is worth in the visitor's own
 * numbers. Two sliders (what a new customer is worth, how many extra a
 * month) and plain arithmetic against the $297: revenue a month and a
 * year, the return multiple, and how many customers cover the fee.
 *
 * Nothing is assumed beyond what the visitor sets, and the note says
 * it's an estimate with no guarantee (the platform guarantees nothing).
 * Light gray, so it breaks the run of navy sections around it.
 *
 * On /manage the button scrolls to the price card; the homepage passes
 * `link` and gets a button to /manage instead.
 */
export function ManageRoi({
  targetId = "convert",
  link,
}: {
  targetId?: string;
  link?: { label: string; href: string };
}) {
  const copy = manage.roi;
  const [value, setValue] = useState<number>(copy.value.initial);
  const [customers, setCustomers] = useState<number>(copy.customers.initial);

  const month = value * customers;
  const year = month * 12;
  const multiple = month / copy.price;
  const breakEven = Math.max(1, Math.ceil(copy.price / value));

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-micro uppercase text-fynd-green-text">{copy.eyebrow}</p>
            <h2 className="mt-3 text-h1 text-ink lg:text-[40px] lg:leading-[1.15]">
              <span className="block">{copy.lead}</span>
              <span className="block text-fynd-green-text">{copy.accent}</span>
            </h2>
            <p className="mt-4 text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">{copy.sub}</p>

            <div className="mt-8 flex flex-col gap-7">
              <Slider
                id="roi-value"
                label={copy.value.label}
                help={copy.value.help}
                min={copy.value.min}
                max={copy.value.max}
                step={copy.value.step}
                value={value}
                display={money(value)}
                onChange={setValue}
              />
              <Slider
                id="roi-customers"
                label={copy.customers.label}
                help={copy.customers.help}
                min={copy.customers.min}
                max={copy.customers.max}
                step={copy.customers.step}
                value={customers}
                display={String(customers)}
                onChange={setCustomers}
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-line bg-white p-6 shadow-md sm:p-8" aria-live="polite">
              <div className="flex items-start justify-between gap-4">
                <p className="text-small font-semibold text-ink-soft">{copy.outputs.month}</p>
                <span className="shrink-0 rounded-full bg-fynd-green/15 px-2.5 py-1 text-micro uppercase text-fynd-green-text">
                  {copy.outputs.ads}
                </span>
              </div>
              <p className="mt-2 text-[44px] font-bold leading-none tabular-nums text-ink sm:text-[56px]">
                {money(month)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                <div>
                  <p className="text-small text-ink-soft">{copy.outputs.year}</p>
                  <p className="mt-1 text-h2 tabular-nums text-ink">{money(year)}</p>
                </div>
                <div>
                  <p className="text-small text-ink-soft">{copy.outputs.multiple}</p>
                  <p className="mt-1 text-h2 tabular-nums text-fynd-green-text">{times(multiple)}</p>
                </div>
              </div>

              <p className="mt-5 flex items-start gap-3 rounded-sm bg-fynd-gray px-4 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
                  <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green-text" />
                </span>
                <span className="text-body text-ink">{copy.outputs.breakEven(breakEven)}</span>
              </p>

              {link ? (
                <ButtonLink href={link.href} size="lg" arrow className="mt-6 w-full">
                  {link.label}
                </ButtonLink>
              ) : (
                <ScrollButton targetId={targetId} label={copy.cta} section="roi" className="mt-6 sm:w-full" />
              )}

              <p className="mt-5 text-small text-ink-soft">{copy.note}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function money(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function times(n: number) {
  return `${n >= 10 ? Math.round(n) : n.toFixed(1)}×`;
}

function Slider({
  id,
  label,
  help,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const helpId = `${id}-help`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-small font-semibold text-ink">
          {label}
        </label>
        <span className="text-h3 font-bold tabular-nums text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={helpId}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-slider mt-3 h-11 w-full cursor-pointer bg-transparent"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
      <p id={helpId} className="mt-1 text-small text-ink-soft">
        {help}
      </p>
    </div>
  );
}
