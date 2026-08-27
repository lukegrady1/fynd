import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

/** Single family — no secondary typeface, no serifs anywhere. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fynd — Be found. Everywhere.",
    template: "%s | Fynd",
  },
  description: brand.description,
  /**
   * The title is what a link preview prints under the image, so it is the
   * tagline on its own — the site name is already carried by `siteName` and by
   * the domain every unfurler shows, and repeating it inside the title just
   * spends the line twice.
   *
   * The image itself is src/app/opengraph-image.png; Next emits its URL, type
   * and dimensions from the file, so there is nothing to declare here.
   */
  openGraph: {
    title: "Be Found Everywhere",
    description: brand.description,
    siteName: "Fynd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Be Found Everywhere",
    description: brand.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
