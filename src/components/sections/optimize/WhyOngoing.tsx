"use client";

import Link from "next/link";
import { ArrowRight, Check, Image, MessageSquareText, Minus, Users } from "lucide-react";
import { optimize } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * Why kept-up beats filled-in, taught before it is asked for.
 *
 * Two parts. First, what goes stale after a one-time fill: three cards
 * (photos age, posts go quiet, the competitor keeps going), picking up
 * the relevance/prominence distinction the ranking section made at the
 * top of the page. Second, the one-off beside the monthly service as one
 * table, so the reader can see exactly what the $297 adds — and that it
 * starts with the same optimization. The right-hand column is only what
 * the white-labelled platform does.
 *
 * The button goes to /manage and is the page's only ask for the monthly
 * plan. The hero's quiet link and the $99 card's hand-off both land here
 * (`id`), so nobody reaches the ask without the case.
 */
export function WhyOngoing({ id }: { id: string }) {
  const copy = optimize.ongoing;

  return (
    <section id={id} className="scroll-mt-20 bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <h2 className="text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
          <p className="measure mx-auto mt-4 text-body text-ink-soft">
            {copy.sub}
          </p>
        </Reveal>

        {/* What goes stale */}
        <ul className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3 md:gap-6 lg:mt-14">
          {copy.decays.map((item, i) => {
            const Icon = decayIcons[item.key];
            return (
              <li key={item.key} className="flex">
                <Reveal
                  delay={i * 0.08}
                  className="flex w-full flex-col rounded-md border border-line bg-white p-6 shadow-sm lg:p-7"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-fynd-orange/50 bg-fynd-orange/5 text-fynd-orange"
                  >
                    <Icon strokeWidth={1.75} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-h3 text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-body text-ink-soft">{item.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* Once beside every month */}
        <Reveal className="mx-auto mt-12 max-w-[880px] lg:mt-16">
          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[26%] p-3 text-micro uppercase text-ink-soft sm:w-[30%] sm:px-6 sm:py-4">
                    <span className="sr-only">What</span>
                  </th>
                  <th scope="col" className="w-[30%] p-3 text-micro uppercase text-ink-soft sm:px-6 sm:py-4">
                    {copy.table.onceLabel}
                  </th>
                  <th scope="col" className="w-[44%] bg-navy p-3 text-micro uppercase text-fynd-green sm:w-[40%] sm:px-6 sm:py-4">
                    {copy.table.monthlyLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {copy.table.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-3 align-top text-small font-semibold text-ink sm:px-6 sm:py-4">
                      {row.label}
                    </th>
                    <td className="p-3 align-top sm:px-6 sm:py-4">
                      {row.once ? (
                        <span className="flex items-start gap-2 text-small font-medium text-ink-soft">
                          <Check
                            aria-hidden="true"
                            strokeWidth={2.5}
                            className="mt-0.5 h-4 w-4 shrink-0 text-fynd-green-text"
                          />
                          {row.once}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-small text-ink-muted">
                          <Minus aria-hidden="true" strokeWidth={2} className="h-4 w-4 shrink-0" />
                          <span className="sr-only">Not included</span>
                        </span>
                      )}
                    </td>
                    <td className="bg-navy p-3 align-top sm:px-6 sm:py-4">
                      <span className="flex items-start gap-2 text-small font-medium text-white">
                        <Check
                          aria-hidden="true"
                          strokeWidth={2.5}
                          className="mt-0.5 h-4 w-4 shrink-0 text-fynd-green"
                        />
                        {row.monthly}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href={copy.href}
              onClick={() => track("cta_click", { cta: copy.cta, section: "ongoing" })}
              className="group flex h-12 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99] sm:h-14 sm:w-auto sm:px-8"
            >
              {copy.cta}
              <ArrowRight
                aria-hidden="true"
                className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const decayIcons = {
  photos: Image,
  posts: MessageSquareText,
  competitors: Users,
} as const;
