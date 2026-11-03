import {
  BarChart3,
  Plus,
  Bell,
  Camera,
  Check,
  Globe,
  LayoutTemplate,
  MapPin,
  Plug,
  Reply,
  Send,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";

/**
 * "Every local SEO feature, in plain English": every group as a closed
 * <details>, at every width. The summary carries the icon, the name,
 * the count and "Included"; open it and the features are inside, as
 * name / what it means / green check rows from md (a plain stacked list
 * on a phone).
 *
 * The platform's own page shows the whole thing as one open table. It
 * was that on desktop here too, until Luke (Nov 3, 2026) asked for the
 * phone's open-and-close groups everywhere: the open table was 8,000px
 * of rows, and the reader who wants the detail taps for it.
 */
export type FeaturesCopy = {
  eyebrow: (n: number) => string;
  heading: string;
  sub: string;
  cta: string;
  groupCount: (n: number) => string;
  included: string;
  open: string;
  close: string;
  groups: readonly {
    icon: string;
    title: string;
    items: readonly { name: string; means: string }[];
  }[];
};

/**
 * `copy` defaults to /manage's; /watch passes the Review System's list
 * (`watch.features`) and gets the same accordion.
 */
export function FeatureTable({
  copy = manage.features,
  targetId = "convert",
  tone = "dark",
}: {
  copy?: FeaturesCopy;
  targetId?: string;
  /** "dark" is /manage's navy; "light" is /watch's white with grey groups. */
  tone?: "dark" | "light";
} = {}) {
  const total = copy.groups.reduce((n, g) => n + g.items.length, 0);
  const dark = tone === "dark";
  const tones = dark ? groupTone : groupToneLight;

  return (
    <section className={cn("py-12 lg:py-20", dark ? "bg-navy text-white" : "bg-white text-ink")}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[720px]">
            <p className={cn("text-micro uppercase", dark ? "text-[#8FA0FF]" : "text-fynd-green-text")}>{copy.eyebrow(total)}</p>
            <h2 className={cn("mt-3 text-h1 lg:text-[44px] lg:leading-[1.15]", dark ? "text-white" : "text-ink")}>{copy.heading}</h2>
            <p className={cn("mt-4 text-body lg:text-[18px] lg:leading-[28px]", dark ? "text-white/75" : "text-ink-soft")}>{copy.sub}</p>
          </Reveal>
          {/* Desktop: beside the heading. On phones the button comes
              after the groups instead, so the section ends on the ask
              the way the one above it does (Luke, Nov 3, 2026). */}
          <ScrollButton targetId={targetId} label={copy.cta} section="features" className="hidden lg:inline-flex" />
        </div>

        {/* One closed group at a time, at every width. */}
        <div className="mt-8 flex flex-col gap-3 lg:mt-10">
          {copy.groups.map((group) => {
            const Icon = groupIcon[group.icon] ?? MapPin;
            return (
              <details
                key={group.title}
                className={cn(
                  "group rounded-lg",
                  dark ? "bg-navy-card text-white ring-1 ring-white/10" : "bg-fynd-gray text-ink ring-1 ring-line",
                )}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden md:gap-4 md:px-5 md:py-4">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                      tones[group.icon] ?? (dark ? "bg-fynd-blue/25 text-[#8FA0FF]" : "bg-fynd-blue/10 text-fynd-blue"),
                    )}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 md:flex md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1.5">
                    <span className={cn("block text-body font-semibold leading-snug md:text-h3", dark ? "text-white" : "text-ink")}>{group.title}</span>
                    <span className={cn("mt-0.5 flex items-center gap-2 text-small md:mt-0", dark ? "text-white/70" : "text-ink-soft")}>
                      {copy.groupCount(group.items.length)}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold md:px-2.5 md:text-[12px]",
                          dark ? "bg-fynd-green/20 text-fynd-green" : "bg-fynd-green/15 text-fynd-green-text",
                        )}
                      >
                        <Check aria-hidden="true" strokeWidth={3} className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        {copy.included}
                      </span>
                    </span>
                  </span>
                  <span className={cn("hidden text-small md:block", dark ? "text-white/60" : "text-ink-soft")}>
                    <span className="group-open:hidden">{copy.open}</span>
                    <span className="hidden group-open:inline">{copy.close}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-250 ease-fynd group-open:rotate-45 md:h-8 md:w-8",
                      dark ? "bg-fynd-blue/25 text-[#8FA0FF]" : "bg-fynd-blue/10 text-fynd-blue",
                    )}
                  >
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                </summary>
                <ul className={cn("divide-y border-t px-4 md:px-5", dark ? "divide-white/10 border-white/10" : "divide-line border-line")}>
                  {group.items.map((item) => (
                    <li key={item.name} className="py-3 md:grid md:grid-cols-[34%_1fr_auto] md:items-start md:gap-x-5 md:py-3.5">
                      <p className={cn("text-small font-semibold md:text-body", dark ? "text-white" : "text-ink")}>{item.name}</p>
                      <p className={cn("mt-0.5 text-small md:mt-0 md:text-body", dark ? "text-white/70" : "text-ink-soft")}>{item.means}</p>
                      <span
                        className={cn(
                          "hidden h-6 w-6 items-center justify-center rounded-full md:inline-flex",
                          dark ? "bg-fynd-green/20 text-fynd-green" : "bg-fynd-green/15 text-fynd-green-text",
                        )}
                      >
                        <Check aria-hidden="true" strokeWidth={3} className="h-3.5 w-3.5" />
                        <span className="sr-only">{copy.included}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>

        <ScrollButton targetId={targetId} label={copy.cta} section="features" className="mt-8 lg:hidden" />
      </Container>
    </section>
  );
}

const groupIcon: Record<string, LucideIcon> = {
  map: MapPin,
  globe: Globe,
  star: Star,
  chart: BarChart3,
  users: Users,
  zap: Zap,
  bell: Bell,
  share: Share2,
  video: Video,
  camera: Camera,
  layout: LayoutTemplate,
  send: Send,
  shield: ShieldCheck,
  reply: Reply,
  plug: Plug,
};

const groupTone: Record<string, string> = {
  star: "bg-fynd-green/20 text-fynd-green",
  shield: "bg-fynd-green/20 text-fynd-green",
  chart: "bg-fynd-orange/15 text-fynd-orange",
  users: "bg-fynd-orange/15 text-fynd-orange",
};

/** The same tones on a light section: green text has to be the AA green. */
const groupToneLight: Record<string, string> = {
  star: "bg-fynd-green/15 text-fynd-green-text",
  shield: "bg-fynd-green/15 text-fynd-green-text",
  chart: "bg-fynd-orange/15 text-fynd-orange",
  users: "bg-fynd-orange/15 text-fynd-orange",
};
