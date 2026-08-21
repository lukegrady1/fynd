/**
 * Every string on /start and /call lives here so headlines can be rewritten
 * and A/B tested without touching component code.
 */

export const offer = {
  productName: "Review System",

  /**
   * The angle: Luke does the work for free and the client covers the software
   * at cost. `software` is what they actually pay today; `managed` is what
   * management costs once the free window closes.
   *
   * There is deliberately no struck-through "was $197" — the discount IS the
   * free labour, and a crossed-out price on top of it would be a second,
   * unexplained anchor.
   */
  software: 97,
  managed: 197,

  /**
   * PLACEHOLDER — Luke to set the real goal that ends the free period.
   * Whatever goes here has to be something the client can verify themselves,
   * and something Luke will actually honour.
   */
  goal: "100 reviews",

  labels: {
    management: "Management",
    software: "Software",
    free: "Free",
  },

  /** One-line version of the angle. The long version lives in the FAQ. */
  angle: "You cover the software. I run the whole thing for free until you hit 100 reviews.",
  afterLine: "After that, management is $197/mo — and only if you want to keep it.",
  terms: "No contract. Cancel anytime.",
  lockLine:
    "Nothing else to pay while the free period runs. No setup fee, no per-seat charge.",

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
  /**
   * Hero copy is per-page on purpose. The headline and the CTA have to rhyme:
   * /start sells the product (button buys it), /call sells the CALL itself
   * (button books it). Promising the product outcome and then asking for a
   * meeting is the mismatch that stalls booking pages.
   */
  /**
   * /start uses pain reversal (formula 2). "Start" deliberately echoes the
   * button, so headline and CTA rhyme. The biz variant switches formula —
   * naming the business is a stronger opening than any pattern.
   */
  start: {
    lead: "Get more Google reviews",
    accent: "without asking for them.",
    leadWithBiz: "More Google reviews for",
    accentWithBiz: (biz: string) => `${biz}.`,
    sub: "Every time you finish a job, your customer gets a text with a one-tap review link. You do nothing. Reviews show up.",
    cta: "Start for $97/mo",
  },
  /**
   * /call also uses pain reversal, with the objection ("is this a pitch?")
   * answered in the green line rather than left for the reader to worry about.
   */
  call: {
    lead: "Get more Google reviews",
    accent: "without asking for them.",
    leadWithBiz: "More Google reviews for",
    accentWithBiz: (biz: string) => `${biz}.`,
    sub: "Fifteen minutes on the phone. I'll tell you how many reviews you're getting now, how many you'd get with every customer asked, and exactly how the system does it. No slides, no pitch.",
    cta: "Pick a time to talk",
  },

  demoLink: "Watch the 2-min demo",
  /**
   * One line, not three. The hero previously restated the offer in a price
   * row, an angle line and a bullet row — all after the CTA, all competing.
   */
  offerLine:
    "I run it free until you hit 100 reviews. You cover the software: $97/mo, no contract, cancel anytime.",
} as const;

/**
 * Booking pages stall on "what is this actually going to be" — the fear is a
 * pitch. Naming the agenda up front is the highest-leverage friction remover
 * on /call.
 */
export const callPreview = {
  heading: "What the fifteen minutes actually is",
  items: [
    "I pull up your Google Business Profile and read you your real review count and rating.",
    "I work out how many reviews a month you get now, and how many you'd get with every customer asked.",
    "I show you the exact text your customers would receive, and you tell me if it sounds like you.",
    "If it's not a fit, I'll say so on the call. I'd rather not set up an account I have to unwind.",
  ],
  footer: "No slides. If you want to start after, you can. If not, you keep the numbers.",
} as const;

/** The signature element: where the counter starts and where it lands. */
export const ratingDemo = {
  businessName: "Your business",
  category: "Local service · Open now",
  from: { rating: 4.2, reviews: 31 },
  to: { rating: 4.8, reviews: 94 },
} as const;

/**
 * The hero profile card. The reference layout centres a map-position readout;
 * this shows review volume instead, because that is what the product moves.
 */
