"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, RotateCcw, Volume2 } from "lucide-react";
import { watch } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The self-hosted VSL.
 *
 * A native `<video>` rather than a YouTube iframe: the file lives in /public,
 * so there is no third-party script on the critical path. The poster is the
 * logo title card, painted like any other image while the file loads.
 *
 * It autoplays, muted. Browsers will not start a video with sound until the
 * visitor has interacted with the page, so the muted start is the only
 * autoplay there is. Over it sits one control, "Turn sound on", which
 * restarts from the beginning with audio — someone who has watched twelve
 * silent seconds has not heard the pitch, so the restart is the point, not
 * a limitation. If the browser refuses even the muted start (Low Power Mode
 * on iOS does), or the visitor prefers reduced motion, it falls back to the
 * poster and a play button.
 *
 * `vsl_play` fires when the sound goes on, and the quartiles only count
 * once it has — a muted loop scrolled past is not a view.
 *
 * When it ends the ask appears over the last frame, with a replay. Someone
 * who has just watched the whole thing is the warmest visitor on the page,
 * and the calendar is a screen below.
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
  const [state, setState] = useState<"idle" | "muted" | "playing" | "ended">(
    "idle",
  );

  const copy = watch.video;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Set on the element rather than as a JSX prop: React does not render
    // the `muted` attribute into server HTML, and the browser decides whether
    // to allow autoplay from what the element says at the moment play() is
    // called.
    video.muted = true;
    let cancelled = false;
    video
      .play()
      .then(() => {
        if (!cancelled) setState("muted");
      })
      .catch(() => {
        // Blocked. The poster and play button are already showing.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** From the top, with audio. Every path to sound goes through here. */
  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    firedRef.current.clear();
    video.muted = false;
    video.currentTime = 0;
    setState("playing");
    track("vsl_play", { section: "hero" });
    // Rejects only if the browser blocks it; every caller is a real click,
    // and if it does the native controls are already showing.
    void video.play().catch(() => undefined);
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || state !== "playing") return;
    const pct = (video.currentTime / video.duration) * 100;

    for (const mark of [25, 50, 75] as const) {
      if (pct >= mark && !firedRef.current.has(mark)) {
        firedRef.current.add(mark);
        track(`vsl_${mark}`);
      }
    }
  };

  const onEnded = () => {
    if (state === "playing" && !firedRef.current.has(100)) {
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
        preload="auto"
        playsInline
        controls={state === "playing"}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      >
        <source src={copy.src} type="video/mp4" />
        Your browser can&rsquo;t play this video.
      </video>

      {state === "idle" && (
        <button
          type="button"
          onClick={playWithSound}
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
          <DurationChip />
        </button>
      )}

      {state === "muted" && (
        <button
          type="button"
          onClick={playWithSound}
          aria-label={copy.unmuteLabel}
          className="group absolute inset-0"
        >
          {/* Bottom-left, opposite the duration chip, and out of the middle
              of the frame: the video is kinetic type and its lines land in
              the centre, so a control there would sit on the words. Anywhere
              on the frame still turns the sound on. */}
          <span className="absolute bottom-3 left-3 flex h-10 items-center gap-2 rounded-full bg-white px-4 text-small font-semibold text-ink shadow-lg transition-transform duration-150 ease-fynd group-hover:scale-105 group-active:scale-95 sm:bottom-4 sm:left-4 sm:h-11 sm:px-5 sm:text-body">
            <Volume2 aria-hidden="true" className="h-4 w-4 text-fynd-blue sm:h-5 sm:w-5" />
            {copy.unmuteLabel}
          </span>
          <DurationChip />
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
              onClick={playWithSound}
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

function DurationChip() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-3 right-3 rounded-sm bg-navy/80 px-2 py-1 text-micro tabular-nums text-white"
    >
      {watch.video.duration}
    </span>
  );
}
