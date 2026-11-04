import type { CSSProperties } from "react";
import {

  FileText,
  Image as ImageIcon,
  MessageSquare,
  MousePointer2,
  Phone,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { MarkSvg, type Brand } from "./ChannelLogos";
import { LiveShop } from "./LiveShop";
import { ScrollButton } from "./ScrollButton";

/**
 * "Your business. Everywhere." — the navy panel, drawn the way the
 * platform draws it: the business card in the middle (the storefront,
 * a "Booked!" slip, a rising customer count, the Fynd team pill under
 * it) and eleven channels on a ring around it, each as its real mark
 * on a pale tile. Small "packets" sit on the spokes between them —
 * blue for content going out, green for customers finding you — and
 * breathe (the legend naming them was dropped at Luke's request). Still, not interactive: the platform's version is a whole
 * app in an iframe, and the point lands without it.
 *
 * Geometry: the ring radius is a CSS variable (`--r`) set per
 * breakpoint, and each tile is placed with `calc(50% + cos * var(--r))`,
 * so the ring is a circle at every width and nothing is measured in JS.
 * ILLUSTRATION: the count and the booking are made up; the panel says
 * "Illustrative activity" and the screen-reader text says so too.
 */
export function Everywhere() {
  const copy = manage.everywhere;

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[800px] text-center">
          <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow}</p>
          <h2 className="mt-3 text-h1 text-white lg:text-[46px] lg:leading-[1.12]">
            {copy.heading}
          </h2>
        </Reveal>

        <Reveal className="relative isolate mx-auto mt-10 max-w-[1120px] overflow-hidden rounded-[28px] bg-navy-card px-4 pb-5 pt-9 text-white ring-1 ring-white/10 sm:px-7 lg:mt-14 lg:px-9 lg:pt-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_48%,rgba(43,85,255,0.09),transparent_53%)]"
          />

          <div className="text-center">
            <h3 className="text-[36px] font-medium leading-[1.12] tracking-[-1px] sm:text-[42px] lg:text-[56px] lg:tracking-[-1.3px]">
              {copy.panel.lead} <span className="text-[#8FA0FF]">{copy.panel.accent}</span>
            </h3>
            <p className="mx-auto mt-2.5 max-w-[340px] text-[17px] leading-[1.6] text-[#8b9fbf] sm:mt-4 sm:max-w-none sm:text-[19px] lg:text-[21px]">
              {copy.panel.sub}
            </p>
          </div>

          <p className="sr-only">{copy.sr}</p>
          <Scene />

          <p className="mt-2 text-right text-[9px] text-[#647e9f]">{copy.illustrative}</p>
        </Reveal>

        <div className="mt-10 text-center">
          <ScrollButton targetId="convert" label={copy.cta} section="everywhere" />
          <p className="mt-4 text-small text-white/60">{copy.ctaNote}</p>
        </div>
      </Container>
    </section>
  );
}

/** Spokes carrying a packet: which channel, going out or coming in, which glyph. */
const packets: { at: number; kind: "out" | "in"; icon: LucideIcon; delay: string }[] = [
  { at: 0, kind: "out", icon: FileText, delay: "0s" },
  { at: 1, kind: "in", icon: Phone, delay: "0.6s" },
  { at: 3, kind: "out", icon: MessageSquare, delay: "1.2s" },
  { at: 5, kind: "in", icon: MousePointer2, delay: "0.3s" },
  { at: 7, kind: "out", icon: ImageIcon, delay: "0.9s" },
  { at: 8, kind: "out", icon: Video, delay: "1.5s" },
  { at: 10, kind: "in", icon: Phone, delay: "0.45s" },
];

