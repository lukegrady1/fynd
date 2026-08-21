/**
 * REAL CLIENT QUOTES ONLY.
 *
 * Every entry below is intentionally left with `quote: null` until Luke
 * supplies the actual wording. The Testimonials section renders nothing for
 * a slot whose quote is null, and renders nothing at all if no slot is filled.
 *
 * Do NOT write placeholder testimonials that read as real, and do not invent
 * names, businesses, towns, or before/after numbers.
 */

export type Testimonial = {
  /** Client business — supplied by Luke, these are real accounts. */
  business: string;
  /** null until the real quote is supplied. */
  quote: string | null;
  /** Person's name, if they're happy to be named. */
  name?: string;
  town?: string;
  /** Optional before→after stat, only if Luke supplies real numbers. */
  stat?: {
    ratingFrom: number;
    ratingTo: number;
    reviewsAdded: number;
  };
  /** Optional logo in /public. A business logo beats a stock headshot. */
  logoSrc?: string;
};

export const testimonials: Testimonial[] = [
  { business: "Garabedian Plumbing", quote: null },
  { business: "Pro Pressure Washing", quote: null },
  { business: "Greg's Cuts", quote: null },
  { business: "MrDetails", quote: null },
];

/** Only slots with a real quote are ever rendered. */
export const supplied = () => testimonials.filter((t) => t.quote !== null);
