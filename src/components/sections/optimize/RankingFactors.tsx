import { Crosshair, MapPin, Sparkles } from "lucide-react";
import { optimize } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { cn } from "@/lib/utils";

/**
 * Why the list matters, before the list: Google's own three local ranking
 * factors, one card each. Distance is drawn muted because there is nothing
 * to do about it; the other two name the checklist items that feed them,
 * so the reader arrives at the fourteen already knowing what each is for.
 *
 * Icons in the four-pillar style (48px circle, 1.5px ring in the icon's own
 * color). Blue, then green, for the two the profile controls; the one it
 * doesn't is ink-soft on a plain ring.
 */
export function RankingFactors() {
  const copy = optimize.ranking;

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <h2 className="text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
          <p className="measure mx-auto mt-4 text-body text-ink-soft">
            {copy.sub}
          </p>
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3 md:gap-6 lg:mt-14">
          {copy.factors.map((factor, i) => {
            const look = looks[factor.key];
            return (
              <li key={factor.key} className="flex">
                <Reveal
                  delay={i * 0.08}
                  className={cn(
                    "flex w-full flex-col rounded-md border bg-white p-6 shadow-sm lg:p-7",
                    factor.yours ? "border-line" : "border-dashed border-line",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-[1.5px]",
                      look.ring,
                    )}
                  >
                    <look.Icon strokeWidth={1.75} className={cn("h-5 w-5", look.icon)} />
                  </span>

                  <h3 className="mt-5 text-h3 text-ink">{factor.name}</h3>
                  <p className="mt-1.5 text-body text-ink-soft">{factor.what}</p>

                  <p className="mt-auto border-t border-line pt-4">
                    <span
                      className={cn(
                        "block text-micro uppercase",
                        factor.yours ? "text-fynd-green-text" : "text-ink-muted",
                      )}
                    >
                      {factor.yours ? copy.yoursLabel : copy.notYoursLabel}
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 block text-small font-medium",
                        factor.yours ? "text-ink" : "text-ink-soft",
                      )}
                    >
                      {factor.onProfile}
                    </span>
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

const looks = {
  relevance: {
    Icon: Crosshair,
    ring: "border-fynd-blue/40 bg-fynd-blue/5",
    icon: "text-fynd-blue",
  },
  distance: {
    Icon: MapPin,
    ring: "border-line bg-fynd-gray",
    icon: "text-ink-soft",
  },
  prominence: {
    Icon: Sparkles,
    ring: "border-fynd-green/50 bg-fynd-green/5",
    icon: "text-fynd-green-text",
  },
} as const;
