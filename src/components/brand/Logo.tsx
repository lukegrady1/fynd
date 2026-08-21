import { cn } from "@/lib/utils";

/**
 * The Fynd mark: a stylized "F" from three elements —
 *   1. blue leaf/flag (top arm) curving right
 *   2. green leaf/flag (lower arm) curving right, overlapping the blue
 *   3. orange circle at the base-left of the stem
 * Never recolor, rotate, stretch, or reorder these elements.
 */
export function LogoMark({
  className,
  monotone,
}: {
  className?: string;
  /** Reverse to a single color — used inside solid brand-color icon variants. */
  monotone?: string;
}) {
  const blue = monotone ?? "#4C5BFF";
  const green = monotone ?? "#19D3A2";
  const orange = monotone ?? "#FF8A1F";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* stem of the F */}
      <rect x="13" y="6" width="9" height="46" rx="4.5" fill={blue} />
      {/* top arm — blue leaf/flag curving right */}
      <path
        d="M20 6c19 0 33 3.6 33 8.6S39 23.2 20 23.2V6Z"
        fill={blue}
      />
      {/* lower arm — green leaf/flag curving right, overlapping the blue */}
      <path
        d="M20 21.5c14.5 0 25 3.3 25 7.8s-10.5 7.8-25 7.8V21.5Z"
        fill={green}
      />
      {/* base-left orange circle */}
      <circle cx="11" cy="53" r="7" fill={orange} />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "light",
}: {
  className?: string;
  /** "light" = white text (on navy), "dark" = navy text (on white). */
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "font-sans font-bold tracking-[-0.01em]",
        tone === "light" ? "text-white" : "text-navy",
        className,
      )}
    >
      Fynd
    </span>
  );
}

/**
 * Full lockup: mark + wordmark, with the tagline set beneath the wordmark.
 * Below 120px wide the tagline drops; below 64px use LogoMark alone.
 */
export function Logo({
  className,
  tone = "light",
  showTagline = false,
  markClassName,
}: {
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8 shrink-0", markClassName)} />
      <span className="flex flex-col justify-center">
        <Wordmark tone={tone} className="text-h3 leading-none" />
        {showTagline && (
          <span
            className={cn(
              "mt-1 text-[10px] font-medium uppercase leading-none tracking-[0.25em]",
              tone === "light" ? "text-white/70" : "text-ink-soft",
            )}
          >
            Being found everywhere.
          </span>
        )}
      </span>
    </span>
  );
}
