/**
 * The people a lead meets on the demo call. Shown beside the calendar on
 * /watch so booking is a meeting with faces, not a form.
 *
 * PHOTO: one picture of both of you. Drop it in /public/team and set
 * `photo.src`. Until then a navy block with your initials renders in its
 * place. Landscape works best — the card is wider than it is tall — 1200px
 * or more on the long side, and cropped so you're both clearly in it.
 *
 * QUOTE: a DRAFT written by Claude. Replace it with something you'd actually
 * say — the point is that it sounds like the two of you, not a website.
 */
export const team = {
  photo: {
    /** Path under /public, e.g. "/team/keegan-and-luke.jpg". null until supplied. */
    src: null as string | null,
    alt: "Keegan Zoller and Luke Grady",
    /** Intrinsic size of the file, for next/image. Update when the photo lands. */
    width: 1200,
    height: 900,
  },
  people: [
    { name: "Keegan Zoller", role: "Co-founder" },
    { name: "Luke Grady", role: "Co-founder" },
  ],
  /** One line, from both of you. null hides it. */
  quote:
    "We kept meeting owners doing great work that nobody could see on Google. Fynd exists to fix that without adding a single thing to your day." as
      | string
      | null,
} as const;
