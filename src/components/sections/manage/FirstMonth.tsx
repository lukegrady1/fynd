import { Check } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { CallLink } from "./CallLink";
import { ScrollButton } from "./ScrollButton";

/**
 * "Here's what your free trial looks like", for a paid first month: three
 * steps on a horizontal rail, the first dot filled and the rail coloured
 * up to the second. Under it, the one line that is a promise rather than
 * a statistic (the platform's is "70% keep her"; ours is that the
 * baseline is taken on day one), then the button and the call link.
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
          <span
            aria-hidden="true"
            className="absolute left-[16.66%] top-[9px] hidden h-[3px] w-[33.33%] rounded-full bg-gradient-to-r from-fynd-blue to-fynd-green md:block"
          />

          {copy.steps.map((step, i) => (
            <li key={step.when} className="relative flex flex-col items-center text-center">
              <Reveal delay={i * 0.08} className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-[3px]",
                    i === 0 ? "border-fynd-blue bg-white" : "border-white/25 bg-navy",
                  )}
                >
                  {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-fynd-blue" />}
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

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-7">
            <ScrollButton targetId="convert" label={copy.cta} section="first_month" />
            <CallLink label={copy.callLink} section="first_month" tone="light" />
          </div>
          <p className="mt-5 text-small text-white/60">{copy.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
