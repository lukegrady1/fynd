"use client";

import { useState } from "react";
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
 * Ring geometry, as percentages of the graph box.
 *
 * Computed rather than authored: at 13 platforms the bottom of the arc is the
 * tight spot, and hand-placed coordinates put three pairs of cards on top of
 * each other. Even angular spacing at this radius leaves roughly 14px between
 * neighbours there, and adding a platform re-spaces the ring automatically.
 */
const RING_RX = 40.5;
const RING_RY = 44;
const CARD_W = 132;

const ringPosition = (index: number, total: number) => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: 50 + RING_RX * Math.cos(angle),
    y: 50 + RING_RY * Math.sin(angle),
  };
};

/**
 * Booking-platform integrations, drawn as a ring around the Fynd mark.
 *
 * The radial graph is desktop only. Thirteen absolutely-positioned cards need
 * roughly 700px of width to avoid overlapping, so below lg the same platforms
 * render as a plain grid — which is also the more useful form on a phone,
 * where the reader is scanning for their own platform rather than admiring a
 * diagram.
 *
 * Logos degrade: if the file for a platform is not in /public/integrations
 * yet, the card shows the platform name set as a wordmark instead of a broken
 * image, and starts showing the real mark the moment the file appears.
 */
export function BookingIntegrations() {
  const { heading, fallback } = integrations;

  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-24">
      <Glow />

      <Container className="relative">
        {/* The ring needs more width than the 1200px container allows, so the
            grid bleeds its right edge toward the viewport. Bleeding right only
            keeps the heading aligned with every other section on the page. */}
        <div className="grid items-center gap-14 lg:mr-[calc(50%-50vw+1rem)] lg:grid-cols-[0.34fr_0.66fr] lg:gap-10">
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

          {/* Desktop: the ring. */}
          <div className="relative hidden min-h-[700px] lg:block">
            <Network />
          </div>

          {/* Below lg: the same platforms, scannable. */}
          <div className="lg:hidden">
            <div className="flex justify-center">
              <Hub compact />
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {integrations.platforms.map((platform) => (
                <li
                  key={platform.name}
                  className="flex min-h-[76px] items-center justify-center rounded-md border border-white/10 bg-navy-card p-4"
                >
                  <PlatformLogo platform={platform} />
                </li>
              ))}
            </ul>
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

function Glow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-[62%] top-[24%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fynd-blue/[0.07] blur-[150px]" />
      <span className="absolute right-[6%] top-[38%] h-[420px] w-[420px] rounded-full bg-fynd-green/[0.05] blur-[140px]" />
    </div>
  );
}

/** The ring: dashed orbits, connectors from the hub, and the platform cards. */
function Network() {
  return (
    <div className="absolute inset-0">
      {[560, 440, 330].map((size, i) => (
        <span
          key={size}
          aria-hidden="true"
          style={{ width: size, height: size }}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed",
            [
              "border-fynd-blue/10",
              "border-fynd-green/12",
              "border-fynd-blue/16",
            ][i],
          )}
        />
      ))}

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="bi-wire-blue">
            <stop offset="0%" stopColor="var(--color-fynd-blue)" />
            <stop offset="100%" stopColor="var(--color-fynd-blue2)" />
          </linearGradient>
          <linearGradient id="bi-wire-green">
            <stop offset="0%" stopColor="var(--color-fynd-blue)" />
            <stop offset="100%" stopColor="var(--color-fynd-green)" />
          </linearGradient>
        </defs>

        {integrations.platforms.map((platform, i) => {
          const { x, y } = ringPosition(i, integrations.platforms.length);
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

      {integrations.platforms.map((platform, i) => {
        const { x, y } = ringPosition(i, integrations.platforms.length);
        return (
          <div
            key={platform.name}
            style={{ left: `${x}%`, top: `${y}%`, width: CARD_W }}
            className="group absolute z-10 flex h-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/12 bg-navy-card/90 p-2.5 shadow-lg shadow-black/20 backdrop-blur-sm transition-colors duration-200 ease-fynd hover:border-fynd-green/40 hover:bg-navy-card"
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fynd-blue shadow-[0_0_12px_rgba(76,91,255,0.9)] transition-colors duration-200 group-hover:bg-fynd-green"
            />
            <PlatformLogo platform={platform} />
          </div>
        );
      })}
    </div>
  );
}

function Hub({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-navy",
        compact ? "h-32 w-32" : "h-[200px] w-[200px]",
      )}
    >
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
      <LogoMark
        className={cn("relative z-10", compact ? "h-14" : "h-20")}
        sizes={compact ? "56px" : "80px"}
      />
    </div>
  );
}

/**
 * Renders the official mark, or the platform name if that file is not in
 * /public/integrations yet. Falling back on the error event rather than on a
 * hardcoded list means dropping the file in is the only step needed.
 */
function PlatformLogo({ platform }: { platform: Platform }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="text-center text-[15px] font-semibold tracking-[-0.01em] text-white/85">
        {platform.name}
      </span>
    );
  }

  const image = (
    <Image
      src={platform.logo}
      alt={platform.name}
      width={280}
      height={84}
      sizes="120px"
      onError={() => setMissing(true)}
      className="max-h-9 w-auto max-w-full object-contain"
    />
  );

  // A dark-on-light mark would vanish against navy, so it sits on a light
  // chip — what the brand's own guidelines would ask for — rather than being
  // recoloured to fit.
  return "light" in platform && platform.light ? (
    <span className="flex w-full items-center justify-center rounded-sm bg-white px-2 py-1.5">
      {image}
    </span>
  ) : (
    image
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
