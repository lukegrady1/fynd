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
 * doesn't is ink-soft on a plain ring. On phones each card is a row,
 * icon beside the text, so three of them don't run a screen and a half.
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
                    "flex w-full gap-4 rounded-md border bg-white p-5 shadow-sm md:flex-col md:p-6 lg:p-7",
                    factor.yours ? "border-line" : "border-dashed border-line",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] md:h-12 md:w-12",
                      look.ring,
                    )}
                  >
                    <look.Icon
                      strokeWidth={1.75}
                      className={cn("h-5 w-5", look.icon)}
                    />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-h3 text-ink md:mt-5">{factor.name}</h3>
                    <p className="mt-1 text-small font-medium text-ink-soft md:mt-1.5 md:text-body">
                      {factor.what}
                    </p>

                    <p className="mt-3 border-t border-line pt-3 md:mt-auto md:pt-4">
                      <span
                        className={cn(
                          "block text-micro uppercase",
                          factor.yours
                            ? "text-fynd-green-text"
                            : "text-ink-muted",
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
                  </div>
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
