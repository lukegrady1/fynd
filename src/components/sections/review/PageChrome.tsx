import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
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
 * Footer carries the compliance text these pages need: SMS opt-in disclosure
 * and the trademark note, since the product sends text messages on the
 * client's behalf and references Google throughout.
 */
export function FunnelFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="bg-navy py-12 text-white lg:py-14">
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
            <p className="mt-4 text-small text-white/80">
              Reply to my text and I&apos;ll answer there. It&apos;s the fastest
              way to reach me.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6">
          <p className="text-small text-white/72">
            © {new Date().getFullYear()} Fynd. All rights reserved.
          </p>
          <p className="text-[13px] font-normal leading-relaxed text-white/55">
            Google and Google Maps are trademarks of Google LLC. Fynd is not
            affiliated with, endorsed by, or sponsored by Google. Review
            requests are sent only to customers of the subscribing business.
            Message and data rates may apply; reply STOP to opt out of messages
            at any time.
          </p>
          {children}
        </div>
      </Container>
    </footer>
  );
}
