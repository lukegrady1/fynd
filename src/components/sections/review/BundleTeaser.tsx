"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { bundle } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

/**
 * The Website + Reviews plan, teased at the bottom of the homepage.
 *
 * One card, one link, to /website. It sits after the FAQ and before the
 * closer: everything above it sells the $97 system, and this is for the
 * reader who got to the end still wanting the site done too. Fynd Gray
 * between the white FAQ and the navy closer so it reads as its own thing.
 */
export function BundleTeaser() {
  const copy = bundle.teaser;

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[760px]">
          <div className="grid gap-6 rounded-lg border border-line bg-white p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 lg:p-8">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-fynd-blue/25 bg-fynd-blue/[0.07] text-fynd-blue"
            >
              <Globe strokeWidth={1.75} className="h-6 w-6" />
            </span>

            <div>
              <Eyebrow variant="pill">{copy.eyebrow}</Eyebrow>
              <h2 className="mt-3 text-h2 text-ink">
                {copy.lead}{" "}
                <span className="whitespace-nowrap text-fynd-green-text">
                  {copy.accent}
                </span>
              </h2>
              <p className="mt-2 text-body text-ink-soft">{copy.body}</p>
            </div>

            <Link
              href={copy.href}
              onClick={() =>
                track("cta_click", { cta: copy.cta, section: "bundle_teaser" })
              }
              className="group flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99]"
            >
              {copy.cta}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
