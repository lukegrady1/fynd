"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { nav } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const trackCta = () => track("cta_click", { cta: nav.cta.label, section: "nav" });

/*
 * The logo on the homepage itself: a link to the page you're on does
 * nothing visible, so scroll back to the top instead, smoothly unless the
 * visitor asks for reduced motion (Luke, Nov 17, 2026). Elsewhere it's an
 * ordinary link home.
 */
const toTopOnHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (window.location.pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  if (window.location.hash) history.replaceState(null, "", "/" + window.location.search);
};

/**
 * The site header: navy, the same 64px bar as `FunnelHeader` so the pages
 * that keep that one (the texted links) line up with these. The logo goes
 * home, the three services link across, "Run my free audit" on the right; on a
 * phone a menu button opens a navy sheet with the same links. The current
 * page's link is white, the rest dimmed.
 *
 * Sticky (Luke, Nov 16, 2026): it stays at the top as you scroll. It's
 * solid navy and takes its own 64px at the top of the page, so it never
 * covers a hero's headline. Scroll targets under it carry `scroll-mt-20`
 * (80px) so a scrolled-to section lands below the bar.
 *
 * Once the page scrolls, the bar lifts off the edges into a floating
 * glass capsule (Luke, Nov 16, 2026: "transparent, or something else to
 * look cooler"): navy at 85% with a blur, a hairline ring and a shadow,
 * sized to the nav row (logo to button) rather than the screen. On
 * desktop the row also draws in from the full 1152px to 820px, so the
 * pill holds only the logo, the links and the button (Luke, Nov 16, 2026). Never fully clear: the links are white and half the sections
 * are white (at 70–80% it went a muddy grey over white). The blur sits on its own layer behind the content,
 * NOT on the header: backdrop-filter on the header would make it the
 * containing block for the phone menu's `fixed inset-0` sheet and shrink
 * the sheet to the bar.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {/* At the top: the full-width solid bar. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 bg-navy transition-opacity duration-300 ease-fynd",
          scrolled && "opacity-0",
        )}
      />
      <Container className={cn("relative transition-transform duration-300 ease-fynd", scrolled && "translate-y-1")}>
        <div
          className={cn(
            "relative mx-auto flex h-16 items-center justify-between lg:transition-[max-width] lg:duration-300 lg:ease-fynd",
            scrolled ? "lg:max-w-[820px]" : "lg:max-w-[1152px]",
          )}
        >
          {/* Scrolled: the glass pill, sized to the row (logo to button)
              rather than the screen, so on a wide screen it hugs the
              content. Inside the row, so it is NOT an ancestor of the
              phone sheet below. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -inset-x-2 top-1 bottom-1 -z-10 rounded-full bg-navy/85 shadow-lg ring-1 ring-white/10 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-fynd lg:-inset-x-5",
              scrolled ? "opacity-100" : "scale-[0.98] opacity-0",
            )}
          />
          <Link href="/" aria-label="Fynd — home" onClick={toTopOnHome}>
            <Logo tone="light" priority />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={cn(
                  "text-[15px] font-medium transition-colors duration-150 hover:text-white",
                  pathname === l.href ? "text-white" : "text-white/70",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex">
            <ButtonLink
              href={nav.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCta}
              arrow
              className="h-10 px-5 text-small shadow-blue sm:h-10"
            >
              {nav.cta.label}
              <span className="sr-only"> {nav.cta.newTabSr}</span>
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-white lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </Container>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy lg:hidden">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <Logo tone="light" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-sm text-white"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center text-h3 text-white"
                >
                  {l.label}
                </Link>
              ))}
              <ButtonLink
                href={nav.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                arrow
                className="mt-6 w-full"
                onClick={() => {
                  trackCta();
                  setOpen(false);
                }}
              >
                {nav.cta.label}
                <span className="sr-only"> {nav.cta.newTabSr}</span>
              </ButtonLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
