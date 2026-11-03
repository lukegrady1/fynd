import {
  BadgeCheck,
  Bookmark,
  CalendarCheck,
  Camera,
  Check,
  CircleHelp,
  Clock,
  Globe,
  Images,
  Megaphone,
  Navigation,
  Phone,
  Star,
  StarHalf,
  Store,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { optimize } from "@/content/copy";
import { cn } from "@/lib/utils";

type State = "typical" | "optimized";
type Section = (typeof optimize.profile.sections)[number];
type Annotate = "numbered" | "dots" | "none";

/**
 * A Google Business Profile, drawn the way a customer sees it: the panel
 * that opens on a phone after searching the business by name. Photo strip,
 * name and rating, the row of round action buttons, then the stacked rows
 * Google fills from whatever the owner has entered.
 *
 * Not a screenshot. A real profile can't be shown half-finished without
 * naming whose it is, so it is one component in two states with the same
 * business, rating and review count in both — only the fields change, which
 * is exactly the claim the page makes. Typical rows show Google's empty
 * state ("Be the first to ask a question."), and an orange marker sits on
 * each gap like markup over a screenshot; `annotate="numbered"` keys those
 * markers to the legend the hero draws beside the card.
 *
 * `compact` is the hero's cut: three rows, so the card reads as a phone beside
 * the headline rather than becoming the page.
 *
 * No client JavaScript. The rows are a <dl>, so a screen reader gets
 * "Services: No services listed. Missing" rather than a grid of fragments.
 */
export function GoogleProfile({
  state,
  compact = false,
  annotate = "dots",
  className,
}: {
  state: State;
  compact?: boolean;
  annotate?: Annotate;
  className?: string;
}) {
  const p = optimize.profile;
  const optimized = state === "optimized";
  const sections = compact
    ? p.sections.filter((s) =>
        (p.heroSections as readonly string[]).includes(s.key),
      )
    : p.sections;
  const gaps = profileGaps(compact);
  const markerFor = (key: string) =>
    optimized ? null : gaps.findIndex((g) => g.key === key) + 1;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-white text-left",
        optimized ? "shadow-lg" : "shadow-md",
        className,
      )}
    >
      <figcaption className="sr-only">
        {p.exampleLabel} Google Business Profile, {state}: {p.business}
      </figcaption>

      {/* Photo strip. A photo mosaic when there are photos to show, the
          grey of an empty one when not. */}
      <div className={cn("relative", compact ? "h-[112px]" : "h-[132px]")}>
        {optimized ? (
          <div
            aria-hidden="true"
            className="grid h-full grid-cols-[1.6fr_1fr] grid-rows-2 gap-0.5"
          >
            <div className="row-span-2 bg-[linear-gradient(135deg,#4c5bff_0%,#19d3a2_100%)]" />
            <div className="bg-[linear-gradient(135deg,#4c5bff_0%,#7a5cff_100%)]" />
            <div className="flex items-center justify-center bg-navy-card text-small font-semibold text-white/85">
              {p.photos.optimized.more}
            </div>
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center bg-fynd-gray"
          >
            <Camera strokeWidth={1.5} className="h-8 w-8 text-ink-muted" />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-px text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-soft ring-1 ring-line">
          {p.exampleLabel}
        </span>

        <span
          className={cn(
            "absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            optimized
              ? "bg-navy/70 text-white"
              : "bg-white text-ink-soft ring-1 ring-line",
          )}
        >
          <Images aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
          {p.photos[state].value}
          {!optimized && <span className="sr-only">, {p.missingLabel}</span>}
        </span>

        <Marker n={markerFor("photos")} annotate={annotate} className="right-3 top-3" />
      </div>

      {/* Name, rating, category line. */}
      <div className="relative px-4 pt-4">
        <p className="pr-10 text-[19px] font-semibold leading-tight text-ink">
          {p.business}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-small">
          <span className="sr-only">{p.ratingSr}</span>
          <span aria-hidden="true" className="font-semibold tabular-nums text-ink">
            {p.rating}
          </span>
          <Stars />
          <span aria-hidden="true" className="tabular-nums text-ink-soft">
            ({p.reviews})
          </span>
        </p>
        <p className="mt-1 pr-10 text-small text-ink-soft">
          <span className={cn(optimized && "text-ink")}>{p.category[state].value}</span>
          {!optimized && <span className="sr-only">, {p.missingLabel}</span>}
          {" · "}
          {p.hoursLine[state]}
        </p>
        <Marker
          n={markerFor("category")}
          annotate={annotate}
          className="bottom-0 right-4"
        />
      </div>

      {/* The row of round buttons Google puts under every profile. */}
      <ul aria-hidden="true" className="mt-4 flex justify-between gap-2 px-5">
        {p.actions[state].map((action) => {
          const Icon = actionIcon[action] ?? Globe;
          const filled = action === "Book";
          return (
            <li key={action} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  filled
                    ? "bg-fynd-blue text-white"
                    : "border border-line text-fynd-blue",
                )}
              >
                <Icon strokeWidth={2} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[11px] font-medium text-ink-soft">
                {action}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 border-t border-line">
        {sections.map((section) => (
          <Row
            key={section.key}
            section={section}
            state={state}
            marker={markerFor(section.key)}
            annotate={annotate}
          />
        ))}
      </dl>
    </figure>
  );
}

/**
 * The typical card's gaps in the order the markers count them — photos and
 * category first because they sit at the top of the card, then the rows.
 * The hero builds its legend from this so the numbers match.
 */
export function profileGaps(compact = false) {
  const p = optimize.profile;
  const sections = compact
    ? p.sections.filter((s) =>
        (p.heroSections as readonly string[]).includes(s.key),
      )
    : p.sections;
  return [
    { key: "photos", label: p.photos.typical.gap },
    { key: "category", label: p.category.typical.gap },
    ...sections.map((s) => ({ key: s.key, label: s.typical.gap })),
  ];
}

const actionIcon: Record<string, LucideIcon> = {
  Call: Phone,
  Directions: Navigation,
  Website: Globe,
  Save: Bookmark,
  Book: CalendarCheck,
};

const rowIcon: Record<string, LucideIcon> = {
  description: Store,
  services: Wrench,
  hours: Clock,
  qa: CircleHelp,
  updates: Megaphone,
  attributes: BadgeCheck,
};

function Row({
  section,
  state,
  marker,
  annotate,
}: {
  section: Section;
  state: State;
  marker: number | null;
  annotate: Annotate;
}) {
  const p = optimize.profile;
  const Icon = rowIcon[section.key] ?? Store;
  const content = section[state];
  const optimized = state === "optimized";

  return (
    <div className="relative flex gap-3 border-b border-line px-4 py-3 pr-12 last:border-b-0">
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink-soft"
      />
      <div className="min-w-0 flex-1">
        <dt className="text-[13px] font-semibold text-ink">{section.label}</dt>
        <dd className="mt-1">
          <RowContent content={content} />
          {!optimized && <span className="sr-only"> {p.missingLabel}</span>}
        </dd>
      </div>
      {optimized ? (
        annotate !== "none" && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-fynd-green/15 text-fynd-green-text"
          >
            <Check strokeWidth={3} className="h-3 w-3" />
          </span>
        )
      ) : (
        <Marker n={marker} annotate={annotate} className="right-4 top-3" />
      )}
    </div>
  );
}

function RowContent({ content }: { content: Section[State] }) {
  if ("empty" in content) {
    return (
      <p className="text-[13px] font-normal leading-snug text-ink-soft">
        {content.empty}
      </p>
    );
  }
  if ("chips" in content) {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {content.chips.map((chip) => (
          <li key={chip}>
            <Chip>{chip}</Chip>
          </li>
        ))}
        {"more" in content && (
          <li className="self-center text-[12px] font-medium text-ink-soft">
            {content.more}
          </li>
        )}
      </ul>
    );
  }
  return (
    <p className="line-clamp-3 text-[13px] leading-snug text-ink">
      {content.text}
    </p>
  );
}

