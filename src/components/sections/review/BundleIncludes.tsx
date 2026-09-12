import { Check, Globe, Star } from "lucide-react";
import { bundle } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * What the $249 buys, as two lists side by side.
 *
 * Two columns rather than one long list because the plan IS two things, and
 * the reader's question is "what do I get for the extra $152" — the website
 * column is that answer, and it needs to be readable on its own.
 */
export function BundleIncludes() {
  const copy = bundle.includes;

  return (
    <section className="bg-white py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow variant="pill" className="mx-auto">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[960px] gap-5 md:grid-cols-2 md:gap-6">
          <Reveal className="flex">
            <Column
              tone="blue"
              icon={<Globe aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />}
              title={copy.website.title}
              blurb={copy.website.blurb}
              items={copy.website.items}
            />
          </Reveal>
          <Reveal delay={0.08} className="flex">
            <Column
              tone="green"
              icon={<Star aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />}
              title={copy.reviews.title}
              blurb={copy.reviews.blurb}
              items={copy.reviews.items}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

const TONES = {
  blue: "border-fynd-blue/25 bg-fynd-blue/[0.07] text-fynd-blue",
  green: "border-fynd-green/25 bg-fynd-green/[0.07] text-fynd-green-text",
} as const;

function Column({
  tone,
  icon,
  title,
  blurb,
  items,
}: {
  tone: keyof typeof TONES;
  icon: React.ReactNode;
  title: string;
  blurb: string;
  items: readonly string[];
}) {
  return (
    <div className="flex w-full flex-col rounded-lg border border-line bg-fynd-gray p-6 lg:p-8">
      <span className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${TONES[tone]}`}
        >
          {icon}
        </span>
        <span className="text-h3 text-ink">{title}</span>
      </span>
      <p className="mt-3 text-body text-ink-soft">{blurb}</p>

      <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-fynd-green/15">
              <Check
                aria-hidden="true"
                strokeWidth={3}
                className="h-2.5 w-2.5 text-fynd-green-text"
              />
            </span>
            <span className="text-body text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
