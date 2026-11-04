<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:fynd-project-rules -->

# Fynd

Marketing site for Fynd — a platform that helps small businesses get Google reviews
and get found across search, maps, directories, and AI search.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS v4 · lucide-react.

## Design system

`design.md` in the repo root is the **source of truth** for brand, color, type,
components, and layout. Do not introduce colors, fonts, radii, shadows, or
component patterns that aren't defined there.

Tokens live in `src/app/globals.css` under `@theme`. Tailwind v4 is CSS-first —
there is no `tailwind.config.js`. The `design.md` Tailwind snippet is v3-shaped;
the `@theme` block is the translated, authoritative version.

Key conventions:
- **Body copy is Medium (500)**, not Regular. Regular is for small/caption text only.
- Headlines split across two lines with the payoff word in Fynd Green
  (`SplitHeading`, or the `line1`/`line2` props on `Hero` / `CtaCloser`).
- Green and orange fail contrast on white for small text. For green text on
  white use `#0F8F6E` (`text-fynd-green-text`). Never use red — orange covers errors.
- Icons: outline only, 1.75–2px stroke, colored by domain. Lucide is the base set.
- One background texture per section, never two stacked.
- Chart series order is fixed: blue → green → orange → navy.

## Where things live

- `src/lib/brand.ts` — canonical copy, colors, the four pillars, nav config.
  Import strings from here rather than retyping them.
- `src/lib/utils.ts` — `cn()`. Note it uses `extendTailwindMerge` to register the
  custom named font sizes (`text-body`, `text-h3`, …). Without that registration
  tailwind-merge reads them as color classes and silently strips `text-white`.
  **Add any new named font size to that list.**
- `src/components/brand/` — logo mark, wordmark, lockup.
- `src/components/ui/` — Button, Card, Layout (Container/Section/Eyebrow), DataViz.
- `src/components/textures/` — dot grid, topographic lines, dotted world map, gradient block.
- `src/components/sections/` — the reusable signature page blocks from design.md §10.
- `src/components/site/` — Nav and Footer.

Hero map pins are positioned as percentages in an overlay layer and only render
at `lg` and up: below that the hero stacks and there is no band clear of the text.


## Funnel pages — /start and /call

Built from `review-system-landing-pages.md` (the build spec). Two pages, ~85%
shared; the only structural difference is the conversion module: Stripe checkout
on `/start`, GHL calendar on `/call`. Mobile at 390px is the primary target —
the links get texted to a prospect who is still on the phone.

- **All copy lives in `src/content/copy.ts`.** Never inline strings in JSX —
  headlines get rewritten and A/B tested without touching components.
- **Testimonials are real quotes only** (`src/content/testimonials.ts`). Slots
  with `quote: null` render nothing. Never invent a testimonial, name, business,
  town, or before/after stat.
- **Urgency must be true** (spec §5). The deadline comes from the `exp` query
  param; missing/past/garbage falls back to the cohort date in `copy.ts`. Never
  build a session-based countdown that resets, fake viewer counts, or a timer
  whose expiry doesn't change anything.
- **Both pages are `noindex, nofollow`** — the pricing differs from the public
  site.

Stripe Checkout is live in `src/lib/stripe.ts`: full price up front, extended
first period. The customer pays $97 at checkout and that payment carries them
to the next billing day — the 1st or the 15th, whichever falls first on or
after one month from signup (`src/lib/billing-anchor.ts`). First periods run
28–46 days and **nothing is prorated in either direction**; the extra days are
given away deliberately in exchange for collecting a whole month on day one.

This is **two operations, not one**:

1. A `payment` mode Checkout Session collects $97 and saves the card
   (`setup_future_usage: "off_session"`).
2. `ensureSubscription` creates the subscription against that saved card, with
   a trial running to the anchor.

Subscription mode was tried and rejected on wording — it can only produce this
shape via a trial, and Checkout then derives "Try …", "N days free" and "Pay
and start trial" from it, none of which can be overridden and "free" is untrue
when $97 was just taken. (`billing_cycle_anchor` cannot do it at all: Stripe
refuses `proration_behavior: "none"` in a session carrying a one-time price.)

Splitting it opens a window where a customer has paid and has no
subscription, so `ensureSubscription` is called from **both** the
`checkout.session.completed` webhook (`src/app/api/stripe/webhook/route.ts`)
and the `/start/welcome` success page. Either can win. It is idempotent twice
over: it looks for a subscription already tagged `checkout_session_id`, and
the create carries an idempotency key. **Never make it non-idempotent** — the
two callers race on every normal checkout.

