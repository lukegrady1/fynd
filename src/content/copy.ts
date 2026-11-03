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
  nfcCard: 19,

  /**
   * The second plan: a rebuilt website plus the Review System. One charge
   * of `price` at checkout covers the build and the first period; from the
   * next billing day it is the ordinary `offer.price` a month. Sold on
   * /website and teased at the bottom of the homepage.
   */
  bundle: {
    productName: "Website + Review System",
    price: 249,
  },

  /**
   * The one-time service: a Google Business Profile tidied up once, by a
   * person. No subscription attached — the checkout is plain `payment`
   * mode and never reaches `ensureSubscription`. Sold on /optimize.
   */
  gbp: {
    productName: "Profile Optimization",
    price: 99,
  },

  terms: "No contract. Cancel anytime.",

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
   * Split across two lines with the payoff on the second, which renders in
   * Fynd Green — the headline convention in design.md §10. So `accent` is the
   * half that has to carry the promise, not just the tail of a sentence.
   *
   * The biz variant keeps the same shape and drops the business name into the
   * green line, since naming the business is a stronger opening than any
   * pattern.
   */
  start: {
    lead: "Turn appointments",
    accent: "into reviews.",
    leadWithBiz: "Turn appointments at",
    accentWithBiz: (biz: string) => `${biz} into reviews.`,
    sub: "Fynd asks every customer for a review after their appointment, follows up, and helps manage your reputation — all without adding another task to your day.",
    /**
     * Hero only. The price-bearing label lives on `pricing.cta`, which the
     * results, pricing and closing buttons all read — changing this one does
     * not move those, and it shouldn't: the number belongs next to the offer,
     * not at the top of the page before anyone has been told what it buys.
     */
    cta: "Start Now",
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

/**
 * /watch — the VSL page texted to leads. Three beats: the video, what owners
 * say, and the calendar. There is no price on it: the video sells the idea
 * and the call is the ask, so the number belongs on the call.
 */
export const watch = {
  /**
   * The one ask on the page, on every button that scrolls to the plans:
   * hero, video end-card, closer, sticky pill. Plain "Start now" rather than
   * "Start for $97" because the page carries two prices, and naming one on
   * the button would misquote the other.
   */
  cta: "Start now",

  hero: {
    /** One headline for everyone — no ?biz= variant on this page. */
    lead: "Watch how Fynd turns",
    accent: "appointments into reviews.",
  },

  video: {
    src: "/fynd-split-vsl-vo-web_4.mp4",
    poster: "/fynd-split-vsl-poster.jpg",
    /** Runs 47.1s, with voiceover. Update if the file is swapped. */
    duration: "0:47",
    playLabel: "Play the video",
    /** Over the muted autoplay. Pressing it restarts from 0 with audio. */
    unmuteLabel: "Turn sound on",
    /** Shown over the last frame once it finishes. */
    ended: {
      heading: "Ready to run this on your business?",
      replay: "Watch again",
    },
  },

  testimonials: {
    eyebrow: "Owners",
    lead: "What owners say",
    accent: "once it's running.",
  },

  /**
   * The plan picker — the conversion module on /watch, at #convert. Two
   * tabs above one card, so a phone is not stacking two full cards. The
   * card bodies are the same ones as on / and /website.
   */
  plans: {
    eyebrow: "Pricing",
    lead: "Pick a plan.",
    accent: "Start today.",
    /** Accessible name for the tab strip. */
    pickerLabel: "Choose a plan",
    /** Name and a line on what it is. No prices on the tabs — the cards
        carry them, with the strikethrough and the clock. */
    review: {
      name: offer.productName,
      blurb: "Reviews on autopilot",
    },
    bundle: {
      name: offer.bundle.productName,
      blurb: "Your site rebuilt, reviews included",
    },
  },

  /**
   * The calendar column that used to sit on this page. `BookDemo.tsx` still
   * reads it; the page no longer renders that section.
   */
  book: {
    eyebrow: "Book a demo",
    lead: "Pick a time",
    accent: "that suits you.",
    /** Over the two faces beside the calendar. */
    meetLabel: "Who you'll be talking to",
  },
} as const;

export const checkout = {
  /**
   * The standalone "Get started" section was removed — pricing is now the
   * single conversion module on /start, so only the checkout mechanics below
   * are still used.
   */
  secure: "Secure checkout by Stripe",
  cancelledNote: {
    lead: "No charge was made. Still deciding?",
    linkLabel: "Book a call instead",
  },
} as const;

/**
 * /demo is the bare calendar now — no heading, preframe, agenda or
 * text-instead note. The page is reached by clicking "Book a Demo" from a page
 * that has already made the argument, so the only string left is the one shown
 * while the embed loads.
 */
export const calendar = {
  loading: "Loading available times…",
} as const;

export const faq = {
  heading: "FAQs",
  /**
   * Order is deliberate: who it's for and what to expect first, then the
   * objections, then the implementation questions people scroll for.
   */
  items: [
    {
      q: "Who is Fynd for?",
      a: "Fynd is built for local business owners who want more 5-star Google reviews without the hassle. We work with hair salons, barbers, massage therapists, Pilates and yoga studios, nail and skincare studios, and home service businesses too. Whether you're a solo provider or running multiple locations, if you want more reviews without the hassle, Fynd is for you.",
    },
    {
      q: "Are these reviews real?",
      a: "Yes, every one of them. Fynd never writes a review, buys a review, or asks anyone who isn't your customer. The request goes only to people who actually had an appointment with you, and they write what they want in their own Google account, or don't. All Fynd does is ask at the right moment. The reviews are real customers saying real things, which is the only kind worth having.",
    },
    {
      q: "Why do 5-star reviews matter?",
      a: "Three reasons, and the numbers back them up. Google ranks local businesses partly on how many reviews they have and how recent they are, so more reviews means showing up higher in the map when someone searches for what you do. Once you're on the list, reviews decide who gets picked: 97% of people read reviews before choosing a local business, 47% won't use one with fewer than 20 reviews, and 31% will only use one rated 4.5 stars or higher. And recency counts: 74% want to see reviews from the last three months, which is why a steady stream beats a wall of old ones.",
      /** Every figure above is from this survey. Update both together. */
      link: {
        label: "Source: BrightLocal, Local Consumer Review Survey 2026",
        href: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    },
    {
      q: "How many reviews should I expect?",
      a: "Two waves. The first is your past customers: expect somewhere between 10% and 15% of the people already in your booking system or CRM to leave a review when we reach out to them. With 1,000 past customers on file, that's roughly 100 to 150 reviews in the first four to six weeks. The second wave is every customer from then on: expect 20% to 30% of new customers to leave a review after their appointment, and some businesses see more than half.",
    },
    {
      q: "What about repeat customers?",
      a: "Someone who's already reviewed you doesn't get asked again. Your weekly regulars get asked once, not after every appointment.",
    },
    {
      q: "How long until I see reviews?",
      a: "Fast. The moment setup is done, the messages start going out to your recent customers, and the first reviews usually land within 48 hours or shortly after. From there it builds with every appointment: the more clients you see, the faster the rating moves.",
    },
    {
      q: "Do I have to do anything?",
      a: "No. We connect to your booking system or CRM, and from there it's automatic: when an appointment is marked complete, the request goes out on its own. Once we have access, it's hands-off. You don't write the message, you don't send it, and you don't chase anyone.",
    },
    {
      q: "What booking software do you connect to?",
      /**
       * Only platforms with a verified route in, checked Sept 2026: a Zapier
       * app with an appointment trigger (Square, Acuity, Boulevard, Zenoti,
       * Meevo, Setmore, MyTime, Appointy) or a CRM Connector integration
       * (Vagaro, Mindbody, Booker, Square, Acuity). Fresha, Booksy,
       * StyleSeat, Goldie, GlossGenius, Jane and Schedulicity have neither;
       * Timely and WellnessLiving are on Zapier with no appointment trigger.
       */
      a: "Vagaro, Mindbody, Booker, Square, Acuity, Boulevard, Zenoti, Meevo, Setmore, MyTime and Appointy, plus most CRMs. Don't see yours? If it's on Zapier, we can connect it.",
      link: {
        label: "Check the Zapier list",
        href: "https://zapier.com/apps",
      },
    },
    {
      q: "What if I get a bad review?",
      a: "That's the part most people worry about, so it's built in. The portal asks how it went — Excellent, Good, Ok or Bad. Excellent and Good get pointed at your Google profile. Ok and Bad never do; that customer lands on a private feedback form that comes straight to your inbox, usually within seconds, so you hear it before anyone else does.",
    },
    {
      q: "Is this against Google's rules?",
      a: "No. Google's policy prohibits incentivizing reviews and review gating — selectively soliciting only customers you expect to be happy. We ask every customer, and we never offer anything in exchange. The private-feedback path is an additional channel, not a filter on who gets asked. The portal does turn what the customer picked into a draft, but they read it, change anything that isn't true for them, and post it from their own account — or don't.",
    },
    {
      q: "Can I pick which clients get asked?",
      a: "No, and that's on purpose. Google's rules prohibit choosing who gets asked, so everyone is asked. What protects your rating is the routing: an unhappy client lands on a private feedback form that comes straight to you, not on Google. Filtering would break the rules. Routing doesn't.",
    },
    {
      q: "Am I locked in?",
      a: "Month to month. Cancel anytime from your dashboard or by texting me. The reviews you've collected are on your Google Business Profile — they're yours and they stay there whether you keep paying or not.",
    },
    {
      q: "What happens if I cancel?",
      a: "The requests stop. Every review you've collected is on your Google profile and stays there. Reviews aren't ours to take back.",
    },
    {
      q: "Can you get a bad review taken down?",
      a: "Only Google can remove a review, and only when it breaks their rules — but the software does the work of that for you. Every new review is watched, and anything that looks fake, off-topic, from a competitor, or carries slurs or personal details gets flagged so it can be reported and chased. Those do come down. A real customer who had a bad day and said so honestly is not coming down, not for anyone. So the software does two more things about it: it posts a calm reply in your voice, so the next reader sees how you handle it, and it keeps the four and five star reviews coming, so one bad one stops being the first thing anybody reads. And because unhappy customers are routed to you privately first, most never post at all.",
    },
    {
      q: "Do you reply to reviews for me?",
      a: "Yes. Every new review gets a reply in your voice, posted for you, so nothing sits unanswered. Replies show the next person reading that you pay attention, and Google counts them too.",
    },
    {
      q: "What if I have more than one location?",
      a: "Each location has its own Google Business Profile, so each one needs its own Review System: its own review requests, its own routing, and its own dashboard. Reviews for one location never count toward another, which is exactly why a customer at your second shop needs to be asked about that shop.",
    },
    {
      q: "How many messages will my customers get?",
      a: "One request, and one follow-up if they don't respond. Then it stops. Anyone who replies STOP is removed immediately, and nothing sends outside 8am–8pm their time.",
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
  ],
} as const;

/**
 * /watch sells both plans, so its FAQ carries one question the homepage's
 * doesn't: why a website at all when the owner already has Vagaro. The
 * answer is the pitch for the bundle — the site ships with its own online
 * booking, so they move onto ours rather than keep paying for a booking
 * page. It goes second, straight after who it's for, because on this page
 * it is the objection. Everything else is the shared list, in order.
 */
const websiteQuestion = {
  q: "I already have Vagaro or online booking. Why do I need a website?",
  a: "Because the site comes with online booking built in, so you end up with one thing instead of two. Vagaro is a booking page: a calendar with your logo on it that people reach once they've already picked you. It isn't where they find you, and it isn't what convinces them. The site we build is the whole thing in one place: your work, your reviews shown live, your services and prices, and a booking calendar that's part of your own site rather than a tab that sends people off to someone else's software. Every appointment booked there feeds the review requests automatically, and when someone searches for what you do, Google has a real page to send them to.",
} as const;

const afterWhoItsFor = faq.items.findIndex((item) => item.q === "Who is Fynd for?") + 1;

export const watchFaq = {
  heading: faq.heading,
  items: [
    ...faq.items.slice(0, afterWhoItsFor),
    websiteQuestion,
    ...faq.items.slice(afterWhoItsFor),
  ],
} as const;

export const finalCta = {
  /**
   * Split so the payoff word carries Fynd Green, per design.md — inline here
   * rather than via SplitHeading, which breaks across two lines. `tail` is
   * punctuation only, so it renders hard against the accent with no space.
   */
  heading: {
    lead: "Ready to own your",
    accent: "reputation",
    tail: "?",
  },
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
} as const;

export const confirmed = {
  heading: "You're booked.",
  sub: "I'll call you at the number you gave me. If anything changes, just reply to my text.",
  addToCalendar: "Add to calendar",
  skipHeading: "Already sold?",
  skipBody: "You can skip the call and start now.",
  skipCta: `Start for $${offer.price}/month`,
} as const;

/**
 * /schedule — the setter's booking page. Internal: the setter keeps it open
 * while on the phone with a lead and books onto Keegan's calendar directly.
 */
export const setter = {
  eyebrow: "Setter booking",
  heading: "Book a demo with Keegan",
  note: "Books onto the Fynd Demo Call calendar, which is separate from the site's own demo calendar, so these bookings are traceable to you.",
  notConfigured: "Calendar not configured — set NEXT_PUBLIC_GHL_SETTER_CALENDAR_ID.",
} as const;

export const meta = {
  schedule: {
    title: "Setter booking — Fynd",
    description: "Internal booking calendar for setter-scheduled demos with Keegan.",
  },
  demo: {
    title: "Book a demo — Fynd",
    description:
      "Fifteen minutes to see where your rating stands and what the review system would do for your business.",
  },
  home: {
    title: "Fynd — Automated Google reviews for local businesses",
    description:
      "Every finished appointment asks for a Google review, automatically. More reviews, a better rating, and hours a year off your plate.",
  },
  start: {
    title: "Start — Fynd Review System",
    description:
      "Automated Google review requests for local service businesses. $97/mo, no contract.",
  },
  website: {
    /** The layout appends " | Fynd", so no brand here. */
    title: "Website + Reviews plan",
    description:
      "A rebuilt website plus automated Google review requests. $249 to start, then $97 a month. No contract.",
  },
  watch: {
    title: "Watch — Fynd Review System",
    description:
      "Forty-seven seconds on how Fynd turns finished appointments into Google reviews, then pick a plan and start today.",
  },
  optimize: {
    /** The layout appends " | Fynd". */
    title: "Google Business Profile optimization for salons and barbers",
    description:
      "Everything to update on a salon or barbershop Google Business Profile, what finished looks like, and $99 once if you'd rather we did it.",
  },
  optimizeThanks: {
    title: "Paid — Fynd Profile Optimization",
  },
  manageWelcome: {
    title: "You're in — Fynd",
  },
  manage: {
    /** The layout appends " | Fynd". */
    title: "Google Business Profile management for salons and barbers",
    description:
      "Your Google Business Profile optimized and run for you: weekly posts and photos, review requests and replies, website, social, video and AI search, with a monthly ranking report. $297 a month, no contract.",
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
    /** Sits next to the price so the add-on can't be read as part of the plan. */
    tag: "Optional",
    note: "One-time purchase. Tap it on a phone and the review page opens.",
  },
  /**
   * Sits under the card, as the out for anyone the price just stopped.
   * `linkLabel` is the only part that links — the sentence has to read
   * naturally with it underlined mid-phrase, so keep it a noun, not "click
   * here" and not the whole line.
   */
  demoLine: {
    lead: "Want to see it first? Book a",
    linkLabel: "demo call",
    tail: ".",
  },
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
  elapsed: "60 days",
  business: "Salt Salon",
  before: {
    label: "Before",
    src: "/old-gbp.webp",
    width: 398,
    height: 426,
    alt: "Salt Salon's Google Business Profile before Fynd: 4.6 stars from 93 reviews.",
  },
  after: {
    label: "After",
    src: "/new-gbp.webp",
    width: 1913,
    height: 2048,
    alt: "Salt Salon's Google Business Profile after Fynd: 4.9 stars from 174 reviews.",
  },
} as const;

/**
 * The secondary ask, shown beside every primary CTA.
 *
 * Booking lives on its own route now rather than as a module further down the
 * page, and these open it in a new tab: someone who wants a call before they
 * buy should be able to book it without losing the page that convinced them.
 *
 * The links carry the current query string across, so the SMS prefill params
 * (?firstName=, ?phone=, ?email=) still reach the calendar.
 */
/** The footer's "Get in touch" link. Goes to the same booking page. */
export const footerCta = {
  label: "Book a call",
} as const;

export const demoCta = {
  label: "Book a Demo",
  href: "/demo",
  /** Appended for screen readers, since the link leaves the page. */
  newTabHint: "opens in a new tab",
} as const;

export const results = {
  eyebrow: "Results",
  heading: "More reviews. Better reputation. More business.",
  sub: "Every appointment that ends becomes a request, every request that lands becomes a review, and the rating people see when they look you up moves up.",
  cta: `Start for $${offer.price}/month`,

  /**
   * The three headline outcomes.
   *
   * REAL NUMBERS ONLY — the same rule as content/clients.ts, and the reason
   * the invented dashboard that used to sit here is gone. A prospect who
   * spots one fabricated figure discounts the real screenshots above it too,
   * so the mockup was costing more credibility than it bought.
   *
   * `basis` renders verbatim under every figure and is not decoration: it is
   * what keeps the claim tied to its evidence. Write "average across 30
   * businesses" only once there are thirty of them; while there is one
   * documented client it names that client. A result with `value: null`
   * renders nothing, and all three null hides the block.
   *
   * Today: reviews and rating are Salt Salon's real before/after — 4.6 from
   * 93 reviews to 4.9 from 174 in sixty days, the same profile in the
   * screenshots above, so 81 more reviews is +87%. Hours is arithmetic, not
   * a measurement, and its basis line shows the whole sum: 2 x 40 x 52 is
   * 4,160 minutes, or 69.3 hours, rounded to 70. Keep the basis and the
   * figure in step — if the factors change, redo the sum rather than nudging
   * the headline number on its own.
   */
  keyResults: {
    heading: "Three things change once it's running.",
    items: [
      {
        icon: "trending",
        tone: "blue",
        value: "+87%",
        label: "more reviews",
        basis: "Salt Salon, first 60 days",
        body: "Every finished appointment gets asked, the same day, without anyone remembering to.",
      },
      {
        icon: "star",
        tone: "green",
        value: "4.6 → 4.9",
        label: "Google rating",
        basis: "Salt Salon, first 60 days",
        body: "You get reviews from everyone you serve, not just the rare unhappy one who bothers to post.",
      },
      {
        icon: "clock",
        tone: "orange",
        value: "70 hours",
        label: "a year back",
        basis: "2 min × 40 clients × 52 weeks",
        body: "The texting, the chasing and the replies all happen without you. Spend the time back on the work you'd rather be doing.",
      },
    ],
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
 * `light: true` puts a light chip behind a logo that would otherwise vanish
 * on navy. Nothing needs it now — every mark is either natively light or has
 * had its neutral wordmark knocked out to white, with each brand's coloured
 * icon left untouched. Prefer an official white/reverse asset over a derived
 * one wherever a platform publishes it.
 *
 * Ring positions are computed from the list length in the component, not
 * stored here — hand-tuned coordinates collided as soon as the list grew.
 */
/**
 * Extra services, under the pricing card.
 *
 * Deliberately priced nowhere. The review system has one number and that is
 * the page's whole pricing story; these are scoped per business, and inventing
 * a "from $X" for them would be a number nobody could hold you to. Every card
 * asks for the same thing instead — a call.
 *
 * The third is not a fourth product. It exists because the two named ones make
 * a visitor wonder whether the thing they actually want is on the list, and a
 * dead end there costs an enquiry.
 */
export const addOnServices = {
  eyebrow: "Additional services",
  heading: "Need more than reviews?",
  sub: "Reviews are what we do every day. These are the things owners ask for next.",
  /** Same booking page as every other ask on the site. */
  ctaLabel: "Ask on a demo call",
  href: "/demo",
  items: [
    {
      icon: "globe",
      tone: "blue",
      title: "Custom website",
      body: "A fast, modern site built around getting found and getting booked — not a template with your logo dropped in.",
      /** The one add-on with a plan of its own: goes to /website, same tab. */
      href: "/website",
      ctaLabel: "See the website plan",
    },
    {
      icon: "map",
      tone: "green",
      title: "GBP SEO",
      body: "Your Google Business Profile set up properly: categories, services, photos and posts, so you show up in the map pack and not just the list.",
    },
    {
      icon: "custom",
      tone: "orange",
      title: "Not listed?",
      body: "Ads, email, a booking setup, something we haven't listed here — ask. If it isn't a fit we'll say so on the call.",
    },
  ],
} as const;

export const integrations = {
  heading: {
    lead: "Works with the",
    accent: "booking software",
    tail: "you already use.",
  },
  sub: "Fynd connects to the tools you already rely on, so the request fires the moment an appointment is marked complete.",

  /**
   * Order is popularity, most first — the ring fills from the top of this
   * list and everything past the cut renders in the grid underneath. Reorder
   * freely; nothing else needs to change.
   */
  platforms: [
    { name: "Vagaro", logo: "/integrations/vagaro.webp" },
    { name: "Mindbody", logo: "/integrations/mindbody.webp" },
    { name: "Fresha", logo: "/integrations/fresha.webp" },
    { name: "Booksy", logo: "/integrations/booksy.webp" },
    { name: "Square", logo: "/integrations/square.webp" },
    { name: "Acuity", logo: "/integrations/acuity.webp" },
    { name: "StyleSeat", logo: "/integrations/styleseat.webp" },
    { name: "Setmore", logo: "/integrations/setmore.webp" },
    { name: "Timely", logo: "/integrations/timely.webp" },
    { name: "Booker", logo: "/integrations/booker.webp" },
    { name: "Goldie", logo: "/integrations/goldie.webp" },
    { name: "MyTime", logo: "/integrations/mytime.webp" },
    { name: "Appointy", logo: "/integrations/appointy.webp" },
  ],

  /** Heading for the platforms that did not fit in the ring. */
  moreHeading: "Plus everything else you might be on",

  fallback: {
    lead: "Don't see your booking software?",
    body: "We probably connect with it anyway — and if you don't use one at all, that's fine too.",
    ctaLabel: "Ask on a quick call",
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

/**
 * The problem, told as one interactive profile instead of four paragraphs.
 *
 * The four ideas are the same ones `problem.items` carried — they were good —
 * but the presentation is inverted: one dominant object the visitor can poke
 * at, four controls under it, and the explanation held back in a drawer until
 * they ask for it. Reading four text blocks is passive; watching the same
 * profile restate the problem four different ways is not.
 *
 * ILLUSTRATION, NOT A CLIENT. Marlow Hair Studio is the same fictional salon
 * as the hero phone, kept deliberately consistent so the page tells one story
 * rather than inventing a new business per section. Every number below is
 * internally consistent and must stay that way: 247 - 31 = 216 missed, and
 * 214 - 31 = 183 behind the competitor. Nothing here is presented as a Fynd
 * result — the real numbers live in `results`, sourced to Salt Salon.
 *
 * The rating is deliberately HIGH (4.8) against a low review count. That is
 * the section's whole thesis: the work is good, the profile just doesn't show
 * it. A mediocre rating would argue the opposite.
 */
export const problemStory = {
  eyebrow: "The problem",
  heading: "You do good work. Your profile doesn't show it.",
  sub: "Great service doesn't automatically become a great reputation.",

  profile: {
    label: "Your Google profile",
    business: "Marlow Hair Studio",
    category: "Hair salon",
    rating: "4.8",
    reviews: 31,
    appointments: 247,
    missed: 216,
  },

  /** Scrolls to the solution section, which is the answer to all four. */
  ctaLabel: "See how Fynd fixes it",
  ctaTargetId: "solution",
  drawerHint: "Read the detail",
  closeLabel: "Close",

  states: [
    {
      n: "01",
      tab: "Nobody asks",
      hook: "216 customers never left a review.",
      linkLabel: "See where they went",
      counts: {
        leftLabel: "appointments completed",
        rightLabel: "Google reviews",
      },
      drawer: {
        title: "Where the review went",
        when: "Tuesday · 2:00 PM",
        steps: [
          { done: true, label: "Appointment completed", note: "Sarah M." },
          { done: true, label: "Customer left happy", note: "Said she'd be back" },
          { done: false, label: "Review request", note: "Never sent" },
          { done: false, label: "Google review", note: "Never posted" },
        ],
        punch: ["Nothing went wrong.", "Nobody asked."],
      },
    },
    {
      n: "02",
      tab: "You get busy",
      hook: "7 happy customers. 0 review requests.",
      linkLabel: "See the day",
      day: {
        label: "Today",
        appointments: [
          { time: "8:00", service: "Haircut" },
          { time: "9:00", service: "Colour" },
          { time: "10:30", service: "Haircut" },
          { time: "12:00", service: "Balayage" },
          { time: "1:30", service: "Haircut" },
          { time: "3:00", service: "Colour" },
          { time: "4:30", service: "Haircut" },
        ],
        sentLabel: "Review requests sent",
        sent: "0",
      },
      drawer: {
        title: "A normal Tuesday",
        when: "8:00 AM — 5:30 PM",
        steps: [
          { done: true, label: "Appointments finished", note: "Seven" },
          { done: true, label: "Customers who left happy", note: "Seven" },
          { done: false, label: "Review requests sent", note: "None" },
          { done: false, label: "Reviews received", note: "None" },
        ],
        punch: [
          "You meant to text them.",
          "Then your next client walked in.",
        ],
      },
    },
    {
      n: "03",
      tab: "They forget",
      hook: "Happy doesn't mean they'll remember.",
      linkLabel: "See what she did next",
      message: {
        fromLabel: "Customer",
        quote: "Absolutely loved it — I'll definitely be back!",
        time: "2:14 PM",
        outcomeLabel: "Google review",
        outcome: "Never posted",
      },
      drawer: {
        title: "The review she meant to leave",
        when: "Tuesday, then Wednesday, then never",
        steps: [
          { done: true, label: "Told you in person", note: "Five stars, unprompted" },
          { done: true, label: "Meant to post one", note: "Genuinely" },
          { done: false, label: "That evening", note: "Forgot" },
          { done: false, label: "By Thursday", note: "Gone from mind" },
        ],
        punch: [
          "The ones who loved it forget.",
          "The rare unhappy one always finds the time.",
        ],
      },
    },
    {
      n: "04",
      tab: "They win",
      hook: "Same rating. 183 fewer reasons to pick you.",
      linkLabel: "See the gap",
      search: {
        query: "Hair salons near me",
        rows: [
          { rank: "1", name: "The Loft Salon", rating: "4.8", reviews: 214 },
          { rank: "2", name: "Marlow Hair Studio", rating: "4.8", reviews: 31, you: true },
        ],
      },
      drawer: {
        title: "Why they get the call",
        when: "Every search, all day",
        steps: [
          { done: true, label: "Same star rating", note: "4.8 each" },
          { done: true, label: "Same quality of work", note: "Arguably better" },
          { done: false, label: "Same number of reviews", note: "183 behind" },
          { done: false, label: "Picked from the search", note: "Rarely" },
        ],
        punch: [
          "The work isn't the problem.",
          "Nobody scrolling can tell yet — they only see the number.",
        ],
      },
    },
  ],
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

/**
 * The review-reply mockup inside the "Review management" modal.
 *
 * Two panels — approving a drafted reply, and the training note that teaches
 * it your tone — plus the line about why that matters.
 *
 * Rendered as a picture, not a working UI: the buttons below are spans, since
 * a button that does nothing is worse than an image of one.
 */
export const reviewReplies = {
  approve: {
    label: "Approve review reply",
    reviewer: "Grain",
    review:
      "I needed help quickly and the whole team was professional, clear, and finished earlier than expected. I will use them again.",
    replyLabel: "Drafted reply",
    reply:
      "Thanks, Grain. We really appreciate the kind words and we are glad the team could help quickly.",
    note: "Please approve this so it can publish to your profile.",
    cta: "Approve",
  },
  train: {
    eyebrow: "Your voice, every time",
    heading: "Train review replies to sound just like you.",
    label: "Train review replies",
    note: 'Please end all positive reviews by saying something like "We look forward to helping you again!" and send unhappy customers to us privately so we can make things right.',
    example:
      "Training note example: Use our friendly tone, mention the service when it fits, and keep replies short enough to feel personal.",
    cancel: "Cancel",
    save: "Save training note",
  },
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
  /**
   * Each item is a card that opens a modal. The card shows only the title —
   * the point of the section is that the list is short and scannable, and
   * anyone who wants the detail asks for it.
   *
   * `visual` names which mockup the modal renders; see FeatureModal. `points`
   * are the specifics, and every one of them is a claim made somewhere else on
   * this page already — behindScenes, the integrations list, the FAQ. Do not
   * add a capability here that the rest of the site does not also promise.
   */
  modalCta: "See how it works",

  /**
   * Every modal is the same shape: headline with the payoff in green, a sub,
   * the visual, the specifics, then a footer that offers a call.
   * That shape came from the Fit section, which is now the integrations modal
   * — so that item simply points at the `integrations` copy rather than
   * restating it, which is also why `integrations` is declared above this.
   *
   * `visual` names which mockup to render; see FeatureVisual. Every point is
   * a claim made somewhere else on this page already — behindScenes, the
   * integrations list, the FAQ. Do not add a capability here that the rest of
   * the site does not also promise.
   */
  items: [
    {
      icon: "MessageSquare",
      title: "Automatic review requests",
      visual: "sms",
      heading: {
        lead: "Every finished appointment",
        accent: "asks for a review",
        tail: "— without you.",
      },
      sub: "The message goes out from your studio's name, with the client's name and the service they booked on it.",
      points: [
        "It waits the right amount of time before sending, rather than firing the second you close the ticket.",
        "Every message uses the client's name and the service they booked.",
        "Same message after every appointment — nobody gets left off the list.",
        "If someone has an issue, it comes to you first instead of going straight to Google.",
      ],
      footer: {
        lead: "Want to read the exact message?",
        body: "I'll show you how it lands on a phone.",
        ctaLabel: "Ask on a quick call",
      },
    },
    {
      icon: "Plug",
      title: "Booking software integration",
      visual: "integrations",
      heading: integrations.heading,
      sub: integrations.sub,
      points: [
        "The request fires the moment an appointment is marked complete — marking it done is your only step.",
        "Appointment and client details stay in sync both ways.",
        "Don't see yours? We probably connect with it anyway.",
        "No booking software at all is fine — text us the number instead.",
      ],
      footer: {
        lead: integrations.fallback.lead,
        body: integrations.fallback.body,
        ctaLabel: integrations.fallback.ctaLabel,
      },
    },
    {
      icon: "Sparkles",
      title: "Review management",
      visual: "reviews",
      heading: {
        lead: "Never stare at a",
        accent: "blank review reply",
        tail: "again.",
      },
      sub: "Every Google review gets a reply written in your tone and posted for you, so nothing sits unanswered while you stay focused on the work.",
      points: [
        "Set preferences once and Fynd keeps every reply consistent.",
        "Your customers see a business that is responsive, grateful and professional.",
        "Google weights a profile that answers its reviews — the replies are not just manners.",
        "Anything that breaks Google's review policy gets a removal request filed.",
        "Set the tone once in a training note and every reply follows it.",
      ],
      footer: {
        lead: "Got a review you want gone?",
        body: "Bring it to the call and I'll tell you straight whether it's removable.",
        ctaLabel: "Ask on a quick call",
      },
    },
    {
      icon: "BarChart3",
      title: "Reputation dashboard",
      visual: "dashboard",
      heading: {
        lead: "Everything that matters,",
        accent: "on one page",
        tail: "—  no report to read.",
      },
      sub: "Your rating, your review growth, and where you sit against the studios nearby.",
      points: [
        "Your rating and review count, and how both have moved.",
        "Where the reviews came from — the text, the NFC card, or straight from your profile.",
        "How you compare to the other studios nearby.",
        "One page. No report to read.",
      ],
      footer: {
        lead: "Want a look at the real thing?",
        body: "I'll share my screen on the call.",
        ctaLabel: "Ask on a quick call",
      },
    },
  ],
} as const;

/* ==========================================================================
   /website — the Website + Reviews plan.

   The website side of the list below is a scope statement, and it is what
   a customer will hold Luke to. Edit it here, not in the component.
   ========================================================================== */

export const bundle = {
  name: offer.bundle.productName,
  /** Charged once at checkout: the build plus the first period of reviews. */
  price: offer.bundle.price,
  /** What it becomes from the next billing day — the reviews-only rate. */
  monthly: offer.price,

  hero: {
    lead: "A new website, and",
    accent: "the reviews to back it up.",
    sub: `Your site rebuilt to get you booked, and every appointment turned into a Google review. $${offer.bundle.price} to start, then $${offer.price} a month for the Review System. Nothing to piece together.`,
    cta: `Start for $${offer.bundle.price}`,
    reassure: `Then $${offer.price}/month. No contract. Cancel anytime.`,
  },

  includes: {
    eyebrow: "What's included",
    lead: "Two things owners pay",
    accent: "two people for.",
    website: {
      title: "The website",
      blurb: "Rebuilt from the ground up, on the domain you already have.",
      items: [
        "Fast, mobile-first, and designed around getting booked",
        "Copy written for you from one short call",
        "Book-now wired to your booking software",
        "Hosting, security and updates handled",
        "Your Google reviews shown live on the site",
      ],
    },
    reviews: {
      title: "The Review System",
      blurb: `The same system on the $${offer.price} plan, at the same $${offer.price} a month after the first charge.`,
      items: [
        "A review request texted after every appointment, automatically",
        "Follow-up for anyone who didn't respond",
        "Unhappy customers routed to you privately, not to Google",
        "Live and sending within 72 hours",
      ],
    },
  },

  pricing: {
    eyebrow: "Pricing",
    heading: `$${offer.bundle.price} to start. $${offer.price} a month after.`,
    /** Beside the big number. */
    todayLabel: "today",
    /**
     * The monthly line under the big number: "then ~~$197~~ $97/mo". The
     * strikethrough is the same deal the $97 card shows — the Review System
     * is discounted from `offer.regular` on this plan too.
     */
    then: {
      lead: "then",
      regular: `$${offer.regular}`,
      price: `$${offer.price}/mo`,
    },
    nowLabel: "Covers the website build and the review system",
    clears: [
      `Then $${offer.price}/month, the same as the reviews-only plan`,
      "Online booking included",
      "Site live in about two weeks",
      "No contract, cancel anytime",
    ],
    demoLine: {
      lead: "Want to talk it through first? Book a",
      linkLabel: "demo call",
      tail: ".",
    },
  },

  faq: {
    heading: "FAQs",
    items: [
      {
        q: "Do I keep my domain?",
        a: "Yes. The new site goes live on the domain you already own, and it stays yours. If you don't have one yet, we register it in your name, not ours.",
      },
      {
        q: `What does the $${offer.bundle.price} cover?`,
        a: `The website build and your first period of the Review System. From the next billing day it's $${offer.price} a month, exactly the same as the reviews-only plan. The site isn't billed again.`,
      },
      {
        q: `Is the review part the same as the $${offer.price} plan?`,
        a: "Exactly the same system, nothing held back, at the same monthly rate. The website is on top of it, not instead of it.",
      },
      {
        q: "How long until the site is live?",
        a: "About two weeks from the kickoff call, most of which is waiting on photos and a look at the draft. The review requests start sending within 72 hours, so that part is working long before the site goes up.",
      },
      {
        q: "Can I start with just reviews and add the site later?",
        a: `Yes. Start on the $${offer.price} plan and add the site whenever you want it. Your monthly doesn't change; the $${offer.bundle.price} covers the build.`,
      },
    ],
  },

  finalCta: {
    heading: { lead: "Ready for a site that", accent: "gets you booked", tail: "?" },
    cta: `Start for $${offer.bundle.price}`,
  },

  /** The teaser at the bottom of the homepage. */
  teaser: {
    eyebrow: "New plan",
    lead: "Need a website too?",
    accent: "Get both.",
    body: `The Review System plus your site rebuilt. $${offer.bundle.price} to start, then $${offer.price} a month, and the reviews start sending in the first 72 hours.`,
    cta: "See the website plan",
    href: "/website",
  },
} as const;

/**
 * Link-preview text for the permanent payment links at /offer/<slug>
 * (`src/lib/offers.ts`). Only crawlers ever see it: iMessage, WhatsApp and
 * Slack fetch the link to draw the card under the text, and get this instead
 * of a checkout session. People are redirected straight to Stripe.
 */
export const offerLinks = {
  website: {
    title: "Fynd Website + Reviews",
    description: `Your new website plus the Review System. $${offer.bundle.price} today, then $${offer.price} a month.`,
  },
  reviews: {
    title: "Fynd Review System",
    description: `More 5-star Google reviews, on autopilot. $${offer.price} a month, cancel any time.`,
  },
  manage: {
    title: "Fynd Profile Management",
    description:
      "Your Google Business Profile run for you: posts, photos, reviews, website and AI search, every week. $297 a month, cancel any time.",
  },
  nov1: {
    title: "Fynd Website + Reviews",
    description:
      "Your new website plus the Review System. Nothing today, first payment November 1.",
  },
  nov13: {
    title: "Fynd Review System",
    description:
      "More 5-star Google reviews, on autopilot. Nothing today, first payment November 13.",
  },
} as const;

/**
 * /optimize — the one-time Google Business Profile optimization.
 *
 * The page's shape is the pitch: here is the problem, here are three fixes
 * in full, here is the rest of the list by NAME ONLY, here is what a finished
 * profile looks like, and if you'd rather not do it yourself it is $99. The
 * three tips are real and complete on purpose — a page that withholds
 * everything reads as a trick — and the eleven after them are deliberately
 * headings with no how-to, which is the point of the $99.
 *
 * Commitments written here by Claude, not agreed policy — edit before
 * sending anyone the link: "five business days", "done by a person", and the
 * "manager access, never your password" answer.
 */
export const optimize = {
  name: offer.gbp.productName,
  price: offer.gbp.price,

  hero: {
    lead: "Verified, but",
    accent: "not optimized.",
    sub: "Verifying put your Google profile on the map. Filling in the rest is what gets you found, and most profiles are still missing half of what Google looks for. Those gaps are why the salon down the road shows up first.",
    /** Scrolls to the checklist, not the checkout: the page teaches first (Luke). */
    cta: "Learn how",
    reassure: "One-time, no subscription.",
    /** The quiet link under the button, to the managed section. */
    managedLink: "Rather have it managed every month?",
    /** The tag on the phone: "<n> gaps on the first screen". */
    callout: "gaps on the first screen",
  },

  /**
   * The drawn profile: the mobile Google panel a customer sees after
   * searching the business, in two states. FICTIONAL business — it is drawn,
   * not a screenshot, and every instance carries the "Example" chip so nobody
   * reads it as a client. The rating and the review count are the same in
   * both states on purpose: optimization fixes the profile, not the review
   * count. Reviews are the monthly plan.
   *
   * `sections` are the panel rows, in order. In the typical state a row's
   * `gap` is the legend line beside the hero card (and what the orange
   * marker on the row means); the row itself shows what Google shows when
   * the field is empty. The hero card shows `heroSections` only.
   */
  profile: {
    exampleLabel: "Example",
    typicalLabel: "Typical",
    optimizedLabel: "Optimized",
    business: "Northside Hair Studio",
    rating: "4.6",
    reviews: 23,
    ratingSr: "Rated 4.6 out of 5, 23 ratings",
    /** The line under the name: category, then the hours. */
    category: {
      typical: { value: "Beauty salon", gap: "“Beauty salon”, not “Hair salon”" },
      optimized: { value: "Hair salon" },
    },
    hoursLine: { typical: "Hours may differ", optimized: "Open · Closes 7 PM" },
    photos: {
      typical: { value: "3 photos", gap: "Three photos, all from 2019" },
      optimized: { value: "42 photos", more: "+39" },
    },
    actions: {
      typical: ["Call", "Directions", "Website", "Save"],
      optimized: ["Call", "Directions", "Website", "Book"],
    },
    missingLabel: "Missing",
    setLabel: "Set",
    sections: [
      {
        key: "description",
        label: "From the business",
        typical: { empty: "No description added.", gap: "No description" },
        optimized: {
          text: "Hair salon and barbershop in Beverly, MA since 2014. Cuts, color, balayage, skin fades and beard trims, with online booking and walk-ins when the chair is free. Open late Thursdays.",
        },
      },
      {
        key: "services",
        label: "Services",
        typical: { empty: "No services listed.", gap: "No services listed" },
        optimized: {
          chips: ["Women's haircut", "Balayage", "Skin fade", "Beard trim"],
          more: "+10 more",
        },
      },
      {
        key: "hours",
        label: "Hours",
        typical: {
          empty: "Hours might differ. Not confirmed by the business.",
          gap: "Hours never confirmed",
        },
        optimized: {
          text: "Tue–Sat 9 AM – 7 PM · Thu until 9 PM · Holiday hours set",
        },
      },
      {
        key: "qa",
        label: "Questions & answers",
        typical: {
          empty: "Be the first to ask a question.",
          gap: "No questions answered",
        },
        optimized: { text: "8 questions, answered by the owner" },
      },
      {
        key: "updates",
        label: "Updates",
        typical: { empty: "No updates from the business.", gap: "Never posted" },
        optimized: {
          text: "3 days ago · “Thursday evening openings this week. Book online.”",
        },
      },
      {
        key: "attributes",
        label: "Highlights",
        typical: { empty: "No highlights added.", gap: "No attributes set" },
        optimized: {
          chips: ["Walk-ins welcome", "Online booking", "Women-owned", "Wheelchair accessible"],
        },
      },
    ],
    /** Which rows the hero card shows. */
    heroSections: ["description", "services", "hours"],
  },

  /**
   * How Google decides who shows up, as a mental model for the list that
   * follows: relevance, distance, prominence (Google's own three, as stated
   * in its help docs). Distance can't be changed; the other two are mostly
   * the profile. Each card names which checklist items feed it.
   */
  ranking: {
    lead: "Google ranks on three things.",
    accent: "Your profile is two of them.",
    sub: "Before the list, the reason for it. When someone searches “hair salon near me”, Google weighs every profile in the area on the same three things.",
    factors: [
      {
        key: "relevance",
        name: "Relevance",
        what: "How closely the profile matches what was typed.",
        onProfile: "Categories, services, description, attributes.",
        yours: true,
      },
      {
        key: "distance",
        name: "Distance",
        what: "How far you are from the person searching.",
        onProfile: "Nothing to do here. It is what it is.",
        yours: false,
      },
      {
        key: "prominence",
        name: "Prominence",
        what: "How well known and well kept the business looks.",
        onProfile: "Photos, posts, confirmed hours, details that match everywhere.",
        yours: true,
      },
    ],
    yoursLabel: "On the profile",
    notYoursLabel: "Out of your hands",
  },

  /**
   * The list: everything on the profile to update, with why Google cares,
   * and deliberately not what to write in any of it. The list is the free
   * value; the writing is the $99. Grouped in four so fourteen items read
   * as four jobs; numbering runs straight through.
   */
  checklist: {
    lead: "Here's everything on the list.",
    accent: "Start at the top.",
    sub: "These are the parts of your profile Google looks at. Go through them one by one and fill in anything that's missing.",
    groups: [
      {
        title: "Who you are",
        blurb: "What Google reads first to work out what kind of business this is.",
        items: [
          {
            title: "Primary category",
            why: "The first thing Google ranks you on. One broad word here and you're competing with every spa and nail bar in town.",
          },
          {
            title: "Secondary categories",
            why: "Everything else you do that people search for on its own. Barbering, extensions, waxing, each one a category.",
          },
          {
            title: "Business description",
            why: "750 characters Google reads for your town and what you specialise in. On most profiles it's blank.",
          },
          {
            title: "Logo and cover photo",
            why: "What shows beside your name on Maps and in the search results. The default is a grey circle.",
          },
        ],
      },
      {
        title: "What you offer",
        blurb: "The searches you can show up for that your category alone won't cover.",
        items: [
          {
            title: "Services, with a line under each",
            why: "The closest thing the profile has to keywords. Named the way people search, described in two lines.",
          },
          {
            title: "Products",
            why: "The retail lines you carry, each one a search you can show up for.",
          },
          {
            title: "Attributes",
            why: "Walk-ins, parking, accessibility, women-owned. People filter by these without knowing they're filtering.",
          },
        ],
      },
      {
        title: "Signs you're open",
        blurb: "What tells Google, and the person searching, that this is a live business.",
        items: [
          {
            title: "Hours, including holidays",
            why: "“Hours might differ” is what customers see until you confirm them. Set the holidays now, not the week of.",
          },
          {
            title: "Photos",
            why: "Google dates them. Three from 2019 reads as a place that might have closed. Chairs, work, team, recent.",
          },
          {
            title: "Updates",
            why: "A post a week is what keeps the profile current in Google's eyes. Most have never posted.",
          },
          {
            title: "Questions and answers",
            why: "Anyone can ask one and anyone can answer it. The ones you get on the phone belong here, answered by you.",
          },
        ],
      },
      {
        title: "Links and details",
        blurb: "The buttons on the profile, and the facts Google checks against everywhere else.",
        items: [
          {
            title: "Booking link",
            why: "Puts a Book button on the profile itself. For a salon, that button is the whole point.",
          },
          {
            title: "Website link",
            why: "The Website button on the profile. It should go to the page you want people to land on, and be the same address Google has everywhere else.",
          },
          {
            title: "Name, address and phone, matched everywhere",
            why: "Google checks the profile against every other listing of you. One old phone number on Yelp costs trust on Google.",
          },
        ],
      },
    ],
    /** The hand-off line under the list, into the $99. */
    outro: "That's everything, and you can do all of it yourself. If you don't have the time, don't know where to start, or it's all a bit confusing, we can do it for you.",
  },

  /**
   * Typical beside optimized. From md the two drawn cards sit side by
   * side; on a phone they'd stack a full screen apart, so phones get
   * `rows` instead: the same comparison as a two-column table, one line
   * per part of the profile, so both states are on screen together
   * (Luke, Nov 3, 2026: anything compared must be side by side on mobile).
   */
  compare: {
    lead: "Same salon. Next day.",
    accent: "Different profile.",
    sub: "Both are the same salon. The one on the right just has every section filled in.",
    rows: [
      { label: "Photos", typical: "3, all from 2019", optimized: "42, recent" },
      { label: "Category", typical: "Beauty salon", optimized: "Hair salon" },
      { label: "Hours", typical: "“Hours may differ”", optimized: "Set, holidays too" },
      { label: "Book button", typical: "None", optimized: "On the profile" },
      { label: "Description", typical: "None", optimized: "Written, town and all" },
      { label: "Services", typical: "None listed", optimized: "14, each described" },
      { label: "Q&A", typical: "None", optimized: "8, answered by the owner" },
      { label: "Updates", typical: "Never posted", optimized: "Posted this week" },
      { label: "Highlights", typical: "None", optimized: "Walk-ins, booking, accessible" },
    ],
    /** Under the phone table: the drawn cards are an example business. */
    rowsNote: "Example salon. Same rating and reviews in both: optimization fills the profile in, it doesn't change the review count.",
  },

  /** The $99 card, at #convert, and the three steps under it. */
  pricing: {
    heading: "Want us to do it?",
    sub: "You can do the list yourself. Or, if you don't have the time or aren't sure how, pay once and have it professionally done.",
    onceLabel: "one time",
    nowLabel: "We fill in everything on the list for you, once",
    includedLabel: "What's included",
    clears: [
      "All fourteen items on the list, including the writing",
      "A short list of what we're changing before we start",
      "Finished within five business days of getting access",
      "A note when it's done. No report; the finished profile is the result",
      "You keep ownership; we work as a manager you can remove",
    ],
    /** Under the button: what this is and isn't, then the hand-off. */
    oneTimeNote:
      "This is a one-time update, not an ongoing service. We fill the profile in, hand it back, and that's it.",
    managedLead: "Want it kept up to date every month? See full management",
    cta: `Get started for $${offer.gbp.price}`,
    needLine: "No subscription. Nothing to cancel.",
    /** How it goes after the button: three steps, in order. */
    stepsLabel: "How it works",
    steps: [
      {
        title: "Pay once",
        body: "$99 at checkout, and you're on the list. We reach out within a day.",
      },
      {
        title: "Add us as a manager",
        body: "Two minutes in your Google account. We send the steps; we never need your password.",
      },
      {
        title: "Done in five business days",
        body: "Every item filled in and written. We let you know it's done, and the profile itself is what you get: there's no report with the one-time update.",
      },
    ],
  },

  /**
   * Why ongoing beats once, taught before it is asked for: what goes
   * stale after a one-time fill (three cards), then the one-off beside
   * the monthly service as a table. The right-hand column is what the
   * white-labelled platform does and nothing more — no Q&A or hours
   * upkeep (see the note on `manage`). Sits after the $99 card, before
   * the managed ask.
   */
  ongoing: {
    lead: "Keep it optimized",
    accent: "every month.",
    sub: "Relevance is mostly set once. Prominence is earned every week, and Google notices when it stops.",
    decays: [
      {
        key: "photos",
        title: "Photos age",
        body: "Google dates every photo. The ones that make the profile look alive today are the ones that make it look abandoned in a year.",
      },
      {
        key: "posts",
        title: "Posts go quiet",
        body: "A profile with a post from this week reads as open. One whose last post was months ago reads as a place that stopped trying.",
      },
      {
        key: "competitors",
        title: "The salon down the road keeps going",
        body: "Rankings are relative. A competitor posting every week and collecting reviews moves ahead of a profile that was perfect once.",
      },
    ],
    /** Once beside every month. Column one is the $99; column two is full management. */
    table: {
      rowLabel: "Every month",
      onceLabel: `$${offer.gbp.price} once`,
      monthlyLabel: "$297 a month",
      /** `once` null means the one-off doesn't do it; the cell draws a dash. */
      rows: [
        { label: "Profile optimization", once: "Every item", monthly: "First, then kept optimized" },
        { label: "Google posts", once: null, monthly: "Written and published every week" },
        { label: "Photos", once: "The ones you send", monthly: "New ones added, geotagged" },
        { label: "Reviews", once: null, monthly: "Requested by text, every one answered" },
        { label: "Social and video", once: null, monthly: "Facebook, Instagram, LinkedIn, YouTube, TikTok" },
        { label: "Website", once: null, monthly: "Yours tuned up, or built for you for $249 once" },
        { label: "AI search", once: null, monthly: "Kept easy for ChatGPT and Gemini to recommend" },
        { label: "Report", once: null, monthly: "Monthly: rankings across your area, plus AI" },
      ],
    },
    /** The line over the button, then the button to /manage. */
    ctaLead: "Want it kept up every month? That's our Google Business Profile management.",
    cta: "Learn more",
    href: "/manage",
  },

  /**
   * Questions about the one-off. Nothing here about the monthly service
   * (that FAQ is `manage.faq`) and nothing about reviews (Luke, Nov 2, 2026:
   * the Review System covers those). The last answer is the only mention
   * of full management, as the honest answer to "then what?".
   */
  faq: {
    heading: "FAQs",
    items: [
      {
        q: "What do you need from me?",
        a: "Nothing, we just need you to manage your access on your Google Business Profile.",
      },
      {
        q: "How long does it take?",
        a: "Within five business days of getting access. Most of that is the writing and waiting on Google to approve changes to things like categories and the description.",
      },
      {
        q: "Do I have to write anything?",
        a: "No. The writing is the job. You tell us about the salon in plain words and we write the description, the services and the answers. You can change any of it afterwards; it's your profile.",
      },
      {
        q: "What about photos?",
        a: "We use yours. Send what you have and we'll tell you which shots would help most, so you can take them on your phone in an afternoon. We don't put stock photos on a salon's profile.",
      },
      {
        q: "Can't I just do this myself?",
        a: "Yes, you can. Or you can pay if you don't have time, don't know how, or are confused by it. You can pay us to have it professionally done.",
      },
      {
        q: "Some of my profile is already filled in.",
        a: "Then we go through what's there as well as what's missing. A category that's too broad or a description with no town in it count as gaps too, and we fix those as well.",
      },
      {
        q: "Do I keep control of the profile?",
        a: "Yes. It stays on your Google account. We work as a manager you can remove in two clicks, and we tell you when we're done so you can.",
      },
      {
        q: "Is this safe with Google?",
        a: "Yes. Everything on the list is a field Google itself provides and asks you to fill in. No tricks, nothing against Google's guidelines, nothing that puts the profile at risk.",
      },
      {
        q: "I have more than one location.",
        a: "Each location has its own profile, and each profile is $99. Tell us which ones when we get in touch.",
      },
      {
        q: "Is anything recurring?",
        a: "No. One payment, nothing to cancel. If later you want the profile kept up to date, with new photos and posts every week, that's full management, and it's a separate decision.",
        link: { label: "See full management", href: "/manage" },
      },
    ],
  },

  finalCta: {
    heading: { lead: "Fix the profile you", accent: "already have", tail: "." },
    cta: "Fix my profile",
  },

  stickyCta: `Fix my profile for $${offer.gbp.price}`,

  /** /optimize/thanks — after the $99 goes through. */
  thanks: {
    heading: "Paid. Here's what happens next.",
    sub: "There's nothing else to fill out. We'll reach out within a day to get manager access to your profile and get started.",
    steps: [
      {
        when: "Within a day",
        body: "We get in touch with the two-minute steps to add Fynd as a manager on your profile. It never involves your password.",
      },
      {
        when: "Once we're in",
        body: "We go through the profile and send you a short list of what we're changing.",
      },
      {
        when: "Within five business days",
        body: "Everything on the list is done and we let you know. There's no report with the one-time update; open the profile and it's all there.",
      },
    ],
    /** When the session can't be confirmed as paid (a reload, a stray link). */
    unpaid: {
      heading: "We couldn't find that payment.",
      sub: "If you just paid, give it a minute and refresh. If you backed out, the page is still here.",
      cta: "Back to the page",
      href: "/optimize",
    },
    helpLine: "Questions? Reply to the first email you get from us.",
  },
} as const;

/**
 * /manage — full Google Business Profile management, $297/month, reviews
 * included. The page is Merchynt's Paige page (merchynt.com/paige, read
 * 2026-11-02) rebuilt section for section in Fynd's branding, because the
 * service IS Paige, white-labelled. Same section order, same arguments,
 * same illustrations redrawn: the "new customer" call, the to-do list,
 * the channel orbit, the three-step timeline, the sample report, the
 * cost bars, the tools table, the website mock, the pricing card, the
 * full feature table, the numbered FAQ, the closer.
 *
 * Left out on purpose: Paige's customer results and heatmaps, its
 * testimonials, its vendor stats (13,000+ businesses, 70% keep it, 80%
 * autopilot, 4.9/5, press logos), the agency / white-label section, the
 * Citations add-on, and the Users / Integrations / Support feature
 * groups. None of that is Fynd's to claim, and the last is
 * platform-revealing. The free trial is a paid month here: $297 today.
 * Review requests are by text only (Luke), so the QR code and the
 * email / WhatsApp channels are off the feature list too.
 *
 * Things Paige's page does NOT claim are kept off this one: Q&A,
 * hours/holiday upkeep (the owner's), any ranking guarantee.
 */
export const manage = {
  price: 297,

  /**
   * Paige's hero, as Luke saw it: a badge, "Get found by customers in
   * your area on" with the channel rotating on the third line, then the
   * paragraph, three checks and the button on the left and a drawn
   * search result on the right — the business first, two competitors
   * under it, a call coming in. ILLUSTRATION, no caption (Luke). Navy,
   * like the rest of Fynd's heroes.
   */
  hero: {
    badge: "Full Google profile management",
    headline: { lead: "Get found by customers", mid: "in your area on" },
    /**
     * The third line cycles through these, each drawn as its logo and its
     * name in the brand's own styling (Google's letter colours, the Gemini
     * gradient, Claude's serif), as the platform's page does. The first is
     * what renders without JavaScript. `brand` picks the logo and styling in
     * `ChannelLogos.tsx`.
     */
    channels: [
      { brand: "chatgpt", name: "ChatGPT" },
      { brand: "maps", name: "Google Maps" },
      { brand: "gemini", name: "Gemini" },
      { brand: "google", name: "Google Search" },
      { brand: "claude", name: "Claude" },
      { brand: "aimode", name: "Google AI Mode" },
      { brand: "perplexity", name: "perplexity" },
    ],
    wordsSr: "Google Search, Google Maps, ChatGPT, Gemini, Claude and Perplexity. Everywhere people search.",
    body: {
      lead: "When someone nearby searches for what you do, we make sure they find ",
      strong: "you",
      tail: ", not your competitor. We update your Google profile, post for you, reply to reviews and fix your listings every day. You just answer the phone.",
    },
    checks: [
      "No marketing or tech skills needed",
      "Set up in 20 minutes, then it runs itself",
      "Google, Google Maps, ChatGPT and more",
    ],
    cta: "Start for $297",
    ctaNote: "$297/mo per profile · Cancel anytime",
    onceLink: { lead: "Just want it optimized once?", label: "Check it out here", href: "/optimize" },
    mock: {
      query: "balayage near me",
      results: [
        { rank: "1", name: "Your business", stars: 5, meta: "4.9 · Open now · 0.8 mi", action: "Call", you: true },
        { rank: "2", name: "Competitor A", stars: 4, meta: "4.2 · 2.4 mi", you: false },
        { rank: "3", name: "Competitor B", stars: 4, meta: "4.0 · 3.1 mi", you: false },
      ],
      calling: "New customer calling…",
    },
  },

  /** "A local SEO tool built for busy owners": the two cards and three stats. */
  busy: {
    eyebrow: "How full management works",
    heading: "Local marketing, built for busy owners",
    sub: "Most SEO tools give you reports and a to-do list. This is the opposite: we improve your Google Business Profile, write the posts, reply to the reviews and track where you rank across your area. You approve what goes live, or let it run.",
    question: "Is it right for a busy local business?",
    questionSub: "If Google posts and review replies keep slipping down your to-do list, this handles that recurring work. It also covers profile optimization and ranking reports, so you see more than a list of recommendations.",
    blocks: [
      {
        tone: "blue",
        title: "Start with your business, not a blank dashboard",
        body: "Connect the Google account that manages your Business Profile. Tell us what you do, where you work and which customers you want to reach. Choose autopilot, or approve content first.",
      },
      {
        tone: "orange",
        title: "What still needs you?",
        body: "You know when your services, hours or offers change. Keep those facts accurate, send real photos of your work and check that what goes out represents your business. We don't replace your judgment, and nothing here guarantees rankings, calls or AI recommendations.",
      },
      {
        tone: "blue",
        title: "Already have a website?",
        body: "You can keep it, but we'll tell you straight: it holds the rest back. We can scan it and list what to fix, not fix it, and a slow or desktop-only site drags on everything else we do. Most of this page works best on the site we build you.",
      },
    ],
    todo: {
      title: "Meanwhile, our to-do list",
      sub: "Recurring work, according to your automation and approval settings",
      items: [
        "Optimize your Google Business Profile",
        "Write and publish Google posts",
        "Add your photos, geotagged",
        "Reply to every new review",
        "Ask happy customers for reviews, by text",
        "Share posts to Facebook, Instagram & LinkedIn",
        "Publish videos to YouTube & TikTok",
        "Build your website, or tune up yours",
        "Make you easy for AI to recommend",
        "Track your rankings on Google & AI",
        "Adjust strategy to beat competitors",
        "Send you a simple monthly report",
      ],
    },
    reach: {
      title: "If we ever need you, we reach out",
      sub: "So nothing stalls quietly in the background",
      items: [
        "We ask for fresh photos when we need them",
        "We tell you when it's time for more reviews",
        "We flag profile changes that need your OK",
        "We show you what to update as best practices change",
      ],
    },
    note: "We handle the recurring work while you keep business facts and photos current. Rankings, calls and AI recommendations are not guaranteed.",
    stats: [
      { value: "~20 min", label: "to set up, once" },
      { value: "0", label: "SEO knowledge needed" },
      { value: "1", label: "business day until work starts" },
    ],
    cta: "Start for $297",
  },

  /**
   * "Your business. Everywhere." — the navy panel, drawn as the platform
   * draws it: the business card in the middle (storefront, a booking, a
   * rising customer count, the Fynd team pill) and eleven channels on a
   * ring around it, each as its real mark. ILLUSTRATION: the count and
   * the booking are made up, and the panel says "Illustrative activity".
   */
  everywhere: {
    eyebrow: "One setup gets your business everywhere",
    heading: "Watch your marketing go out everywhere people search",
    panel: {
      lead: "Your business.",
      accent: "Everywhere.",
      sub: "Your business. Our marketing team. Let's grow your business.",
    },
    sr: "Your business and Fynd sit at the centre of a ring of eleven channels: Google Search, Google Maps, YouTube, ChatGPT, Claude, Gemini, Facebook, Instagram, TikTok, LinkedIn and your website. Content goes out to them and customers come back through them. The customer count and the booking shown are illustrative, not live data.",
    centre: {
      kicker: "The place they choose",
      title: "Your business",
      sub: "More customers. More revenue.",
      receipt: "Booked!",
      count: "12",
      countLabel: "new customers",
      countSub: "and counting",
      team: "Fynd",
      teamRole: "Your marketing team",
    },
    /** Clockwise from the top, as on the platform's panel. `brand` picks the mark in `ChannelLogos.tsx`. */
    channels: [
      { brand: "google", label: "Google Search" },
      { brand: "maps", label: "Google Maps" },
      { brand: "youtube", label: "YouTube" },
      { brand: "chatgpt", label: "ChatGPT" },
      { brand: "claude", label: "Claude" },
      { brand: "gemini", label: "Gemini" },
      { brand: "facebook", label: "Facebook" },
      { brand: "instagram", label: "Instagram" },
      { brand: "tiktok", label: "TikTok" },
      { brand: "linkedin", label: "LinkedIn" },
      { brand: "website", label: "Your website" },
    ],
    illustrative: "Illustrative activity",
    cta: "Start for $297",
    ctaNote: "$297 a month per profile · No contract · Cancel anytime",
  },

  /** "Here's what your free trial looks like" — the first month, three steps. */
  firstMonth: {
    heading: "Here's what your first month looks like.",
    sub: "Start to finish. No sales call and no setup team.",
    steps: [
      {
        when: "Minutes 1–20",
        title: "One-time setup",
        body: "Sign in with Google and tell us about your business. Your Maps heatmap and AI visibility check are ready right away.",
      },
      {
        when: "Within 1 business day",
        title: "Optimization first",
        body: "Once your profile is connected, we do the full one-time optimization first: every section checked and filled in, so everything after it is built on a correct profile. Then the first posts and review replies are prepared.",
      },
      {
        when: "Days 1–30",
        title: "Watch it happen",
        body: "Work goes out on autopilot or after you approve it. Photos and videos depend on the images you send. On day 30, your first report.",
      },
    ],
    proof: "Your baseline is taken the day you connect, so every report is measured against it.",
    cta: "Start for $297",
    note: "Billed monthly, per profile. No contract. Cancel anytime.",
  },

  /** "What you can judge in 3 days, and what takes longer", plus the sample report. */
  judge: {
    heading: "What you can judge in week one, and what takes longer",
    sub: "The first week shows you the work and the control you keep. Rankings, calls and AI recommendations need weeks of observation, so don't judge those in seven days.",
    cards: [
      {
        tone: "blue",
        label: "In your first week",
        title: "Check the work and the control",
        items: [
          "Your baseline Google Maps heatmap and AI visibility check",
          "Suggested profile fixes you can approve one by one or all at once",
          "Draft posts and review replies, published on autopilot or after your OK",
          "The calendar of planned and finished work",
          "Whether the content sounds like your business",
        ],
      },
      {
        tone: "orange",
        label: "Over the next 30–90 days",
        title: "Watch the results",
        items: [
          "Changes in your Google Maps rankings across your service area",
          "Calls, direction requests and website clicks from your profile",
          "Whether AI assistants start recommending you",
          "Your monthly report, compared with your starting baseline",
        ],
      },
    ],
    /**
     * A sample monthly report for the fictional salon: the counts, the
     * work done and the AI line are made up and the caption says so. The
     * two maps are the exception (Luke, Nov 3, 2026: "take one of the
     * heatmaps from paige site"): they are a REAL salon's before/after
     * from the platform's own results page, saved in public/images and
     * labelled as real and as the platform's, not Fynd's.
     */
    report: {
      business: "Northside Hair Studio",
      tagline: "Cut · Colour · Extensions",
      badge: "Sample report",
      title: "Monthly report · Month 3",
      sub: "Here's how your business performed online this month.",
      sr: "Sample monthly report for the fictional Northside Hair Studio. Three counts with made-up rises since day one: calls, direction requests and website clicks. Then two real Google Maps rank heatmaps from a salon on the platform full management runs on: before, mostly ranked twentieth or worse across its area, and after one month, mostly in the top three. Then the work completed that month and an AI search visibility line.",
      stats: [
        { icon: "phone", label: "Calls", value: "118", delta: "+74% vs. day 1" },
        { icon: "map", label: "Direction requests", value: "86", delta: "+91% vs. day 1" },
        { icon: "pointer", label: "Website clicks", value: "312", delta: "+128% vs. day 1" },
      ],
      /** The real pair. `src` under public/; the alt is what the image shows. */
      heatmap: {
        label: "Google Maps rank across the area",
        before: { day: "Before", src: "/images/heatmap-salon-before.webp", alt: "Google Maps rank heatmap for a salon before: a grid of points across its area, most ranked 20 or worse, a few on page one near the centre." },
        after: { day: "After 1 month", src: "/images/heatmap-salon-after.webp", alt: "The same grid one month later: most points ranked 1 to 3, the rest on page one." },
      },
      work: {
        title: "Work completed this month",
        items: [
          { icon: "post", value: "14", label: "Google posts published" },
          { icon: "reply", value: "37", label: "review replies" },
          { icon: "image", value: "26", label: "photos added" },
          { icon: "video", value: "8", label: "videos published" },
        ],
      },
      ai: {
        label: "AI search visibility",
        lead: "ChatGPT mentioned you in",
        strong: "5 of 10",
        tail: "checks",
        link: "View details",
      },
      caption: "Sample report for a made-up business: the counts and work done are illustrative. The two maps are real, from a salon on the platform full management runs on, before and one month in.",
    },
  },

  /**
   * "The math": a marketer plus the tools against $297. The figures are
   * Paige's own typical-cost estimates, labelled as estimates in `note`;
   * nothing here is a Fynd client's bill. "85% less" is $297 against
   * $1,932.
   */
  math: {
    eyebrow: "The math",
    lead: "Hire a full-time local marketer,",
    accent: "tools included, for $297 a month.",
    body: "An in-house marketer and the tools they need cost about $1,932 a month. Full management does that work every week, with every tool included and a person running it.",
    cta: "See everything we do",
    usual: {
      label: "The usual way",
      sub: "Marketer + software",
      segments: [
        { label: "In-house marketer · $1,500", amount: 1500 },
        { label: "Software · $432", amount: 432 },
      ],
      total: "$1,932",
    },
    ours: {
      label: "With Fynd",
      sub: "Every tool included",
      amount: 297,
      total: "$297",
      saving: "About 85% less",
    },
    per: "/mo",
    note: "Estimated typical monthly cost of an in-house marketer and the separate tools we replace. Priced per Google Business Profile.",
  },

  /** "Already paying for tools?": the navy total card and the table. */
  tools: {
    eyebrow: "Already paying for tools?",
    lead: "Everything we do, and the tools it",
    accent: "replaces",
    sub: "Each of these jobs usually means another subscription. Here's what those tools typically cost on their own. Full management includes every one.",
    card: {
      separately: "Bought separately",
      separatelyValue: "$432",
      ours: "With Fynd",
      included: "Included",
      yearly: {
        lead: "That's about ",
        strong: "$5,184 a year",
        tail: " in software you can cancel, before counting anyone's time.",
      },
      cta: "Start for $297",
    },
    cols: { job: "What we do", replaces: "Replaces", price: "Typical price" },
    per: "/mo",
    included: "Included",
    rows: [
      {
        icon: "map",
        job: "Google Business Profile",
        does: "Optimized to match top-ranked businesses near you, kept fresh weekly",
        replaces: "Profile management software",
        price: "$49",
      },
      {
        icon: "sparkles",
        job: "AI search",
        does: "Easy for ChatGPT, Gemini, Perplexity and AI Mode to recommend",
        replaces: "AI rank tracker",
        price: "$79",
      },
      {
        icon: "star",
        job: "Reviews",
        does: "Asks customers for reviews by text and replies to every one",
        replaces: "Review management software",
        price: "$99",
      },
      {
        icon: "share",
        job: "Social media",
        does: "Your photos turned into posts for Facebook, Instagram and LinkedIn",
        replaces: "Social media scheduler",
        price: "$49",
      },
      {
        icon: "video",
        job: "YouTube & TikTok",
        does: "Short videos made from your photos and published for you",
        replaces: "AI video maker",
        price: "$39",
      },
      {
        icon: "globe",
        job: "Your website",
        does: "A complete website built for you ($249 once), or a fix list for yours",
        replaces: "Website builder & hosting",
        price: "$39",
      },
      {
        icon: "chart",
        job: "Rank tracking & reports",
        does: "Google Maps heatmaps, AI rankings and a monthly report",
        replaces: "Google Maps rank tracker",
        price: "$49",
      },
      {
        icon: "pen",
        job: "Content",
        does: "Every post, reply and description written for you",
        replaces: "AI writing tool",
        price: "$29",
      },
    ],
    /** The row no tool replaces: the person. */
    manager: {
      icon: "chat",
      job: "Account manager",
      does: "A person who messages you whenever something's needed to improve your rankings",
      replaces: "No separate tool does this",
      only: "Only with Fynd",
    },
    total: { label: "Total, bought separately", sub: "8 tools, 8 logins, 8 bills", value: "$432" },
    note: "Typical monthly prices for a standalone tool in each category. Actual prices vary by provider and plan.",
  },

  /**
   * "Great local & AI SEO starts with a great website": navy, with the
   * drawn site. ILLUSTRATION, the fictional salon; the "built while you
   * set up" badge is the label. The site is NOT part of the $297: it is
   * a one-time $249 add-on (Luke, Nov 3, 2026); hosting, widgets and the
   * scan of an existing site stay in the plan.
   */
  website: {
    badge: "Website & AI SEO · $249 one time",
    lead: "Great local and AI SEO starts with a great website.",
    accent: "So we'll build you one.",
    body: "Your website is one of the main things Google and AI assistants look at when they decide which local businesses to show. If you need one, we build you a fast, fully optimized site while you set up, for a one-time $249. Hosting and updates are part of your plan after that.",
    points: [
      { icon: "map", text: "Google uses it to understand what you do and where you do it" },
      { icon: "chat", text: "ChatGPT, Gemini and Google AI Mode read it before they recommend you" },
      { icon: "phone", text: "Customers check it before they call or book" },
    ],
    mock: {
      builtLabel: "Built while you set up",
      checks: "SEO check passed · published",
      domain: "northsidehair.com",
      live: "Live",
      brand: "Northside",
      brandSub: "Hair Studio",
      nav: ["Services", "Stylists", "Reviews", "About"],
      navCta: "Book online",
      kicker: "Northside · Cut · Colour · Extensions",
      headline: { lead: "Hair done properly,", accent: "in Northside." },
      sub: "Cuts, balayage and extensions by stylists who've done it for years. Book online in a minute.",
      cta: "Book online",
      secondary: "See our work →",
      rating: "4.6 · 23 Google reviews",
      promise: { title: "Walk-ins", sub: "welcome on weekdays" },
      review: { initials: "DK", quote: "“Best balayage I've had. Booked again before I left.”", who: "Dana K. · ★★★★★" },
      photoLabel: "Balayage · Northside",
      servicesEdit: "Edit services",
      servicesTitle: "What we do",
      servicesAll: "All services →",
      services: [
        { name: "Cut and finish", note: "Consultation, cut and blow-dry, usually under an hour." },
        { name: "Balayage", note: "Hand-painted colour that grows out softly." },
        { name: "Extensions", note: "Consultation first, fitted in one visit." },
      ],
      phone: {
        time: "9:41",
        kicker: "Northside · Cut · Colour",
        headline: "Hair done properly, in Northside.",
        cta: "Book online",
        rating: "★★★★★ 4.6 · 23 reviews",
      },
      edit: { request: "Add a section about our walk-in hours", button: "Update" },
    },
    options: [
      {
        label: "Option 1",
        title: "Have us build your website",
        pill: "Recommended · $249 one time",
        items: [
          "Built for you while you set up, $249 once",
          "Fast, mobile-first and multi-page",
          "SEO and AI-ready on every page",
          "Auto-adds new reviews & photos",
          "Live on your domain in one click",
          "Edit anything just by asking",
        ],
        note: "Yours to keep. Hosted, updated and fed with new reviews and photos as part of your plan.",
      },
      /**
       * The path we steer away from (Luke, Nov 3, 2026: the section's job
       * is to move people onto our site). Drawn muted, the items are what
       * it costs them, and the note hands them back to option 1.
       */
      {
        label: "Option 2",
        title: "Keep your current website",
        pill: "Not recommended",
        tone: "warn",
        items: [
          "We can only scan it and list what to fix. Someone still has to fix it",
          "If it's slow or not built for phones, Google and AI mark you down every day it stays that way",
          "Fresh reviews, photos and posts only show where a widget fits",
          "Everything else we do lands softer on a site we didn't build",
        ],
        note: "Our advice: switch. The site is built while you set up, and it's $249 once.",
      },
    ],
  },

  /** "Every day you wait, a competitor gets the call" and the pricing card, at #convert. */
  pricing: {
    kicker: "Full management",
    lead: "Every day you wait,",
    accent: "a competitor gets the call.",
    sub: "Start today. Your baseline is ready in minutes, and work starts on your profile within one business day of connecting Google.",
    card: {
      label: "One simple price",
      per: "/ month",
      perNote: "per Google Business Profile",
      pill: "$297 today · carries you to your first billing date",
      explain: "A Google Business Profile is your listing on Google Search & Maps, one for each location. More than one? Each profile is $297 a month.",
      allIn: {
        title: "All-in price. No surprise token, credit or reporting bills.",
        body: "Every AI and reporting cost is included in your monthly price. We don't charge for tokens.",
      },
      includedLine: {
        label: "Included:",
        text: "A full profile optimization first, then posts, reviews, website hosting and reporting every month.",
      },
      checks: [
        "The one-time optimization, done first",
        "Every feature listed below",
        "No contracts. Cancel anytime.",
        "Your data is safe and secure",
        "Real humans when you need support",
      ],
      cta: "Start for $297",
      ctaNote: "Billed monthly · No contract · Cancel anytime",
      anchorNote: "Your first payment today covers you until your first billing date, the 1st or the 15th. Then $297 a month.",
      onceLine: { lead: "Only need it optimized once?", label: "Check it out here", href: "/optimize#convert" },
    },
  },

  /** /manage/welcome — after the $297 goes through. */
  welcome: {
    heading: "Paid. Here's what happens next.",
    sub: "Nothing else to fill in right now. Setup is about 20 minutes, and we'll send you the link.",
    steps: [
      {
        when: "Within a day",
        body: "You get an email with the link to connect the Google account that manages your profile and a short form about the business.",
      },
      {
        when: "One business day after",
        body: "Your profile is optimized first, every section checked and filled in. Then the first posts and review replies are ready, on autopilot or waiting for your OK, whichever you chose.",
      },
      {
        when: "Day 30",
        body: "Your first report, measured against the baseline we take the day you connect.",
      },
    ],
    helpLine: "Questions? Reply to the first email you get from us.",
  },

  /**
   * "Every local SEO feature, in plain English": the full table, every
   * group open. Paige's list trimmed to what Fynd offers: review requests
   * by text only, no citations add-on, no users / integrations / support /
   * white-label groups.
   */
  features: {
    eyebrow: (n: number) => `All ${n} features`,
    heading: "Every feature, in plain English",
    sub: "Everything below is included in your $297 a month. Nothing is an add-on.",
    cta: "Start for $297",
    cols: { feature: "Feature", means: "What it means for your business", included: "Included" },
    groupCount: (n: number) => `${n} features`,
    included: "Included",
    groups: [
      {
        icon: "map",
        title: "Google Business Profile optimization",
        items: [
          { name: "Optimize business description", means: "Rewritten so Google knows exactly what you do and where you do it." },
          { name: "Optimize services list", means: "Every service you offer gets listed, so you show up for more searches." },
          { name: "Optimize service descriptions", means: "Each service gets a clear, keyword-rich description." },
          { name: "Optimize attributes", means: "Details like “walk-ins welcome” or “wheelchair accessible” filled in, so you match more filters." },
          { name: "Optimize social links", means: "Your social profiles linked, so customers can find you everywhere." },
        ],
      },
      {
        icon: "globe",
        title: "Website creation & hosting",
        items: [
          { name: "Website built for you", means: "A full, multi-page site built from your profile while you set up. A one-time $249, not part of the monthly price." },
          { name: "Hosting included", means: "No separate hosting bill." },
          { name: "Easy editing", means: "Change anything by telling us what you want." },
          { name: "SEO set up for you", means: "Titles, schema and FAQs set up so Google and AI understand your site." },
          { name: "Fresh content over time", means: "New reviews, photos and posts flow onto your site automatically." },
        ],
      },
      {
        icon: "star",
        title: "Reputation management",
        items: [
          { name: "Link to get more reviews", means: "A simple link, texted to customers, so they review you in one tap." },
          { name: "Automated review replies", means: "Every review answered in your voice, with the right keywords." },
          { name: "Auto flag bad reviews", means: "You hear about negative reviews right away, so you can step in." },
          { name: "Auto follow-up to get more", means: "Customers who didn't leave a review get a friendly reminder by text." },
          { name: "Turn five-star reviews into social posts", means: "Your best reviews become posts that show off your work." },
          { name: "See why you're not getting reviews", means: "Find out where requests stall and what to fix." },
          { name: "Backup of your Google reviews", means: "Your reviews are saved, so you never lose your reputation." },
        ],
      },
      {
        icon: "chart",
        title: "Rank tracking & reporting",
        items: [
          { name: "Automated monthly heatmap reporting", means: "See where you rank across your whole service area, every month." },
          { name: "Before & after ranking heatmaps", means: "See exactly how far you've climbed since your baseline." },
          { name: "Track up to 10 keywords", means: "Follow the searches that bring you the most customers." },
          { name: "AI rank reports for Gemini, ChatGPT, Perplexity, Grok, Llama and Claude", means: "Know whether AI assistants recommend you, and whether it's improving." },
          { name: "See all completed actions", means: "A clear log of everything done for you." },
        ],
      },
      {
        icon: "users",
        title: "Competitor analysis",
        items: [
          { name: "See who your top competitors are", means: "Know exactly who's getting the customers you want." },
          { name: "Momentum tracking", means: "See how fast competitors get reviews and photos compared with you." },
          { name: "Competitor breakdown", means: "See what top-ranked competitors do differently." },
        ],
      },
      {
        icon: "zap",
        title: "Google Business Profile automations",
        items: [
          { name: "Automated image uploads", means: "Your photos go up on a steady schedule." },
          { name: "Automated video uploads", means: "Videos added to your profile automatically." },
          { name: "Automated posts & updates", means: "Fresh posts go live every week." },
          { name: "Automated review replies", means: "Reviews answered fast, without you lifting a finger." },
          { name: "Automated offers", means: "Promotions posted when you have something to offer." },
          { name: "Automated strategy adjustments", means: "Tactics change as Google changes how it ranks businesses." },
        ],
      },
      {
        icon: "bell",
        title: "Your account manager",
        items: [
          { name: "Weekly progress updates", means: "A short note each week on what got done and what's next." },
          { name: "Google Business Profile change alerts", means: "You're told right away if something on your profile changes." },
          { name: "Automated report sending", means: "Your monthly report lands in your inbox." },
          { name: "Proactive review reminders", means: "A nudge when it's time to collect more reviews." },
          { name: "Proactive image reminders", means: "A nudge when fresh photos would help you rank." },
          { name: "Approval requests", means: "We ask first whenever something needs your OK." },
          { name: "Appreciation messages", means: "You hear about the wins, like new milestones and great reviews." },
        ],
      },
      {
        icon: "share",
        title: "Automated social media posting",
        items: [
          { name: "Facebook posts", means: "Your updates shared to Facebook automatically." },
          { name: "Instagram posts", means: "Your photos posted to Instagram for you." },
          { name: "LinkedIn posts", means: "Stay visible on LinkedIn without logging in." },
          { name: "YouTube videos", means: "Videos published to your YouTube channel." },
          { name: "TikTok videos", means: "Short videos posted to TikTok for you." },
        ],
      },
      {
        icon: "video",
        title: "Video automation",
        items: [
          { name: "Auto create videos", means: "Short videos made from your photos." },
          { name: "Auto upload to your Google profile", means: "Videos added to your Google Business Profile." },
          { name: "Auto upload to YouTube", means: "Published to YouTube for you." },
          { name: "Auto upload to TikTok", means: "Published to TikTok for you." },
          { name: "Auto upload to LinkedIn", means: "Shared on LinkedIn too." },
          { name: "Auto-written descriptions", means: "Every video gets a title and description that help you get found." },
        ],
      },
      {
        icon: "camera",
        title: "Image optimization",
        items: [
          { name: "Auto geotag images", means: "Location data added so Google ties your photos to your area." },
          { name: "Drip images onto your profile", means: "Photos go up a few at a time, the way Google likes." },
          { name: "Auto-add metadata", means: "Each photo labelled so search engines understand it." },
          { name: "Send photos however is easiest", means: "Text them over, send a link or share a folder. We take it from there." },
        ],
      },
      {
        icon: "layout",
        title: "Website widgets",
        items: [
          { name: "Add posts to your website", means: "Your latest Google posts appear on your own site." },
          { name: "Add reviews to your website", means: "Show off your newest reviews automatically." },
          { name: "Add images to your website", means: "Your newest photos show up on your site." },
          { name: "Structured schema markup", means: "Behind-the-scenes code that helps AI assistants understand and recommend you." },
          { name: "FAQ section", means: "Answers to common questions that help you show up in more searches." },
        ],
      },
    ],
  },

  /** Paige's FAQ, minus the trial, agency and citations questions. */
  faq: {
    eyebrow: "FAQ",
    heading: "Questions about full management",
    sub: "Straight answers about pricing, setup and how it works.",
    items: [
      {
        q: "What's included in the $297?",
        a: "It starts with a full one-time optimization of your profile, the same work as the $99 update, so everything is correct before the ongoing work begins. Then everything on this page: setup, your baseline heatmap and AI visibility check, profile optimization, posts, photos, review requests and replies, social, video, website hosting and widgets, and the monthly report. One price per Google Business Profile. The only extra is a website build, if you want one: a one-time $249.",
      },
      {
        q: "Do I still need the $99 optimization?",
        a: "No. Every subscription starts with it. The profile is optimized first, every section checked and filled in, and only then do the posts, photos and review replies begin. If you've already had the $99 update, we check it over and the recurring work starts right away.",
      },
      {
        q: "When do I see results?",
        a: "You get your baseline the day you connect, so every improvement is measured from day one. Rankings usually move over 30 to 90 days, and your first monthly report compares everything with your baseline.",
      },
      {
        q: "How long does setup take, and what do I do after that?",
        a: "About 20 minutes, once. You connect your Google Business Profile, tell us about your business and choose autopilot or approve-first. After that we only need two things from you: a few new photos now and then, and a heads-up when hours, services or offers change. Posts, review replies, AI search, website SEO and reporting run on their own.",
      },
      {
        q: "Is this a tool I have to log into every day?",
        a: "No. It works like a marketing employee, not software you operate. The work gets done and you get simple updates. Log in whenever you like to see results or approve content first.",
      },
      {
        q: "Will you post anything without my OK?",
        a: "Only if you want. Choose full autopilot, or approve every post and reply before it goes out. You can switch at any time.",
      },
      {
        q: "Is it safe for my Google Business Profile?",
        a: "Yes. Only practices within Google's guidelines: a complete profile, regular posts and photos, real reviews, a website that matches. Nothing that would put the profile at risk.",
      },
      {
        q: "Do I need any SEO or marketing experience?",
        a: "No. We learn about your business during setup and make the decisions. If we need something from you, we ask.",
      },
      {
        q: "Is this just a Google Business Profile service?",
        a: "No. Your Google Business Profile is the foundation, so we start there. It also covers AI search visibility, reviews, social posts on Facebook, Instagram and LinkedIn, videos for YouTube and TikTok, your website and reporting, with the software for each built in.",
      },
      {
        q: "How do I rank higher on Google Maps?",
        a: "Google ranks local results on relevance, distance and prominence. You can't change distance, but you can improve the other two: a complete, accurate profile, fresh posts and photos, steady new reviews with replies, and a website that matches your profile. That's the work we do every week, and the heatmaps show your Maps rankings across your whole area.",
      },
      {
        q: "Can you help me get recommended by ChatGPT, Gemini and Google AI Mode?",
        a: "Yes. We publish your content in the places AI assistants draw from, keep your business details consistent, and report each month whether ChatGPT, Gemini, Perplexity, Claude, Grok and Llama recommend you. Most local searches still happen on Google, so Google comes first and AI alongside it.",
      },
      {
        q: "How are my rankings tracked?",
        a: "Up to 10 searches, with Google Maps heatmaps that show where you rank across your whole area, before-and-after comparisons, and AI rank reports for ChatGPT, Gemini, Perplexity, Grok, Llama and Claude. The report goes out every month.",
      },
      {
        q: "Do you charge for AI usage or tokens?",
        a: "No. $297 a month includes every AI and reporting cost. No tokens, credits or surprise bills.",
      },
      {
        q: "I have more than one location.",
        a: "Each Google Business Profile is $297 a month. Add as many as you like.",
      },
      {
        q: "Does it come with a website?",
        a: "Building one is a one-time $249, not part of the $297. For that, while you set up, we build a complete, multi-page website in the background, fast, mobile-first and SEO-ready on every page, that you can put live on your own domain in one click. Hosting is included in your plan after that. You can keep your current site instead, but we don't recommend it: we can only tell you what to fix, not fix it, and it holds the rest of the work back.",
      },
      {
        q: "Can I keep my current website?",
        a: "You can, but we don't recommend it. We can scan it and tell you what to fix, and add widgets for fresh reviews, photos and posts where they fit, but we can't rebuild it, and a slow or desktop-only site holds back everything else on this page. Switching is a one-time $249 and the site is built while you set up.",
      },
      {
        q: "Is there a contract?",
        a: "No. $297 a month, per profile, cancel anytime. You're charged when you sign up, then on the same day each month from then.",
      },
      {
        q: "Do I keep control of the profile?",
        a: "Yes. It stays on your Google account. You can remove our access in two clicks.",
      },
      {
        q: "How do I get help?",
        a: "Reply to any message from us and a person answers. When it's easier to show than tell, we'll jump on a screen-share call.",
      },
    ],
  },

  /** The closer, under the Fynd mark. */
  finalCta: {
    lead: "Stop managing your Google profile.",
    accent: "Start answering the phone.",
    body: "Set it up in about 20 minutes tonight and get your baseline right away. Within one business day of connecting Google, we start fixing what's missing and preparing posts and review replies, published on autopilot or after your OK.",
    cta: "Start for $297",
    note: "$297 a month per profile · No contract · Cancel anytime",
    notReady: "Not ready?",
    callLink: "Book a call",
    once: { lead: "Just want it fixed once?", label: "See the $99 update", href: "/optimize" },
  },

  stickyCta: "Start now",
} as const;
