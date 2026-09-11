"use client";

import { useRef, useState } from "react";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { watch } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The self-hosted VSL.
 *
 * A native `<video>` rather than a YouTube iframe: the file lives in /public,
 * so there is no third-party script on the critical path and nothing to
 * block LCP — the poster is a plain JPEG and the browser paints it like any
 * other image. `preload="metadata"` fetches only the header, so the 11MB
 * file costs nothing until someone presses play.
 *
 * Click-to-play, with sound. The video has a voice track, so it cannot
 * autoplay unmuted, and a muted autoplay of a talking video is a silent
 * animation nobody understands. Native controls are enabled once it is
 * playing, so scrubbing and volume work the way people expect, and the
 * custom overlay is only the first press.
 *
 * Quartile events (25/50/75/100) fire from `timeupdate`, once each per page
 * load — the same events the YouTube player in DemoVideo reports, so the
 * funnel reads the same whichever page the video was watched on.
 *
 * When it ends the ask appears over the last frame. Someone who has just
 * watched the whole thing is the warmest visitor on the page, and the
 * calendar is a screen below — the button carries them there instead of
 * leaving them looking at a replay icon.
 */
export function VslPlayer({
  targetId,
  className,
}: {
  /** The booking section the end-card button scrolls to. */
  targetId: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firedRef = useRef<Set<number>>(new Set());
  const [state, setState] = useState<"idle" | "playing" | "ended">("idle");

  const copy = watch.video;

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    firedRef.current.clear();
    video.currentTime = 0;
    setState("playing");
    track("vsl_play", { section: "hero" });
    // play() returns a promise that rejects if the browser blocks it; the
    // press came from a real click so it shouldn't, and if it does the
    // native controls are already showing.
    void video.play().catch(() => undefined);
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;

    for (const mark of [25, 50, 75] as const) {
      if (pct >= mark && !firedRef.current.has(mark)) {
        firedRef.current.add(mark);
        track(`vsl_${mark}`);
      }
    }
  };

  const onEnded = () => {
    if (!firedRef.current.has(100)) {
      firedRef.current.add(100);
      track("vsl_complete");
    }
    setState("ended");
  };

  const goToBooking = () => {
    track("cta_click", { cta: copy.ended.cta, section: "vsl_end" });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-md bg-navy-card shadow-lg ring-1 ring-white/10",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full"
        poster={copy.poster}
        preload="metadata"
        playsInline
        controls={state !== "idle"}
        onPlay={() => {
          // Resumes from the native controls land here too, so the play
          // event is tracked from the button, not from this handler.
          if (state !== "playing") setState("playing");
        }}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      >
        <source src={copy.src} type="video/mp4" />
        Your browser can&rsquo;t play this video.
      </video>

      {state === "idle" && (
        <button
          type="button"
          onClick={play}
          aria-label={`${copy.playLabel} (${copy.duration})`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          {/* The poster is the logo lockup on navy, sitting a little above
              the middle of the frame, so the play control sits below it
              rather than on top of it. Absolutely placed instead of centred
              by flex for that reason; the button itself still spans the
              whole frame so anywhere on it is a target. */}
          <span className="absolute left-1/2 top-[68%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-150 ease-fynd group-hover:scale-105 group-active:scale-95 sm:h-20 sm:w-20">
            <Play
              aria-hidden="true"
              className="ml-0.5 h-6 w-6 fill-fynd-blue text-fynd-blue sm:h-7 sm:w-7"
            />
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 rounded-sm bg-navy/80 px-2 py-1 text-micro tabular-nums text-white"
          >
            {copy.duration}
          </span>
        </button>
      )}

      {state === "ended" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-navy/85 px-6 text-center">
          <p className="text-h3 text-white sm:text-h2">{copy.ended.heading}</p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={goToBooking}
              className="group flex h-12 items-center justify-center rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white shadow-blue transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] active:scale-[0.99]"
            >
              {copy.ended.cta}
              <ArrowRight
                aria-hidden="true"
                className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
              />
            </button>
            <button
              type="button"
              onClick={play}
              className="flex h-12 items-center justify-center gap-2 rounded-sm border border-white/25 px-6 text-body font-semibold text-white transition-colors duration-150 hover:border-white/45 hover:bg-white/[0.06]"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {copy.ended.replay}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
