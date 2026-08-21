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

export const nav = {
  links: [
    { label: "Product", href: "/#product" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Resources", href: "/#resources" },
  ],
  login: { label: "Login", href: "/login" },
  cta: { label: "Book a Demo", href: "/#demo" },
} as const;
