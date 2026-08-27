import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { ArrowUpRight } from "lucide-react";
import { demoCta, footerCta } from "@/content/copy";
import { brand } from "@/lib/brand";

/**
 * Minimal chrome for the funnel pages. They already know who I am — they just
 * got off the phone — so there's no nav and nothing to click away with.
 */
export function FunnelHeader({
  tone = "light",
}: {
  /** "dark" sits directly above the navy hero with no seam. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <header className={dark ? "bg-navy" : "border-b border-line bg-white"}>
      <Container>
        <div className="flex h-16 items-center">
          <Link href="/" aria-label="Fynd — home">
            <Logo tone={dark ? "light" : "dark"} priority />
          </Link>
        </div>
      </Container>
    </header>
  );
}

/**
 * Site footer.
 *
 * It used to carry the compliance block — the Google trademark disclaimer and
 * the "message and data rates apply / reply STOP" SMS line — removed by
 * request. Both were here for a reason: the product sends texts on a client's
 * behalf and references Google throughout, and carriers generally expect
 * opt-out language wherever the programme is described. See the note in
 * AGENTS.md before assuming this page has no disclosure obligations.
 */
export function FunnelFooter({ children }: { children?: ReactNode }) {
  return (
        // pb clears the sticky CTA pills: they sit 20px off the bottom and stand
    // 48px tall, so without it the copyright line reads underneath them. The
    // extra space is invisible on the pages without a sticky bar — it is navy
    // on navy.
    <footer className="bg-navy pb-28 pt-12 text-white lg:pb-32 lg:pt-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo tone="light" showTagline />
            <p className="measure mt-5 text-small text-white/72">
              {brand.description}
            </p>
          </div>

          <div>
            <p className="text-micro uppercase text-white/72">Legal</p>
            <ul className="mt-4 flex flex-col gap-3">
              {["Privacy policy", "Terms of service", "SMS terms"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-small font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-micro uppercase text-white/72">Get in touch</p>
            {/* A link rather than a sentence: the footer is where someone
                lands after reading everything, and "reply to my text" only
                worked for the people who arrived from one. */}
            <Link
              href={demoCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-small font-semibold text-fynd-green underline-offset-4 hover:underline"
            >
              {footerCta.label}
              <span className="sr-only"> ({demoCta.newTabHint})</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6">
          <p className="text-small text-white/72">
            © {new Date().getFullYear()} Fynd. All rights reserved.
          </p>
          {children}
        </div>
      </Container>
    </footer>
  );
}
