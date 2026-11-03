import { Check } from "lucide-react";
import { optimize } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { cn } from "@/lib/utils";
import { GoogleProfile } from "./GoogleProfile";

/**
 * Typical beside optimized.
 *
 * From md, the full drawn card each time, side by side so each row lines
 * up with its counterpart — "No services listed." directly across from
 * four service chips is the whole argument. On a phone the two cards
 * would stack a full screen apart and the reader would scroll up and
 * down to compare, so below md the section is a table instead: a narrow
 * label column, then typical and optimized side by side, every row on
 * one line so the green column runs unbroken top to bottom. Orange
 * marks the gaps, green the fills, in both forms.
 */
export function ProfileCompare() {
  const copy = optimize.compare;
  const p = optimize.profile;

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
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

        {/* Phones: the table. */}
        <Reveal className="mt-8 md:hidden">
          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[27%] px-2.5 py-2.5">
                    <span className="sr-only">Part of the profile</span>
                  </th>
                  <th
                    scope="col"
                    className="w-[33%] px-2.5 py-2.5 text-micro uppercase text-ink-soft"
                  >
                    <span className="flex items-center gap-1.5">
                      <Dot tone="orange" />
                      {p.typicalLabel}
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="w-[40%] bg-fynd-green/10 px-2.5 py-2.5 text-micro uppercase text-fynd-green-text"
                  >
                    <span className="flex items-center gap-1.5">
                      <Dot tone="green" />
                      {p.optimizedLabel}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {copy.rows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="px-2.5 py-2.5 align-top text-[12px] font-semibold leading-snug text-ink"
                    >
                      {row.label}
                    </th>
                    <td className="px-2.5 py-2.5 align-top text-[12px] font-medium leading-snug text-ink-soft">
                      {row.typical}
                    </td>
                    <td className="bg-fynd-green/10 px-2.5 py-2.5 align-top text-[12px] font-semibold leading-snug text-ink">
                      <span className="flex items-start gap-1.5">
                        <Check
                          aria-hidden="true"
                          strokeWidth={3}
                          className="mt-[3px] h-3 w-3 shrink-0 text-fynd-green-text"
                        />
                        {row.optimized}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-[12px] font-medium leading-snug text-ink-soft">
            {copy.rowsNote}
          </p>
        </Reveal>

        {/* md and up: the full cards. */}
        <div className="mx-auto mt-10 hidden max-w-[880px] gap-8 md:grid md:grid-cols-2">
          <Reveal>
            <Caption tone="orange">{p.typicalLabel}</Caption>
            <GoogleProfile state="typical" className="mt-3 w-full" />
          </Reveal>
          <Reveal delay={0.12}>
            <Caption tone="green">{p.optimizedLabel}</Caption>
            <GoogleProfile state="optimized" className="mt-3 w-full" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Dot({ tone, className }: { tone: "orange" | "green"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        tone === "orange" ? "bg-fynd-orange" : "bg-fynd-green",
        className,
      )}
    />
  );
}

function Caption({
  tone,
  children,
}: {
  tone: "orange" | "green";
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-micro uppercase text-ink-soft">
      <Dot tone={tone} className="h-2.5 w-2.5" />
      {children}
    </p>
  );
}
