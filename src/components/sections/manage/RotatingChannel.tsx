"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandMark, BrandName, type Brand } from "./ChannelLogos";

/**
 * The channel on the hero's third line, cycling: ChatGPT, Google Maps,
 * Gemini… each as its mark and its name in the brand's styling. The
 * outgoing one fades, the incoming one plays the enter animation
 * (`.rot-logo` / `.rot-ch` in globals.css) because it remounts on a
 * new key.
 *
 * Progressive enhancement: the first channel is in the markup, so the
 * line reads without JavaScript, and the full list is there for screen
 * readers. Reduced-motion users get the first channel and no cycling.
 */
export function RotatingChannel({
  channels,
  sr,
  className,
}: {
  channels: readonly { brand: Brand; name: string }[];
  sr: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap = 0;
    const tick = window.setInterval(() => {
      setShown(false);
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % channels.length);
        setShown(true);
      }, 300);
    }, 2600);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(swap);
    };
  }, [channels.length]);

  const channel = channels[index];

  return (
    <span className={cn("inline-grid h-[1.3em] place-items-center", className)}>
      <span className="sr-only">{sr}</span>
      <span
        key={index}
        aria-hidden="true"
        className={cn(
          "inline-flex items-center gap-[0.22em] whitespace-nowrap transition-opacity duration-300 ease-fynd [perspective:600px]",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        <BrandMark brand={channel.brand} />
        <BrandName brand={channel.brand} name={channel.name} />
      </span>
    </span>
  );
}
