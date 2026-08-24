"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { integrations } from "@/content/copy";
import { LogoMark } from "@/components/brand/Logo";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Platform = (typeof integrations.platforms)[number];

/**
 * How many platforms orbit the mark at each width.
 *
 * The ring is geometry, not styling: thirteen cards need roughly 800px to sit
 * apart, four need almost none. So the count steps down with the viewport and
 * whatever does not fit drops into the grid underneath — the same platforms,
 * a form that survives a narrow screen.
 *
 * Ordered widest first; the first match wins.
 */
const RING_STEPS = [
  { min: 1280, count: 13 },
  { min: 1024, count: 10 },
  { min: 768, count: 8 },
  { min: 640, count: 6 },
] as const;

/** Server render and no-JS both get this, so the narrow case is the safe one. */
const BASE_RING = 4;

const useRingCount = () => {
  const store = useMemo(() => {
    const queries = RING_STEPS.map((step) => ({
      count: step.count,
      mql:
        typeof window === "undefined"
          ? null
          : window.matchMedia(`(min-width: ${step.min}px)`),
    }));

    return {
      subscribe: (onChange: () => void) => {
        queries.forEach((q) => q.mql?.addEventListener("change", onChange));
        return () =>
          queries.forEach((q) => q.mql?.removeEventListener("change", onChange));
      },
      getSnapshot: () =>
        queries.find((q) => q.mql?.matches)?.count ?? BASE_RING,
      getServerSnapshot: () => BASE_RING,
    };
  }, []);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
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
  const ringCount = useRingCount();

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

          <div className="w-full">
            <Ring platforms={inRing} />

            {rest.length > 0 && (
              <div className="mt-10">
                <p className="text-center text-small text-white/50">
                  {integrations.moreHeading}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {rest.map((platform) => (
                    <li
                      key={platform.name}
                      className="flex min-h-[68px] items-center justify-center rounded-md border border-white/10 bg-navy-card p-3"
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
          <Link
            href="/call"
            className="group inline-flex shrink-0 items-center gap-2 text-body font-semibold text-fynd-green underline-offset-4 hover:underline"
          >
            {fallback.ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
            />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-12 sm:grid-cols-2 xl:grid-cols-4">
          {integrations.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05} className="flex gap-4">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-md border",
                  TONES[feature.tone],
                )}
              >
                <FeatureIcon name={feature.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  {feature.title}
                </p>
                <p className="mt-1 text-small text-white/60">{feature.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const TONES: Record<string, string> = {
  blue: "border-fynd-blue/25 bg-fynd-blue/[0.06] text-fynd-blue",
  green: "border-fynd-green/25 bg-fynd-green/[0.06] text-fynd-green",
  orange: "border-fynd-orange/25 bg-fynd-orange/[0.06] text-fynd-orange",
  blue2: "border-fynd-blue2/25 bg-fynd-blue2/[0.06] text-fynd-blue2",
};

/* ------------------------------------------------------------------ */

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
      style={{ containerType: "inline-size" }}
      className="relative mx-auto w-full max-w-[820px]"
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

function FeatureIcon({ name }: { name: string }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  if (name === "sync") {
    return (
      <svg {...props}>
        <path d="M20 7h-5V2M4 17h5v5" />
        <path d="M5.1 9A7 7 0 0 1 17 5l3 2M18.9 15A7 7 0 0 1 7 19l-3-2" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M13 2 3 14h8l-1 8 11-13h-8V2Z" />
    </svg>
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
