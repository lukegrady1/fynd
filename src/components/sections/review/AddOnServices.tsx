"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, MapPin, Sparkles } from "lucide-react";
import { addOnServices, demoCta } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { useBookingHref } from "./DemoCta";

/**
 * The other things owners ask for, under the pricing card.
 *
 * Fynd Gray between two white sections — pricing above and the feature grid
 * below are both white, so without a tone change this reads as a continuation
 * of the pricing card rather than a separate offer.
 *
 * Every card is one link to /demo, same as every other ask on the site.
 * Nothing here is priced (see the note in copy.ts) and none of it is
 * self-serve, so a card that looked buyable would be lying about what happens
 * when you click it.
 */
export function AddOnServices() {
  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[560px] text-center">
          <Eyebrow variant="pill">{addOnServices.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">{addOnServices.heading}</h2>
          <p className="measure mx-auto mt-3 text-body text-ink-soft">
            {addOnServices.sub}
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-6">
          {addOnServices.items.map((item, i) => (
            <li key={item.title} className="flex">
              <Reveal delay={i * 0.08} className="flex w-full">
                <ServiceCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const TONES: Record<string, string> = {
  blue: "border-fynd-blue/25 bg-fynd-blue/[0.07] text-fynd-blue",
  green: "border-fynd-green/25 bg-fynd-green/[0.07] text-fynd-green-text",
  orange: "border-fynd-orange/25 bg-fynd-orange/[0.07] text-fynd-orange",
};

type ServiceItem = (typeof addOnServices.items)[number] & {
  href?: string;
  ctaLabel?: string;
};

const cardClass =
  "group flex h-full w-full flex-col rounded-lg border border-line bg-white p-5 transition-all duration-250 ease-fynd hover:-translate-y-1 hover:border-fynd-blue/40 hover:shadow-lg hover:shadow-ink/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-6 lg:p-7";

function ServiceCard({ item }: { item: ServiceItem }) {
  const bookingHref = useBookingHref(addOnServices.href);
  const ctaLabel = item.ctaLabel ?? addOnServices.ctaLabel;
  const onClick = () =>
    track("cta_click", { cta: ctaLabel, section: `addon_${item.icon}` });

  // An add-on with a page of its own stays in this tab: it is part of the
  // site, not a booking form the visitor might want to keep the page behind.
  if (item.href) {
    return (
      <Link href={item.href} onClick={onClick} className={cardClass}>
        <CardBody item={item} ctaLabel={ctaLabel} external={false} />
      </Link>
    );
  }

  return (
    // The whole card is the link, and each one's text differs, so the three
    // read as three distinct destinations rather than three identical ones.
    <a
      href={bookingHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cardClass}
    >
      <CardBody item={item} ctaLabel={ctaLabel} external />
    </a>
  );
}

function CardBody({
  item,
  ctaLabel,
  external,
}: {
  item: ServiceItem;
  ctaLabel: string;
  external: boolean;
}) {
  return (
    <>
      {/* Icon beside the title on a phone, above it from md. Stacked, three
          cards run ~300px each and the section becomes a 1300px scroll for
          three sentences; inline, the icon costs no vertical space at all. */}
      <span className="flex items-center gap-3 md:block">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border md:h-11 md:w-11",
            TONES[item.tone] ?? TONES.blue,
          )}
        >
          <ServiceIcon name={item.icon} />
        </span>

        <span className="block text-h3 text-ink md:mt-5">{item.title}</span>
      </span>

      {/* flex-1 on the body, not mt-auto on the footer: mt-auto collapses to
          zero when the cards happen to have equal content, which put the rule
          hard against the last line of text. Letting the body absorb the slack
          keeps the gap fixed and still lands the three footers on one line. */}
      <span className="mt-3 block text-body text-ink-soft md:mt-2 md:flex-1">
        {item.body}
      </span>

      <span className="mt-4 flex items-center gap-1.5 border-t border-line pt-3.5 text-small font-semibold text-fynd-blue md:mt-5 md:pt-4">
        {ctaLabel}
        {external ? (
          <>
            <span className="sr-only"> ({demoCta.newTabHint})</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
            />
          </>
        ) : (
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
          />
        )}
      </span>
    </>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const props = {
    "aria-hidden": true as const,
    strokeWidth: 1.75,
    className: "h-5 w-5",
  };

  if (name === "map") return <MapPin {...props} />;
  if (name === "custom") return <Sparkles {...props} />;
  return <Globe {...props} />;
}
