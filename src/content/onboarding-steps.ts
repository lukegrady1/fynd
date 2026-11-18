import { offer } from "./copy";
import type { OnboardingService } from "@/lib/services";

/**
 * /onboarding — the steps each service needs after checkout.
 *
 * A plain list of steps, not a chat (Luke, Nov 17, 2026: "I'm not sure if an
 * AI chatbot is really necessary"). Checkout lands on /onboarding?session_id=…,
 * the page reads what was bought from the session, and shows that service's
 * steps. The wording is Luke's own onboarding notes, rewritten client-facing.
 *
 * Rules, same as `copy.ts`: no strings inline in the components, and every
 * "what happens next" line is one the service's own page already makes.
 *
 * Two things come from env, read on the server and passed in:
 * - FYND_GBP_ACCESS_URL: the one link every customer uses to give us access
 *   to their Google Business Profile (the white-labelled platform's connect
 *   link). Unset, the step says the link is coming by email.
 * - GHL_ONBOARDING_FORM_ID: the GHL form with the customer-list upload and
 *   the CRM dropdown. Unset, the step says to reply to the welcome email.
 */

/** The address customers invite to their domain registrar. */
export const domainAccessEmail = "luke@gradydigital.com";

export type StepAction =
  /** The button to FYND_GBP_ACCESS_URL. */
  | "gbp-access"
  /** The embedded GHL form (customer list + CRM). */
  | "customer-form";

export type OnboardingStep = {
  /** Checklist key, stored in the visitor's browser. Renaming it un-ticks the step. */
  id: string;
  title: string;
  body: string[];
  /** Labelled alternatives, e.g. "On GoDaddy" / "Somewhere else". */
  options?: { label: string; text: string }[];
  action?: StepAction;
  /** Small print under the step: the most common way it stalls, and the way out. */
  help?: string;
  /** A link under the step to a page of its own (opens in a new tab), e.g. how to create a profile. */
  helpLink?: { label: string; path: string };
  /** Words in the body and options to turn into links (every occurrence). */
  links?: { text: string; href: string }[];
};

const godaddy = { text: "GoDaddy", href: "https://www.godaddy.com" };

export type StepGroup = {
  /** Only set when a page has more than one group (Website + Reviews). */
  title?: string;
  steps: OnboardingStep[];
};

export type ServiceOnboarding = {
  heading: string;
  intro: string;
  groups: StepGroup[];
  /** "What happens next", once the steps are done. */
  next: string[];
};

/* ---------------- The steps ---------------- */

const gbpAccess: OnboardingStep = {
  id: "gbp-access",
  title: "Give us access to your Google Business Profile",
  body: [
    "Click the button and sign in with the Google account that owns your Business Profile. It takes about 2 minutes, and we never see your password.",
  ],
  action: "gbp-access",
  helpLink: { label: "Don't have a Business Profile yet? Check out how to set one up", path: "/onboarding/google-profile" },
};

const customerList: OnboardingStep = {
  id: "customer-list",
  title: "Upload your customer list and tell us your CRM",
  body: [
    "We'll send review requests to your past customers to give your profile a strong start. All we need is each customer's full name and phone number. An export from your CRM or a spreadsheet works fine.",
    "Then pick the CRM or job software you use (Jobber, Housecall Pro, ServiceTitan, anything else). We'll connect it so a review request goes out automatically each time you finish a job, and we'll follow up within 1 business day with the steps to connect it.",
  ],
  action: "customer-form",
};

const domain: OnboardingStep = {
  id: "domain",
  title: "Get a domain",
  body: [
    "Already own one? Skip to the next step. If not, buy one. GoDaddy is easiest for us.",
  ],
  links: [godaddy],
};

const domainAccess: OnboardingStep = {
  id: "domain-access",
  title: "Give us access to your domain",
  body: [],
  options: [
    {
      label: "On GoDaddy",
      text: `Go to Account Settings → Delegate Access, invite ${domainAccessEmail}, and choose “Products, Domains & Purchase” access.`,
    },
    {
      label: "On Namecheap, Cloudflare or Squarespace",
      text: `Invite ${domainAccessEmail}. Namecheap calls it “Share Access,” Cloudflare lets you add a member, and Squarespace lets you add a domain user.`,
    },
    {
      label: "Somewhere else",
      text: "Reply to your welcome email with the website where you bought your domain, plus your username and password, and we'll take it from there.",
    },
  ],
  links: [godaddy],
};

