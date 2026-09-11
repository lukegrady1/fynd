import Image from "next/image";
import { watch } from "@/content/copy";
import {
  placeholderTestimonials,
  supplied,
  type Testimonial,
} from "@/content/testimonials";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { colors } from "@/lib/brand";
import { Reveal } from "./Reveal";

/**
 * The testimonial band on /watch — the design.md §9 card, in a grid.
 *
 * Reads the same real-quotes-only list as the Testimonials section on the
 * homepage. While that list is empty it falls back to the fictional
 * placeholders in `content/testimonials.ts`. The first real quote retires
 * the placeholders.
 */
export function TestimonialBand() {
  const real = supplied();
  const items = real.length > 0 ? real : placeholderTestimonials;
  if (items.length === 0) return null;

  const copy = watch.testimonials;

  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow variant="pill" className="mx-auto">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((t, i) => (
            <li key={t.business} className="flex">
              <Reveal delay={(i % 3) * 0.06} className="flex w-full">
                <TestimonialCard item={t} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * design.md "Testimonial card": Fynd Gray fill, 24px radius, 32px padding, a
 * large quote glyph in Fynd Blue at 30%, the quote in body weight, then a
 * 56px avatar with name and business.
 *
 * The star row only renders when the client's own rating is on record —
 * five green stars under a quote nobody rated would be a stat we made up.
 */
function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="relative flex w-full flex-col rounded-lg bg-fynd-gray p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-4 select-none font-sans text-[64px] font-bold leading-none text-fynd-blue/30"
      >
        &ldquo;
      </span>

      <blockquote className="relative mt-6 flex-1 text-body leading-[26px] text-ink">
        {item.quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar item={item} />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">
            {item.name ?? item.business}
          </p>
          <p className="truncate text-[13px] text-ink-soft">
            {item.name ? item.business : null}
            {item.name && item.town ? " · " : null}
            {item.town}
          </p>
        </div>
      </figcaption>

      {item.rating && <Stars count={item.rating} />}

      {item.stat && (
        <p className="mt-4 border-t border-line pt-4 text-small font-semibold tabular-nums text-ink">
          {`${item.stat.ratingFrom.toFixed(1)} → ${item.stat.ratingTo.toFixed(1)}`}
          <span className="ml-2 font-medium text-ink-soft">
            {`${item.stat.reviewsAdded} reviews added`}
          </span>
        </p>
      )}
    </figure>
  );
}

/** Profile portrait, business logo, or an initial on a navy disc. */
function Avatar({ item }: { item: Testimonial }) {
  if (item.portraitSrc) {
    return (
      <span className="flex h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line">
        <Image
          src={item.portraitSrc}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  if (item.logoSrc) {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-white">
        <Image
          src={item.logoSrc}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain p-1.5"
        />
      </span>
    );
  }

  const initial = (item.name ?? item.business).trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-[17px] font-semibold text-white"
    >
      {initial}
    </span>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <p
      className="mt-4 flex items-center gap-1"
      aria-label={`Rated ${count} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4"
          fill={i < count ? colors.green : "transparent"}
          stroke={colors.green}
          strokeWidth={1.75}
        >
          <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
        </svg>
      ))}
    </p>
  );
}
