import { Check, X } from "lucide-react";
import { compliance } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * The compliance answer, given properly rather than waved away in one FAQ line.
 * "Is this allowed?" is a real objection for anyone who's been burned by a
 * review tool before, and the honest answer is a competitive advantage.
 */
export function Compliance() {
  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{compliance.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-h1 text-ink">{compliance.heading}</h2>
            <p className="measure mt-3 text-body text-ink-soft">
              {compliance.sub}
            </p>

            <p className="mt-6 rounded-sm border-l-2 border-fynd-blue bg-white px-4 py-3 text-small text-ink">
              {compliance.privateRouting}
            </p>
          </Reveal>

          <ul className="flex flex-col gap-px overflow-hidden rounded-lg border border-line bg-line">
            {compliance.rules.map((rule, i) => (
              <li key={rule.title} className="bg-white">
                <Reveal delay={i * 0.05} className="flex gap-4 p-5 lg:p-6">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      rule.ok ? "bg-fynd-green/15" : "bg-fynd-orange/15",
                    )}
                  >
                    {rule.ok ? (
                      <Check
                        aria-hidden="true"
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5 text-[#0F8F6E]"
                      />
                    ) : (
                      <X
                        aria-hidden="true"
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5 text-fynd-orange"
                      />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-ink">
                      {rule.title}
                    </h3>
                    <p className="mt-1.5 text-small text-ink-soft">
                      {rule.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
