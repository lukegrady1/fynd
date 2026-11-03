import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { ScrollButton } from "./ScrollButton";

/**
 * "The math": one white card. Eyebrow, two-tone heading, the paragraph,
 * the button over on the right; under them two rows of bars — the usual
 * way as a long bar in two segments (marketer, software) ending in
 * $1,932, and ours as a short green bar ending in $297 — and the
 * estimate note.
 *
 * Bar widths are the amounts, so the picture can't disagree with the
 * figures. The figures are the platform's typical-cost estimates, and
 * the note says so.
 */
export function TheMath() {
  const copy = manage.math;
  const usualTotal = copy.usual.segments.reduce((n, s) => n + s.amount, 0);
  const pct = (amount: number) => `${(amount / usualTotal) * 100}%`;

  return (
    <section className="bg-navy pb-12 lg:pb-20">
      <Container>
        <Reveal className="relative mx-auto max-w-[1120px] overflow-hidden rounded-lg bg-navy-card ring-1 ring-white/10 p-6 text-white shadow-lg sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-fynd-green/[0.12] blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <p className="text-micro uppercase text-[#8FA0FF]">{copy.eyebrow}</p>
              <h2 className="mt-3 text-h1 text-white lg:text-[40px] lg:leading-[1.15]">
                <span className="block">{copy.lead}</span>
                <span className="block text-fynd-green">{copy.accent}</span>
              </h2>
              <p className="mt-4 max-w-[640px] text-body text-white/70 lg:text-[18px] lg:leading-[28px]">
                {copy.body}
              </p>
            </div>
            <ScrollButton targetId="tools" label={copy.cta} section="the_math" />
          </div>

          <div className="relative mt-10 flex flex-col gap-6">
            {/* The usual way */}
            <div className="grid items-center gap-x-6 gap-y-2 sm:grid-cols-[170px_1fr_auto]">
              <div>
                <p className="text-h3 text-white">{copy.usual.label}</p>
                <p className="text-small text-white/70">{copy.usual.sub}</p>
              </div>
              <div aria-hidden="true" className="flex h-11 overflow-hidden rounded-sm">
                {copy.usual.segments.map((seg, i) => (
                  <span
                    key={seg.label}
                    style={{ width: pct(seg.amount) }}
                    className={
                      i === 0
                        ? "flex items-center truncate bg-white/[0.18] px-3 text-small font-semibold text-white"
                        : "flex items-center truncate bg-white/[0.09] px-3 text-[12px] font-semibold text-white/70"
                    }
                  >
                    <span className="hidden sm:inline">{seg.label}</span>
                  </span>
                ))}
              </div>
              <ul aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/70 sm:hidden">
                {copy.usual.segments.map((seg, i) => (
                  <li key={seg.label} className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-sm", i === 0 ? "bg-white/[0.18]" : "bg-white/[0.09]")} />
                    {seg.label}
                  </li>
                ))}
              </ul>
              <p className="text-h2 tabular-nums text-white sm:text-right">
                {copy.usual.total}
                <span className="text-small font-normal text-white/70">{copy.per}</span>
              </p>
            </div>

            {/* With Fynd */}
            <div className="grid items-center gap-x-6 gap-y-2 sm:grid-cols-[170px_1fr_auto]">
              <div>
                <p className="text-h3 text-fynd-green">{copy.ours.label}</p>
                <p className="text-small text-white/70">{copy.ours.sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  style={{ width: pct(copy.ours.amount) }}
                  className="h-11 shrink-0 rounded-sm bg-fynd-green"
                />
                <span className="rounded-full bg-fynd-green/20 px-2.5 py-1 text-micro uppercase text-fynd-green">
                  {copy.ours.saving}
                </span>
              </div>
              <p className="text-h2 tabular-nums text-fynd-green sm:text-right">
                {copy.ours.total}
                <span className="text-small font-normal text-white/70">{copy.per}</span>
              </p>
            </div>
          </div>

          <p className="relative mt-8 text-small text-white/70">{copy.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
