"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { demoCta, integrations } from "@/content/copy";
import { LogoMark } from "@/components/brand/Logo";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Platform = (typeof integrations.platforms)[number];

/** Widest the ring is ever drawn. Paired with the wrapper's own max width. */
const RING_MAX = 820;

/**
 * Smallest a platform card is allowed to get before the ring sheds one.
 *
 * Below roughly this the wordmarks stop being logos and start being smudges.
 * It is the only tuning knob here: everything else falls out of the geometry.
 */
const MIN_CARD_PX = 92;

/** Server render and no-JS both get this, so the narrow case is the safe one. */
const BASE_RING = 4;
const MIN_RING = 4;

/**
 * Width of the ring's own column, in px.
 *
 * A media query cannot answer this. The ring sits in a 0.66fr column on
 * desktop and spans the full container below `lg`, so the *same* viewport
 * hands it two very different boxes — at 1023px it gets 820px of room, at
 * 1024px it gets 623px. Sizing the ring off the viewport meant it grew
 * platforms as its box shrank. Measure the element instead.
 */
const useBoxWidth = (ref: RefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
};

/**
 * The largest ring this box can hold.
 *
 * Card width is a fixed fraction of the box at every count, so "does thirteen
 * fit?" reduces to "is thirteen cards' share of this box still readable?".
 * Walking down one platform at a time — rather than in the old 13/10/8/6/4
 * jumps — is what makes it read as the desktop drawing scaling down: the
 * cards stay the same physical size all the way, and the ring quietly hands
 * its tail to the grid underneath one logo at a time.
 */
const fitCount = (boxWidth: number, total: number) => {
  for (let n = total; n > MIN_RING; n -= 1) {
    if ((boxWidth * cardWidth(n)) / 100 >= MIN_CARD_PX) return n;
  }
  return MIN_RING;
};

/* ------------------------------------------------------------------ */

/**
 * Booking-platform integrations, drawn as a ring around the Fynd mark.
 *
 * Everything inside the ring is sized in container-query units, so the whole
 * diagram scales with its column instead of switching between a desktop
 * drawing and a mobile one. Card width is derived from the chord between
 * neighbours at the current count, which is what keeps four large cards and
 * thirteen small ones both correct.
 *
 * Logos degrade: if a file is missing the card shows the platform name as a
 * wordmark rather than a broken image.
 */
