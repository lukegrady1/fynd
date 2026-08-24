import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DottedWorldMap } from "@/components/textures/Textures";
import { cn } from "@/lib/utils";

/**
 * Signature pattern 1 — dark hero.
 * Deep Navy + dotted world map with colored pins. H1 in two lines, the payoff
 * line in Fyne Green. Subcopy max 520px. Primary + outline-white buttons.
 */
export function Hero({
  eyebrow,
  line1,
  line2,
  subcopy,
  primary,
  secondary,
  aside,
  className,
}: {
  eyebrow?: string;
  line1: string;
  line2: string;
  subcopy: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Optional product screenshot floated right with a soft blue glow. */
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-navy pb-12 pt-30 md:pb-16 md:pt-34 lg:pb-24 lg:pt-40",
        className,
      )}
    >
      <DottedWorldMap />

      <Container className="relative">
        <div
          className={cn(
            "grid items-center gap-12",
            aside && "lg:grid-cols-[1fr_1fr] lg:gap-16",
          )}
        >
          <div className="reveal">
            {eyebrow && (
              <Eyebrow tone="light" className="mb-4">
                {eyebrow}
              </Eyebrow>
            )}
            <h1 className="text-[2rem] font-bold leading-10 tracking-[-0.01em] text-white sm:text-h1 lg:text-display">
              <span className="block">{line1}</span>
              <span className="block text-fynd-green">{line2}</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-body text-white/75">
              {subcopy}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={primary.href} arrow size="lg">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink
                  href={secondary.href}
                  variant="outlineLight"
                  size="lg"
                  arrow
                >
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>

          {aside && (
            <div className="relative reveal [animation-delay:120ms]">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-lg bg-fynd-blue/25 blur-3xl"
              />
              <div className="relative">{aside}</div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
