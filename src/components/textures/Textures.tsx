import { cn } from "@/lib/utils";
import { colors } from "@/lib/brand";
import type { ReactNode } from "react";

/**
 * Signature background: a world map rendered as a field of low-contrast dots
 * on navy, with colored map pins dropped on it. Dots stay dim so headline
 * text above stays readable.
 */
export function DottedWorldMap({
  className,
  pins = defaultPins,
}: {
  className?: string;
  pins?: Pin[];
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1000 500"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="fynd-map-mask">
            <rect width="1000" height="500" fill="black" />
            {landmasses.map((d, i) => (
              <path key={i} d={d} fill="white" />
            ))}
          </mask>
          <pattern
            id="fynd-map-dots"
            width="11"
            height="11"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2.4" cy="2.4" r="2.1" fill="#8FA0FF" fillOpacity="0.26" />
          </pattern>
          <radialGradient id="fynd-map-fade" cx="50%" cy="45%" r="62%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fynd-map-edge">
            <rect width="1000" height="500" fill="url(#fynd-map-fade)" />
          </mask>
        </defs>

        <g mask="url(#fynd-map-edge)">
          <rect
            width="1000"
            height="500"
            fill="url(#fynd-map-dots)"
            mask="url(#fynd-map-mask)"
          />
        </g>

      </svg>

      {/* Pins live in their own percentage-positioned layer: the map's 2:1
          viewBox gets sliced at wide aspect ratios, so viewBox coordinates
          can't be trusted to stay clear of the headline.
          Below lg the hero stacks and content fills the box, leaving no safe
          band — so the dot map carries those sizes on its own. */}
      <div className="absolute inset-0 hidden lg:block">
        {pins.map((p, i) => (
          <MapPin key={i} pin={p} delay={i * 0.45} />
        ))}
      </div>
    </div>
  );
}

type Pin = {
  /** Position as a percentage of the hero box. */
  left: number;
  top: number;
  color: string;
};

function MapPin({ pin, delay }: { pin: Pin; delay: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-full"
      style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
    >
      <span className="relative block h-6 w-[18px]">
        <span
          className="pin-pulse absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
          style={{ background: pin.color, animationDelay: `${delay}s` }}
        />
        <svg viewBox="0 0 18 24" className="relative h-6 w-[18px]">
          <path
            d="M9 0C4 0 0 4 0 9c0 6.8 9 15 9 15s9-8.2 9-15c0-5-4-9-9-9Z"
            fill={pin.color}
          />
          <circle cx="9" cy="9" r="3.2" fill={colors.navy} />
        </svg>
      </span>
    </span>
  );
}

/** Pins sit in the band below the nav and above the headline, plus a lower band. */
const defaultPins: Pin[] = [
  { left: 11, top: 27, color: colors.blue },
  { left: 29, top: 21, color: colors.orange },
  { left: 47, top: 18, color: colors.green },
  { left: 63, top: 24, color: colors.blue },
  { left: 88, top: 20, color: colors.green },
  { left: 19, top: 94, color: colors.green },
  { left: 41, top: 97, color: colors.blue },
  { left: 73, top: 95, color: colors.orange },
];

/**
 * Simplified continent silhouettes — the map is decorative texture, so these
 * are stylized blocks rather than a survey-accurate projection.
 */
const landmasses = [
  // North America
  "M120 92c34-14 96-20 150-8 26 6 34 22 24 38-8 13-30 14-38 26-8 13 4 26-4 38-10 15-34 22-46 40-10 15-8 34-22 40-13 6-24-8-30-24-8-22-22-40-30-64-8-22-18-44-18-62 0-14 6-20 14-24Z",
  // Central + South America
  "M258 214c14-6 30 2 34 14 4 14-6 24-2 36 4 14 18 20 20 36 3 22-6 46-16 68-9 20-24 40-36 38-13-2-16-24-18-44-2-24-8-46-6-68 2-20 8-40 12-56 3-12 6-22 12-24Z",
  // Europe
  "M470 92c26-8 60-8 84 0 14 5 16 18 8 26-8 8-24 8-28 18-4 11 6 20 0 28-7 9-24 8-38 12-16 5-30 16-42 12-11-4-12-20-10-36 2-18 8-38 12-48 3-8 8-10 14-12Z",
  // Africa
  "M470 186c22-8 52-6 72 2 14 6 14 20 10 34-4 15-12 30-12 46 0 18 6 38-2 54-8 15-26 24-38 18-12-6-14-26-20-44-7-20-18-38-22-58-4-18-4-38 0-46 3-5 7-6 12-6Z",
  // Asia
  "M600 78c58-14 140-16 196 0 30 8 44 26 36 42-8 15-36 16-46 30-9 13 0 30-10 42-11 14-34 16-52 26-20 11-36 30-52 26-14-4-16-24-24-42-9-20-24-36-32-56-8-19-14-40-16-52-2-10 0-14 0-16Z",
  // SE Asia + Indonesia
  "M742 268c16-6 34 0 38 10 4 11-6 18-16 22-12 5-28 6-34 0-6-7-2-18 4-24 3-4 6-7 8-8Z",
  "M790 286c14-4 28 2 30 10 2 9-8 14-20 16-12 2-24 0-26-8-2-9 8-16 16-18Z",
  // Australia
  "M800 320c30-10 66-8 84 4 14 9 14 28 4 42-11 15-32 24-52 24-22 0-42-10-48-26-6-17 0-38 12-44Z",
];

/** Gradient block — blue→green mesh, always in a 24px-radius container. */
export function GradientBlock({
  className,
  children,
  variant = "mesh",
}: {
  className?: string;
  children?: ReactNode;
  variant?: "mesh" | "blue" | "green";
}) {
  const bg = {
    mesh: "bg-grad-mesh",
    blue: "bg-grad-blue",
    green: "bg-grad-green",
  }[variant];

  return (
    <div className={cn("relative overflow-hidden rounded-lg", bg, className)}>
      {children}
    </div>
  );
}

/** Dot grid — one texture per section, never stacked with another. */
export function DotGrid({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        tone === "dark" ? "tex-dots-dark" : "tex-dots",
        className,
      )}
    />
  );
}

/** Topographic contour lines. */
export function TopoLines({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        tone === "dark" ? "tex-topo-dark" : "tex-topo-light",
        className,
      )}
    />
  );
}
