"use client";

import { Clock, Star, TrendingUp } from "lucide-react";
import { profileSwap, results } from "@/content/copy";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ProfileSwap } from "./ProfileSwap";
import { Reveal } from "./Reveal";
import { DemoCta } from "./DemoCta";

/**
 * Results, in four centred tiers: the claim, the proof, the outcomes, the ask.
 *
 * This used to carry a product dashboard and a "how you compare" leaderboard,
 * both mocked up around a business that does not exist. They were removed
 * rather than restyled: the most credible thing on the page is a real Google
 * profile, and a prospect who catches one invented KPI two hundred pixels
 * under it stops believing the screenshots as well. Three figures that can
 * each name where they came from are worth more than a dashboard that cannot.
 *
 * The CTA is last. It used to live in a narrow left column, which left a
 * mostly empty gutter on desktop and, worse, put the button above the section
 * heading on mobile — asking before saying what the section is.
 *
 * Stays on navy so the hero, solution and results read as one dark chapter
 * rather than alternating light/dark blocks.
 */
export function ResultsSection({
  ctaLabel,
  targetId,
  withDemo,
}: {
  ctaLabel?: string;
  targetId?: string;
  withDemo?: boolean;
}) {
  const handleClick = () => {
    if (!targetId) return;
    track("cta_click", { cta: ctaLabel ?? results.cta, section: "results" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Any result still waiting on a real number renders nothing; all three
  // missing takes the heading with it.
  const shown = results.keyResults.items.filter((item) => item.value);

  return (
    <section className="bg-navy py-16 text-white lg:py-28">
      <Container>
        <Reveal className="mx-auto max-w-[660px] text-center">
          <Eyebrow tone="light" variant="pill">
            {results.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-white">{profileSwap.heading}</h2>
        </Reveal>

        {/* The real profile, alone and widest — nothing competes with it.
            ProfileSwap staggers its own reveal, so no wrapper here. */}
        <div className="mx-auto mt-12 max-w-[880px]">
          <ProfileSwap />
        </div>

        {shown.length > 0 && (
          <>
            <Reveal className="mt-16 text-center">
              <h3 className="text-h2 text-white">
                {results.keyResults.heading}
              </h3>
            </Reveal>

            <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
              {shown.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.08}>
                  <KeyResult item={item} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        {ctaLabel && targetId && (
          <Reveal className="mt-14 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleClick}
              className="flex h-14 w-full items-center justify-center rounded-sm bg-fynd-blue px-8 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:w-auto"
            >
              {ctaLabel}
            </button>
            {withDemo && <DemoCta section="results" />}
          </Reveal>
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const TONES: Record<string, { icon: string; value: string }> = {
  blue: {
    icon: "border-fynd-blue/25 bg-fynd-blue/[0.08] text-fynd-blue",
    value: "text-white",
  },
  green: {
    icon: "border-fynd-green/25 bg-fynd-green/[0.08] text-fynd-green",
    value: "text-fynd-green",
  },
  orange: {
    icon: "border-fynd-orange/25 bg-fynd-orange/[0.08] text-fynd-orange",
    value: "text-fynd-orange",
  },
};

/**
 * One headline outcome.
 *
 * The `basis` line is the point of the card, not a footnote — it is the part
 * a sceptical owner checks, and the reason this block can be believed where
 * the dashboard it replaced could not. Keep it directly under the figure and
 * never let a figure render without one.
 */
function KeyResult({
  item,
}: {
  item: (typeof results.keyResults.items)[number];
}) {
  const tone = TONES[item.tone] ?? TONES.blue;

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-navy-card p-6">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border",
          tone.icon,
        )}
      >
        <ResultIcon name={item.icon} />
      </span>

      <p
        className={cn(
          "mt-5 text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums",
          tone.value,
        )}
      >
        {item.value}
      </p>
      <p className="mt-2 text-body font-semibold text-white">{item.label}</p>

      <p className="mt-1.5 text-small text-white/45">{item.basis}</p>

      <p className="mt-4 border-t border-white/10 pt-4 text-small text-white/72">
        {item.body}
      </p>
    </div>
  );
}

function ResultIcon({ name }: { name: string }) {
  const props = {
    "aria-hidden": true as const,
    strokeWidth: 1.75,
    className: "h-5 w-5",
  };

  if (name === "star") return <Star {...props} />;
  if (name === "clock") return <Clock {...props} />;
  return <TrendingUp {...props} />;
}
