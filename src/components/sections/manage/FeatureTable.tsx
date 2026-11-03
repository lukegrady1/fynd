import {
  BarChart3,
  Plus,
  Bell,
  Camera,
  Check,
  Globe,
  LayoutTemplate,
  MapPin,
  Share2,
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
export function FeatureTable() {
  const copy = manage.features;
  const total = copy.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="bg-navy py-12 text-white lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[720px]">
            <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow(total)}</p>
            <h2 className="mt-3 text-h1 text-white lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
            <p className="mt-4 text-body text-white/75 lg:text-[18px] lg:leading-[28px]">{copy.sub}</p>
          </Reveal>
          {/* Desktop: beside the heading. On phones the button comes
              after the groups instead, so the section ends on the ask
              the way the one above it does (Luke, Nov 3, 2026). */}
          <ScrollButton targetId="convert" label={copy.cta} section="features" className="hidden lg:inline-flex" />
        </div>

        {/* One closed group at a time, at every width. */}
        <div className="mt-8 flex flex-col gap-3 lg:mt-10">
          {copy.groups.map((group) => {
            const Icon = groupIcon[group.icon] ?? MapPin;
            return (
              <details key={group.title} className="group rounded-lg bg-navy-card text-white ring-1 ring-white/10">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden md:gap-4 md:px-5 md:py-4">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                      groupTone[group.icon] ?? "bg-fynd-blue/25 text-[#8FA0FF]",
                    )}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 md:flex md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1.5">
                    <span className="block text-body font-semibold leading-snug text-white md:text-h3">{group.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-small text-white/70 md:mt-0">
                      {copy.groupCount(group.items.length)}
                      <span className="inline-flex items-center gap-1 rounded-full bg-fynd-green/20 px-2 py-0.5 text-[11px] font-semibold text-fynd-green md:px-2.5 md:text-[12px]">
                        <Check aria-hidden="true" strokeWidth={3} className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        {copy.included}
                      </span>
                    </span>
                  </span>
                  <span className="hidden text-small text-white/60 md:block">
                    <span className="group-open:hidden">{copy.open}</span>
                    <span className="hidden group-open:inline">{copy.close}</span>
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fynd-blue/25 text-[#8FA0FF] transition-transform duration-250 ease-fynd group-open:rotate-45 md:h-8 md:w-8">
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                </summary>
                <ul className="divide-y divide-white/10 border-t border-white/10 px-4 md:px-5">
                  {group.items.map((item) => (
                    <li key={item.name} className="py-3 md:grid md:grid-cols-[34%_1fr_auto] md:items-start md:gap-x-5 md:py-3.5">
                      <p className="text-small font-semibold text-white md:text-body">{item.name}</p>
                      <p className="mt-0.5 text-small text-white/70 md:mt-0 md:text-body">{item.means}</p>
                      <span className="hidden h-6 w-6 items-center justify-center rounded-full bg-fynd-green/20 text-fynd-green md:inline-flex">
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

        <ScrollButton targetId="convert" label={copy.cta} section="features" className="mt-8 lg:hidden" />
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
};

const groupTone: Record<string, string> = {
  star: "bg-fynd-green/20 text-fynd-green",
  chart: "bg-fynd-orange/15 text-fynd-orange",
  users: "bg-fynd-orange/15 text-fynd-orange",
};
