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

/* ==========================================================================
   Expanded sections — proof-led artifacts.

   IMPORTANT: numbers in `proof` and `roi` are ILLUSTRATIVE, not client
   results. Every component that renders them also renders the label in
   `illustrative.badge`. If real numbers arrive, swap them in AND keep the
   labelling honest about which is which.
   ========================================================================== */

export const illustrative = {
  badge: "Example",
  note: "Illustrative figures, not a client result or a promise.",
} as const;

export const mechanism = {
  eyebrow: "The mechanism",
  heading: "What actually happens",
  sub: "Three steps. You're only involved in the first one.",

  /** The message your customer receives, rendered as a real thread. */
  sms: {
    business: "Reyes Auto Care",
    statusTime: "9:41",
    outbound: {
      body: "Hi Dana — thanks for coming in today. Mind leaving us a quick review? Takes about 10 seconds.",
      time: "9:41 AM",
    },
    prompt: {
      title: "How did we do?",
      subtitle: "Tap a star",
      time: "9:41 AM",
    },
    inbound: { body: "done!", time: "9:43 AM" },
    footnote: "Sent from your business name, not a 1-800 number.",
  },

  /** The fork that makes the "what if someone's mad" objection go away. */
  routing: {
    heading: "Where the tap goes",
    trigger: "Customer taps a star",
    high: {
      label: "4 or 5 stars",
      title: "Straight to Google",
      body: "They land on your review page with the rating already selected. One more tap and it's public.",
    },
    low: {
      label: "1 to 3 stars",
      title: "Straight to you",
      body: "A private form, not Google. It hits your inbox in seconds so you can fix it before anyone else sees it.",
    },
    footnote:
      "Every customer gets asked the same way. The rating decides where they land — nobody is filtered out beforehand.",
  },

  steps: [
    {
      n: "01",
      title: "You finish the job.",
      body: "Mark it done in your CRM, or text the customer's number to your Fynd line. Five seconds, once.",
      actor: "You",
    },
    {
      n: "02",
      title: "We send the request.",
      body: "Within the hour, while you're still fresh in their mind. From your business name, with a one-tap link.",
      actor: "Fynd",
    },
    {
      n: "03",
      title: "The rating routes itself.",
      body: "Happy customers go public. Unhappy ones come to you privately, first.",
      actor: "Fynd",
    },
  ],
} as const;

export const proof = {
  eyebrow: "What changes",
  heading: "A rating is a ranking factor.",
  sub: "Google weighs rating and review count when it decides who shows up in the map pack. Most local businesses are one good quarter away from moving up.",

  beforeAfter: {
    heading: "Six months of steady requests",
    before: { label: "Before", rating: 4.2, reviews: 31, caption: "Where most shops sit" },
    after: { label: "After", rating: 4.8, reviews: 94, caption: "Same business, same jobs" },
    delta: "63 reviews added",
  },

  rank: {
    heading: "Where you sit locally",
    sub: "Plumbers within 5 miles",
    rows: [
      { name: "Valley Plumbing & Drain", rating: 4.9, reviews: 312, you: false },
      { name: "A-1 Rooter", rating: 4.8, reviews: 204, you: false },
      { name: "Your business", rating: 4.2, reviews: 31, you: true },
      { name: "Metro Drain Co.", rating: 4.1, reviews: 88, you: false },
    ],
    takeaway:
      "You don't need to beat the top shop. You need to stop being the one with 31 reviews.",
  },
} as const;

export const roi = {
  eyebrow: "The math",
  heading: "What a review is actually worth",
  sub: "Move the sliders to match your business. These are estimates from your own inputs — not a forecast, and not a promise.",
  inputs: {
    jobsLabel: "Jobs you finish per week",
    rateLabel: "Customers who leave a review",
    rateHelp:
      "Set this to whatever you believe. We default to 30% because a same-day text asking once tends to land far better than an email a week later — but your trade and your customers decide the real number.",
  },
  outputs: {
    perMonth: "New reviews per month",
    sixMonths: "After six months",
    ratingNote: "Enough to move a 4.2 to a 4.8 in most cases",
  },
  disclaimer:
    "Arithmetic on the numbers you entered. Actual results depend on your job volume, your customers, and how good the work is.",
} as const;

