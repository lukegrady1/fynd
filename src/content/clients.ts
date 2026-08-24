/**
 * REAL CLIENT DATA ONLY — same rule as testimonials.ts.
 *
 * Competitor pages in this space lean hard on social proof: "trusted by 700+
 * businesses", logo walls, named case studies with review counts. That proof
 * is earned, not authored. Everything below renders NOTHING until Luke supplies
 * real values, and every consuming component is written to degrade cleanly.
 *
 * Do not invent business names, logos, headcounts, metrics, or quotes.
 */

/**
 * Headline trust stats shown under the hero.
 * Set `value: null` to hide a stat. Hide the whole bar by leaving all null.
 */
export type TrustStat = {
  /** e.g. "Reviews collected" */
  label: string;
  /** e.g. "12,400" — null until it's a real, defensible number. */
  value: string | null;
};

export const trustStats: TrustStat[] = [
  { label: "Businesses running Fynd", value: null },
  { label: "Reviews collected", value: null },
  { label: "Average rating lift", value: null },
];

/** Client logos for the trust bar. Drop files in /public/logos and list them. */
export type ClientLogo = {
  name: string;
  /** Path under /public, e.g. "/logos/garabedian.svg". null = not supplied. */
  src: string | null;
  width: number;
  height: number;
};

export const clientLogos: ClientLogo[] = [];

/**
 * Case studies — the "X reviews in Y months" cards.
 * Every field must be real. A case study with `metric: null` is not rendered.
 */
export type CaseStudy = {
  business: string;
  trade: string;
  town?: string;
  /** e.g. { value: "212", unit: "reviews", period: "in 4 months" } */
  metric: { value: string; unit: string; period: string } | null;
  quote: string | null;
  name?: string;
  role?: string;
  logoSrc?: string;
};

export const caseStudies: CaseStudy[] = [];

/**
 * The small proof row under the hero CTA: client faces, a star rating, and a
 * line of reassurance.
 *
 * Photos standing in for customers are social proof in exactly the way a
 * testimonial is, and a star rating is a stat — so both follow the same rule
 * as everything else in this file. Stock headshots captioned "trusted by local
 * businesses" would be an invented client list with pictures attached.
 *
 * To turn the row on: drop real photos in /public/clients, list them below,
 * and set `clientRating` to a rating you can point at.
 */
export type ClientFace = {
  /** Used as the alt text — a real person at a real client. */
  name: string;
  /** Path under /public, e.g. "/clients/marlow.jpg". */
  src: string;
};

export const clientFaces: ClientFace[] = [];

/** Out of 5. null until there is a real rating to cite. */
export const clientRating: number | null = null;

export const suppliedStats = () => trustStats.filter((s) => s.value !== null);
export const suppliedLogos = () => clientLogos.filter((l) => l.src !== null);
export const suppliedCaseStudies = () =>
  caseStudies.filter((c) => c.metric !== null && c.quote !== null);
