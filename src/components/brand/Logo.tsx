import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of the supplied artwork — used for aspect ratio only. */
const MARK_W = 1831;
const MARK_H = 2048;

/**
 * The Fynd mark, from the supplied artwork at /transparent-fynd.PNG.
 *
 * The source is a transparent PNG, so it sits on navy and on white without a
 * variant. It is taller than it is wide (0.894:1), so callers set a height and
 * let the width follow — never a square box, which would squash it.
 *
 * next/image serves a correctly-sized WebP, so the large source file never
 * reaches the browser.
 */
export function LogoMark({
  className,
  priority = false,
  sizes = "32px",
}: {
  className?: string;
  /** Set on above-the-fold placements (the header) to avoid a lazy-load pop. */
  priority?: boolean;
  /**
   * Required in practice. Without it next/image builds a 1x/2x srcset off the
   * declared intrinsic width (1831px), and a 2x screen downloads the 3840px
   * candidate — 48KB for a 25px logo. With it the browser picks the 64px
   * candidate instead, which is ~1.7KB.
   */
  sizes?: string;
}) {
  return (
    <Image
      src="/transparent-fynd.PNG"
      alt=""
      aria-hidden="true"
      width={MARK_W}
      height={MARK_H}
      sizes={sizes}
      priority={priority}
      className={cn("h-8 w-auto", className)}
    />
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
  priority = false,
  sizes,
}: {
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
  markClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark
        priority={priority}
        sizes={sizes}
        className={cn("h-7 w-auto shrink-0", markClassName)}
      />
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
