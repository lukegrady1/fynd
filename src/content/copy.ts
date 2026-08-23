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

  /** Used by the "what's the catch" FAQ answer. */
  capacity: {
    perMonth: 5,
  },
  /**
   * Fallback deadline used when the `exp` query param is missing or past.
   * ISO 8601 with an explicit offset. Update alongside the cohort.
   */
  cohortDeadlineIso: "2026-09-30T18:00:00-04:00",
  /** Formatting timezone — fixed so server and client render the same string. */
  timeZone: "America/New_York",
} as const;

/**
 * The claim window shown in the offer bar. Ten minutes from the visitor's
 * first arrival, persisted so a reload does not restart it.
 */
export const offerWindow = {
  label: "Free management",
  claimBoth: "Book a call or start now to claim it",
  closedLabel: "Claim window closed",
  closedHint: "Book a call and I'll see what I can do",
} as const;

/**
 * The hero visual: the automation running end to end. This is the product —
 * a dashboard is not. Times are minutes apart on purpose; the whole point is
 * that it happens while the owner is already on the next job.
 */
export const heroFlow = {
  job: {
    label: "Job completed",
    business: "Reyes Auto Care",
    detail: "Oil change",
    time: "9:41 AM",
  },
  review: {
    label: "New review",
    quote: "Great service, on time and super friendly!",
    name: "Dana M.",
    time: "9:43 AM",
  },
  reply: {
    label: "Reply posted",
    body: "Thanks so much, Dana! We appreciate you!",
    business: "Reyes Auto Care",
    time: "9:48 AM",
  },
  autopilot: "All on autopilot",
} as const;

/** Small strip under the hero. Qualifies the visitor without an essay. */
export const trustStrip = {
  lead: "Built for businesses where the job ends and the customer leaves.",
  industries: [
    "Plumbing",
    "HVAC",
    "Auto",
    "Electrical",
    "Roofing",
    "Cleaning",
    "Landscaping",
  ],
  crms: "Works with ServiceTitan, Jobber, Housecall Pro and most CRMs",
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
    sub: "Every time you finish a job, Fynd automatically asks your customers for a review. Then it keeps your reputation moving while you work.",
    cta: "Start for $97/mo",
    reassure: "No contract. Cancel anytime.",
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
    reassure: "No contract. Cancel anytime.",
  },

  demoLink: "Watch the 2-min demo",
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
    "I walk you through how the message reads and where each rating ends up, so there are no surprises.",
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
  /**
   * The card sits right after the mechanism, so it needs a bridge — dropping
   * a price card on someone with no transition reads as abrupt.
   */
  eyebrow: "Get started",
  sectionHeading: "That's the whole system.",
  sectionSub:
    "If it makes sense for you, you can be set up today. The form takes a few minutes and your first requests go out this week.",
  /** Price lives in the rows below, so it isn't repeated in the heading. */
  heading: offer.productName,
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
  preframe:
    "This is what we'll be talking about, so nobody turns up expecting free consulting. Book inside the window and the free management is yours either way — whether you start on the call or after it.",
  textInstead: "Prefer to text? Reply to my message and I'll answer there.",
  loading: "Loading available times…",
} as const;

export const faq = {
  heading: "Straight answers",
  items: [
    {
      q: "What if I get a bad review?",
      a: "That's the part most people worry about, so it's built in. The portal asks how it went — Excellent, Good, Ok or Bad. Excellent and Good get pointed at your Google profile. Ok and Bad never do; that customer lands on a private feedback form that comes straight to your inbox, usually within seconds, so you hear it before anyone else does.",
    },
    {
      q: "Is this against Google's rules?",
      a: "No. Google's policy prohibits incentivizing reviews and review gating — selectively soliciting only customers you expect to be happy. We ask every customer, and we never offer anything in exchange. The private-feedback path is an additional channel, not a filter on who gets asked. The portal does turn what the customer picked into a draft, but they read it, change anything that isn't true for them, and post it from their own account — or don't.",
    },
    {
      q: "How long until I see reviews?",
      a: "Typically the first ones land inside a week. It depends on your job volume — if you finish 20 jobs a week, you'll see movement faster than someone finishing 3. Most accounts see a visible rating change in the first month.",
    },
    {
      q: "Do I have to do anything?",
      a: "The manual version takes five seconds: text a number to a dedicated line when the job's done. The automatic version takes zero — we connect to most CRMs, including ServiceTitan, Jobber and Housecall Pro, and requests fire when you mark a job complete. If yours isn't a direct integration it almost certainly works over Zapier. Either way, you never write the message.",
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
  sub: "One form and I can get started. Here's the order it happens in.",
  steps: [
    {
      when: "Right now",
      body: "Fill out the form below. It's the only thing I need from you.",
    },
    {
      when: "Next",
      body: "I build your portal, your message and the routing rules, and connect it all to your Google Business Profile.",
    },
    {
      when: "Then",
      body: "You give the word and requests start going to your recent customers.",
    },
  ],
  formHeading: "The onboarding form",
  formBody:
    "This is the whole setup. A few minutes now and I can start building.",
  callHeading: "Want to walk through it instead?",
  callBody: "Optional. If you'd rather do the form together, grab a time.",
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
  badge: "Preview",
} as const;

export const mechanism = {
  eyebrow: "The mechanism",
  heading: "Here's what happens after every job.",
  sub: "You finish the job. Fynd handles the rest. So you can get back to work.",

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
      subtitle: "Tap a star to review",
      time: "9:41 AM",
    },
  },

  steps: [
    {
      icon: "wrench",
      title: "You finish the job",
      body: "Mark the job complete in your CRM. That's all you have to do.",
    },
    {
      icon: "send",
      title: "Fynd sends the request",
      body: "Within the hour, your customer gets a personalized text from your business.",
    },
    {
      icon: "star",
      title: "The customer leaves a review",
      body: "One tap takes them to Google. The review shows up on your profile.",
    },
    {
      icon: "reply",
      title: "Fynd manages it for you",
      body: "Fynd keeps your reviews organized and replies in your voice.",
    },
  ],

  behindScenes: {
    heading: "Behind the scenes",
    items: [
      {
        icon: "clock",
        title: "Smart timing",
        body: "We wait the right amount of time before sending.",
      },
      {
        icon: "user",
        title: "Personalized",
        body: "Every message uses the customer's name and the job they had done.",
      },
      {
        icon: "shield",
        title: "Every customer gets asked",
        body: "Same message, after every job. Nobody is left off the list.",
      },
      {
        icon: "lock",
        title: "Private feedback",
        body: "If someone has an issue, it comes to you first.",
      },
    ],
  },
} as const;

