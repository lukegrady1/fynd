import { optimize } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { cn } from "@/lib/utils";
import { GoogleProfile } from "./GoogleProfile";

/**
 * Typical beside optimized, the full card each time.
 *
 * Side by side at md so each row lines up with its counterpart — "No
 * services listed." directly across from four service chips is the whole
 * argument. Stacked on a phone, typical first, so the finished one is what
 * the reader arrives at. Orange dots on the gaps, green checks on the fills.
 */
export function ProfileCompare() {
  const copy = optimize.compare;
  const p = optimize.profile;

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

        <div className="mx-auto mt-10 grid max-w-[880px] gap-10 md:grid-cols-2 md:gap-8">
          <Reveal>
            <Caption tone="orange">{p.typicalLabel}</Caption>
            <GoogleProfile state="typical" className="mt-3 w-full" />
          </Reveal>
          <Reveal delay={0.12}>
            <Caption tone="green">{p.optimizedLabel}</Caption>
            <GoogleProfile state="optimized" className="mt-3 w-full" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Caption({
  tone,
  children,
}: {
  tone: "orange" | "green";
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-micro uppercase text-ink-soft">
      <span
        aria-hidden="true"
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          tone === "orange" ? "bg-fynd-orange" : "bg-fynd-green",
        )}
      />
      {children}
    </p>
  );
}
