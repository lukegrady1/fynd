import type { CSSProperties } from "react";
import {
  CalendarCheck,
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

function BusinessCard({ className }: { className?: string }) {
  const c = manage.everywhere.centre;

  return (
    <div className={cn("w-[204px] pb-[19px] sm:w-[248px] sm:pb-[22px]", className)}>
      <span className="pointer-events-none absolute -inset-x-14 -inset-y-10 -z-10 rounded-full bg-[radial-gradient(ellipse,rgba(76,91,255,0.18),transparent_69%)]" />

      <div className="relative rounded-[23px] border border-white/85 bg-[linear-gradient(145deg,#ffffff,#eaf5ff)] px-4 pb-[30px] pt-4 text-center text-[#182b3a] shadow-[0_20px_70px_rgba(0,0,0,0.4),0_0_45px_rgba(43,85,255,0.13)] sm:rounded-[26px] sm:px-[19px] sm:pb-[35px] sm:pt-[19px]">
        <span className="pointer-events-none absolute -inset-[6px] rounded-[32px] border border-[#8db2ff]/30" />

        <p className="text-[6px] font-semibold uppercase tracking-[1.2px] text-[#68859f] sm:text-[6.5px] sm:tracking-[1.6px]">
          {c.kicker}
        </p>
        <p className="mt-2 text-[26px] font-bold leading-[1.18] tracking-[-0.9px] sm:text-[30px]">{c.title}</p>
        <p className="mt-1.5 text-[8px] leading-[1.5] text-[#587189] sm:text-[9px]">{c.sub}</p>

        <div className="relative mx-auto mt-1.5 h-[98px] w-full max-w-[224px] sm:mt-2 sm:h-[116px]">
          <Storefront />
          <span className="absolute -right-1 top-1 flex items-center gap-1 rounded-[9px] bg-[#fffefa] px-2 py-1.5 text-[8px] font-semibold text-[#3b8469] shadow-[0_5px_18px_rgba(23,55,112,0.13),0_0_0_1px_rgba(115,182,155,0.18)] sm:text-[9px]">
            <CalendarCheck strokeWidth={2} className="h-3 w-3" />
            {c.receipt}
          </span>
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-2 border-t border-[#356aa6]/[0.13] pt-2 text-left sm:gap-[11px] sm:pt-[11px]">
          <p className="whitespace-nowrap text-[36px] font-semibold leading-none tracking-[-2px] tabular-nums sm:text-[43px]">
            <span className="mr-0.5 align-[4px] text-[23px] font-normal text-fynd-blue sm:text-[26px]">+</span>
            {c.count}
          </p>
          <p className="text-[9px] font-medium leading-[1.4] text-[#365372] sm:text-[10px]">
            {c.countLabel}
            <span className="mt-0.5 block text-[7px] font-normal text-[#72899d] sm:text-[8px]">{c.countSub}</span>
          </p>
        </div>
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

/** The platform's storefront drawing, with the awning in Fynd Blue. */
function Storefront() {
  return (
    <svg viewBox="0 0 240 144" fill="none" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="fynd-shop-wall" x1="60" y1="45" x2="180" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" />
          <stop offset="1" stopColor="#d9eaf8" />
        </linearGradient>
        <linearGradient id="fynd-shop-glass" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff5c9" />
          <stop offset="1" stopColor="#f7d8a8" />
        </linearGradient>
      </defs>
      <ellipse cx="119" cy="132" rx="88" ry="7" fill="#6188ba" opacity=".18" />
      <path d="M52 55h136v72a5 5 0 0 1-5 5H57a5 5 0 0 1-5-5Z" fill="url(#fynd-shop-wall)" stroke="#9bbadb" />
      <path d="M61 24h118a5 5 0 0 1 5 5v24H56V29a5 5 0 0 1 5-5Z" fill="#dceaff" stroke="#9bb7e8" />
      <rect x="90" y="32" width="60" height="14" rx="7" fill="#fffaf4" />
      <circle cx="104" cy="39" r="2" fill="#5eab88" />
      <text x="124" y="41.5" textAnchor="middle" fill="#659178" fontFamily="inherit" fontWeight="650" fontSize="7" letterSpacing="1.5">
        OPEN
      </text>
      <rect x="65" y="75" width="48" height="38" rx="3" fill="url(#fynd-shop-glass)" stroke="#d7b689" />
      <path d="m69 92 13-13m-9 23 23-23m-7 21 20-20" stroke="white" strokeOpacity=".6" strokeWidth="3" />
      <path d="M89 76v37M65 95h48" stroke="#c3a385" strokeWidth="1.3" />
      <rect x="128" y="73" width="42" height="58" rx="3" fill="#3a48d6" />
      <rect x="132" y="77" width="34" height="53" rx="1.5" fill="#c6dfff" />
      <rect x="132" y="77" width="34" height="53" rx="1.5" fill="#fff0c9" opacity=".26" />
      <path d="m136 98 25-18m-18 28 18-13" stroke="white" strokeOpacity=".42" strokeWidth="2" />
      <path d="M161 105v9" stroke="#315291" strokeWidth="2" strokeLinecap="round" />
      <path d="M57 49h126l12 14H45Z" fill="#4c5bff" stroke="#3a48d6" />
      <path d="m72 49-6 14h22l3-14m19 0-1 14h22l-1-14m19 0 3 14h22l-6-14" fill="#e4eeff" />
      <path d="M45 63h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Z" fill="#4c5bff" />
      <path d="M66 63h22v5c0 9-22 9-22 0Zm43 0h22v5c0 9-22 9-22 0Zm43 0h22v5c0 9-22 9-22 0Z" fill="#e4eeff" />
      <path d="M38 130h-9l-2-14h13Z" fill="#ddbeab" />
      <path d="M33 117V98m0 12c-12-2-13-9-10-10 7-1 10 7 10 7m0-1c11-2 12-9 8-10-6-1-8 8-8 8" fill="#8ab295" stroke="#76a182" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M207 130h-9l-2-14h13Z" fill="#ddbeab" />
      <path d="M203 117V98m0 12c-12-2-13-9-10-10 7-1 10 7 10 7m0-1c11-2 12-9 8-10-6-1-8 8-8 8" fill="#8ab295" stroke="#76a182" strokeWidth="1.5" strokeLinecap="round" />
      <g transform="translate(53 123) scale(.85)">
        <circle cy="-20" r="5.2" fill="#ad795c" />
        <path d="M-5-23c0-6 11-6 10 1" fill="#493a47" />
        <path d="M-7-8q0-8 7-8t7 8v9H-7Z" fill="#8ebdaf" />
        <path d="M-4 1v10m8-10v10" stroke="#445c7b" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g transform="translate(187 120) scale(.8)">
        <circle cy="-20" r="5.2" fill="#e3b598" />
        <path d="M-5-21c-1-8 12-9 11 1l-3-3-8 2Z" fill="#68525c" />
        <path d="M-7-8q0-8 7-8t7 8v9H-7Z" fill="#7399e5" />
        <path d="M-4 1v10m8-10v10" stroke="#445c7b" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="7" y="-2" width="7" height="9" rx="1" fill="#ecc78e" />
      </g>
    </svg>
  );
}