/**
 * Side-by-side comparison, ranked by REVIEW COUNT rather than map position —
 * the product is review volume, not search rank. Sample figures, consistent
 * with the hero counter's end state.
 */
/**
 * Results: the dashboard and the competitor comparison, together, because
 * they answer the same question — what does this do to my reputation.
 *
 * Figures describe a demo account. No claim is made about what any real
 * customer achieved; there is no client data to draw on yet.
 */
/**
 * Pricing, deliberately small. The features section says what's included, so
 * this only has to state the number and clear the objections.
 */
export const pricing = {
  eyebrow: "Pricing",
  heading: "Put the whole thing on autopilot.",
  planName: "Review System",
  clears: ["No contract", "No setup fee", "No per-seat pricing"],
  cta: "Start for $97/mo",
  reassure:
    "We'll get you set up and your first requests can go out this week.",
} as const;

export const statsSection = {
  eyebrow: "The numbers",
  heading: "Why reviews decide who gets called.",
  sub: "Figures below are from published research, cited so you can check them.",
} as const;

export const results = {
  eyebrow: "Results",
  heading: "More reviews. Better reputation. More business.",
  sub: "Every job that ends becomes a request, every request that lands becomes a review, and the rating people see when they search for you moves up.",
  cta: "Start for $97/mo",

  dashboard: {
    label: "Overview",
    business: "Reyes Auto Care",
    live: "Live",
    range: "Last 6 months",
    kpis: [
      { label: "Google rating", value: "4.8", delta: "0.6", note: "vs. last 6 mo", stars: true },
      { label: "Total reviews", value: "94", delta: "63", note: "vs. last 6 mo" },
      { label: "Review requests sent", value: "305", delta: "28%", note: "vs. last 6 mo" },
      { label: "Response rate", value: "100%", note: "All reviews replied to" },
    ],
    chart: {
      heading: "Reviews over time",
      months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      values: [31, 44, 58, 71, 84, 94],
      tooltip: { value: "94", label: "Total reviews" },
    },
  },

  compare: {
    heading: "How you compare",
    sub: "vs. other local businesses",
    rows: [
      { name: "Your business", rating: 4.8, reviews: 94, you: true },
      { name: "Valley Plumbing & Drain", rating: 4.5, reviews: 61, you: false },
      { name: "A-1 Rooter", rating: 4.2, reviews: 38, you: false },
    ],
    takeaway: "More reviews means more calls. More calls means more booked jobs.",
  },
} as const;

export const fit = {
  eyebrow: "Fit",
  heading: "Does this work with what you already use?",

  integrations: {
    heading: "Connects to most CRMs",
    sub: "Mark a job complete and the request fires. Nothing else to remember.",
    items: [
      { name: "ServiceTitan", status: "Direct integration" },
      { name: "Jobber", status: "Direct integration" },
      { name: "Housecall Pro", status: "Direct integration" },
      { name: "Most other CRMs", status: "Direct or via Zapier" },
      { name: "Not sure what you're on?", status: "Tell me and I'll check" },
    ],
    fallback:
      "No CRM? Text the customer's number to your Fynd line when you pack up. That's the whole workflow.",
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
  heading: "Reviews in days, not weeks.",
  sub: "No drawn-out onboarding. One form and you're in the queue.",
  steps: [
    {
      when: "Step one",
      title: "You fill out the form",
      body: "Your Google Business Profile, how you track jobs, and who your customers should hear from.",
    },
    {
      when: "Step two",
      title: "I build it",
      body: "Your portal, your message in your voice, the routing rules and your Fynd number. Nothing for you to set up.",
    },
    {
      when: "Step three",
      title: "Requests start going out",
      body: "We open with the customers you've already served, so there's a backlog of happy people to ask on day one.",
    },
  ],
} as const;

export const features = {
  eyebrow: "What's included",
  heading: "Everything is included.",
  sub: "Four things, all running from the day you're set up.",
  items: [
    {
      icon: "MessageSquare",
      title: "Automatic review requests",
      body: "Every completed job triggers a personalized request, sent from your business name.",
    },
    {
      icon: "Plug",
      title: "CRM integration",
      body: "ServiceTitan, Jobber, Housecall Pro and most others. No CRM? Text the number instead.",
    },
    {
      icon: "Sparkles",
      title: "Review management",
      body: "Replies drafted in your voice, and removal requests for anything that breaks Google's rules.",
    },
    {
      icon: "BarChart3",
      title: "Reputation dashboard",
      body: "Your rating, your review growth, and where you sit against the shops nearby.",
    },
  ],
  footnote: "No add-ons. No per-seat pricing. No setup fee.",
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
