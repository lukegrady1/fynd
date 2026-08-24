import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ReactNode } from "react";

export function Card({
  tone = "light",
  size = "sm",
  interactive = false,
  className,
  children,
}: {
  tone?: "light" | "dark" | "gray";
  /** sm = 16px radius / 24px padding · lg = 24px radius / 32px padding */
  size?: "sm" | "lg";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        size === "sm" ? "rounded-md p-6" : "rounded-lg p-8",
        tone === "light" && "border border-line bg-white shadow-sm",
        tone === "gray" && "border border-line bg-fynd-gray",
        tone === "dark" && "border border-white/8 bg-navy-card text-white",
        interactive &&
          "transition-all duration-[180ms] ease-fynd hover:-translate-y-0.5 hover:border-fynd-blue/40 hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Testimonial card — light gray fill, decorative quote glyph, avatar row,
 * and a 5-star rating in Fyne Green.
 */
export function TestimonialCard({
  quote,
  name,
  role,
  initials,
  className,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  className?: string;
}) {
  return (
    <figure
      className={cn("relative rounded-lg bg-fynd-gray p-8", className)}
    >
      <span
        aria-hidden="true"
        className="absolute left-6 top-3 select-none text-[40px] font-bold leading-none text-fynd-blue/30"
      >
        &ldquo;
      </span>
      <blockquote className="relative pt-6 text-body leading-[26px] text-ink">
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-small font-semibold text-white">
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="text-[15px] font-semibold text-ink">{name}</span>
          <span className="text-[13px] font-normal text-ink-soft">{role}</span>
        </span>
      </figcaption>
      <div className="mt-4 flex gap-1" aria-label="Rated 5 out of 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className="h-4 w-4 fill-fynd-green text-fynd-green"
          />
        ))}
      </div>
    </figure>
  );
}