The webhook returns 500 on failure *on purpose*, so Stripe retries; that retry
is what rescues a paid customer whose subscription did not get made. It needs
`STRIPE_WEBHOOK_SECRET`; without it the route 503s and the success page is the
only thing creating subscriptions.

### Permanent payment links — /offer/<slug>

Stripe Checkout URLs die after 24 hours, so links texted to leads point at
`/offer/<slug>` instead (`src/app/offer/[slug]/route.ts`). Each visit mints
a fresh session and 303s to Stripe. The offers are a table in
`src/lib/offers.ts`; a new deal is one line there plus its link-preview text
in `offerLinks` in `copy.ts`.

- `billing: "now"` reuses `createCheckoutSession` unchanged.
- `billing: "deferred"` is a **setup-mode** session: no charge, card saved.
  `ensureSubscription` then creates the subscription with a trial to the
  start date and adds the one-time charge as an invoice item **on that
  subscription, created after it** (a trialing subscription issues a $0
  invoice at creation and would sweep up an earlier item, charging it today).
  The session expires an hour before the start date; after that the link
  sends people to the plan's public page.
- Backing out of ANY checkout returns to the plain page it came from, with
  no `?cancelled` note and no `?plan` tab switch (Luke, Nov 3, 2026: no
  "still deciding? book a call" after the back button). The note and the
  flag are gone from the code; don't add them back.
- Link-preview crawlers (iMessage, WhatsApp, Slack) get a static OG card and
  never mint a session or fire `checkout_started`.

The recurring product's Stripe **description** carries the standing billing
policy and renders in the order summary. It lives in the Stripe Dashboard, not
in this repo.

### One-time products — /optimize ($99)

