import Image from "next/image";
import { offer, trust } from "@/content/copy";
import {
  suppliedCaseStudies,
  suppliedLogos,
  suppliedStats,
} from "@/content/clients";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * Trust bar — headline stats and a client logo wall.
 *
 * Comparable pages in this category open with "trusted by 700+ businesses" and
 * a logo carousel. That proof is earned. Until real values exist in
 * content/clients.ts this renders an honest one-line alternative instead of a
 * fabricated wall, and once logos are supplied it becomes the wall.
 */
export function TrustBar() {
  const stats = suppliedStats();
  const logos = suppliedLogos();
  const empty = stats.length === 0 && logos.length === 0;

  return (
    <section
      className={
        empty
          ? "border-b border-line bg-white py-5"
          : "border-b border-line bg-white py-8 lg:py-10"
      }
    >
      <Container>
        {stats.length > 0 && (
          <dl className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-small text-ink-soft">{stat.label}</dt>
                <dd className="mt-1 text-[28px] font-bold leading-none tabular-nums text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {logos.length > 0 ? (
          <>
            <p className="text-center text-micro uppercase text-ink-soft">
              {trust.logosHeading}
            </p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {logos.map((logo) => (
                <li key={logo.name}>
                  <Image
                    src={logo.src as string}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className="h-7 w-auto opacity-60 grayscale"
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          empty && (
            /* Nothing real to show yet, so this stays a compact single line
               rather than a large empty band pretending to be a logo wall. */
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-small text-ink-soft">
              <span className="flex items-center gap-2 font-semibold text-ink">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-fynd-green"
                />
                {`${offer.capacity.perMonth} accounts a month`}
              </span>
              <span aria-hidden="true" className="text-ink-soft">
                ·
              </span>
              {trust.emptyFallback}
            </p>
          )
        )}
      </Container>
    </section>
  );
}

/**
 * Case studies — "X reviews in Y months" with a quote.
 *
 * Renders nothing at all until real ones exist. An empty band is better than
 * an invented client.
 */
export function CaseStudies() {
  const items = suppliedCaseStudies();
  if (items.length === 0) return null;

  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Results</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">What it did for them.</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.business} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-lg border border-line bg-white p-6 lg:p-8">
                <p className="flex items-baseline gap-2">
                  <span className="text-[40px] font-bold leading-none tabular-nums text-ink">
                    {item.metric?.value}
                  </span>
                  <span className="text-body font-semibold text-ink">
                    {item.metric?.unit}
                  </span>
                </p>
                <p className="mt-1 text-small text-ink-soft">
                  {item.metric?.period}
                </p>

                <blockquote className="mt-5 border-t border-line pt-5 text-body text-ink">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-auto pt-5">
                  <p className="text-[15px] font-semibold text-ink">
                    {item.name ?? item.business}
                  </p>
                  <p className="mt-0.5 text-small text-ink-soft">
                    {item.name ? `${item.business} · ` : ""}
                    {item.trade}
                    {item.town ? ` · ${item.town}` : ""}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
