import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "outline" | "outlineLight" | "link";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-sm font-semibold " +
  "transition-all duration-150 ease-fynd disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-fynd-blue text-white hover:bg-[#3F4DF0] hover:-translate-y-px hover:shadow-blue",
  secondary:
    "bg-fynd-green text-white hover:bg-fynd-green2 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(25,211,162,.28)]",
  outline:
    "border-[1.5px] border-fynd-blue text-fynd-blue hover:bg-fynd-blue/8",
  // On navy: white border + white text.
  outlineLight:
    "border-[1.5px] border-white text-white hover:bg-white/10",
  link: "text-fynd-blue hover:underline underline-offset-4 px-0 h-auto",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-body sm:h-11",
  lg: "h-13 px-8 text-body sm:h-12",
};

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  /** Right-side arrow that translates 3px on hover. */
  arrow?: boolean;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ButtonOwnProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        variant !== "link" && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        base,
        variants[variant],
        variant !== "link" && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      strokeWidth={2}
      className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
    />
  );
}