export function BookingIntegrations() {
  const { heading, fallback } = integrations;

  const columnRef = useRef<HTMLDivElement>(null);
  const boxWidth = useBoxWidth(columnRef);
  const ringCount =
    boxWidth === null
      ? BASE_RING
      : fitCount(Math.min(boxWidth, RING_MAX), integrations.platforms.length);

  const inRing = integrations.platforms.slice(0, ringCount);
  const rest = integrations.platforms.slice(ringCount);

  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-24">
      <Glow />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:mr-[calc(50%-50vw+1rem)] lg:grid-cols-[0.34fr_0.66fr] lg:gap-10">
          <Reveal>
            <Eyebrow tone="light" variant="pill">
              {integrations.eyebrow}
            </Eyebrow>

            <h2 className="mt-5 max-w-[430px] text-h1 text-white lg:text-[42px] lg:leading-[1.1]">
              {heading.lead}{" "}
              <span className="text-fynd-green">{heading.accent}</span>{" "}
              {heading.tail}
            </h2>

            <p className="measure mt-5 text-body text-white/70">
              {integrations.sub}
            </p>

            <p className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-small font-semibold text-fynd-green">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-fynd-green/60">
                <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3" />
              </span>
              {integrations.badge}
            </p>
          </Reveal>

          <div ref={columnRef} className="w-full">
            <Ring platforms={inRing} />

            {rest.length > 0 && (
              <div className="mt-10">
                <p className="text-center text-small text-white/50">
                  {integrations.moreHeading}
                </p>
                {/* Wrapped and centred rather than a plain grid: the number
                    of leftovers now changes one at a time with the width, so
                    this list is regularly 1, 2 or 7 long. A grid strands the
                    odd one at the left edge; centring makes every count — a
                    lone card included — look deliberate. */}
                <ul className="mt-4 flex flex-wrap justify-center gap-3">
                  {rest.map((platform) => (
                    <li
                      key={platform.name}
                      className="flex min-h-[68px] w-[calc(50%-0.375rem)] max-w-[220px] items-center justify-center rounded-md border border-white/10 bg-navy-card p-3 sm:w-[calc(33.333%-0.5rem)]"
                    >
                      <PlatformLogo platform={platform} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Reveal className="mt-14 flex flex-col items-start gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-white/70">
            <span className="font-semibold text-white">{fallback.lead}</span>{" "}
            {fallback.body}
          </p>
          {/* An in-page anchor now that the calendar lives on this page. */}
          <Link
            href={`#${demoCta.anchor}`}
            className="group inline-flex shrink-0 items-center gap-2 text-body font-semibold text-fynd-green underline-offset-4 hover:underline"
          >
            {fallback.ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

/** Radius of the ring, as a percentage of the square graph box. */
const RING_R = 33;

/**
 * Card width for a given count, in container-query units.
 *
 * Derived from the chord between neighbouring cards — 2R·sin(π/n) — at 88% so
 * there is always a visible gap. The cap is not cosmetic: a card is centred on
 * the ring, so RING_R + width/2 must stay inside the box or the left and right
 * cards clip against the edges. 2·(50 − RING_R) is that limit, less a little.
 */
const MAX_CARD_W = 2 * (50 - RING_R) - 1;

const cardWidth = (count: number) =>
  Math.min(MAX_CARD_W, 0.88 * 2 * RING_R * Math.sin(Math.PI / count));

const ringPosition = (index: number, total: number) => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: 50 + RING_R * Math.cos(angle),
    y: 50 + RING_R * Math.sin(angle),
  };
};

function Ring({ platforms }: { platforms: readonly Platform[] }) {
  const count = platforms.length;
  const w = cardWidth(count);

  return (
    <div
      // maxWidth here rather than a class: `fitCount` clamps the measured
      // column to the same number, and a drift between the two would size the
      // cards against a box the ring never actually gets.
      style={{ containerType: "inline-size", maxWidth: RING_MAX }}
      className="relative mx-auto w-full"
    >
      <div className="relative aspect-square w-full">
        {[92, 74, 56].map((size, i) => (
          <span
            key={size}
            aria-hidden="true"
            style={{ width: `${size}cqw`, height: `${size}cqw` }}
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed",
              ["border-fynd-blue/10", "border-fynd-green/12", "border-fynd-blue/16"][i],
            )}
          />
        ))}

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            {/* userSpaceOnUse, not the default objectBoundingBox: the wire to
                the card at the top of the ring is perfectly vertical, so its
                bounding box has zero width, and a gradient measured against a
                zero-width box makes the line vanish entirely. */}
            {(["blue", "green"] as const).map((tone) => (
              <linearGradient
                key={tone}
                id={`bi-wire-${tone}`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
              >
                <stop offset="0%" stopColor="var(--color-fynd-blue)" />
                <stop
                  offset="100%"
                  stopColor={
                    tone === "green"
                      ? "var(--color-fynd-green)"
                      : "var(--color-fynd-blue2)"
                  }
                />
              </linearGradient>
            ))}
          </defs>

          {platforms.map((platform, i) => {
            const { x, y } = ringPosition(i, count);
            return (
              <line
                key={platform.name}
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke={`url(#bi-wire-${i % 3 === 0 ? "green" : "blue"})`}
                strokeWidth="0.16"
                strokeDasharray={i % 2 ? "0.5 0.35" : undefined}
                opacity="0.7"
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Hub />
        </div>

        {platforms.map((platform, i) => {
          const { x, y } = ringPosition(i, count);
          return (
            <div
              key={platform.name}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}cqw`,
                height: `${w * 0.46}cqw`,
              }}
              className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/12 bg-navy-card/90 p-[1.6cqw] shadow-lg shadow-black/20 backdrop-blur-sm transition-colors duration-200 ease-fynd hover:border-fynd-green/40 hover:bg-navy-card"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-full h-[1.4cqw] w-[1.4cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fynd-blue shadow-[0_0_12px_rgba(76,91,255,0.9)] transition-colors duration-200 group-hover:bg-fynd-green"
              />
              <PlatformLogo platform={platform} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Hub() {
  return (
    <div className="relative flex h-[26cqw] w-[26cqw] items-center justify-center rounded-full bg-navy">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-fynd-blue via-fynd-blue2 to-fynd-green p-[2px] shadow-[0_0_46px_rgba(76,91,255,0.25)]"
      >
        <span className="block h-full w-full rounded-full bg-navy" />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-[18%] rounded-full bg-fynd-blue/[0.06] blur-xl"
      />
      <LogoMark className="relative z-10 h-[11cqw] w-auto" sizes="120px" />
    </div>
  );
}

/**
 * The official mark, or the platform name if that file is not in
 * /public/integrations. Falling back on the error event rather than a
 * hardcoded list means dropping a file in is the only step needed.
 */
function PlatformLogo({ platform }: { platform: Platform }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="text-center text-[13px] font-semibold tracking-[-0.01em] text-white/85">
        {platform.name}
      </span>
    );
  }

  return (
    <Image
      src={platform.logo}
      alt={platform.name}
      width={280}
      height={84}
      // A bounded hint. Without one the browser can pick the 3840px candidate
      // for a card barely 150px wide.
      sizes="180px"
      onError={() => setMissing(true)}
      className="max-h-full w-auto max-w-full object-contain"
    />
  );
}

function Glow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-[62%] top-[24%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fynd-blue/[0.07] blur-[150px]" />
      <span className="absolute right-[6%] top-[38%] h-[420px] w-[420px] rounded-full bg-fynd-green/[0.05] blur-[140px]" />
    </div>
  );
}
