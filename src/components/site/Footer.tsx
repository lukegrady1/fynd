import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { brand } from "@/lib/brand";

const columns = [
  {
    heading: "Product",
    links: ["Listings", "Reviews", "AI Search", "Reports", "Automations"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Contact", "Partners"],
  },
  {
    heading: "Resources",
    links: ["Blog", "Help center", "Local SEO guide", "Status"],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-navy py-12 text-white lg:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" showTagline />
            <p className="measure mt-5 text-small text-white/72">
              {brand.description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-micro uppercase text-white/72">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
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
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/72">
            © {new Date().getFullYear()} Fyne. All rights reserved.
          </p>
          <p className="text-micro uppercase text-white/72">
            Visibility · Reputation · Growth
          </p>
        </div>
      </Container>
    </footer>
  );
}
