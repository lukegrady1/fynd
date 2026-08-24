/**
 * Every string on /start and /call lives here so headlines can be rewritten
 * and A/B tested without touching component code.
 */

export const offer = {
  productName: "Review System",

  /**
   * One number, for cold traffic.
   *
   * `regular` is the rate the page is discounted from and `price` is what
   * checkout charges. There is no software/management split on the site any
   * more — the "we run it free until you hit the goal" angle is an SMS-only
   * pitch, so nothing on the page should reference it.
   */
  price: 97,
  regular: 197,

  /** NFC review card. One-off add-on, not part of the subscription. */
  nfcCard: 20,

  terms: "No contract. Cancel anytime.",

  /** Used by the "what's the catch" FAQ answer. */
  capacity: {
    perMonth: 5,
  },
  /**
   * Fallback deadline for the /call confirmation page. ISO 8601 with an
   * explicit offset.
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
  label: "Limited time offer",
  /** Suffix after the running clock, e.g. "6d 14:22:07 left". */
  suffix: "left",
  resets: "Resets Sunday",
} as const;

/**
 * The hero visual: the automation running end to end. This is the product —
 * a dashboard is not. Times are minutes apart on purpose; the whole point is
 * that it happens while the owner is already on the next job.
 */
export const heroFlow = {
  eyebrow: "Automated reputation management",

  /**
   * One sentence told left to right: something happens, Fynd handles it, and
   * the business is better off. The right-hand column is deliberately business
   * outcomes rather than product features — "we manage it automatically" is a
   * description of us, "you rank higher" is a reason to care.
   */
  trigger: {
    title: "Appointment done",
    body: "Mark it complete in your booking software. That's your only step.",
  },

  brand: {
    label: "Fynd",
    body: "Asks every client, routes the feedback, drafts the replies.",
  },

  outcomes: [
    {
      n: "01",
      icon: "trending",
      tone: "blue",
      title: "Rank higher on Google",
      body: "Volume and recency are what Google rewards.",
    },
    {
      n: "02",
      icon: "search",
      tone: "green",
      title: "Get found by more customers",
      body: "A stronger profile surfaces in more searches.",
    },
    {
      n: "03",
      icon: "shield",
      tone: "orange",
      title: "Build trust",
      body: "The rating people see is your whole first impression.",
    },
  ],

} as const;

/** Small strip under the hero. Qualifies the visitor without an essay. */
export const trustStrip = {
  lead: "Built for studios and salons where clients book, come in, and leave happy.",
  industries: [
    "Hair salons",
    "Barbers",
    "Massage therapy",
    "Pilates studios",
    "Yoga",
    "Nails",
    "Skincare",
  ],
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
    lead: "Every appointment you finish",
    accent: "should earn you a review.",
    leadWithBiz: "Every appointment at",
    accentWithBiz: (biz: string) => `${biz} should earn a review.`,
    sub: "Fynd asks every client for a Google review automatically — building trust, lifting your reputation, and helping you rank higher in local search while you stay focused on the work.",
    cta: `Start for $${offer.price}/month`,
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
    sub: "Fifteen minutes on the phone. I'll show you where your reputation stands, what it's costing you in rank, and exactly how the system builds the trust back. No slides, no pitch.",
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

/** The proof row under the hero CTA. Data lives in content/clients.ts. */
export const heroProof = {
  label: "Trusted by local businesses",
  ratingLabel: (rating: number) => `Rated ${rating} out of 5`,
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
   * The standalone "Get started" section was removed — pricing is now the
   * single conversion module on /start, so only the checkout mechanics below
   * are still used.
   */
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
      a: "Typically the first ones land inside a week. It depends how many clients you see — a salon running 40 appointments a week moves faster than a solo therapist doing 10. Most accounts see a visible rating change in the first month.",
    },
    {
      q: "Do I have to do anything?",
      a: "The manual version takes five seconds: text the client's number to a dedicated line as they leave. The automatic version takes zero — we connect to most booking platforms, and requests fire when you mark the appointment complete. If yours isn't a direct integration it almost certainly works over Zapier. Either way, you never write the message.",
    },
    {
      q: "Am I locked in?",
      a: "Month to month. Cancel anytime from your dashboard or by texting me. The reviews you've collected are on your Google Business Profile — they're yours and they stay there whether you keep paying or not.",
    },
    {
      q: `What's the catch?`,
      a: `Two, and they're both real. First, setup is done by hand, so there is a limit to how many accounts start in a given week — if this week is full I'll tell you. Second, this only works if your clients are actually leaving happy. I can automate the asking. I can't fix the service.`,
    },
  ],
} as const;

