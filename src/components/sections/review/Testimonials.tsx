import { testimonialsSection } from "@/content/copy";
import { supplied } from "@/content/testimonials";
import { Container } from "@/components/ui/Layout";
import { colors } from "@/lib/brand";
import { Reveal } from "./Reveal";

/**
 * Renders only quotes Luke has actually supplied. If none are filled in, the
 * whole section renders nothing — an empty testimonial band is better than an
 * invented one.
 */
export function Testimonials() {
  const items = supplied();
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <Reveal>
          <h2 className="text-h2 text-ink">{testimonialsSection.heading}</h2>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.business} delay={i * 0.06}>
              <figure className="h-full rounded-md border border-line bg-white p-6">
                <blockquote className="text-body text-ink">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-5 border-t border-line pt-4">
                  <p className="text-[15px] font-semibold text-ink">
                    {t.name ?? t.business}
                  </p>
                  <p className="mt-0.5 text-small text-ink-soft">
                    {t.name ? t.business : null}
                    {t.name && t.town ? " · " : null}
                    {t.town}
                  </p>

                  {t.stat && (
                    <p className="mt-3 flex items-center gap-2 text-small font-semibold tabular-nums text-ink">
                      <StarMark />
                      {`${t.stat.ratingFrom.toFixed(1)} → ${t.stat.ratingTo.toFixed(1)}`}
                      <span className="font-medium text-ink-soft">
                        {`${t.stat.reviewsAdded} reviews added`}
                      </span>
                    </p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StarMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill={colors.green}
    >
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}
