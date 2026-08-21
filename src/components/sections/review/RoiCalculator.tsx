"use client";

import { useState } from "react";
import { roi } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Estimate, not a forecast.
 *
 * This is deliberately just arithmetic on numbers the visitor types in, and it
 * says so. The response rate is adjustable rather than baked in, because
 * asserting a conversion rate we can't stand behind is exactly the kind of
 * thing the skeptical trades owner in the brief would catch.
 */

const WEEKS_PER_MONTH = 4.33;

export function RoiCalculator() {
  const [jobs, setJobs] = useState(15);
  const [rate, setRate] = useState(30);

  const perMonth = Math.round(jobs * WEEKS_PER_MONTH * (rate / 100));
  const sixMonths = perMonth * 6;

  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow>{roi.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-h1 text-ink">{roi.heading}</h2>
            <p className="measure mt-3 text-body text-ink-soft">{roi.sub}</p>

            <div className="mt-8 flex flex-col gap-7">
              <Slider
                id="roi-jobs"
                label={roi.inputs.jobsLabel}
                value={jobs}
                min={1}
                max={80}
                step={1}
                display={`${jobs}`}
                onChange={setJobs}
              />
              <Slider
                id="roi-rate"
                label={roi.inputs.rateLabel}
                value={rate}
                min={5}
                max={80}
                step={5}
                display={`${rate}%`}
                onChange={setRate}
                help={roi.inputs.rateHelp}
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-line bg-white p-6 lg:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <Output label={roi.outputs.perMonth} value={perMonth} />
                <span
                  aria-hidden="true"
                  className="hidden w-px self-stretch bg-line sm:block"
                />
                <Output
                  label={roi.outputs.sixMonths}
                  value={sixMonths}
                  note={roi.outputs.ratingNote}
                />
              </div>

              <p className="mt-7 border-t border-line pt-5 text-small text-ink-soft">
                {roi.disclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Output({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note?: string;
}) {
  return (
    <div className="flex-1">
      <p className="text-small text-ink-soft">{label}</p>
      <p className="mt-1 text-[44px] font-bold leading-none tabular-nums text-ink">
        {value.toLocaleString("en-US")}
      </p>
      {note && <p className="mt-2 text-small text-ink-soft">{note}</p>}
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
  help?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-small font-semibold text-ink">
          {label}
        </label>
        <span className="text-h3 font-bold tabular-nums text-ink">
          {display}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-slider mt-3 h-11 w-full cursor-pointer bg-transparent"
        style={{ ["--pct" as string]: `${pct}%` }}
      />

      {help && <p className="mt-1 text-small text-ink-soft">{help}</p>}
    </div>
  );
}