export const fit = {
  eyebrow: "Fit",
  heading: "Does this work with what you already use?",

  integrations: {
    heading: "Connects to your CRM",
    sub: "Mark a job complete and the request fires. Nothing else to remember.",
    items: [
      { name: "ServiceTitan", status: "Direct integration" },
      { name: "Jobber", status: "Direct integration" },
      { name: "Housecall Pro", status: "Direct integration" },
      { name: "Anything else", status: "Text a number, or a Zapier hook" },
    ],
    fallback:
      "No CRM? Text the customer's number to your Fynd line when you pack up. That's the whole workflow.",
  },

  timeline: {
    heading: "What the first month looks like",
    steps: [
      { when: "Day 1", title: "Kickoff call", body: "Fifteen minutes. I need your Google Business Profile and how you track jobs." },
      { when: "Days 2–4", title: "I build it", body: "Message templates in your voice, routing rules, CRM connection, your Fynd number." },
      { when: "Day 5", title: "You approve", body: "You read the exact text your customers will get and change anything you don't like." },
      { when: "Week 1", title: "First requests go out", body: "We start with recent jobs so you see reviews inside days, not months." },
      { when: "Week 3", title: "NFC cards arrive", body: "Tap-to-review cards for the truck and the front counter." },
    ],
  },

  trades: {
    heading: "Who this is built for",
    sub: "Anything where you finish a job and leave.",
    items: [
      "Plumbing", "HVAC", "Electrical", "Roofing", "Auto repair", "Auto detailing",
      "Pressure washing", "Landscaping", "Barbers & salons", "Pest control",
      "Garage doors", "Cleaning services",
    ],
    other: "Not listed? It probably still works. Ask me on the call.",
  },
} as const;

export const compliance = {
  eyebrow: "The legal bit",
  heading: "This is inside Google's rules. Here's exactly why.",
  sub: "Worth knowing the difference, because plenty of tools in this space do get it wrong.",
  rules: [
    {
      ok: true,
      title: "We ask every customer",
      body: "Not just the ones you think will be nice. Selectively soliciting only happy customers is called review gating, and it's the thing Google actually prohibits.",
    },
    {
      ok: true,
      title: "We never offer anything for a review",
      body: "No discounts, no entries into a drawing, no free oil change. Incentivized reviews violate Google's policy and get removed.",
    },
    {
      ok: true,
      title: "We never write the review",
      body: "The customer writes it, in their own words, from their own account. We only send the link.",
    },
    {
      ok: false,
      title: "What we don't do",
      body: "No fake reviews, no review swaps, no buying them, no filtering unhappy customers out of the ask. Those get profiles suspended.",
    },
  ],
  privateRouting:
    "The private feedback path isn't a filter on who gets asked — everybody gets the same message. It's an extra channel for someone who's already unhappy, so they have somewhere to put it besides your public profile.",
} as const;

export const founder = {
  eyebrow: "From me",
  heading: "We just talked.",
  body: [
    "So I'll skip the part where I explain who I am.",
    "Here's the honest version of what you're buying. This isn't complicated software. It's a text that goes out after every job, a link that makes leaving a review take ten seconds instead of two minutes, and a rule that sends unhappy people to me instead of to Google. That's it. The reason it works isn't cleverness — it's that almost nobody asks, and the ones who do ask badly.",
    "I take five accounts a month because I set each one up myself. If that's full when you call, I'll tell you.",
  ],
  signoff: "— Luke",
  role: "Fynd",
  guarantee: {
    heading: "If it doesn't work, leave.",
    body: "Month to month, cancel from the dashboard or by texting me. No exit call, no retention offer. Every review you collected stays on your Google profile — those belong to your business, not to me.",
  },
} as const;