const siteContent: OnboardingStep = {
  id: "site-content",
  title: "Send us what goes on the site",
  body: [
    "Your logo, photos of your work, your list of services, the area you serve and any brand colors. These hold up a build more than the domain does, so the sooner the better. Reply to your welcome email with them; phone photos are fine.",
  ],
};

/* ---------------- Per service ---------------- */

const reviewSteps: StepGroup = { steps: [gbpAccess, customerList] };
const websiteSteps: StepGroup = { steps: [domain, domainAccess, siteContent] };

const reviewNext =
  "Once your profile is connected, the first review requests go out to your past customers within 24 hours of us getting your list.";

export const onboardingSteps: Record<OnboardingService, ServiceOnboarding> = {
  reviews: {
    heading: "Set up your Review System",
    intro: "Thanks for signing up. Two steps and we can start sending review requests.",
    groups: [reviewSteps],
    next: [reviewNext],
  },

  "reviews-trial": {
    heading: "Set up your Review System",
    intro: `Welcome to the trial. Two steps and we can start sending review requests. The sooner they're done, the more of your ${offer.trialDays} free days you get to judge it by.`,
    groups: [reviewSteps],
    next: [
      reviewNext,
      `Nothing is charged for ${offer.trialDays} days, then $${offer.price} a month. Cancel before the end of day ${offer.trialDays} by replying to any email from us and you won't be charged.`,
    ],
  },

  "website-reviews": {
    heading: "Set up your website and reviews",
    intro: "Thanks for signing up. Reviews first, since they start long before the site goes up, then what we need to build it.",
    groups: [
      { title: "Reviews", steps: [gbpAccess, customerList] },
      { title: "Website", steps: [domain, domainAccess, siteContent] },
    ],
    next: [
      reviewNext,
      "Once we have your domain and your content, we build a first draft and send it to you to look at.",
    ],
  },

  manage: {
    heading: "Set up Profile Management",
    intro: "Thanks for signing up. Two steps and we take it from there.",
    groups: [reviewSteps],
    next: [
      "Your profile is optimized one business day after you connect it, every section checked and filled in.",
      "Your first report comes on day 30, measured against the baseline we take the day you connect.",
    ],
  },

  optimize: {
    heading: "Give us access to your profile",
    intro: "Thanks for your order. This is the one thing we need to start on your profile.",
    groups: [{ steps: [gbpAccess] }],
    next: [
      "Once we're in, we go through your profile and send you a short list of what we're changing. Everything on it is done within five business days.",
    ],
  },

  website: {
    heading: "Set up your website",
    intro: "Thanks for your order. Three steps and we can start building.",
    groups: [websiteSteps],
    next: [
      "Once we have your domain and your content, we build a first draft and send it to you to look at.",
    ],
  },
};

/** The page's own strings. */
export const onboardingPage = {
  title: "Set up your account",
  progress: (done: number, total: number) => `${done} of ${total} done`,
  markDone: "Mark as done",
  done: "Done",
  gbpButton: "Connect your Google profile",
  gbpPending:
    "We'll email you the link within 1 business day. When it arrives, sign in with the Google account that owns your Business Profile.",
  formPending:
    "Reply to your welcome email with the list attached and the name of your CRM.",
  formTitle: "Customer list and CRM",
  nextHeading: "What happens next",
  help: "Questions? Reach out to us and we'll get back to you.",
  unpaid: {
    heading: "We couldn't find that payment.",
    sub: "If you just paid, give it a minute and refresh. If the link came from an email, open it again from there.",
    cta: "Back to Fynd",
    href: "/",
  },
} as const;

/**
 * /onboarding/google-profile — how to create and verify a Google Business
 * Profile, for customers who don't have one yet. Linked from the Google
 * access step.
 *
 * Adapted from Luke's own setup guide for a salon-suite client
 * (gbp_setup.pdf, Nov 17, 2026), made general for any business with a
 * location customers visit. It steers to a physical address and away from
 * service-area-only (Luke: a service area doesn't help Google show the
 * profile). `**text**` renders bold (button and field names, as in the PDF).
 */
