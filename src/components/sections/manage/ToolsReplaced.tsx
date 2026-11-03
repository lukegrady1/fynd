import {
  BarChart3,
  Check,
  Globe,
  MapPin,
  MessageCircle,
  PenLine,
  Share2,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";

/**
 * "Already paying for tools?": the heading and the navy total card down
 * the left, the table of eight tools down the right, each ending in a
 * struck-out price and an "Included" pill, plus the one row no tool
 * replaces (the person) and the total. From md the table is a table;
 * below that each row is a card.
 */
export function ToolsReplaced() {
  const copy = manage.tools;

  return (
    <section id="tools" className="scroll-mt-20 bg-navy py-12 text-white lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-12">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow}</p>
            <h2 className="mt-3 text-h1 text-white lg:text-[40px] lg:leading-[1.15]">
              {copy.lead} <span className="text-fynd-green">{copy.accent}</span>
            </h2>
            <p className="mt-4 text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
              {copy.sub}
            </p>

            <div className="mt-8 rounded-lg bg-navy-card p-6 text-white shadow-lg ring-1 ring-fynd-blue/60 lg:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-body text-white/70">{copy.card.separately}</p>
                <p className="text-h2 tabular-nums text-white/60 line-through decoration-fynd-orange decoration-2">
                  {copy.card.separatelyValue}
                  <span className="text-small font-normal">{copy.per}</span>
                </p>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-white/10 pt-5">
                <p className="text-body font-semibold text-white">{copy.card.ours}</p>
                <p className="text-[30px] font-bold leading-none text-fynd-green">
                  {copy.card.included}
                </p>
              </div>
              <p className="mt-5 text-small text-white/80">
                {copy.card.yearly.lead}
                <strong className="font-semibold text-white">{copy.card.yearly.strong}</strong>
                {copy.card.yearly.tail}
              </p>
              <ScrollButton
                targetId="convert"
                label={copy.card.cta}
                section="tools_card"
                variant="light"
                className="mt-6 w-full sm:w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            {/* md and up */}
            <div className="hidden overflow-hidden rounded-lg bg-navy-card ring-1 ring-white/10 text-white shadow-lg md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/[0.05] text-micro uppercase text-[#8FA0FF]">
                    <th scope="col" className="px-5 py-3.5 font-semibold">{copy.cols.job}</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">{copy.cols.replaces}</th>
                    <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right font-semibold">
                      {copy.cols.price}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {copy.rows.map((row) => (
                    <tr key={row.job} className="border-t border-white/10">
                      <th scope="row" className="px-5 py-4 align-top font-medium">
                        <JobCell icon={row.icon} job={row.job} does={row.does} />
                      </th>
                      <td className="px-5 py-4 align-top text-small text-white/70">{row.replaces}</td>
                      <td className="px-5 py-4 text-right align-top">
                        <PriceCell price={row.price} />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-white/10">
                    <th scope="row" className="px-5 py-4 align-top font-medium">
                      <JobCell icon={copy.manager.icon} job={copy.manager.job} does={copy.manager.does} />
                    </th>
                    <td className="px-5 py-4 align-top text-small text-white/70">{copy.manager.replaces}</td>
                    <td className="px-5 py-4 text-right align-top">
                      <span className="text-small text-white/70">&mdash;</span>
                      <span className="mt-1.5 block">
                        <OnlyPill />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-white/10 bg-white/[0.06]">
                    <th scope="row" className="px-5 py-4 align-top font-medium">
                      <span className="block text-h3 text-white">{copy.total.label}</span>
                    </th>
                    <td className="px-5 py-4 align-top text-small text-white/70">{copy.total.sub}</td>
                    <td className="px-5 py-4 text-right align-top text-h2 tabular-nums text-white">
                      {copy.total.value}
                      <span className="text-small font-normal text-white/70">{copy.per}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Below md: a card per row. */}
            <ul className="flex flex-col gap-3 md:hidden">
              {copy.rows.map((row) => (
                <li key={row.job} className="rounded-md bg-navy-card ring-1 ring-white/10 p-4 text-white">
                  <JobCell icon={row.icon} job={row.job} does={row.does} />
                  <div className="mt-3 flex items-end justify-between gap-4 border-t border-white/10 pt-3">
                    <p className="text-small text-white/70">{row.replaces}</p>
                    <PriceCell price={row.price} />
                  </div>
                </li>
              ))}
              <li className="rounded-md bg-navy-card ring-1 ring-white/10 p-4 text-white">
                <JobCell icon={copy.manager.icon} job={copy.manager.job} does={copy.manager.does} />
                <div className="mt-3 flex items-end justify-between gap-4 border-t border-white/10 pt-3">
                  <p className="text-small text-white/70">{copy.manager.replaces}</p>
                  <OnlyPill />
                </div>
              </li>
              <li className="flex items-center justify-between gap-4 rounded-md bg-white/[0.06] p-4 text-white">
                <div>
                  <p className="text-h3 text-white">{copy.total.label}</p>
                  <p className="text-small text-white/70">{copy.total.sub}</p>
                </div>
                <p className="text-h2 tabular-nums text-white">
                  {copy.total.value}
                  <span className="text-small font-normal text-white/70">{copy.per}</span>
                </p>
              </li>
            </ul>

            <p className="mt-4 text-small text-white/60">{copy.note}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function JobCell({ icon, job, does }: { icon: string; job: string; does: string }) {
  const Icon = rowIcon[icon] ?? MapPin;
  return (
    <span className="flex gap-3">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          rowTone[icon] ?? "bg-fynd-blue/25 text-[#8FA0FF]",
        )}
      >
        <Icon aria-hidden="true" strokeWidth={1.75} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-body font-semibold text-white">{job}</span>
        <span className="mt-0.5 block text-small text-white/70">{does}</span>
      </span>
    </span>
  );
}

function PriceCell({ price }: { price: string }) {
  const copy = manage.tools;
  return (
    <span className="flex flex-col items-end gap-1.5">
      <span className="whitespace-nowrap text-small font-semibold tabular-nums text-white/70 line-through decoration-fynd-orange decoration-2">
        {price}
        {copy.per}
      </span>
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-fynd-green/20 px-2.5 py-0.5 text-[12px] font-semibold text-fynd-green">
        <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3" />
        {copy.included}
      </span>
    </span>
  );
}

function OnlyPill() {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-fynd-blue/25 px-2.5 py-0.5 text-[12px] font-semibold text-[#8FA0FF]">
      {manage.tools.manager.only}
    </span>
  );
}

const rowIcon: Record<string, LucideIcon> = {
  map: MapPin,
  sparkles: Sparkles,
  star: Star,
  share: Share2,
  video: Video,
  globe: Globe,
  chart: BarChart3,
  pen: PenLine,
  chat: MessageCircle,
};

const rowTone: Record<string, string> = {
  star: "bg-fynd-green/20 text-fynd-green",
  chart: "bg-fynd-orange/15 text-fynd-orange",
};
