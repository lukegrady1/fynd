import { Check, MessageCircle, Sparkles } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";

/**
 * "A local SEO tool built for busy owners", redrawn: the eyebrow and two
 * headings, then the two cards side by side — on the left, the owner's
 * side (start with your business / what still needs you / already have
 * a website), each block with a coloured left rule; on the right, our
 * to-do list with a nested "if we ever need you" card. Three stat tiles
 * and the button under them.
 *
 * The platform's third tile is a vendor stat (80% run on autopilot).
 * Ours is the one-business-day start, which is a promise, not a claim.
 */
export function BusyOwners() {
  const copy = manage.busy;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow}</p>
          <h2 className="mt-3 text-h1 text-white">{copy.heading}</h2>
          <p className="mx-auto mt-4 max-w-[720px] text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
            {copy.sub}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-[820px] text-center lg:mt-16">
          <h2 className="text-h1 text-white lg:text-[46px] lg:leading-[1.12]">
            {copy.question}
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
            {copy.questionSub}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1120px] gap-6 lg:mt-14 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <Reveal className="rounded-lg border-2 border-fynd-blue bg-navy-card ring-1 ring-white/10 p-6 text-white shadow-lg lg:mt-14 lg:p-8">
            <div className="flex flex-col gap-7">
              {copy.blocks.map((block) => (
                <div
                  key={block.title}
                  className={cn(
                    "border-l-[3px] pl-5",
                    block.tone === "orange" ? "border-fynd-orange" : "border-fynd-blue",
                  )}
                >
                  <h3 className="text-h3 text-white lg:text-[22px]">{block.title}</h3>
                  <p className="mt-2 text-body text-white/70">{block.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-lg bg-navy-card ring-1 ring-white/10 p-6 text-white shadow-lg lg:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fynd-blue text-white">
                <Sparkles aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-h3 text-white">{copy.todo.title}</h3>
                <p className="mt-0.5 text-small text-white/70">{copy.todo.sub}</p>
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-2.5">
              {copy.todo.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/20">
                    <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green" />
                  </span>
                  <span className="text-small font-medium text-white">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-md bg-white/[0.06] p-4">
              <p className="text-small font-semibold text-white">{copy.reach.title}</p>
              <p className="mt-0.5 text-small text-white/70">{copy.reach.sub}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {copy.reach.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-blue/25 text-[#8FA0FF]">
                      <MessageCircle aria-hidden="true" strokeWidth={2} className="h-3 w-3" />
                    </span>
                    <span className="text-small font-medium text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-small text-white/70">{copy.note}</p>
          </Reveal>
        </div>

        <ul className="mx-auto mt-6 grid max-w-[1120px] grid-cols-3 gap-2 sm:gap-4">
          {copy.stats.map((stat, i) => (
            <li key={stat.label}>
              <Reveal
                delay={i * 0.06}
                className="flex h-full flex-col items-center justify-center gap-1 rounded-lg bg-navy-card px-2 py-4 text-center shadow-lg ring-1 ring-white/10 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:px-6 sm:py-6"
              >
                <span className="whitespace-nowrap text-[22px] font-bold leading-none tabular-nums text-[#8FA0FF] sm:text-data">{stat.value}</span>
                <span className="text-[12px] leading-tight text-white/70 sm:text-body">{stat.label}</span>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <ScrollButton targetId="convert" label={copy.cta} section="busy_owners" />
        </div>
      </Container>
    </section>
  );
}
