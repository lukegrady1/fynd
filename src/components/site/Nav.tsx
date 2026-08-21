"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { nav } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Navy bar — transparent over the hero, solid once scrolled. */
export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const isSolid = solid || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-250 ease-fynd",
        isSolid ? "bg-navy shadow-md" : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-18 items-center justify-between py-4">
          <Link href="/" aria-label="Fynd — home">
            <Logo tone="light" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[15px] font-medium text-white/80 transition-colors duration-150 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href={nav.login.href}
              className="text-[15px] font-medium text-white transition-opacity hover:opacity-80"
            >
              {nav.login.label}
            </Link>
            <ButtonLink href={nav.cta.href} arrow>
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

      {/* Mobile: full-screen navy sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-navy lg:hidden">
          <Container>
            <div className="flex h-18 items-center justify-between py-4">
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
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center text-h3 text-white"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={nav.login.href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center text-h3 text-white"
              >
                {nav.login.label}
              </Link>
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
