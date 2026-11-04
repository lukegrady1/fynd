import {
  BarChart3,
  LayoutTemplate,
  MapPin,
  Plug,
  Plus,
  Reply,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { watch } from "@/content/copy";
import type { Widen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { ScrollButton } from "@/components/sections/manage/ScrollButton";
import { Reveal } from "./Reveal";

/**
 * Every feature, as a grid of six cards, three across from lg, each one
 * a closed <details>: the summary is the icon, the name, the count and
 * the plus; open it and the group's features are inside as name over
 * what-it-means. /manage's accordion is one column of full-width rows;
 * this keeps the grid (Luke, Nov 3, 2026: "the same three columns, two
 * rows, but… a dropdown, like how the Manage page is, for each
 * individual card"). The grid aligns to the top so an open card grows
 * on its own without stretching its neighbours. Group names never wrap
 * (Luke): 18px from xl, where the three columns start; two columns
 * below that. Reads `watch.features`.
 */
export type FeaturesCopy = Widen<typeof watch.features>;

export function WatchFeatureGrid({ targetId = "convert", copy = watch.features }: { targetId?: string; copy?: FeaturesCopy } = {}) {
  const total = copy.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[720px]">
            <p className="text-micro uppercase text-fynd-green-text">{copy.eyebrow(total)}</p>
            <h2 className="mt-3 text-h1 text-ink lg:text-[44px] lg:leading-[1.15]">{copy.heading}</h2>
            <p className="mt-4 text-body text-ink-soft lg:text-[18px] lg:leading-[28px]">{copy.sub}</p>
          </Reveal>
          <ScrollButton targetId={targetId} label={copy.cta} section="features" className="hidden lg:inline-flex" />
        </div>

        {/* Three across from xl, not lg: at 1024 a third of the row leaves
            ~160px for the name, and "Reputation dashboard" needs ~190 even
            at 18px. The names must sit on one line (Luke, Nov 3, 2026). */}
        <ul className="mt-8 grid items-start gap-4 md:grid-cols-2 lg:mt-10 lg:gap-5 xl:grid-cols-3">
          {copy.groups.map((group, i) => {
            const Icon = groupIcon[group.icon] ?? MapPin;
            return (
              <li key={group.title}>
                <Reveal delay={(i % 3) * 0.06}>
                  <details className="group rounded-lg border border-line bg-white shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden lg:p-6">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                          groupTone[group.icon] ?? "bg-fynd-blue/10 text-fynd-blue",
                        )}
                      >
                        <Icon aria-hidden="true" strokeWidth={1.75} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block whitespace-nowrap text-h3 text-ink xl:text-[18px] xl:leading-snug">{group.title}</span>
                        <span className="block text-small text-ink-soft">
                          {copy.groupCount(group.items.length)}
                          <span className="hidden sm:inline">
                            {" · "}
                            <span className="group-open:hidden">{copy.open}</span>
                            <span className="hidden group-open:inline">{copy.close}</span>
                          </span>
                        </span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-blue/10 text-fynd-blue transition-all duration-250 ease-fynd group-open:rotate-45 group-open:bg-fynd-blue group-open:text-white">
                        <Plus aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
                      </span>
                    </summary>
                    <ul className="divide-y divide-line border-t border-line px-5 lg:px-6">
                      {group.items.map((item) => (
                        <li key={item.name} className="py-3">
                          <p className="text-small font-semibold text-ink">{item.name}</p>
                          <p className="mt-0.5 text-small text-ink-soft">{item.means}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <ScrollButton targetId={targetId} label={copy.cta} section="features" className="mt-8 lg:hidden" />
      </Container>
    </section>
  );
}

const groupIcon: Record<string, LucideIcon> = {
  send: Send,
  shield: ShieldCheck,
  reply: Reply,
  plug: Plug,
  chart: BarChart3,
  layout: LayoutTemplate,
};

const groupTone: Record<string, string> = {
  shield: "bg-fynd-green/15 text-fynd-green-text",
  chart: "bg-fynd-orange/15 text-fynd-orange",
};
