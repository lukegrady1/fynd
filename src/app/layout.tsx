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
  openGraph: {
    title: "Fynd — Be found. Everywhere.",
    description: brand.description,
    siteName: "Fynd",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
