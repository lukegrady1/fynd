/**
 * Every string on /start and /call lives here so headlines can be rewritten
 * and A/B tested without touching component code.
 */

export const offer = {
  productName: "Review System",
  priceNow: 97,
  priceLater: 197,
  /** One-line version of the price story. The long version lives in the FAQ. */
  priceReason:
    "$97 is the founding-client rate while we build case studies in your trade.",
  terms: "No contract. Cancel anytime.",
  lockLine: "Locked at $97 for as long as you stay.",
  /**
   * Capacity is real and set by hand — never a live-decrementing counter.
   * Update these two together.
   */
  capacity: {
    perMonth: 5,
    spotsLeft: 2,
    month: "September",
  },
  /**
   * Fallback deadline used when the `exp` query param is missing or past.
   * ISO 8601 with an explicit offset. Update alongside the cohort.
   */
  cohortDeadlineIso: "2026-09-30T18:00:00-04:00",
  /** Formatting timezone — fixed so server and client render the same string. */
  timeZone: "America/New_York",
} as const;

export const hero = {
  h1: "Get more Google reviews without asking for them.",
  /** Used when a `biz` query param is present. */
  h1WithBiz: (biz: string) => `Get more Google reviews for ${biz}.`,
  sub: "Every time you finish a job, your customer gets a text with a one-tap review link. You do nothing. Reviews show up.",
  ctaStart: "Start for $97/mo",
  ctaCall: "Pick a time to talk",
  demoLink: "Watch the 2-min demo",
} as const;

/** The signature element: where the counter starts and where it lands. */
export const ratingDemo = {
  businessName: "Your business",
  category: "Local service · Open now",
  from: { rating: 4.2, reviews: 31 },
  to: { rating: 4.8, reviews: 94 },
} as const;

export const vsl = {
  duration: "2:14",
  caption:
    "Watch the actual system send a review request and a review come back.",
  playLabel: "Play the demo",
} as const;

export const howItWorks = {
  heading: "How it works",
  steps: [
    {
      n: "01",
      title: "You finish the job.",
      body: "Mark it done in your CRM, or just text a number. Takes 5 seconds.",
    },
    {
      n: "02",
      title: "We text your customer.",
      body: "Personalized, from your business name, with a one-tap link straight to your Google review page.",
    },
    {
      n: "03",
      title: "The review posts.",
      body: "Happy customers go public. Unhappy ones get routed privately to you first, so you hear it before Google does.",
    },
  ],
} as const;

export const whatYouGet = {
  heading: "What you get",
  items: [
    "Automated review requests by text and email",
    "Private feedback routing for anything under 4 stars",
    "Reply-to-reviews assistance",
    "NFC review cards for the truck or front counter",
    "A dashboard showing rating, review velocity, and where you rank vs. local competitors",
    "Setup done for you — you're live in under a week",
  ],
} as const;

export const testimonialsSection = {
  heading: "What owners say",
} as const;

export const checkout = {
  heading: `${offer.productName} — $${offer.priceNow}/mo`,
  cta: "Start for $97/mo",
  secure: "Secure checkout by Stripe",
  billing: "First charge today, then monthly.",
  cancelledNote: {
    lead: "No charge was made. Still deciding?",
    linkLabel: "Book a call instead",
  },
} as const;

export const calendar = {
  heading: "Grab 15 minutes.",
  body: "I'll show you your current rating, what your competitors have, and exactly what the system would do for you. No pitch deck.",
  preframe: (deadline: string) =>
    `This is what we'll be talking about. Same price whether you buy today or Friday — the $97 rate is held until ${deadline}.`,
  textInstead: "Prefer to text? Reply to my message and I'll answer there.",
  loading: "Loading available times…",
} as const;

export const faq = {
  heading: "Straight answers",
  items: [
    {
      q: "What if I get a bad review?",
      a: "That's the part most people worry about, so it's built in. Anything under 4 stars never goes to Google — the customer lands on a private feedback form that comes straight to you. You get a chance to fix it before it's public. Only the happy ones get pointed at your Google profile.",
    },
    {
      q: "Is this against Google's rules?",
      a: "No. Google's policy prohibits incentivizing reviews and review gating — selectively soliciting only customers you expect to be happy. We ask every customer, and we never offer anything in exchange. The private-feedback path is an additional channel, not a filter on who gets asked.",
    },
    {
      q: "How long until I see reviews?",
      a: "Typically the first ones land inside a week. It depends on your job volume — if you finish 20 jobs a week, you'll see movement faster than someone finishing 3. Most accounts see a visible rating change in the first month.",
    },
    {
      q: "Do I have to do anything?",
      a: "The manual version takes five seconds: text a number to a dedicated line when the job's done. The automatic version takes zero — if you're on ServiceTitan, Jobber, or Housecall Pro, we connect to it and requests fire when you mark a job complete. Either way, you never write the message.",
    },
    {
      q: "Am I locked in?",
      a: "Month to month. Cancel anytime from your dashboard or by texting me. The reviews you've collected are on your Google Business Profile — they're yours and they stay there whether you keep paying or not.",
    },
    {
      q: `Why is it $${offer.priceNow} when it says $${offer.priceLater}?`,
      a: `Because I'm still building case studies in your trade, and a real before-and-after from your business is worth more to me right now than the difference. $${offer.priceNow} is the founding-client rate. It goes to $${offer.priceLater} once I have 25 accounts. If you're on at $${offer.priceNow}, you stay at $${offer.priceNow} for as long as you stay subscribed — it doesn't step up later.`,
    },
  ],
} as const;

export const finalCta = {
  headingStart: "More reviews, starting this week.",
  headingCall: "Fifteen minutes, no pitch deck.",
  subStart: "Set it up once. It runs after every job.",
  subCall: "I'll show you where you stand and what it would take.",
  ctaStart: "Start for $97/mo",
  ctaCall: "Pick a time",
} as const;

export const welcome = {
  heading: "You're in.",
  sub: "Here's exactly what happens next.",
  steps: [
    {
      when: "Right now",
      body: "You'll get a receipt by email and a text from me confirming we're on.",
    },
    {
      when: "Within 24 hours",
      body: "I'll set up your review pipeline and connect it to your Google Business Profile.",
    },
    {
      when: "This week",
      body: "We do a 15-minute setup call, then the first requests go out.",
    },
  ],
  formHeading: "One thing first",
  formBody:
    "Fill this in so I can start setting up — it takes about a minute.",
  callHeading: "Book your setup call",
  callBody: "Fifteen minutes. Pick whatever time works.",
} as const;

export const confirmed = {
  heading: "You're booked.",
  sub: "I'll call you at the number you gave me. If anything changes, just reply to my text.",
  addToCalendar: "Add to calendar",
  skipHeading: "Already sold?",
  skipBody: "You can skip the call and start now.",
  skipCta: "Start for $97/mo",
} as const;

export const meta = {
  start: {
    title: "Start — Fynd Review System",
    description:
      "Automated Google review requests for local service businesses. $97/mo, no contract.",
  },
  call: {
    title: "Book a call — Fynd Review System",
    description:
      "Fifteen minutes to see where your rating stands and what the review system would do for your business.",
  },
} as const;