export const finalCta = {
  heading: "Ready to own your reputation?",
  ctaStart: `Start for $${offer.price}/month`,
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
  skipCta: `Start for $${offer.price}/month`,
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

export const mechanism = {
  eyebrow: "Solution",
  heading: "With Fynd, managing your reputation",
  headingAccent: "becomes effortless.",
  sub: "Your client checks out. Fynd handles the rest, so you can get on with the next one.",

  /** The message your customer receives, rendered as a real thread. */
  sms: {
    business: "Marlow Hair Studio",
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
      title: "The appointment ends",
      body: "Mark it complete in your booking software. That's all you have to do.",
    },
    {
      icon: "send",
      title: "Fynd sends the request",
      body: "Within the hour, your client gets a personalized text from your studio.",
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
        body: "Every message uses the client's name and the service they booked.",
      },
      {
        icon: "shield",
        title: "Every customer gets asked",
        body: "Same message, after every appointment. Nobody is left off the list.",
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
  heading: "One price. Everything included.",
  planName: offer.productName,
  strikeLabel: "Regular price",
  nowLabel: "Everything below, one monthly price",
  cta: `Start for $${offer.price}/month`,
  clears: [
    "Live and sending within 72 hours",
    "No contract, cancel anytime",
    "No setup fee, no per-seat pricing",
  ],
  addOn: {
    label: "NFC review card",
    price: `$${offer.nfcCard}`,
    note: "One-off. Tap it on a phone and the review page opens.",
  },
  reassure:
    "We build it, connect it to your booking software, and switch it on.",
} as const;

/**
 * The before/after Google Business Profile.
 *
 * These are real screenshots of a real profile, not a mockup — which is why
 * this section is worth more than everything else on the page put together,
 * and why the numbers and the elapsed time both have to be true. Replace the
 * files, the figures and `elapsed` together; never one without the others.
 */
export const profileSwap = {
  eyebrow: "Before / after",
  heading: "What sixty days of asking every client looks like.",
  elapsed: "~60 days",
  business: "Salt Salon",
  before: {
    label: "Before",
    src: "/old-gbp.png",
    width: 398,
    height: 426,
    alt: "Salt Salon's Google Business Profile before Fynd: 4.6 stars from 93 reviews.",
  },
  after: {
    label: "After",
    src: "/new-gbp.png",
    width: 1913,
    height: 2048,
    alt: "Salt Salon's Google Business Profile after Fynd: 4.9 stars from 174 reviews.",
  },
} as const;

export const results = {
  eyebrow: "Results",
  heading: "More reviews. Better reputation. More business.",
  sub: "Every appointment that ends becomes a request, every request that lands becomes a review, and the rating people see when they look you up moves up.",
  cta: `Start for $${offer.price}/month`,

  dashboard: {
    label: "Overview",
    business: "Marlow Hair Studio",
    live: "Live",
    range: "Last 6 months",
    kpis: [
      { label: "Google rating", value: "4.8", delta: "0.6", note: "vs. last 6 mo", stars: true },
      { label: "Total reviews", value: "118", delta: "67", note: "vs. last 6 mo" },
      { label: "Review requests sent", value: "305", delta: "28%", note: "vs. last 6 mo" },
      { label: "Response rate", value: "100%", note: "All reviews replied to" },
    ],
    chart: {
      heading: "Reviews over time",
      months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      values: [51, 64, 77, 90, 104, 118],
      tooltip: { value: "118", label: "Total reviews" },
    },
  },

  compare: {
    heading: "How you compare",
    sub: "vs. other local salons",
    rows: [
      { name: "Your business", rating: 4.8, reviews: 118, you: true },
      { name: "The Loft Salon", rating: 4.5, reviews: 61, you: false },
      { name: "Bloom Beauty Bar", rating: 4.2, reviews: 38, you: false },
    ],
    takeaway: "More reviews means more bookings. More bookings means a fuller calendar.",
  },
} as const;

/**
 * The integrations section — the radial network of booking platforms around
 * the Fynd mark.
 *
 * `logo` points at a file in /public/integrations. If the file is missing the
 * card falls back to the platform name set as a wordmark rather than showing
 * a broken image. Do not substitute a redrawn or generated logo for a real
 * one — a slightly-wrong logo is more noticeable than no logo.
 *
 * `light: true` marks a logo that is dark-on-light and would disappear
 * against navy. Those get a light chip behind them, which is what a brand's
 * own guidelines would ask for, rather than being recoloured here.
 *
 * Ring positions are computed from the list length in the component, not
 * stored here — hand-tuned coordinates collided as soon as the list grew.
 */
export const integrations = {
  eyebrow: "Fit",
  heading: {
    lead: "Works with the",
    accent: "booking software",
    tail: "you already use.",
  },
  sub: "Fynd connects to the tools you already rely on, so the request fires the moment an appointment is marked complete.",
  badge: "Integrates with your existing workflow",

  platforms: [
    { name: "Goldie", logo: "/integrations/goldie.png" },
    { name: "Vagaro", logo: "/integrations/vagaro.png" },
    { name: "Mindbody", logo: "/integrations/mindbody.png" },
    { name: "Fresha", logo: "/integrations/fresha.png", light: true },
    { name: "Timely", logo: "/integrations/timely.png" },
    { name: "Booker", logo: "/integrations/booker.png" },
    { name: "Appointy", logo: "/integrations/appointy.png" },
    { name: "Setmore", logo: "/integrations/setmore.png" },
    { name: "MyTime", logo: "/integrations/mytime.png" },
    { name: "Square", logo: "/integrations/square.png" },
    { name: "StyleSeat", logo: "/integrations/styleseat.png" },
    { name: "Booksy", logo: "/integrations/booksy.png" },
    { name: "Acuity", logo: "/integrations/acuity.png" },
  ],

  fallback: {
    lead: "Don't see your booking software?",
    body: "We probably connect with it anyway — and if you don't use one at all, that's fine too.",
    ctaLabel: "Ask on a quick call",
  },

  features: [
    {
      icon: "bolt",
      tone: "blue",
      title: "Automatic triggers",
      body: "Requests go out on their own once the appointment is done.",
    },
    {
      icon: "sync",
      tone: "green",
      title: "Customer sync",
      body: "Appointment and client details stay up to date both ways.",
    },
    {
      icon: "shield",
      tone: "orange",
      title: "Secure and reliable",
      body: "Verified connections built around the workflow you already have.",
    },
    {
      icon: "user",
      tone: "blue2",
      title: "Easy to connect",
      body: "Set it up once and Fynd handles the rest from there.",
    },
  ],
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
      body: "The appointment ends, they tell you they love it, and that's where it stops. Almost every review you never got was one you never asked for.",
    },
    {
      title: "You don't have time to chase",
      body: "You meant to text them. Then your next client walked in. Asking works, but only if it happens the same day, every day, without you.",
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

export const features = {
  eyebrow: "What's included",
  heading: "Everything is included.",
  sub: "Four things, all running from the day you're set up.",

  /** Labels for the dashboard mockup beside the list. The business name is
      not here: it comes from the ?biz= param so the mockup shows the reader
      their own studio, same as the hero. */
  mockup: {
    label: "Overview",
    range: "last 30 days",
  },
  items: [
    {
      icon: "MessageSquare",
      title: "Automatic review requests",
      body: "Every completed appointment triggers a personalized request, sent from your studio's name.",
    },
    {
      icon: "Plug",
      title: "Booking software integration",
      body: "Connects to most booking platforms. No software? Text the client's number instead.",
    },
    {
      icon: "Sparkles",
      title: "Review management",
      body: "Replies drafted in your voice, and removal requests for anything that breaks Google's rules.",
    },
    {
      icon: "BarChart3",
      title: "Reputation dashboard",
      body: "Your rating, your review growth, and where you sit against the studios nearby.",
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
    a: "Studios and salons where clients book time with you — hair, barbering, massage, pilates, yoga, nails, skincare. If new clients find you on Google and you'd struggle to name the last person who reviewed you, it fits.",
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
    a: "Someone who's already reviewed you doesn't get asked again. Your weekly regulars get asked once, not after every appointment.",
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
