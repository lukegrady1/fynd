"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { vsl } from "@/content/copy";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/Layout";

/**
 * Click-to-play demo. The iframe is never rendered until the play button is
 * pressed, so the embed can't block LCP. Space is reserved by a fixed 16:9
 * box, so swapping the poster for the player causes no layout shift.
 *
 * Quartile tracking uses the YouTube IFrame API and is only active once a real
 * NEXT_PUBLIC_VSL_EMBED_ID is set — untested until a video exists.
 */

type YtPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: Record<string, unknown>,
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  const embedId = process.env.NEXT_PUBLIC_VSL_EMBED_ID;

  // No video, no section. A play button that does nothing is worse than no
  // demo at all — it breaks a promise in the middle of the page.
  if (!embedId) return null;

  return (
    <section id="demo" className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-[720px]">
          <div className="relative aspect-video overflow-hidden rounded-md border border-line bg-navy">
            {playing ? (
              <Player embedId={embedId} />
            ) : (
              <Poster
                onPlay={() => {
                  track("vsl_play", { section: "demo" });
                  setPlaying(true);
                }}
              />
            )}
          </div>
          <p className="mt-3 text-small text-ink-soft">{vsl.caption}</p>
        </div>
      </Container>
    </section>
  );
}

function Poster({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${vsl.playLabel} (${vsl.duration})`}
      className="group absolute inset-0 flex items-center justify-center"
    >
      {/* Placeholder poster — swap for a real frame once the VSL is recorded. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-grad-mesh opacity-15"
      />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-150 ease-fynd group-hover:scale-105 group-active:scale-95">
        <Play
          aria-hidden="true"
          className="ml-0.5 h-6 w-6 fill-fynd-blue text-fynd-blue"
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-3 right-3 rounded-sm bg-navy/80 px-2 py-1 text-micro tabular-nums text-white"
      >
        {vsl.duration}
      </span>
    </button>
  );
}

/** Lazily-mounted player that reports 25/50/75/100% watched. */
function Player({ embedId }: { embedId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let player: YtPlayer | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      poll = setInterval(() => {
        if (!player) return;
        const duration = player.getDuration();
        if (!duration) return;
        const pct = (player.getCurrentTime() / duration) * 100;

        for (const mark of [25, 50, 75, 100] as const) {
          if (pct >= mark && !firedRef.current.has(mark)) {
            firedRef.current.add(mark);
            track(mark === 100 ? "vsl_complete" : (`vsl_${mark}` as const));
          }
        }
      }, 1000);
    };

    const create = () => {
      if (!window.YT) return;
      player = new window.YT.Player(host, {
        videoId: embedId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, enablejsapi: 1 },
        events: { onReady: startPolling },
      });
    };

    if (window.YT) {
      create();
    } else {
      const existing = document.getElementById("yt-iframe-api");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = create;
    }

    return () => {
      if (poll) clearInterval(poll);
    };
  }, [embedId]);

  return <div ref={hostRef} className="absolute inset-0 h-full w-full" />;
}
