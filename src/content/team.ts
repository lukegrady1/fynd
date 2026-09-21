/**
 * The two people a lead meets on the demo call. Shown beside the calendar on
 * /watch so booking is a meeting with faces, not a form.
 *
 * PHOTOS: drop them in /public/team and set `photoSrc`. Until then the card
 * shows an initial on a navy disc. Square crops, 600px or larger, both shot
 * the same way (same light, same distance) so they sit together.
 *
 * QUOTES: these are DRAFTS written by Claude in each person's voice. Replace
 * them with something you actually say — the point is that it sounds like
 * you on the call, not like a website.
 */
export type TeamMember = {
  name: string;
  /** Shown under the name. */
  role: string;
  /** Path under /public, e.g. "/team/keegan.jpg". null until supplied. */
  photoSrc: string | null;
  /** One short line, in their own words. null hides the quote. */
  quote: string | null;
};

export const team: TeamMember[] = [
  {
    name: "Keegan Zoller",
    role: "Co-founder",
    photoSrc: null,
    quote:
      "Fifteen minutes. I'll pull up your profile and show you exactly where the reviews are going to come from.",
  },
  {
    name: "Luke Grady",
    role: "Co-founder",
    photoSrc: null,
    quote:
      "No slides. You'll see the actual text your customers get and the review that comes back.",
  },
];
