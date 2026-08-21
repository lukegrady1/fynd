import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DotGrid } from "@/components/textures/Textures";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Signature pattern 5 — CTA closer.
 * Navy block (or gradient mesh), centered H2 headline, one primary button.
 */
export function CtaCloser({
  line1 = brand.headline.line1,
  line2 = brand.headline.line2,
  supporting = brand.supporting,
  cta = { label: "Book a Demo", href: "/#demo" },
  variant = "navy",
  className,
}: {
  line1?: string;
  line2?: string;
  supporting?: string;
  cta?: { label: string; href: string };
  variant?: "navy" | "mesh";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-16 lg:py-24",
        variant === "navy" ? "bg-navy" : "bg-grad-mesh",
        className,
      )}
    >
      {variant === "navy" && <DotGrid tone="dark" />}

      <Container className="relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-h1 text-white lg:text-[2.75rem] lg:leading-[3.25rem]">
            <span className="block">{line1}</span>
            <span
              className={cn(
                "block",
                variant === "navy" ? "text-fynd-green" : "text-white/90",
              )}
            >
              {line2}
            </span>
          </h2>
          <p className="mt-4 text-body text-white/75">{supporting}</p>
          <ButtonLink
            href={cta.href}
            arrow
            size="lg"
            variant={variant === "navy" ? "primary" : "outlineLight"}
            className="mt-8"
          >
            {cta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
