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
export type BusyCopy = {
  eyebrow: string;
  heading: string;
  sub: string;
  question: string;
  questionSub: string;
  blocks: readonly { tone: "blue" | "orange"; title: string; body: string }[];
  todo: { title: string; sub: string; items: readonly string[] };
  reach: { title: string; sub: string; items: readonly string[] };
  note: string;
  stats: readonly { value: string; label: string }[];
  cta: string;
};

/**
 * `copy` defaults to /manage's; /watch passes its reviews-only version
 * (`watch.busy`) and gets the same section.
 */
export function BusyOwners({
  copy = manage.busy,
  targetId = "convert",
  tone = "dark",
}: {
  copy?: BusyCopy;
  targetId?: string;
  /** "dark" is /manage's navy; "light" is /watch's Fynd Gray with white cards. */
  tone?: "dark" | "light";
} = {}) {
  const dark = tone === "dark";

  return (
    <section className={cn("py-12 lg:py-20", dark ? "bg-navy text-white" : "bg-fynd-gray text-ink")}>
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <p className={cn("text-micro uppercase", dark ? "text-[#8FA0FF]" : "text-fynd-green-text")}>{copy.eyebrow}</p>
          <h2 className={cn("mt-3 text-h1", dark ? "text-white" : "text-ink")}>{copy.heading}</h2>
          <p className={cn("mx-auto mt-4 max-w-[720px] text-body lg:text-[18px] lg:leading-[28px]", dark ? "text-white/75" : "text-ink-soft")}>
            {copy.sub}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-[820px] text-center lg:mt-16">
          <h2 className={cn("text-h1 lg:text-[46px] lg:leading-[1.12]", dark ? "text-white" : "text-ink")}>
            {copy.question}
          </h2>
          <p className={cn("mx-auto mt-4 max-w-[680px] text-body lg:text-[18px] lg:leading-[28px]", dark ? "text-white/75" : "text-ink-soft")}>
            {copy.questionSub}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1120px] gap-6 lg:mt-14 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <Reveal
            className={cn(
              "rounded-lg border-2 border-fynd-blue p-6 lg:mt-14 lg:p-8",
              dark ? "bg-navy-card ring-1 ring-white/10 text-white shadow-lg" : "bg-white text-ink shadow-sm",
            )}
          >
            <div className="flex flex-col gap-7">
              {copy.blocks.map((block) => (
                <div
                  key={block.title}
                  className={cn(
                    "border-l-[3px] pl-5",
                    block.tone === "orange" ? "border-fynd-orange" : "border-fynd-blue",
                  )}
                >
                  <h3 className={cn("text-h3 lg:text-[22px]", dark ? "text-white" : "text-ink")}>{block.title}</h3>
                  <p className={cn("mt-2 text-body", dark ? "text-white/70" : "text-ink-soft")}>{block.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className={cn(
              "rounded-lg p-6 lg:p-7",
              dark ? "bg-navy-card ring-1 ring-white/10 text-white shadow-lg" : "border border-line bg-white text-ink shadow-sm",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fynd-blue text-white">
                <Sparkles aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
              </span>
              <div>
                <h3 className={cn("text-h3", dark ? "text-white" : "text-ink")}>{copy.todo.title}</h3>
                <p className={cn("mt-0.5 text-small", dark ? "text-white/70" : "text-ink-soft")}>{copy.todo.sub}</p>
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-2.5">
              {copy.todo.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", dark ? "bg-fynd-green/20" : "bg-fynd-green/15")}>
                    <Check aria-hidden="true" strokeWidth={3} className={cn("h-3 w-3", dark ? "text-fynd-green" : "text-fynd-green-text")} />
                  </span>
                  <span className={cn("text-small font-medium", dark ? "text-white" : "text-ink")}>{item}</span>
                </li>
              ))}
            </ul>

            <div className={cn("mt-5 rounded-md p-4", dark ? "bg-white/[0.06]" : "bg-fynd-gray")}>
              <p className={cn("text-small font-semibold", dark ? "text-white" : "text-ink")}>{copy.reach.title}</p>
              <p className={cn("mt-0.5 text-small", dark ? "text-white/70" : "text-ink-soft")}>{copy.reach.sub}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {copy.reach.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", dark ? "bg-fynd-blue/25 text-[#8FA0FF]" : "bg-fynd-blue/10 text-fynd-blue")}>
                      <MessageCircle aria-hidden="true" strokeWidth={2} className="h-3 w-3" />
                    </span>
                    <span className={cn("text-small font-medium", dark ? "text-white" : "text-ink")}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className={cn("mt-4 text-small", dark ? "text-white/70" : "text-ink-soft")}>{copy.note}</p>
          </Reveal>
        </div>

        <ul className="mx-auto mt-6 grid max-w-[1120px] grid-cols-3 gap-2 sm:gap-4">
          {copy.stats.map((stat, i) => (
            <li key={stat.label}>
              <Reveal
                delay={i * 0.06}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-4 text-center sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:px-6 sm:py-6",
                  dark ? "bg-navy-card shadow-lg ring-1 ring-white/10" : "border border-line bg-white shadow-sm",
                )}
              >
                <span className={cn("whitespace-nowrap text-[22px] font-bold leading-none tabular-nums sm:text-data", dark ? "text-[#8FA0FF]" : "text-fynd-blue")}>{stat.value}</span>
                <span className={cn("text-[12px] leading-tight sm:text-body", dark ? "text-white/70" : "text-ink-soft")}>{stat.label}</span>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <ScrollButton targetId={targetId} label={copy.cta} section="busy_owners" />
        </div>
      </Container>
    </section>
  );
}
