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
  /**
   * The stars this client actually gave, if they reviewed Fynd. The card's
   * star row renders only when this is set — five stars under a quote nobody
   * rated is a made-up stat.
   */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Optional before→after stat, only if Luke supplies real numbers. */
  stat?: {
    ratingFrom: number;
    ratingTo: number;
    reviewsAdded: number;
  };
  /** Optional logo in /public. A business logo beats a stock headshot. */
  logoSrc?: string;
  /** Profile portrait in /public. Placeholder portraits are AI-generated. */
  portraitSrc?: string;
  /**
   * Fictional. Renders with an "Example" badge so it can never read as a
   * client's words. Only the placeholder list below sets this.
   */
  placeholder?: true;
};

export const testimonials: Testimonial[] = [
  { business: "Garabedian Plumbing", quote: null },
  { business: "Pro Pressure Washing", quote: null },
  { business: "Greg's Cuts", quote: null },
  { business: "MrDetails", quote: null },
];

/** Only slots with a real quote are ever rendered. */
export const supplied = () => testimonials.filter((t) => t.quote !== null);

/**
 * PLACEHOLDERS — FICTIONAL, FOR LAYOUT ONLY.
 *
 * Every name, business and quote below is invented so the /watch testimonial
 * band can be looked at before any real quotes exist. They carry
 * `placeholder: true`, which renders an "Example" badge on the card, and the
 * band only falls back to them while `supplied()` is empty — the first real
 * quote above retires all of them at once.
 *
 * Do not copy these into the real list. Do not strip the badge.
 */
export const placeholderTestimonials: Testimonial[] = [
  {
    business: "Northside Barber Co.",
    name: "Marcus T.",
    portraitSrc: "/images/testimonials/marcus.webp",
    quote:
      "I used to ask for reviews maybe once a week and feel weird about it every time. Now the text goes out after every cut and I don't think about it. The reviews just show up.",
    placeholder: true,
  },
  {
    business: "Willow Street Pilates",
    name: "Priya R.",
    portraitSrc: "/images/testimonials/priya-v2.webp",
    quote:
      "Clients always said they'd leave one and then forgot by the time they got home. The message lands while they're still in the car, and that's when they actually do it.",
    placeholder: true,
  },
  {
    business: "Bright Lane Nail Studio",
    name: "Jenna L.",
    portraitSrc: "/images/testimonials/jenna.webp",
    quote:
      "The part I didn't expect was the catch for unhappy clients. If someone's not thrilled it comes to me first, not straight onto Google.",
    placeholder: true,
  },
  {
    business: "Harbor Massage & Wellness",
    name: "Devon S.",
    portraitSrc: "/images/testimonials/devon-v2.webp",
    quote:
      "Setup was one form. I gave access to my booking software and it was running by the next day. I haven't touched it since.",
    placeholder: true,
  },
  {
    business: "Maple & Main Hair Salon",
    name: "Sofia M.",
    portraitSrc: "/images/testimonials/sofia-v2.webp",
    quote:
      "We're booked back to back, so nobody at the desk has time to chase reviews. Having it ask automatically after each appointment is the only reason we get any.",
    placeholder: true,
  },
  {
    business: "Stillwater Yoga Studio",
    name: "Elena K.",
    portraitSrc: "/images/testimonials/elena.webp",
    quote:
      "New students pick the studio with the most reviews, full stop. This is the first thing that's actually moved that number for us without me nagging anyone after class.",
    placeholder: true,
  },
];