export const createProfilePage = {
  title: "Create your Google Business Profile",
  intro:
    "What to click, what Google does next, and how to pass video verification.",
  needs:
    "**You'll need:** your business name exactly as it appears on your sign, your full address (with suite or unit number if you have one), your phone number, and your keys. Plan to record the verification video at your location during business hours, when you don't have a customer.",
  first: {
    heading: "Do this first: get your signage up",
    body: "Google needs to see permanent signage with your business name. Make sure it's on your door or storefront (and on the building directory if you share a building) before you record the video. A printed paper sign taped to the door usually isn't enough.",
  },

  create: {
    heading: "Part 1: Create the profile",
    steps: [
      "Go to business.google.com and sign in with the Google account you want to own the profile. Use your own, not a landlord's, a building's or a staff member's.",
      "Click **Manage now** (or **Add business**).",
      "Type your **business name** exactly as it appears on your sign. Don't add your town or a keyword unless it's actually part of the name. If you share a building, ignore any listing Google suggests for the building itself; that isn't yours to claim. Click **Next**.",
      "For **business category**, type and select the one that best describes what you do. Click **Next**.",
      "Google asks if you want to add a location customers can visit. Click **Yes**.",
      "Enter your street address. If you're in a suite or unit, put that in **Address line 2** (e.g. “Suite 112”). Check that the map pin is on your building.",
      "If Google says a business already exists at that address, check whether it's yours. In a shared building other businesses will show up; that's normal. Click **No, this business is not mine** unless it really is your listing (for example, one you made before under an old name).",
      "Skip service areas. You don't need them when customers come to you.",
      "Enter your **phone number** (the one customers call or text). Add your website if you have one. If Fynd is building your site, leave it blank (choose “I don't have a website” if asked); we'll add it once your profile is verified. Click **Next**.",
      "Click **Continue** through any remaining prompts until you reach the **Verify** screen.",
    ],
  },

  process: {
    heading: "Part 2: Google's process",
    intro: "Your profile won't show up on Google Search or Maps until it's verified. Here's what happens:",
    steps: [
      "**Google picks the verification method.** You can't choose. For most new businesses it's a video. If a phone, text or email code is offered instead, use that; it's instant.",
      "**You submit your verification.** Part 3 covers the video.",
      "**Google reviews it.** Video reviews usually take up to 5 business days. You'll get an email when it's done.",
      "**Approved:** your profile goes live on Search and Maps. It can take a few more days to show up consistently.",
      "**Rejected:** the email will say why. Fix that one issue and record a new video.",
    ],
    wait: {
      heading: "While you wait",
      body: "Don't change your business name, address, category or phone number, and don't create a second profile. Any of these can reset or fail the review.",
    },
  },

  video: {
    heading: "Part 3: Video verification",
    intro: "Google needs to see that your business is real and that it's yours. Your video has to prove three things:",
    proof: [
      { what: "Your location", show: "The street and the outside of your building, with your sign. If you share a building, the directory showing your business name and suite number too." },
      { what: "Your business", show: "The tools, equipment, products or workspace you use to serve customers." },
      { what: "You run it", show: "Unlock your door with your key on camera, and show a document with your name and the business on it, like a license, lease or business registration." },
    ],
    recordHeading: "How to record it",
    record: [
      "Stand outside your building. Open the **Google Maps** app on your phone, signed in to the same Google account.",
      "Tap your profile picture, then **Your Business Profile**, then **Get verified**.",
      "Tap **Capture video** (or **Business video**), read the requirements, and tap **Next**.",
      "Do a practice walk-through first without recording, so you know your route from the street to your workspace.",
      "Tap record and film in **one continuous take**. No stopping or editing. It has to be recorded in the app, not uploaded from your camera roll.",
      "Move slowly and hold on each important thing (the building sign, the directory, your door sign, the key unlocking the door, your document) for 2 to 3 seconds.",
      "Keep it to around **1 to 2 minutes**.",
      "Watch it back, then tap **Upload video**. If the signal is weak inside, step outside to upload.",
    ],
    routeHeading: "Your video route (about 90 seconds)",
    route: [
      "The street sign or the road in front of your building, then pan to your sign",
      "Walk in the front entrance (show your key card or code if the building uses one)",
      "The building directory, if there is one, holding on your business name and suite number",
      "Your door, holding on the sign with your business name",
      "Unlock the door with your key",
      "Walk in and slowly show your workspace, equipment, tools and products",
      "Finish on your license, lease or registration showing your name",
    ],
    rejected: {
      heading: "Common reasons videos get rejected",
      body: "Your business name isn't visible on the door, storefront or directory. The name in the video doesn't match the profile exactly. Only the inside is shown, with no building or street. No door unlock or document. Cuts or edits in the video. Customers' faces in the shot (record when nobody's there).",
    },
  },

  linkText: "business.google.com",
  linkHref: "https://business.google.com",
  after:
    "Once Google has verified your profile, go back to your setup page and click “Connect your Google profile.”",
  help: "Stuck on a step? Reply to your welcome email with a screenshot and we'll help.",
  interfaceNote: "Google changes this interface often. If a button name differs slightly, look for the closest match.",
} as const;
