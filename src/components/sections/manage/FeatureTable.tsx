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
 * "Every local SEO feature, in plain English": the whole list as one
 * table, every group open, the way the platform shows it. A tinted header
 * row, a tinted row per group (icon, name, count, "Included"), then a
 * row per feature ending in a green check.
 *
 * The table is for md and up. On a phone it would be 8,000px of rows,
 * so there each group is a closed <details> instead: the name, the
 * count and "Included" on the summary, the rows inside. Most visitors
 * are on a phone (Luke), so the short form is the one that matters.
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
          <ScrollButton targetId="convert" label={copy.cta} section="features" />
        </div>

        <Reveal className="mt-10 hidden overflow-hidden rounded-lg bg-navy-card ring-1 ring-white/10 text-white shadow-lg md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/[0.05] text-micro uppercase text-[#8FA0FF]">
                <th scope="col" className="px-4 py-4 font-semibold sm:px-5">{copy.cols.feature}</th>
                <th scope="col" className="px-5 py-4 font-semibold">{copy.cols.means}</th>
                <th scope="col" className="px-4 py-4 text-right font-semibold sm:px-5">{copy.cols.included}</th>
              </tr>
            </thead>
            {copy.groups.map((group) => {
              const Icon = groupIcon[group.icon] ?? MapPin;
              return (
                <tbody key={group.title}>
                  <tr className="border-t border-white/10 bg-white/[0.04]">
                    <th scope="colgroup" colSpan={3} className="px-4 py-4 text-left font-medium sm:px-5">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                            groupTone[group.icon] ?? "bg-fynd-blue/25 text-[#8FA0FF]",
                          )}
                        >
                          <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                        </span>
                        <span className="text-h3 text-white">{group.title}</span>
                        <span className="text-small text-white/70">{copy.groupCount(group.items.length)}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-fynd-green/20 px-2.5 py-0.5 text-[12px] font-semibold text-fynd-green">
                          <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3" />
                          {copy.included}
                        </span>
                      </span>
                    </th>
                  </tr>
                  {group.items.map((item) => (
                    <tr key={item.name} className="border-t border-white/10">
                      <th scope="row" className="px-4 py-3.5 align-top font-medium sm:px-5 md:w-[34%]">
                        <span className="block text-body font-semibold text-white">{item.name}</span>
                      </th>
                      <td className="px-5 py-3.5 align-top text-body text-white/70">
                        {item.means}
                      </td>
                      <td className="px-4 py-3.5 text-right align-top sm:px-5">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fynd-green/20 text-fynd-green">
                          <Check aria-hidden="true" strokeWidth={3} className="h-3.5 w-3.5" />
                          <span className="sr-only">{copy.included}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </Reveal>

        {/* Below md: one closed group at a time. */}
        <div className="mt-8 flex flex-col gap-3 md:hidden">
          {copy.groups.map((group) => {
            const Icon = groupIcon[group.icon] ?? MapPin;
            return (
              <details key={group.title} className="group rounded-lg bg-navy-card text-white ring-1 ring-white/10">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                      groupTone[group.icon] ?? "bg-fynd-blue/25 text-[#8FA0FF]",
                    )}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-semibold leading-snug text-white">{group.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-small text-white/70">
                      {copy.groupCount(group.items.length)}
                      <span className="inline-flex items-center gap-1 rounded-full bg-fynd-green/20 px-2 py-0.5 text-[11px] font-semibold text-fynd-green">
                        <Check aria-hidden="true" strokeWidth={3} className="h-2.5 w-2.5" />
                        {copy.included}
                      </span>
                    </span>
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fynd-blue/25 text-[#8FA0FF] transition-transform duration-250 ease-fynd group-open:rotate-45">
                    <Plus aria-hidden="true" strokeWidth={2.5} className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <ul className="divide-y divide-white/10 border-t border-white/10 px-4">
                  {group.items.map((item) => (
                    <li key={item.name} className="py-3">
                      <p className="text-small font-semibold text-white">{item.name}</p>
                      <p className="mt-0.5 text-small text-white/70">{item.means}</p>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
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
