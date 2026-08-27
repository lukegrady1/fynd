/**
 * Onboarding — copy and the booking-platform catalog.
 *
 * Lives here rather than in the component for the same reason the funnel copy
 * does: these strings get rewritten without touching markup. The platform
 * roster is the other half — it is product data, and the `Other` free-text
 * answers are the signal for which integration to build next.
 *
 * NOTE: this is deliberately NOT `integrations.platforms` from copy.ts. That
 * list is the marketing ring — ordered by popularity, and every entry needs a
 * logo file. This one is the roster we ask a paying customer to pick from:
 * wider, ordered per vertical, and it has to include the two answers the ring
 * can never show ("Other", "I don't use booking software").
 */

export const businessTypes = [
  { id: "hair-salon", label: "Hair salon" },
  { id: "barber", label: "Barber" },
  { id: "massage", label: "Massage therapy" },
  { id: "pilates", label: "Pilates" },
  { id: "yoga", label: "Yoga" },
  { id: "nails", label: "Nail salon" },
  { id: "skincare", label: "Skincare / med spa" },
  { id: "other", label: "Something else" },
] as const;

/**
 * How Fynd gets read access to completed appointments.
 *
 * - `oauth`   — the platform has a public OAuth app flow, so the owner clicks
 *               through on the platform's own domain and never hands us a
 *               credential. Gated on env at runtime (see `src/lib/connect.ts`);
 *               if the app isn't provisioned the UI falls back to `invite`.
 * - `invite`  — no public OAuth. The owner adds Fynd as a limited staff user
 *               from inside their own account. Still no shared password.
 * - `manual`  — "Other" and "no booking software": there is nothing to connect
 *               yet, so we ask how they track finished appointments instead.
 *
 * Everything defaults to `invite` on purpose. Marking a platform `oauth` is a
 * claim that the OAuth app exists — do not flip one without the credentials.
 */
export type ConnectMethod = "oauth" | "invite" | "manual";

export const platforms = [
  { id: "square", name: "Square Appointments", connect: "oauth" },
  { id: "acuity", name: "Acuity Scheduling", connect: "oauth" },
  { id: "vagaro", name: "Vagaro", connect: "invite" },
  { id: "fresha", name: "Fresha", connect: "invite" },
  { id: "mindbody", name: "Mindbody", connect: "invite" },
  { id: "glossgenius", name: "GlossGenius", connect: "invite" },
  { id: "booksy", name: "Booksy", connect: "invite" },
  { id: "boulevard", name: "Boulevard", connect: "invite" },
  { id: "zenoti", name: "Zenoti", connect: "invite" },
  { id: "meevo", name: "Meevo", connect: "invite" },
  { id: "mangomint", name: "Mangomint", connect: "invite" },
  { id: "jane", name: "Jane", connect: "invite" },
  { id: "schedulicity", name: "Schedulicity", connect: "invite" },
  { id: "wellnessliving", name: "WellnessLiving", connect: "invite" },
  { id: "mariana-tek", name: "Mariana Tek", connect: "invite" },
  { id: "other", name: "Other", connect: "manual" },
  { id: "none", name: "I don't use booking software", connect: "manual" },
] as const satisfies readonly {
  id: string;
  name: string;
  connect: ConnectMethod;
}[];

/**
 * Which platforms surface first for each vertical.
 *
 * The point is that a barber never scrolls past Mindbody and a Pilates studio
 * never scrolls past GlossGenius — the list should read as though it was built
 * for their industry. Anything not listed still appears, alphabetically, under
 * a "More platforms" divider, so this is ordering only, never filtering.
 *
 * `other` has no priority order: an unknown vertical gets the plain
 * alphabetical roster rather than a guess dressed up as a recommendation.
 */
export const priorityByType: Record<
  (typeof businessTypes)[number]["id"],
  readonly (typeof platforms)[number]["id"][]
