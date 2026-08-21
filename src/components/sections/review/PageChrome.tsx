import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";

/**
 * Minimal chrome for the funnel pages. They already know who I am — they just
 * got off the phone — so there's no nav, no menu, nothing to click away with.
 */
export function FunnelHeader() {
  return (
    <header className="border-b border-line bg-white">
      <Container>
        <div className="flex h-16 items-center">
          <Link href="/" aria-label="Fynd — home">
            <Logo tone="dark" />
          </Link>
        </div>
      </Container>
    </header>
  );
}

export function FunnelFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="border-t border-line bg-white py-8">
      <Container>
        <div className="flex flex-col gap-2">
          <Logo tone="dark" />
          <p className="text-small text-ink-soft">
            © {new Date().getFullYear()} Fynd. All rights reserved.
          </p>
          {children}
        </div>
      </Container>
    </footer>
  );
}