`/optimize` sells a one-off Google Business Profile optimization. It is a
different billing shape from everything above: **one `payment` mode session,
card not saved, and no subscription afterwards.** `createOneTimeCheckoutSession`
in `src/lib/stripe.ts` builds it, and the product table there (`ONE_TIME`)
holds the second one-off too: **`website-build`, the $249 website on its
own** (Luke, Nov 3, 2026), sold at `fynnd.co/offer/website` (the `website`
offer is now `billing: "one-time"`, no plan; the Website + Reviews plan is
still the /website page's own button and the `nov1` link), tagged
`fynd-website-paid`. It has no thanks page yet (Luke): success lands back
on /manage and only the webhook records the customer. Copy is `optimize` in `copy.ts`; the drawn
profile card is fictional and labelled "Example" — never swap in a client's
without permission.

- Sessions carry `billing: "one-time"` and `product`, **not `plan`**.
  `ensureSubscription` checks for that first and returns `none`. Without
  that guard a one-time session has no `plan`, falls back to the review
  system, and gets a $97/month subscription hung on a $99 purchase. Keep
  the guard ahead of `readBilling`.
- Success goes to `/optimize/thanks`, not `/start/welcome` (which opens the
  subscription onboarding form). The webhook and the thanks page both write
  the contact to GHL with tag `fynd-gbp-paid` and **no** pipeline card.
- `OneTimeProduct` is a separate type from `Plan` in `stripe-plans.ts` on
  purpose; `CheckoutButton` accepts either (`Purchasable`).

### Full management — /manage ($297/month, plan `gbp-management`)

`/manage` sells the monthly service that keeps the profile the way the $99
leaves it, reviews included. **What the page says the service does comes
from the white-labelled platform behind it** (Merchynt's Paige,
merchynt.com/paige) — don't add a deliverable that platform doesn't list
(it does not do Q&A or hours upkeep, and guarantees nothing). Review
requests are by text only; the price is per profile.

Billing is **same-day monthly**, not the review system's anchored shape
(Luke, Nov 3, 2026, to match the page's "charged today, then on the same
day each month"): the plan `gbp-management` carries `billing: "same-day"`
in the `PLANS` table, and `createCheckoutSession` hands it to
`createSameDayCheckoutSession` — a subscription-mode Checkout on the
$297 recurring price (`MANAGE_PRICE_ID`, product "Fynd Profile
Management", whose Stripe description is the same-day policy) with no
trial, so Stripe takes $297 today, creates the subscription itself and
renews on this day monthly. `ensureSubscription` sees `mode:
"subscription"` and only tags the subscription with the session id. It
lands on **/manage/welcome**, not /start/welcome (the review onboarding
form does not apply). The webhook tags the GHL contact
`fynd-manage-paid` and still opens the onboarding card. `/offer/manage` is the permanent link. Copy is `manage` in
`copy.ts`; sections live in `src/components/sections/manage/`. **The
page is Paige's own sales page rebuilt in Fynd's branding, section for
section and in its order** (Luke, Nov 2, 2026: "basically copy the
paige page and put the fynd branding on it") — keep new sections in
that shape rather than inventing a layout. Its illustrations (the
"new customer" call, the channel ring, the sample report, the website
browser) are drawn and fictional; the report carries Paige's own
"numbers are illustrative" caption. What it leaves out on purpose is
Paige's customer results, testimonials and vendor stats (not Fynd's to
claim; the one exception is the real salon heatmap pair in the sample
report, credited in the caption to "the platform full management
runs on"), the citations add-on, and anything agency- or
platform-revealing — see the note on `manage` in `copy.ts` and
`progress.md` before adding a section back. The $99 one-off is linked
from the price card and the closer; `/optimize`'s managed
section links here.

### Free trial — /watch (plan `review-trial`)

`/watch` sells one thing: the Review System free for `offer.trialDays`
(7) days, then $97/month. No website plan, no $197-to-$97 strikethrough,
no offer clock on that page. **The page carries /manage's argument for
reviews only, in its own format** (Luke, Nov 3, 2026): the copy is
`watch` in `copy.ts`, section for section the shape of `manage`'s, and
the components are the page's own in `src/components/sections/review/`
(`WatchHowItWorks`, `WatchTrialTimeline`, `WatchProof`,
`WatchFeatureGrid`, plus the homepage's `ObjectionFaq` and `FinalCta`).
The one /manage component on it is `ManagePricing`, because Luke asked
for that card. (The /manage sections also take a `copy` and `tone` —
the first design, commit `a59f45e`, used them; defaults keep /manage as
it was.) Keep every claim one the homepage FAQ or feature list already
makes; the numbers panel's figures are documented on
`watch.judge.numbers`. The card's button posts `review-trial` — a
`TrialPlan`, kept apart from `Plan` because every `Plan` charges a month
up front.

**Billing is the one SUBSCRIPTION-mode checkout on the site**
(`createTrialCheckoutSession`; `billing: "trial"` in `offers.ts`;
`/offer/trial` is the permanent link and the /watch button mints the
same session). Checkout saves the card and creates the subscription
itself on the trial's own $97 price (`TRIAL_PRICE_ID`, product "Fynd
Review System", whose Stripe description carries the trial wording;
the shared "Fynd" product's description is the 1st/15th policy and
would print here otherwise) with `trial_period_days: 7`; Stripe
charges $97 when the trial ends and on that day each month after. No
billing anchor, no first invoice, no `ensureSubscription` create: that
function sees `mode: "subscription"`, tags the subscription with the
session id once (so the webhook's `checkout_completed` fires once) and
returns. Subscription mode is right here because "7 days free" is
true; it stays wrong for the paid-first-period plans. Never route
`review-trial` into `createCheckoutSession`.

### Stageshow demos

`src/components/stageshow/kit/` is the stageshow skill's kit, vendored
as-is (ESLint ignores it); `fynd.css` beside it is Fynd's look for it.
Demos are built with the `/stageshow` skill (`~/.claude/skills/stageshow`)
and filmed with its `scripts/film.mjs` against the dev server; each demo
keeps a `REHEARSAL.md` beside it. The first is `WatchJudgeDemo` on /watch.
Every studio and figure in a demo is fictional and captioned as such.

`src/lib/ghl.ts` is still stubbed and marked `TODO(integration)`. See
`progress.md` for the full state.

### Traps worth knowing

- `--text-muted` (#8A93A6) **fails WCAG AA** on white (3.09:1) and Fynd Gray
  (2.80:1). Use `text-ink-soft` (#5A6478) for anything readable. Fynd Green and
  Fynd Orange have the same problem as small text on white.
- Scroll reveals (`Reveal`, `.js-reveal`) are progressive enhancement: markup
  renders visible, the hidden start state sits behind
  `@media (scripting: enabled)`. Don't swap in a motion library that SSRs
  `opacity: 0` — it breaks the no-JS requirement and causes hydration mismatches.
- Deadline strings are formatted in a fixed timezone (`offer.timeZone`) so the
  server and client agree.

<!-- END:fynd-project-rules -->
