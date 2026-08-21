import { founder } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { LogoMark } from "@/components/brand/Logo";
import { Reveal } from "./Reveal";

/**
 * A plain note, set as prose rather than as another card grid. They just got
 * off the phone with Luke — this should read like the same person, so it gets
 * a measure, a signature, and nothing else.
 */
export function FounderNote() {
  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <div className="mx-auto max-w-[680px]">
          <Reveal>
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-h1 text-ink">{founder.heading}</h2>

            <div className="mt-5 flex flex-col gap-4">
              {founder.body.map((para) => (
                <p key={para.slice(0, 24)} className="text-body text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
              <LogoMark className="h-8 w-8 shrink-0" />
              <div>
                <p className="text-[15px] font-semibold text-ink">
                  {founder.signoff}
                </p>
                <p className="text-small text-ink-soft">{founder.role}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-10 rounded-lg border-l-2 border-fynd-green bg-fynd-gray p-6 lg:p-8">
              <h3 className="text-h3 text-ink">
                {founder.guarantee.heading}
              </h3>
              <p className="mt-2 text-body text-ink-soft">
                {founder.guarantee.body}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
