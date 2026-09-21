import Image from "next/image";
import { watch } from "@/content/copy";
import { team, type TeamMember } from "@/content/team";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { CalendarEmbed } from "./CalendarModule";
import { MarkerUnderline } from "./MarkerUnderline";
import { Reveal } from "./Reveal";

/**
 * The booking ask on /watch: a heading, then the two people you'd be
 * meeting beside the calendar.
 *
 * A booking form is a commitment to a stranger. Putting the faces next to
 * the time slots — with a line each in their own words — turns it into a
 * meeting with two people, which is what it actually is.
 *
 * On a phone the people stack above the calendar: they are short, and the
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
            <ul className="mt-4 flex flex-col gap-4">
              {team.map((person, i) => (
                <li key={person.name}>
                  <PersonCard person={person} flip={i % 2 === 1} />
                </li>
              ))}
            </ul>
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
 * Photo, name with a marker stroke under it, role, and the quote.
 *
 * `flip` mirrors every second card so the two read as a conversation rather
 * than a list. The photo is 96px on desktop — big enough to be a person,
 * small enough that two of them don't out-weigh the calendar.
 */
function PersonCard({ person, flip }: { person: TeamMember; flip: boolean }) {
  return (
    <figure
      className={`flex items-start gap-4 rounded-lg border border-line bg-white p-5 lg:p-6 ${
        flip ? "flex-row-reverse text-right" : ""
      }`}
    >
      <Portrait person={person} />

      <div className="min-w-0 flex-1">
        <figcaption>
          <span className="relative inline-block text-h3 text-ink">
            {person.name}
            <MarkerUnderline />
          </span>
          <span className="mt-1 block text-small text-ink-soft">
            {person.role}
          </span>
        </figcaption>

        {person.quote && (
          <blockquote className="mt-3 text-body text-ink">
            &ldquo;{person.quote}&rdquo;
          </blockquote>
        )}
      </div>
    </figure>
  );
}

/** The photo when there is one; an initial on a navy disc until then. */
function Portrait({ person }: { person: TeamMember }) {
  if (person.photoSrc) {
    return (
      <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line lg:h-24 lg:w-24">
        <Image
          src={person.photoSrc}
          alt={person.name}
          width={96}
          height={96}
          sizes="96px"
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy text-[28px] font-semibold text-white lg:h-24 lg:w-24"
    >
      {person.name.trim().charAt(0)}
    </span>
  );
}
