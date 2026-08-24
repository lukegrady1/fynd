import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

/** 12-col grid, 24px gutters, 1200px max, 24px page padding (16px mobile). */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

type Tone = "white" | "gray" | "navy";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  gray: "bg-fynd-gray text-ink",
  navy: "bg-navy text-white",
};

/** Section padding: 48px mobile → 64px tablet → 96–128px desktop. */
export function Section({
  tone = "white",
  className,
  children,
  id,
  as: Tag = "section",
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  id?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative isolate overflow-hidden py-12 md:py-16 lg:py-24",
        tones[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Uppercase micro label — 12/16, 0.12em tracking. */
export function Eyebrow({
  className,
  children,
  tone = "dark",
  variant = "plain",
}: {
  className?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  /** "pill" gives it a bordered chip, for section openers that need weight. */
  variant?: "plain" | "pill";
}) {
  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-micro uppercase",
          tone === "light"
            ? "border-white/20 bg-white/5 text-white/80"
            : "border-line bg-white text-ink-soft",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <p
      className={cn(
        "text-micro uppercase",
        tone === "light" ? "text-white/72" : "text-ink-soft",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Section heading in the brand's two-line form — the payoff word in Fyne Green.
 * On white backgrounds green text is darkened to #0F8F6E for contrast, unless
 * the type is large display weight.
 */
export function SplitHeading({
  line1,
  line2,
  tone = "dark",
  as: Tag = "h2",
  className,
}: {
  line1: string;
  line2: string;
  tone?: "dark" | "light";
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={cn(tone === "light" ? "text-white" : "text-ink", className)}>
      <span className="block">{line1}</span>
      <span className="block text-fynd-green">{line2}</span>
    </Tag>
  );
}