/** A service or attribute chip as the panel draws it. */
export function Chip({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green";
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[12px] font-medium leading-tight",
        tone === "green"
          ? "bg-fynd-green/15 text-fynd-green-text"
          : "bg-fynd-gray text-ink",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Orange markup over the drawn profile: a numbered disc keyed to the legend,
 * or a plain dot where there is no legend. Decorative — every gap also says
 * "Missing" to a screen reader in its own row.
 */
function Marker({
  n,
  annotate,
  className,
}: {
  n: number | null;
  annotate: Annotate;
  className?: string;
}) {
  if (!n || annotate === "none") return null;
  if (annotate === "dots") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "absolute h-3 w-3 rounded-full bg-fynd-orange ring-[3px] ring-fynd-orange/25",
          className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute flex h-6 w-6 items-center justify-center rounded-full bg-fynd-orange text-[11px] font-bold tabular-nums text-navy ring-[3px] ring-fynd-orange/25",
        className,
      )}
    >
      {n}
    </span>
  );
}

/**
 * Four and a half for the 4.6. Orange rather
 * than green: green fails as a small filled shape, and orange is the
 * palette's rating colour elsewhere.
 */
export function Stars() {
  return (
    <span aria-hidden="true" className="flex items-center gap-px text-fynd-orange">
      {Array.from({ length: 4 }).map((_, i) => (
        <Star key={i} strokeWidth={1.5} className="h-3.5 w-3.5 fill-current" />
      ))}
      <span className="relative h-3.5 w-3.5">
        <Star strokeWidth={1.5} className="absolute inset-0 h-3.5 w-3.5" />
        <StarHalf
          strokeWidth={1.5}
          className="absolute inset-0 h-3.5 w-3.5 fill-current"
        />
      </span>
    </span>
  );
}