function Scene() {
  const copy = manage.everywhere;
  const n = copy.channels.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const at = (i: number, k = 1): CSSProperties => ({
    left: `calc(50% + ${Math.cos(angle(i)).toFixed(4)} * var(--r) * ${k})`,
    top: `calc(50% + ${Math.sin(angle(i)).toFixed(4)} * var(--r) * ${k})`,
  });

  return (
    <>
      {/* sm and up: the ring. */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-6 hidden h-[560px] w-full max-w-[900px] [--r:205px] sm:block md:h-[640px] md:[--r:266px] lg:h-[700px] lg:[--r:296px]"
      >
        {/* The ring and its inner echo. */}
        <span className="absolute left-1/2 top-1/2 h-[calc(var(--r)*2)] w-[calc(var(--r)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7297cd]/[0.13]" />
        <span className="absolute left-1/2 top-1/2 h-[calc(var(--r)*2-68px)] w-[calc(var(--r)*2-68px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7297cd]/[0.05]" />

        {/* Packets on the spokes. */}
        {packets.map((p) => {
          const Icon = p.icon;
          return (
            <span
              key={`${p.at}-${p.kind}`}
              style={{ ...at(p.at, 0.56), animationDelay: p.delay }}
              className={cn(
                "absolute flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border motion-safe:animate-pulse",
                p.kind === "out"
                  ? "border-[#7399f0]/60 bg-[#14254a] text-[#aac9ff]"
                  : "border-fynd-green/50 bg-[#102e2b] text-[#74e0b3]",
              )}
            >
              <Icon strokeWidth={1.75} className="h-[11px] w-[11px]" />
            </span>
          );
        })}

        <BusinessCard className="absolute left-1/2 top-[calc(50%+18px)] -translate-x-1/2 -translate-y-1/2" />

        {/* The channels, on the ring. */}
        {copy.channels.map((ch, i) => (
          <div key={ch.brand} style={at(i)} className="absolute w-[104px] -translate-x-1/2 -translate-y-[26px] text-center">
            <Tile brand={ch.brand as Brand} label={ch.label} />
          </div>
        ))}
      </div>

      {/* Phones: the card, then the channels in rows. A 130px ring can't
          clear a 330px card, so the phone gets the same pieces stacked. */}
      <div aria-hidden="true" className="mt-6 flex flex-col items-center gap-8 sm:hidden">
        <BusinessCard className="relative" />
        <ul className="grid grid-cols-4 gap-x-1 gap-y-5">
          {copy.channels.map((ch) => (
            <li key={ch.brand} className="w-[78px] text-center">
              <Tile brand={ch.brand as Brand} label={ch.label} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Tile({ brand, label }: { brand: Brand; label: string }) {
  return (
    <>
      <span
        className={cn(
          "mx-auto grid h-11 w-11 place-items-center rounded-[14px] shadow-[0_0_0_5px_#121b36] sm:h-[52px] sm:w-[52px] sm:rounded-[17px] sm:shadow-[0_0_0_7px_#121b36]",
          brand === "website"
            ? "border border-[#5a87ec]/40 bg-[#152348] text-[#91b8ff]"
            : "bg-[#f0f5fc] text-[#345daa]",
          markSize[brand] ?? "[&>svg]:h-[25px] [&>svg]:w-[25px] sm:[&>svg]:h-[29px] sm:[&>svg]:w-[29px]",
        )}
      >
        <MarkSvg brand={brand} />
      </span>
      <span className="mt-2 block text-[10px] leading-tight text-[#a6b8d3] sm:text-[11px]">{label}</span>
    </>
  );
}

const markSize: Record<string, string> = {
  maps: "[&>svg]:h-[26px] [&>svg]:w-[17px] sm:[&>svg]:h-[31px] sm:[&>svg]:w-[21px]",
  youtube: "[&>svg]:h-[22px] [&>svg]:w-[26px] sm:[&>svg]:h-[26px] sm:[&>svg]:w-[31px]",
};

/** The business card with the live storefront. Exported for the homepage. */
export function BusinessCard({ className }: { className?: string }) {
  const c = manage.everywhere.centre;

  return (
    // pb is the team pill's hang below the card: deeper on phones so it sits
    // under the count and its "and counting" line, not over them (Luke, Nov 3, 2026).
    <div className={cn("w-[204px] pb-[44px] sm:w-[248px] sm:pb-[22px]", className)}>
      <span className="pointer-events-none absolute -inset-x-14 -inset-y-10 -z-10 rounded-full bg-[radial-gradient(ellipse,rgba(76,91,255,0.18),transparent_69%)]" />

      <div className="relative rounded-[23px] border border-white/85 bg-[linear-gradient(145deg,#ffffff,#eaf5ff)] px-4 pb-[30px] pt-4 text-center text-[#182b3a] shadow-[0_20px_70px_rgba(0,0,0,0.4),0_0_45px_rgba(43,85,255,0.13)] sm:rounded-[26px] sm:px-[19px] sm:pb-[35px] sm:pt-[19px]">
        <span className="pointer-events-none absolute -inset-[6px] rounded-[32px] border border-[#8db2ff]/30" />

        <p className="text-[6px] font-semibold uppercase tracking-[1.2px] text-[#68859f] sm:text-[6.5px] sm:tracking-[1.6px]">
          {c.kicker}
        </p>
        <p className="mt-2 text-[26px] font-bold leading-[1.18] tracking-[-0.9px] sm:text-[30px]">{c.title}</p>
        <p className="mt-1.5 text-[8px] leading-[1.5] text-[#587189] sm:text-[9px]">{c.sub}</p>

        {/* The storefront and the count, alive: customers walk in, the door
            opens, the number rolls up — see LiveShop. */}
        <LiveShop />
      </div>

      {/* The team, tucked under the card's edge. */}
      <div className="absolute bottom-0 left-1/2 flex w-[168px] -translate-x-1/2 items-center gap-2 rounded-[13px] border border-[#5c83da]/50 bg-[linear-gradient(125deg,#13234b,#101a38)] px-2.5 py-2 text-left shadow-[0_7px_22px_rgba(0,0,0,0.2)] sm:w-[198px] sm:gap-[9px] sm:px-3 sm:py-2.5">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-white/[0.08] sm:h-7 sm:w-7 sm:rounded-[9px]">
          <LogoMark className="h-[18px] sm:h-5" sizes="24px" />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold leading-tight tracking-[-0.2px] text-white sm:text-[13px]">
            {c.team}
          </span>
          <span className="mt-0.5 block whitespace-nowrap text-[7px] text-[#a8bddc] sm:text-[8px]">{c.teamRole}</span>
        </span>
        <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-fynd-green" />
      </div>
    </div>
  );
}
