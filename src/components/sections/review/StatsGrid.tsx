import { statsSection } from "@/content/copy";
import { suppliedStats } from "@/content/stats";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Market-statistics grid.
 *
 * Renders nothing until content/stats.ts holds entries, and every entry must
 * carry a named source. Figures like "92% of consumers read reviews" are
 * everywhere, but printing one as fact without being able to point at the
 * study is exactly the thing a skeptical trades owner checks and holds
 * against you. The source is shown on the card, not buried.
 */
export function StatsGrid() {
  const items = suppliedStats();
  if (items.length === 0) return null;

  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow variant="pill">{statsSection.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-h1 text-ink">{statsSection.heading}</h2>
          <p className="mt-3 text-body text-ink-soft">{statsSection.sub}</p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[900px] gap-5 sm:grid-cols-2">
          {items.map((stat, i) => (
            <Reveal key={stat.value + stat.body} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-lg border border-line bg-white p-6 lg:p-7">
                <p className="text-[40px] font-bold leading-none tabular-nums text-fynd-blue">
                  {stat.value}
                </p>
                <p className="mt-3 text-body text-ink">{stat.body}</p>
                <p className="mt-auto pt-4 text-small text-ink-soft">
                  {stat.source}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
