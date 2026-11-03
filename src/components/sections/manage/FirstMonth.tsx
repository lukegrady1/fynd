import { Check } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";
import { ProgressRail } from "./ProgressRail";

/**
 * "Here's what your free trial looks like", for a paid first month: three
 * steps on a horizontal rail. The rail's colour slides across as the
 * reader scrolls through the section and each dot fills as it's reached
 * (`ProgressRail`; without JavaScript it sits at the first dot filled
 * and the line a third across). Under it, the one line that is a promise rather than
 * a statistic (the platform's is "70% keep her"; ours is that the
 * baseline is taken on day one), then the button. The "book a call"
 * link that sat beside it came off (Luke, Nov 3, 2026).
 */
export function FirstMonth() {
  const copy = manage.firstMonth;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <h2 className="text-h1 text-white lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.02em]">
            {copy.heading}
          </h2>
          <p className="mt-4 text-body text-white/75 lg:text-[18px]">{copy.sub}</p>
        </Reveal>

        <ol className="relative mx-auto mt-12 grid max-w-[1040px] gap-10 md:grid-cols-3 md:gap-6 lg:mt-16">
          {/* The rail, md and up: grey across, coloured from the first dot to the second. */}
          <span
            aria-hidden="true"
            className="absolute left-[16.66%] right-[16.66%] top-[9px] hidden h-[3px] rounded-full bg-white/15 md:block"
          />
          <ProgressRail steps={copy.steps.length} />

          {copy.steps.map((step, i) => (
            <li key={step.when} className="relative flex flex-col items-center text-center">
              <Reveal delay={i * 0.08} className="flex flex-col items-center">
                <span
                  data-dot
                  data-step={i}
                  {...(i === 0 ? { "data-reached": "" } : {})}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white/25 bg-navy transition-colors duration-250 ease-fynd",
                    "data-[reached]:border-fynd-blue data-[reached]:bg-white",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-fynd-blue opacity-0 transition-opacity duration-250 ease-fynd [[data-reached]_&]:opacity-100" />
                </span>
                <p className="mt-5 text-small font-semibold text-[#8FA0FF]">{step.when}</p>
                <h3 className="mt-1 text-h2 text-white">{step.title}</h3>
                <p className="mt-3 max-w-[320px] text-body text-white/70">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mx-auto mt-12 flex max-w-[760px] flex-col items-center text-center lg:mt-16">
          <p className="flex items-start gap-3 text-h3 text-white sm:items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-green text-navy">
              <Check aria-hidden="true" strokeWidth={3} className="h-4 w-4" />
            </span>
            {copy.proof}
          </p>

          <div className="mt-8 flex w-full flex-col items-center sm:w-auto">
            <ScrollButton targetId="convert" label={copy.cta} section="first_month" />
          </div>
          <p className="mt-5 text-small text-white/60">{copy.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
