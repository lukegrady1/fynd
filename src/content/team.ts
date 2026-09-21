/**
 * The people a lead meets on the demo call. Shown beside the calendar on
 * /watch so booking is a meeting with faces, not a form.
 *
 * PHOTO: /public/luke-keegan.png, shown at its own proportions — it is a
 * portrait shot and a landscape crop would take the heads off. next/image
 * serves a resized WebP, so the 1.6MB PNG never reaches a phone.
 *
 * QUOTE: a DRAFT written by Claude. Replace it with something you'd actually
 * say — the point is that it sounds like the two of you, not a website.
 */
export const team = {
  photo: {
    /** Path under /public. null hides the photo and shows initials. */
    src: "/luke-keegan.png" as string | null,
    alt: "Luke Grady and Keegan Zoller",
    /** Intrinsic size of the file, for next/image. */
    width: 1195,
    height: 1316,
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
