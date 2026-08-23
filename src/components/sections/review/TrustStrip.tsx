import { trustStrip } from "@/content/copy";
import { Container } from "@/components/ui/Layout";

/**
 * A thin qualifying strip under the hero. Its job is to let the visitor
 * confirm "this is for me" in two seconds, not to sell anything.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-navy py-8">
      <Container>
        <p className="text-center text-small text-white/60">
          {trustStrip.lead}
        </p>

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
          {trustStrip.industries.map((industry, i) => (
            <li key={industry} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-white/20">
                  ·
                </span>
              )}
              <span className="text-small font-semibold text-white/85">
                {industry}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-small text-white/60">
          {trustStrip.crms}
        </p>
      </Container>
    </section>
  );
}