export const profileCard = {
  header: "Business Profile",
  live: "Live",
  panelLabel: "Google reviews",
  panelHint: "Last six months",
  trend: "Climbing",
  /** Monthly review volume, in px bar heights. Sample shape, not real data. */
  months: [10, 14, 18, 26, 34, 44],
  newReview: "New review received",
  footnote: "Sample profile. Yours replaces it on day one.",
} as const;

export const vsl = {
  duration: "2:14",
  caption:
    "Watch the actual system send a review request and a review come back.",
  playLabel: "Play the demo",
} as const;

export const testimonialsSection = {
  heading: "What owners say",
} as const;

export const checkout = {
  heading: `${offer.productName} — $${offer.software}/mo`,
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
  body: "I'll show you how many reviews you're getting now, how many you'd get with every customer asked, and exactly how the system does it. No pitch deck.",
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
      a: "That's the part most people worry about, so it's built in. Four and five stars go to your Google profile. Three stars or fewer never do — that customer lands on a private feedback form that comes straight to your inbox, usually within seconds, so you get a chance to fix it before anyone else sees it.",
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
      q: `Why would you work for free?`,
      a: `Because I need proof in your trade more than I need your money right now. A real before-and-after from a business like yours is worth more to me than a few hundred dollars, and the fastest way to get one is to do the work properly and let the result speak. The $${offer.software} covers the platform the system runs on — messaging, the dashboard, the integrations. That's a real cost I can't absorb. My time is the part I'm not charging for.`,
    },
    {
      q: `What happens when I hit the goal?`,
      a: `I'll tell you, and then you decide. Management becomes $${offer.managed}/mo if you want me to keep running it, or you keep the system at $${offer.software}/mo and run it yourself — the requests keep going out either way. You can also just stop. The reviews are on your profile and they stay there.`,
    },
    {
      q: `What's the catch?`,
      a: `Two, and they're both real. First, I only take ${offer.capacity.perMonth} accounts a month, because I'm doing the setup and the ongoing work by hand — if that's full when you call, I'll say so. Second, this only works if you're actually finishing jobs for people who are happy. I can automate the asking. I can't fix the work.`,
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
  badge: "Sample",
  note: "Screens show sample data so you can see the layout. Your own numbers replace them on day one.",
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
      label: "3 stars or fewer",
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
  eyebrow: "The dashboard",
  heading: "You watch it move.",
  sub: "Your rating, how many reviews came in this month, and where each one came from. Plus how your review count compares to the shops your customers also called. Sample data shown.",

  beforeAfter: {
    heading: "Rating and review count over time",
    before: { label: "Before", rating: 4.2, reviews: 31, caption: "Where most shops sit" },
    after: { label: "After", rating: 4.8, reviews: 94, caption: "Same business, same jobs" },
    delta: "63 reviews added",
  },

  rank: {
    heading: "Review counts near you",
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

/**
 * Side-by-side comparison, ranked by REVIEW COUNT rather than map position —
 * the product is review volume, not search rank. Sample figures, consistent
 * with the hero counter's end state.
 */
export const compare = {
  eyebrow: "The gap",
  heading: "Be the one with the most reviews.",
  body: "When someone searches your trade and three businesses come back, they read the review counts before they read anything else. The shop with 94 gets the call. The shop with 31 gets skipped, even when the work is better.",
  cta: "See how it works",
  cardHeading: "Plumbers within 5 miles",
  rows: [
    { name: "Your business", rating: 4.8, reviews: 94, you: true },
    { name: "Valley Plumbing & Drain", rating: 4.5, reviews: 61, you: false },
    { name: "A-1 Rooter", rating: 4.2, reviews: 38, you: false },
  ],
  footnote: "Sample data. Your own review count replaces it on day one.",
} as const;

export const statsSection = {
  eyebrow: "The numbers",
  heading: "Why reviews decide who gets called.",
  sub: "Figures below are from published research, cited so you can check them.",
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


/* ==========================================================================
   Structural expansion — problem → stakes → speed → features → plan.

   The section *order* follows what converts on comparable pages in this
   category. All wording here is original, written for Fynd's voice.
   ========================================================================== */

export const trust = {
  /** Only shown when real values exist in content/clients.ts. */
  statsHeading: "Where things stand",
  logosHeading: "Businesses running Fynd",
} as const;

export const problem = {
  eyebrow: "The problem",
  heading: "You do good work. Your profile doesn't show it.",
  sub: "Four things are usually true at once, and they compound.",
  items: [
    {
      title: "Nobody's asking",
      body: "The job ends, the customer leaves happy, and that's it. Almost every review you never got was one you never asked for.",
    },
    {
      title: "You don't have time to chase",
      body: "You meant to text them. Then the next job started. Asking works, but only if it happens the same day, every day, without you.",
    },
    {
      title: "The happy ones never post",
      body: "The customers who loved the work are exactly the ones who forget to say so. The rare unhappy one always finds the time.",
    },
    {
      title: "The shop down the road wins",
      body: "They're not better than you. They have 200 reviews and you have 31, and to someone scrolling on a phone that reads as the same thing.",
    },
  ],
} as const;

export const whyReviews = {
  eyebrow: "Why it matters",
  heading: "Reviews are the whole ballgame for local.",
  items: [
    {
      title: "They decide who gets called",
      body: "Given two businesses that both look competent, people call the one with more reviews. It is the cheapest tiebreaker you can own.",
    },
    {
      title: "They're the last thing checked",
      body: "Even a referral looks you up first. Your profile is the interview you don't get to attend.",
    },
    {
      title: "Recent beats old",
      body: "Reviews decay. A steady trickle every week reads as a business that's busy right now — a wall of reviews from 2021 doesn't.",
    },
    {
      title: "Volume makes price matter less",
      body: "When you're clearly the safest choice, you stop being the cheapest quote and start being the obvious one.",
    },
  ],
} as const;

export const quickWins = {
  eyebrow: "Speed",
  heading: "First reviews inside a week.",
  sub: "Not a 90-day onboarding. Here's the actual clock.",
  steps: [
    {
      when: "Day 1",
      title: "Fifteen-minute call",
      body: "I need your Google Business Profile and how you track jobs. That's the whole ask.",
    },
    {
      when: "Day 3",
      title: "You approve the message",
      body: "I build it, you read the exact text your customers will get and change anything that doesn't sound like you.",
    },
    {
      when: "Day 7",
      title: "Reviews start landing",
      body: "We open with your recent jobs, so there's a backlog of happy customers to ask on day one.",
    },
  ],
  footnote:
    "How fast it moves after that is a function of your job volume — 20 jobs a week moves quicker than 3.",
} as const;

export const features = {
  eyebrow: "What's included",
  heading: "Everything, on the one plan.",
  sub: "No tiers, no add-ons, no per-seat pricing. You get the whole thing.",
  items: [
    {
      icon: "MessageSquare",
      title: "Requests that sound like you",
      body: "Personalized with the customer's name and the job you did, sent from your business name. Not a template blast.",
    },
    {
      icon: "Plug",
      title: "CRM integration",
      body: "ServiceTitan, Jobber, Housecall Pro. Mark the job complete and the request fires on its own.",
    },
    {
      icon: "ShieldCheck",
      title: "Private feedback routing",
      body: "Three stars or fewer goes to your inbox instead of your public profile. Four and five go to Google.",
    },
    {
      icon: "Repeat",
      title: "Polite follow-up",
      body: "One nudge if they don't respond, then it stops. Nobody gets pestered into a bad review.",
    },
    {
      icon: "Sparkles",
      title: "Reply assistance",
      body: "Drafted responses to every review, in your voice, for you to approve. Google counts replies too.",
    },
    {
      icon: "ShieldAlert",
      title: "Removal requests",
      body: "Reviews that break Google's rules — fake ones, competitor attacks, off-topic rants — get reported and chased. Google makes the call, but they do come down.",
    },
    {
      icon: "History",
      title: "Past-customer reactivation",
      body: "We start by asking everyone you've served recently, not just new jobs. That's where the first wave comes from.",
    },
    {
      icon: "BarChart3",
      title: "The dashboard",
      body: "Rating, how many reviews came in, where each one came from, and how your count compares locally.",
    },
    {
      icon: "CreditCard",
      title: "NFC review cards",
      body: "Tap-to-review cards for the truck and the front counter, for the customers who'd rather do it there and then.",
    },
  ],
} as const;

export const pricing = {
  eyebrow: "Pricing",
  heading: "One plan. Everything in it.",
  sub: "You are paying for software, not for me. I build it, run it, and keep it running for free until you hit the goal — the $97 covers the platform underneath it.",
  planName: "Review System",
  includedHeading: "Included",
  included: [
    "Unlimited review requests",
    "Text and email sequences",
    "Private feedback routing",
    "CRM integration",
    "Reply assistance",
    "Past-customer reactivation",
    "Review count benchmarking",
    "Removal requests for rule-breaking reviews",
    "NFC review cards",
    "Unlimited users",
    "Setup done for you",
  ],
  notIncludedHeading: "What you won't find",
  notIncluded: [
    "Setup fees",
    "Per-seat charges",
    "A contract",
    "A management fee, until you hit the goal",
  ],
  /** Stated plainly rather than buried — the free period does end. */
  afterHeading: "When the free period ends",
  afterBody: `You'll have hit ${offer.goal}. Keep me running it for $${offer.managed}/mo, keep the software at $${offer.software}/mo and run it yourself, or stop. Your reviews stay on your profile either way.`,
} as const;

/** Additional FAQ entries appended to the originals. */
export const faqExtra = [
  {
    q: "Can you get a bad review taken down?",
    a: "Only if it breaks Google's rules, and I'll tell you straight which bucket yours is in. Fake reviews, ones from competitors, off-topic rants, anything with slurs or personal details — those get reported and chased, and they do come down. A real customer who had a genuinely bad experience and said so honestly is not coming down, not by me and not by anyone selling you otherwise. What we do instead is bury it: enough recent four and five star reviews and one bad one stops being the first thing anybody reads.",
  },
  {
    q: "Who is this actually for?",
    a: "Local businesses where you finish a job and leave — trades, auto, home services, personal services. If your customers find you on Google Maps and you'd struggle to name the last person who reviewed you, it fits.",
  },
  {
    q: "What if I have more than one location?",
    a: "Each location has its own Google Business Profile, its own review flow, and its own dashboard. Message me about pricing for multiple locations rather than assuming it's a multiple of $97 — it usually isn't.",
  },
  {
    q: "How many messages will my customers get?",
    a: "One request, and one follow-up if they don't respond. Then it stops. Anyone who replies STOP is removed immediately, and nothing sends outside 8am–8pm their time.",
  },
  {
    q: "What about repeat customers?",
    a: "Someone who's already reviewed you doesn't get asked again. Regulars on recurring work get asked once, not after every visit.",
  },
  {
    q: "Can I ask customers from before I signed up?",
    a: "Yes, and that's usually where the first wave comes from. If you can export a list of recent customers, we ask them in the first week. It's the fastest lever you have.",
  },
  {
    q: "Do you do platforms other than Google?",
    a: "Google first, always — it's the one your customers actually check before they call. Facebook and industry-specific sites can be added once your Google reviews are coming in steadily.",
  },
  {
    q: "Do you need access to my Google account?",
    a: "You add me as a manager on your Business Profile, which lets me read reviews and post replies. It doesn't give me access to your email, your ads, or anything else in your Google account, and you can remove me in two clicks.",
  },
  {
    q: "Can I put the reviews on my website?",
    a: "Yes. There's an embeddable widget that pulls your live Google reviews onto your site, so the same proof works on the page people land on after they find you.",
  },
];
