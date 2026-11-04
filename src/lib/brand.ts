/**
 * Canonical brand copy and constants. Pulled straight from design.md —
 * import from here instead of retyping strings into pages.
 */

export const brand = {
  name: "Fynd",
  lockupTagline: "BEING FOUND EVERYWHERE.",
  headline: { line1: "Be found.", line2: "Everywhere." },
  supporting: "One platform. Total presence.",
  positioning:
    "AI-powered local visibility across search, maps, directories, and AI.",
  description:
    "Fynd helps businesses get found—everywhere. Our AI-powered platform maximizes your local visibility across Google, Maps, AI search, directories, and more. One platform. Total presence.",
} as const;

export const colors = {
  navy: "#0B132B",
  navyCard: "#121B36",
  blue: "#4C5BFF",
  blue2: "#7A5CFF",
  green: "#19D3A2",
  green2: "#16B98A",
  greenText: "#0F8F6E",
  orange: "#FF8A1F",
  gray: "#F2F4F7",
  white: "#FFFFFF",
  line: "#E3E7EE",
} as const;

/** Fixed chart series order — never introduce a fifth hue. */
export const chartSeries = [colors.blue, colors.green, colors.orange, colors.navy] as const;

export type PillarKey = "visibility" | "reputation" | "growth" | "control";

export const pillars: {
  key: PillarKey;
  name: string;
  icon: "MapPin" | "MessageSquareStar" | "TrendingUp" | "ShieldCheck";
  color: string;
  line: string;
}[] = [
  {
    key: "visibility",
    name: "Visibility",
    icon: "MapPin",
    color: colors.blue,
    line: "Show up where customers search.",
  },
  {
    key: "reputation",
    name: "Reputation",
    icon: "MessageSquareStar",
    color: colors.green,
    line: "Build trust with reviews that win.",
  },
  {
    key: "growth",
    name: "Growth",
    icon: "TrendingUp",
    color: colors.orange,
    line: "More visibility. More customers.",
  },
  {
    key: "control",
    name: "Control",
    icon: "ShieldCheck",
    color: colors.blue,
    line: "One platform. Everything in sync.",
  },
];

/**
 * The site navigation, shared by every public page (Luke, Nov 3, 2026:
 * "pages can link together now"). The three services people come for;
 * the $99 optimization is deliberately not here — it is a section on the
 * homepage and a footer link, "just kind of there if someone needs it".
 * /watch, /start and /call are never linked from anywhere.
 */
export const nav = {
  links: [
    { label: "Reviews", href: "/reviews" },
    { label: "Website", href: "/website" },
    { label: "Management", href: "/manage" },
  ],
  cta: { label: "Book a call", href: "/demo" },
} as const;

/** The footer's services column: everything that can be bought, the $99 included. */
export const footerServices = [
  { label: "Review System", href: "/reviews" },
  { label: "Website + Reviews", href: "/website" },
  { label: "Profile management", href: "/manage" },
  { label: "Profile optimization", href: "/optimize" },
] as const;
