import { offer } from "./copy";
import { domainAccessEmail } from "./onboarding-steps";
import type { OnboardingService } from "@/lib/services";

/**
 * The email each service sends the moment someone pays.
 *
 * The onboarding itself is the list of steps on /onboarding (Luke, Nov 17,
 * 2026, replacing the Nov 4 chat). Checkout lands there, but people close
 * tabs, and a redirect can fail; this email carries the same link, says what
 * to have handy, and repeats the "what happens next" lines from the page.
 *
 * Rules, same as `copy.ts`: every claim is one the matching page already
 * makes, no strings inline in the sender, nothing fabricated. Sent through
 * GoHighLevel (`src/lib/ghl-email.ts`), so a reply lands in the contact's
 * conversation; every email says "reply to this email".
 */

/** Everything the copy can interpolate. */
export type EmailVars = {
  firstName: string | null;
  /** /onboarding?session_id=…, the setup steps for what they bought. */
  onboardingUrl: string;
  /** FYND_GBP_ACCESS_URL, or null when it isn't set yet. */
  gbpAccessUrl: string | null;
  /** "November 11, 2026" — first charge of the free trial. */
  trialEndLabel: string | null;
  /** "November 13, 2026" — first charge of a deferred-start offer. */
  startsOnLabel: string | null;
};

export type EmailStep = { when: string; body: string; href?: string; linkLabel?: string };

export type EmailContent = {
  subject: string;
  /** The inbox preview line. Plain text. */
  preheader: string;
  heading: string;
  /** "Hi Maria," on its own line. */
  greeting: string;
  intro: string;
  steps: EmailStep[];
  /** Optional block after the steps: a billing note or a "have handy" list. */
  aside?: { heading: string; items: string[] };
  closing: string;
};

const hi = (v: EmailVars) => (v.firstName ? `Hi ${v.firstName},` : "Hi,");

const CLOSING = "Questions? Reach out to us and we'll get back to you.";

const setupStep = (v: EmailVars, body: string): EmailStep => ({
  when: "Now",
  body,
  href: v.onboardingUrl,
  linkLabel: "Open your setup steps",
});

/** The Google access step, as a direct link when we have one. */
const gbpStep = (v: EmailVars, when = "Now"): EmailStep =>
  v.gbpAccessUrl
    ? {
        when,
        body: "Give us access to your Google Business Profile. Sign in with the Google account that owns the profile; it takes about 2 minutes and we never see your password.",
        href: v.gbpAccessUrl,
        linkLabel: "Connect your Google profile",
      }
    : {
        when,
        body: "Give us access to your Google Business Profile. We'll email you the link within 1 business day; sign in with the Google account that owns the profile.",
      };

const reviewAside = {
  heading: "Worth having handy",
  items: [
    "A list of your past customers, with each one's full name and phone number (an export from your CRM or a spreadsheet works fine)",
    "The name of the CRM or job software you use",
    "The login for the Google account that owns your Business Profile",
  ],
};

const websiteItems = [
  "Your domain, or the one you'd like to buy (GoDaddy is easiest for us)",
  `Access to it for ${domainAccessEmail} (the setup page has the steps), or the login for wherever you bought it`,
  "Your logo, photos of your work, your list of services, the area you serve and any brand colors",
];

/* ---------------- The emails ---------------- */

const REVIEW_SETUP =
  "Two steps: connect your Google Business Profile, and upload your customer list and tell us your CRM. The setup page has both, and this link brings you back to it any time.";

const REVIEW_NEXT: EmailStep = {
  when: "Then",
  body: "The first review requests go out to your past customers within 24 hours of us getting your list. We follow up within 1 business day with the steps to connect your CRM, so every finished job asks on its own.",
};

const WEBSITE_NEXT: EmailStep = {
  when: "Then",
  body: "Once we have your domain and your content, we build a first draft and send it to you to look at.",
};

