import { illustrative, proof } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

/**
 * Results proof.
 *
 * These figures are ILLUSTRATIVE — they are not a client result. Every block
 * here carries the `Example` badge, and the section closes with the plain-text
 * disclaimer. If real numbers arrive, keep the labelling honest about which is
 * which rather than quietly dropping the badge.
 */
export function ProofSection() {
  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{proof.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{proof.heading}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{proof.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <Reveal>
            <BeforeAfter />
          </Reveal>
          <Reveal delay={0.06}>
            <RankTable />
          </Reveal>
        </div>

        <p className="mt-5 text-small text-ink-soft">{illustrative.note}</p>
      </Container>
    </section>
  );
}

/** Two profile cards, with the delta called out between them. */
function BeforeAfter() {
  const { before, after, delta, heading } = proof.beforeAfter;

  return (
    <div className="h-full rounded-lg border border-line bg-fynd-gray p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-h3 text-ink">{heading}</h3>
        <ExampleBadge />
      </div>

      <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <ProfileCard {...before} muted />
        <span
          aria-hidden="true"
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink-soft sm:mx-0"
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        <ProfileCard {...after} />
      </div>

      <p className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
        <span className="text-[26px] font-bold leading-none tabular-nums text-ink">
          +63
        </span>
        <span className="text-small text-ink-soft">{delta}</span>
      </p>
    </div>
  );
}

function ProfileCard({
  label,
  rating,
  reviews,
  caption,
  muted = false,
}: {
  label: string;
  rating: number;
  reviews: number;
  caption: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white p-4",
        muted ? "border-line" : "border-fynd-green/40",
      )}
    >
      <p className="text-micro uppercase text-ink-soft">{label}</p>
      <p className="mt-2 flex items-baseline gap-2">
        <span
          className={cn(
            "text-[30px] font-bold leading-none tabular-nums",
            muted ? "text-ink-soft" : "text-ink",
          )}
        >
          {rating.toFixed(1)}
        </span>
        <StarRow rating={rating} muted={muted} />
      </p>
      <p className="mt-1.5 text-small tabular-nums text-ink-soft">
        {reviews} reviews
      </p>
      <p className="mt-2 text-[13px] font-normal text-ink-soft">{caption}</p>
    </div>
  );
}

function StarRow({ rating, muted }: { rating: number; muted?: boolean }) {
  const pct = Math.max(0, Math.min(rating / 5, 1)) * 100;
  const fill = muted ? colors.line : colors.green;

  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} color={colors.line} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} color={muted ? colors.navy : fill} />
          ))}
        </span>
      </span>
    </span>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill={color}>
      <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.6Z" />
    </svg>
  );
}

/**
 * Rank table. Tabular numerals and a hairline grid — deliberately closer to a
 * spreadsheet than a marketing card, because that's what makes it credible to
 * someone who checks their own listing every week.
 */
function RankTable() {
  const { heading, sub, rows, takeaway } = proof.rank;

  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-white p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 text-ink">{heading}</h3>
          <p className="mt-1 text-small text-ink-soft">{sub}</p>
        </div>
        <ExampleBadge />
      </div>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="pb-2 text-micro uppercase text-ink-soft">#</th>
            <th className="pb-2 text-micro uppercase text-ink-soft">Business</th>
            <th className="pb-2 text-right text-micro uppercase text-ink-soft">
              Rating
            </th>
            <th className="pb-2 text-right text-micro uppercase text-ink-soft">
              Reviews
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={cn(
                "border-b border-line last:border-0",
                row.you && "bg-fynd-blue/6",
              )}
            >
              <td
                className={cn(
                  "py-3 text-small tabular-nums",
                  row.you ? "font-semibold text-fynd-blue" : "text-ink-soft",
                )}
              >
                {row.you ? "▸" : i + 1}
              </td>
              <td
                className={cn(
                  "py-3 pr-2 text-small",
                  row.you ? "font-semibold text-ink" : "text-ink",
                )}
              >
                {row.name}
              </td>
              <td className="py-3 text-right text-small tabular-nums text-ink">
                {row.rating.toFixed(1)}
              </td>
              <td
                className={cn(
                  "py-3 text-right text-small tabular-nums",
                  row.you ? "font-semibold text-ink" : "text-ink-soft",
                )}
              >
                {row.reviews}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-auto pt-5 text-body text-ink">{takeaway}</p>
    </div>
  );
}

export function ExampleBadge() {
  return (
    <span className="shrink-0 rounded-full border border-line bg-white px-2.5 py-1 text-micro uppercase text-ink-soft">
      {illustrative.badge}
    </span>
  );
}
