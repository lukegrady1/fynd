import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profileSwap } from "@/content/copy";
import { Reveal } from "./Reveal";

/**
 * The real before/after Google Business Profile, side by side.
 *
 * Both shots are the same photo and the same layout, so placing them next to
 * each other puts the only difference — the rating and the review count —
 * directly above one another. Side by side also means the reader can compare
 * at their own pace instead of catching a transition.
 *
 * Stacks on a phone with the arrow turning to point down; two 180px-wide
 * screenshots side by side at 390px would be unreadable.
 *
 * No client JavaScript of its own: the staggered entrance is Reveal, which is
 * progressive enhancement, so with JS off both shots are simply there.
 */
export function ProfileSwap() {
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
      <Reveal>
        <Shot state="before" />
      </Reveal>

      <Reveal delay={0.14}>
        <Elapsed />
      </Reveal>

      <Reveal delay={0.28}>
        <Shot state="after" />
      </Reveal>
    </div>
  );
}

function Elapsed() {
  return (
    <div className="flex flex-col items-center gap-2">
      <ArrowRight
        aria-hidden="true"
        strokeWidth={2}
        className="h-6 w-6 rotate-90 text-fynd-green sm:rotate-0"
      />
      <span className="whitespace-nowrap text-small font-semibold text-white/75">
        {profileSwap.elapsed}
      </span>
    </div>
  );
}

function Shot({ state }: { state: "before" | "after" }) {
  const shot = profileSwap[state];
  const after = state === "after";

  return (
    <figure
      className={`relative overflow-hidden rounded-lg border bg-navy-card ${
        after
          ? "border-fynd-green/40 shadow-2xl shadow-black/30"
          : "border-white/10"
      }`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes="(min-width: 640px) 390px, 100vw"
        className="h-auto w-full"
      />
      <figcaption
        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em] ${
          after
            ? "bg-fynd-green text-navy"
            : "bg-navy/80 text-white/70 ring-1 ring-white/15"
        }`}
      >
        {shot.label}
      </figcaption>
    </figure>
  );
}
