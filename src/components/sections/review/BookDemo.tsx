import Image from "next/image";
import { watch } from "@/content/copy";
import { team } from "@/content/team";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { CalendarEmbed } from "./CalendarModule";
import { MarkerUnderline } from "./MarkerUnderline";
import { Reveal } from "./Reveal";

/**
 * The booking ask on /watch: a heading, then the two people you'd be
 * meeting beside the calendar.
 *
 * A booking form is a commitment to a stranger. Putting the faces next to
 * the time slots — one photo of both, one line from them — turns it into a
 * meeting with two people, which is what it actually is.
 *
 * On a phone the card stacks above the calendar: it is short, and the
 * calendar is the thing that needs the full width. The section id lives on
 * the calendar column so every "Book a demo" lands with the slots in view.
 */
export function BookDemo({
  embedUrl,
  id,
}: {
  embedUrl: string | null;
  id: string;
}) {
  const copy = watch.book;

  return (
    <section className="bg-fynd-gray py-12 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow variant="pill" className="mx-auto">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1040px] gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
          <Reveal className="lg:sticky lg:top-24">
            <p className="text-micro uppercase text-ink-soft">{copy.meetLabel}</p>
            <TeamCard />
          </Reveal>

          <Reveal delay={0.06} className="scroll-mt-20" id={id}>
            <CalendarEmbed embedUrl={embedUrl} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * One photo of both of them, both names under it, one line from the pair.
 *
 * The names sit on one line joined with an ampersand, the marker stroke
 * under the whole pair — two strokes read as two separate people being
 * introduced, and the point of a single photo is that they come together.
 */
function TeamCard() {
  const names = team.people.map((p) => p.name);
  const roles = [...new Set(team.people.map((p) => p.role))];

  return (
    <figure className="mt-4 overflow-hidden rounded-lg border border-line bg-white">
      <TeamPhoto />

      <div className="p-5 lg:p-6">
        <figcaption>
          <span className="relative inline-block text-h3 text-ink">
            {names.join(" & ")}
            <MarkerUnderline stretch className="h-[10px]" />
          </span>
          <span className="mt-2 block text-small text-ink-soft">
            {roles.length === 1 ? `${roles[0]}s` : roles.join(" & ")}
          </span>
        </figcaption>

        {team.quote && (
          <blockquote className="mt-4 text-body text-ink">
            &ldquo;{team.quote}&rdquo;
          </blockquote>
        )}
      </div>
    </figure>
  );
}

/** The photo when there is one; a navy block with both initials until then. */
function TeamPhoto() {
  const { photo, people } = team;

  if (photo.src) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 1024px) 440px, 100vw"
        className="aspect-[4/3] w-full object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex aspect-[4/3] w-full items-center justify-center gap-3 bg-navy text-[40px] font-semibold text-white/90"
    >
      {people.map((p) => p.name.trim().charAt(0)).join(" & ")}
    </span>
  );
}
