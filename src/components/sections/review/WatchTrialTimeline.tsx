import { Check } from "lucide-react";
import { watch } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { Reveal } from "./Reveal";
import { TimelineRail } from "./TimelineRail";

/**
 * "Here's what your free trial looks like" as a vertical timeline: one
 * line down the left, a dot per step, the "when" as a chip and the
 * step beside it, so the week reads top to bottom like a schedule at
 * every width. The line fills green as the reader scrolls, and each
 * dot turns green and gets its check as the fill reaches it
 * (`TimelineRail`; Luke, Nov 3, 2026: "make the check mark in the
 * circles animate and flow through each one as I scroll"). Without
 * JavaScript the first dot is checked and the line is grey. Under it
 * the promise line, the button, and the cancel line. Reads
 * `watch.trialWeek`.
 */
export function WatchTrialTimeline({ targetId = "convert" }: { targetId?: string } = {}) {
  const copy = watch.trialWeek;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <h2 className="text-h1 text-white lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.02em]">
            {copy.heading}
          </h2>
          <p className="mt-4 text-body text-white/75 lg:text-[18px]">{copy.sub}</p>
        </Reveal>

        <ol className="relative mx-auto mt-12 max-w-[720px] lg:mt-16">
          {/* The grey base line, then the green fill that grows over it. */}
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[11px] top-3 w-px bg-white/15"
          />
          <TimelineRail />
          {copy.steps.map((step, i) => {
            const last = i === copy.steps.length - 1;
            return (
              <li key={step.when} className={cn("relative pl-12", last ? "" : "pb-10 lg:pb-12")}>
                <Reveal delay={i * 0.08}>
                  <span
                    aria-hidden="true"
                    data-dot
                    {...(i === 0 ? { "data-reached": "" } : {})}
                    className={cn(
                      "absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white/25 bg-navy text-navy",
                      "transition-all duration-500 ease-fynd data-[reached]:scale-110 data-[reached]:border-fynd-green data-[reached]:bg-fynd-green",
                    )}
                  >
                    <Check
                      strokeWidth={3}
                      className="h-3 w-3 scale-50 opacity-0 transition-all duration-500 ease-fynd [[data-reached]_&]:scale-100 [[data-reached]_&]:opacity-100"
                    />
                  </span>
                  <p className="inline-flex rounded-full bg-fynd-green/15 px-2.5 py-1 text-micro uppercase text-fynd-green">
                    {step.when}
                  </p>
                  <h3 className="mt-3 text-h2 text-white">{step.title}</h3>
                  <p className="mt-2 max-w-[600px] text-body text-white/70">{step.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal className="mx-auto mt-12 flex max-w-[760px] flex-col items-center text-center lg:mt-16">
          <p className="flex items-start gap-3 text-h3 text-white sm:items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-green text-navy">
              <Check aria-hidden="true" strokeWidth={3} className="h-4 w-4" />
            </span>
            {copy.proof}
          </p>

          {/* The button alone: the "Not ready? Book a demo call first" link
              beside it came off (Luke, Nov 3, 2026). */}
          <div className="mt-8 flex w-full flex-col items-center sm:w-auto">
            <ScrollButton targetId={targetId} label={copy.cta} section="trial_week" />
          </div>
          <p className="mt-5 text-small text-white/60">{copy.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