> = {
  "hair-salon": ["vagaro", "fresha", "glossgenius", "boulevard", "square", "mangomint"],
  barber: ["booksy", "square", "vagaro", "fresha", "glossgenius"],
  massage: ["mindbody", "vagaro", "jane", "square", "acuity"],
  pilates: ["mindbody", "mariana-tek", "wellnessliving", "vagaro", "acuity"],
  yoga: ["mindbody", "wellnessliving", "vagaro", "acuity"],
  nails: ["vagaro", "fresha", "glossgenius", "square", "booksy"],
  skincare: ["vagaro", "boulevard", "glossgenius", "fresha", "square", "mangomint"],
  other: [],
};

export const onboarding = {
  heading: "Set up your account",
  sub: "Two minutes. Then I can start building.",

  /** Shown in the progress rail. Keep these to one or two words. */
  stepLabels: ["Your details", "Your business", "Your software", "Connect"],

  details: {
    heading: "Your information",
    sub: "So I know who I'm building for and where to reach you.",
    ownerName: {
      label: "Business owner name",
      placeholder: "Jamie Rivera",
    },
    businessName: {
      label: "Business name",
      placeholder: "Rivera Hair Studio",
    },
    email: {
      label: "Email address",
      placeholder: "you@yourbusiness.com",
    },
    phone: {
      label: "Phone number",
      placeholder: "(978) 000-0000",
    },
    prefillNote: "Pulled from your signup — change it if it's wrong.",
  },

  business: {
    heading: "What type of business do you run?",
    sub: "This just puts the right booking software at the top of the next list.",
  },

  software: {
    heading: "What booking software does your business use?",
    sub: "Select the platform you use to manage appointments and customers.",
    searchLabel: "Search platforms",
    searchPlaceholder: "Search platforms…",
    suggestedHeading: "Common for your business type",
    restHeading: "More platforms",
    noMatches: "No platform matches that. Pick “Other” and type the name — that's how I decide what to build next.",
    otherLabel: "Other software name",
    otherPlaceholder: "What's it called?",
  },

  connect: {
    /** `{platform}` is replaced with the selected platform's name. */
    heading: "Connect {platform} to Fynd",
    body: "To automatically send review requests when you finish an appointment, Fynd needs to see when an appointment is marked complete in {platform}.",
    oauthCta: "Connect {platform}",
    oauthNote: "Opens {platform}. You sign in there — Fynd never sees your password.",

    inviteHeading: "Add Fynd as a staff user",
    inviteBody: "{platform} doesn't offer a one-click connection yet, so the safest route is a limited staff login you control and can remove at any time.",
    inviteSteps: [
      "Open your {platform} account and go to your staff or team settings.",
      "Invite {email} as a staff member.",
    ],
    inviteConfirm: "I've sent the invite",
    inviteNote: "I'll confirm by email once it lands, usually the same day.",

    manualHeading: "Tell me how you track finished appointments",
    manualBody: "No integration to connect yet — so tell me how you know a customer's appointment is done, and I'll build the trigger around it.",
    manualPlaceholder: "e.g. paper appointment book, a spreadsheet, texts, my own notes…",

    /**
     * The second access ask, and the one people forget. It is deliberately
     * NOT a step they can action here — the invite is emailed — so it reads as
     * "what lands in your inbox next", not as another thing to do right now.
     */
    gbpHeading: "Next: access to your Google Business Profile",
    gbpBody:
      "I'll email you a link to a secure portal where you grant Fynd access to manage your Google Business Profile. That access is what lets Fynd send review requests on your behalf, so requests can't start going out until you accept it.",

    security:
      "Fynd only ever asks for read access to appointments. It never sees card details and never charges your customers.",
  },

  submit: {
    next: "Continue",
    back: "Back",
    finish: "Finish setup",
    sending: "Saving…",
    error: "Something went wrong saving that. Try again — and if it keeps failing, just reply to my text.",
  },

  done: {
    heading: "That's everything.",
    body: "I've got what I need and I'll start building. Watch your inbox — I'm sending a link to grant Fynd access to your Google Business Profile, and that's the last thing standing between you and review requests going out.",
  },

  /** Error copy. Field-level, shown on submit of the step, not per keystroke. */
  errors: {
    ownerName: "Please add the owner's name.",
    businessName: "Please add your business name.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
    businessType: "Pick the closest one — it only affects the next list.",
    platform: "Pick your booking software, or choose “Other”.",
    otherPlatform: "Type the name of the software you use.",
  },
} as const;
