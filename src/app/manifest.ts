import type { MetadataRoute } from "next";
import { brand, colors } from "@/lib/brand";

/**
 * Web app manifest, served at /manifest.webmanifest with the <link> emitted
 * automatically.
 *
 * The favicon_io export ships this as a static file with empty name fields and
 * white theme colours. Written as a route instead so the name and description
 * come from lib/brand and cannot drift from the rest of the site, and so the
 * chrome colour is Fynd navy — a white bar under a navy site looks like a
 * rendering fault on Android.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: colors.navy,
    theme_color: colors.navy,
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
