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

/**
 * The site header: navy, the same 64px bar as `FunnelHeader` so the pages
 * that keep that one (the texted links) line up with these. The logo goes
 * home, the three services link across, "Book a call" on the right; on a
 * phone a menu button opens a navy sheet with the same links. The current
 * page's link is white, the rest dimmed.
 *
 * In the flow, not fixed: every hero under it is navy, so a transparent
 * floating bar would only ever hide the top of the headline.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="bg-navy">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Fynd — home">
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
            <ButtonLink href={nav.cta.href} variant="outlineLight" arrow className="h-10 px-5 text-small sm:h-10">
              {nav.cta.label}
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
                arrow
                className="mt-6 w-full"
                onClick={() => setOpen(false)}
              >
                {nav.cta.label}
              </ButtonLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