export const onboardingEmails: Record<OnboardingService, (v: EmailVars) => EmailContent> = {
  /** $97/month Review System, paid today (or a deferred-start offer). */
  reviews: (v) => ({
    subject: "You're in. Here are your two setup steps.",
    preheader: "Connect your Google profile and send your customer list, and the first review requests go out.",
    heading: "Welcome to the Fynd Review System.",
    greeting: hi(v),
    intro: "Thanks for signing up. There are two quick steps before we can start sending review requests.",
    steps: [setupStep(v, REVIEW_SETUP), REVIEW_NEXT],
    aside: v.startsOnLabel
      ? {
          heading: "Billing",
          items: [`Nothing is charged until ${v.startsOnLabel}. Your card is saved, and the first $${offer.price} is taken that day.`],
        }
      : reviewAside,
    closing: CLOSING,
  }),

  /** The 7-day free trial from /watch. */
  "reviews-trial": (v) => ({
    subject: "Your free trial has started. Here are your two setup steps.",
    preheader: `Nothing is charged for ${offer.trialDays} days. Two quick steps get it running.`,
    heading: `Your ${offer.trialDays}-day trial is on.`,
    greeting: hi(v),
    intro: `Thanks for starting the trial. There are two quick steps before we can start sending review requests, and the sooner they're done the more of the ${offer.trialDays} days you get to judge it by.`,
    steps: [setupStep(v, REVIEW_SETUP), REVIEW_NEXT],
    aside: {
      heading: "Billing",
      items: [
        v.trialEndLabel
          ? `Nothing is charged for ${offer.trialDays} days. Your first $${offer.price} is on ${v.trialEndLabel}, and then monthly after that.`
          : `Nothing is charged for ${offer.trialDays} days, then $${offer.price} a month.`,
        `Cancel before the end of day ${offer.trialDays} and you won't be charged. Reply to this email and it's done.`,
      ],
    },
    closing: CLOSING,
  }),

  /** $249 Website + Reviews. */
  "website-reviews": (v) => ({
    subject: "You're in. Here are your setup steps.",
    preheader: "Reviews first, since they start long before the site goes up, then what we need to build it.",
    heading: "Welcome. Let's build your site and start the reviews.",
    greeting: hi(v),
    intro: "Thanks for signing up. Your setup page has the steps for both halves: the reviews first, then your domain and what goes on the site.",
    steps: [setupStep(v, "Connect your Google profile, upload your customer list, then give us access to your domain and send your logo and photos."), REVIEW_NEXT, WEBSITE_NEXT],
    aside: { heading: "Worth having handy", items: [...reviewAside.items, ...websiteItems] },
    closing: CLOSING,
  }),

  /** $297/month profile management. */
  manage: (v) => ({
    subject: "You're in. Here are your two setup steps.",
    preheader: "Connect your Google profile and send your customer list, and we take it from there.",
    heading: "Welcome to Fynd Profile Management.",
    greeting: hi(v),
    intro: "Thanks for signing up. There are two quick steps, and then we take it from there.",
    steps: [
      setupStep(v, REVIEW_SETUP),
      {
        when: "One business day after",
        body: "Your profile is optimized first, every section checked and filled in, one business day after you connect it.",
      },
      {
        when: "Day 30",
        body: "Your first report, measured against the baseline we take the day you connect.",
      },
    ],
    aside: reviewAside,
    closing: CLOSING,
  }),

  /** $99 one-off profile optimization. */
  optimize: (v) => ({
    subject: "Paid. Two minutes to give us access, and we get started.",
    preheader: "Connect your Google Business Profile. It never involves your password.",
    heading: "Thanks. Here's the one thing we need.",
    greeting: hi(v),
    intro: "Thanks for your order. To work on your profile we need access to it. It takes about two minutes and never involves your password.",
    steps: [
      gbpStep(v),
      {
        when: "Once we're in",
        body: "We go through the profile and send you a short list of what we're changing.",
      },
      {
        when: "Within five business days",
        body: "Everything on the list is done and we let you know. There's no report with the one-time update; open the profile and it's all there.",
      },
    ],
    closing: "No Business Profile yet, or not sure who owns it? Reply to this email and we'll help.",
  }),

  /** $249 website on its own. */
  website: (v) => ({
    subject: "Paid. Here are your setup steps.",
    preheader: "Your domain, access to it, and what goes on the site.",
    heading: "Thanks. Let's build your site.",
    greeting: hi(v),
    intro: "Thanks for your order. Three quick steps and we can start building.",
    steps: [
      setupStep(v, "Get a domain if you don't have one, give us access to it, and send us your logo, photos, services, service area and brand colors. The setup page has the steps."),
      WEBSITE_NEXT,
    ],
    aside: { heading: "Worth having handy", items: websiteItems },
    closing: CLOSING,
  }),
};
