# Progress — Fynd

## Done

### Project setup
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react.
`design.md` translated into a working design system: tokens in `src/app/globals.css`
under `@theme`, Poppins via `next/font`, brand/logo components, UI primitives,
data-viz components, textures, and the signature page blocks from design.md §10.
Marketing home page at `/` assembles them as a reference.

### Funnel pages — `/start` and `/call`
Built from `review-system-landing-pages.md`. ~85% shared; the only structural
difference is the conversion module (§3.7).

Decisions taken with Luke:
- **Fynd tokens**, not the spec's §2 palette. The spec says to skip §2 when brand
  tokens already exist. Mapping: ink→Navy, mist→Fynd Gray, star→Fynd Green,
  action→Fynd Blue, alert→Fynd Orange. Poppins throughout (no IBM Plex).
- **"Fynd"** as the name in copy, footer, and metadata (not Grady Digital).
- **Pages + stubs**: pages complete; Stripe/GHL behind typed boundaries.

Design direction: *proof-led artifacts*. The generic three-card "how it works"
was replaced with the actual objects — a drawn phone showing the real SMS, the
routing fork as a diagram, Google profile cards, a rank table. Specificity is
what stops it reading as templated.

Both pages verified at 390px and 1280px.

### Section order — now DIFFERENT per page, on purpose

The two pages previously shared one order. That was the main thing wrong with
them. They were built with a cold-traffic structure (modelled on a competitor
page that runs Google Ads) but they serve warm traffic — the link gets texted
to someone who just got off the phone with Luke. The ask sat at section 14 of
18, roughly 8,700px down.

Commitment level differs, so the ordering does too:

**/call** — booking is low-commitment, so the calendar comes almost immediately.
Ask at ~908px (1.1 screens on a 390px phone).

  Hero -> TrustBar -> **Calendar** -> Mechanism -> Problem -> Features ->
  QuickWins -> Demo -> Proof -> Fit -> Pricing -> WhyReviews -> ROI ->
  CaseStudies -> Testimonials -> Compliance -> FAQ -> FinalCta

**/start** — paying is higher-commitment, so it earns one beat of build-up (the
mechanism, showing what they are buying). Ask at ~2,728px (3.2 screens).

  Hero -> TrustBar -> Mechanism -> **Checkout** -> Features -> QuickWins ->
  Demo -> Proof -> Fit -> Pricing -> Problem -> WhyReviews -> ROI ->
  CaseStudies -> Testimonials -> Compliance -> FAQ -> FinalCta

Everything below the ask is the long tail for whoever is still hesitating.
Nothing was deleted — it was resequenced.

### Other conversion fixes

- **Hero copy is per-page.** The headline and CTA have to rhyme. /call now
  sells the CALL ("See where your rating actually stands" / "Pick a time to
  talk"), not the product. Previously both pages promised the product outcome
  and then asked for a meeting.
- **One primary CTA in the hero.** There were two of equal weight, and the
  second ("Watch the 2-min demo") led to a placeholder that did not play.
- **The demo section returns null when NEXT_PUBLIC_VSL_EMBED_ID is unset.** A
  play button that does nothing breaks a promise mid-page.
- **The proof section was reframed** from a results claim badged "Example" to a
  dashboard illustration labelled "Sample". Three proof slots render nothing;
  having the fourth announce itself as fiction was worse than omitting it.
- **/call gained a "what the fifteen minutes actually is" block** above the
  calendar. The fear on a booking page is that it will be a pitch; naming the
  agenda is the cheapest friction removal available.

### Permanent payment links — `/offer/<slug>`

Replaces sending raw Stripe Checkout URLs, which expire after 24 hours.
Four links, each minting a fresh session on tap:

- `/offer/website` — Website + Reviews, $249 today, then $97/month.
- `/offer/reviews` — Review System, $97 today, then $97/month.
- `/offer/nov1` — Website + Reviews, nothing today. Setup-mode checkout
  saves the card; the subscription is created at once, trialing to
  November 1. Exactly the /website checkout with the charge moved: a draft
  $249 invoice finalizes itself on November 1 and charges the saved card,
  and the $97 subscription trials to December 1. Dry-run against live
  Stripe on a throwaway customer (deleted): invoice and subscription come
  out as intended. Stops minting at 11pm ET on October 31.
- `/offer/nov13` — Review System, nothing today. Same deferred shape as
  `/offer/nov1` on the $97 plan: a draft $97 invoice charges the saved card
  on November 13, and the $97 subscription trials to December 15 (the
  billing day a November 13 checkout would get). Stops minting at 11pm ET
  on November 12.

`?cid=` passes through to Stripe metadata. Verified locally against live
Stripe: all three redirect, the session wording and metadata are right, and
the test sessions were expired. Not yet exercised: a completed setup-mode
checkout creating the subscription and invoice item (needs a real card).

### Profile optimization — `/optimize` ($99 once)

A one-time Google Business Profile clean-up, as its own page. The page's
shape is the pitch (Luke's brief, revised Nov 2, 2026): the problem as a
picture, then the full list of **what** to update with why Google cares —
deliberately **not what to write** in any of it — a typical profile beside
an optimized one, then "want us to do it? $99, once", and a **separate**
ask for whoever wants it managed monthly. The list is the free value; the
writing is what's for sale. An earlier cut gave three fixes in full with
worked examples; Luke pulled it because the examples were the "what to
put". Aimed at salons and barbershops (example business, copy, meta).
**Nothing on the page mentions reviews or replying to them** (Luke, Nov 2,
2026: the Review System already does that) — no checklist item, no review
row on the drawn profile, no "will it get me more reviews" FAQ. The
rating line stays on the drawn profile because a Google panel without one
looks fake.

  Hero (phone showing the drawn "typical" profile, orange dots; the button
  says "Learn how" and scrolls to the checklist at `#how`, not the
  checkout — Luke, Nov 2, 2026) -> how Google ranks, three cards
  (`RankingFactors`: relevance, distance, prominence, with distance drawn
  muted as the one you can't change) -> fourteen things to update, in four
  gray panels ("Who you are", "What you offer", "Signs you're open", "Links
  and details"), numbered straight through, with why (`UpdateChecklist`)
  -> typical beside optimized -> $99 card at `#convert` with a three-step
  "how it works" row under it (pay, add us as a manager, done in five
  business days) -> FAQ -> why kept-up beats filled-in at `#ongoing`
  (`WhyOngoing`, "Keep it optimized every month.": three "what goes
  stale" cards, then the $99 beside the
  $297 as one table, then "Interested in our monthly Google Business
  Profile management plan?" over a "Learn more" button to /manage; the
  hero's quiet link and the $99 card's hand-off both land here) ->
  closer. It moved below the FAQ on Nov 3, 2026 (Luke), so the one-off's
  own case is finished before the monthly plan is raised. The separate
  managed-plan ask ("Rather not think about it at all?", with the
  book-a-call line) came out the same day; the "Learn more" button is
  the only ask for the monthly plan.

  The `#ongoing` table's right-hand column is only what the platform does
  (no Q&A, no hours upkeep); it says the subscription starts with the same
  optimization as the $99. Reviews are mentioned in this section only, as
  the service's own deliverable (Luke, Nov 3, 2026:
  "teach them why our GBP management service is worth it").

  Nov 3, 2026 (Luke: "more value, cleaner"): the ranking section, the
  grouped checklist and the steps row were added, and the FAQ was
  replaced — it had been `manage`'s FAQ verbatim ($297, website, AI
  search, autopilot posting), which contradicted the $99 one-off. The
  new `optimize.faq` is ten questions about the one-off only; its last
  answer is the page's one FAQ mention of full management.

- **Mobile is the primary target and anything compared is side by side
  there** (Luke, Nov 3, 2026: "super important"). Below md the
  typical/optimized section swaps the two drawn cards for a real
  three-column table (`compare.rows` in copy.ts: narrow label column,
  then typical and optimized) so both states are on one screen; the
  once-vs-monthly table at `#ongoing` is one `<table>` at every width
  with tighter cells and a narrower label column on phones. Both are
  proper tables on purpose: a first pass put the row label on its own
  line above two cells, and Luke sent both back because the coloured
  column broke into floating chunks between labels. The three ranking
  cards are rows (icon beside text) on phones. The closer's button says
  "Fix my profile" (no price); the sticky pill keeps the $99.
- **The profile is drawn, not a screenshot** (`GoogleProfile.tsx`, one
  component in two states, drawn as the mobile Google panel: photo strip,
  name and rating, round Call/Directions/Website buttons, then the stacked
  rows). Typical rows show Google's own empty states with orange dots on
  each gap. The hero puts the compact card inside a phone under a Google
  search bar, cropped at the bottom with a navy fade (design.md's
  "screenshot floated right with a soft blue glow"), with one tag on the
  bezel counting the gaps. Fictional business, same rating and review count in both states on
  purpose — optimization fixes the profile, not the review count; reviews
  are the monthly plan. Every instance carries an "Example" chip. Do not
  replace it with a client's profile without permission. `ReviewBody`,
  `Chip` and `Stars` are exported for any section that needs to draw a
  piece of the profile.
- **Billing is a different shape**: one `payment` session, card not saved,
  nothing recurring (`createOneTimeCheckoutSession`). `ensureSubscription`
  returns `none` for these — see the AGENTS.md note on why that guard is
  load-bearing. Success is `/optimize/thanks`; the webhook and the thanks
  page both tag the GHL contact `fynd-gbp-paid`, with no pipeline card
  (the onboarding pipeline is the subscription's). A GHL workflow on that
  tag should send the "add Fynd as a manager" steps — **not built, and
  Luke deferred it (Nov 2, 2026).** Until then each paid customer has to
  be emailed the steps by hand. The page and the thanks page no longer
  mention a receipt email; they say Fynd reaches out within a day.
- Verified against live Stripe: a minted session had mode `payment`, $99,
  no `setup_future_usage`, the one-time metadata and the right URLs; it was
  expired afterwards. Not exercised: a completed payment (needs a card).
- Indexable, like `/website`. The thanks page is `noindex`.

### Full management — `/manage` (monthly, reviews included)

Built Nov 2, 2026 as the sibling of `/optimize`: the service that keeps the
profile the way the $99 leaves it. Salon/barber copy like `/optimize`.
**Every subscription starts with the one-time optimization** (Luke, Nov 3,
2026), and the page says so in four places: first-month step two
("Optimization first"), the price card's included line and first check,
the "What's included" FAQ answer, a "Do I still need the $99
optimization?" FAQ (no, it's included; an existing $99 profile gets checked
over), and the welcome page's second step.
**$297/month per profile, no contract, review requests by text only**
(Luke). The service is Merchynt's Paige, white-labelled; Luke: "everything
it says on that page is what we are doing". The page's deliverables were
taken from merchynt.com/paige on Nov 2, 2026: profile optimization at
setup, website built or tuned, baseline Maps heatmap + AI-visibility
check, daily review replies and requests, negative reviews flagged, weekly
Google post shared to Facebook/Instagram/LinkedIn, geotagged photo drip
from owner's photos, weekly progress update, monthly short videos to
YouTube/TikTok, strategy vs competitors, monthly report (Maps rankings,
calls/directions, AI recommendations), autopilot or approve-first, ~20-min
setup, work within one business day. Deliberately NOT claimed because
Paige doesn't: Q&A, hours/holiday upkeep, any ranking guarantee.

**The ask is the checkout** (Luke: straight to checkout, not a call).
Plan `gbp-management` in `stripe-plans.ts`/`stripe.ts`: the review
system's billing shape ($297 today to the anchor, then $297/month) on a
new live price created Nov 2, 2026 — product `prod_VYZPspD1a8m69f` "Fynd
Profile Management", price `price_1UXSGn3sJGpur4VmLI0FgTYY` (env override
`STRIPE_PRICE_MANAGE_297`). Lands on `/manage/welcome` (steps only, no
form; `ensureSubscription` backstop like /start/welcome). Webhook tags
`fynd-manage-paid` and opens the onboarding card. `/offer/manage` exists.
Verified against live Stripe: a minted session had mode `payment`,
$297.00, plan metadata, the /manage/welcome success URL and
/manage?cancelled=1 cancel URL; expired afterwards. Not exercised: a
completed payment. The `/optimize` managed section links here.

**Rebuilt as a copy of the Paige page in Fynd branding (Nov 2, 2026,
Luke: "basically copy the paige page from merchynt and put the fynd
branding on it").** Same section order and layout as merchynt.com/paige,
Fynd tokens throughout: navy hero (Luke: keep Fynd's dark style, not
Paige's white) in the shape of the Paige hero he sent — badge, "Get
found by customers / in your area on / <channel>" with the channel
cycling as its logo and name in the brand's own styling, as on Paige
(Luke asked for it to match): Google's letter colours, the Maps pin,
the Google G, the AI Mode gradient glass, the Gemini gradient star and
gradient text, Claude's orange mark in serif, OpenAI's knot in white,
Perplexity's mark (`RotatingChannel` + `ChannelLogos.tsx`; marks
redrawn as inline SVG from the public logos; letters rise in one by
one via `.rot-ch` / `.rot-logo` keyframes in globals.css; first
channel in the markup, no cycling under reduced motion), then the paragraph, three checks and the button
on the left and a drawn search result on the right: the query, "Your
business" first with a Call button, Competitor A and B under it, "New
customer calling…" (`ManageHero`; the bar sits in its row, raised with a shadow and slight scale, and rings every 7s; the "Illustration" caption came off Nov 3, 2026) -> "built for busy owners": the owner's card (blue /
orange left rules) beside our to-do list with the nested "if we ever
need you" card, three stat tiles, button (`BusyOwners`) -> "Your
business. Everywhere.": the navy panel redrawn to match Paige's (Luke,
Nov 2, 2026): the business card in the middle (Paige's storefront
drawing with the awning in Fynd Blue, a "Booked!" slip, a "+12 new
customers / and counting" count, the Fynd team pill), eleven channels
on a ring as their real marks on pale tiles (Google G, Maps pin,
YouTube, ChatGPT, Claude, Gemini, Facebook, Instagram, TikTok,
LinkedIn, website), small pulsing packets on the spokes and "Illustrative activity"
under it (the legend was removed at Luke's request). Ring radius is a CSS variable
per breakpoint; phones get the card then the tiles in rows. The
count and booking are made up — labelled illustrative, and the
screen-reader text says so (`Everywhere`, `ChannelLogos.tsx`) -> the first
month in three steps on a horizontal rail (`FirstMonth`) -> what to
judge in week one vs 30–90 days, two top-edged cards, then the sample
monthly report (three counts, two 5x5 numbered maps day 1 / day 90,
work done, AI line) with Paige's own caption "Sample monthly report for
a made-up business. Numbers are illustrative, not results."
(`JudgeReport`, grey) -> the math as one white card with cost bars drawn
from the amounts (`TheMath`) -> "already paying for tools?": navy total
card + the tools table with struck prices and an "Only with Fynd" row
for the account manager (`ToolsReplaced`, `#tools`) -> the website on
navy with the browser + phone mock, "built while you set up" badge, the
edit-request chip, and the two option cards (`WebsiteSection`) -> "Every
day you wait, a competitor gets the call." with the $297 card at
`#convert` (`ManagePricing`, `CheckoutButton`; no location stepper —
checkout is one profile, the card says each profile is $297) -> every
feature as one open table with a navy header (`FeatureTable`, 58) ->
numbered FAQ beside a sticky heading (`ManageFaq`, 18) -> closer with
the Fynd mark above "Stop managing your Google profile. Start answering
the phone." (`ManageCloser`; Luke didn't want Paige's "Give it one
month" line or the orb). Shared `ScrollButton` and `CallLink` in
`sections/manage/`. Header is dark (navy hero). Removed in the
rebuild: MonthPlan, ReviewLoop (the SMS phone), Beyond, FirstNinety,
RankReport, FeatureIndex, WebsiteCta, WaysCompare (the DIY / $99 /
managed table — the $99 link now lives in the hero, the price card and
the closer). **Every section is navy and the cards are dark too** (Luke, Nov 2,
2026: first "make the background dark like the other pages and keep the
card parts white", then "actually convert the cards too"): cards are
`bg-navy-card ring-1 ring-white/10`, white text, `white/70` secondary,
`#8FA0FF` for small blue text. Only the drawn mocks stay white — the
hero search result, the business card in the channel ring, the sample
monthly report and the website browser — because they are pictures of
light UI, as on Paige. Checked at 1280 and
390 (no horizontal scroll).

**Phone pass (Luke, Nov 2, 2026: "most people viewing this will be on
their phone").** The page at 390px went from ~28,000px to ~21,000px:
the feature table is a closed `<details>` per group below md (the
table itself is md and up), the three stat tiles and the report's
three counts sit three across instead of stacked, the math bars drop
their in-bar labels for a line underneath, the report letterhead
stacks, and nothing wraps mid-number. The hero lost its "Book a call
first" link; the only quiet link is now "Just want it optimized once?
Check it out here" to /optimize (Luke).

**Onboarding after payment is not built:** the welcome page promises an
email within a day with the link to connect Google (the Paige white-label
connect flow). Nothing sends it — same gap as the $99's manager-access
email; a GHL workflow on `fynd-manage-paid` would do it. Still Claude's
wording to check: "30 to 90 days".

**Commitments written by Claude, not agreed policy** (all in `optimize` in
`copy.ts`): "five business days", "manager access, never your password",
"a short list of what we're changing before we start" (there is **no
report** for the one-off: Luke, Nov 3, 2026, and the page says so on the
$99 card, the steps, the table and the thanks page), the fourteen "why" lines in the checklist (including the
salon-specific claims), and in the FAQ (Nov 3, 2026): "about ten minutes
of questions", "we'll tell you which shots would help most", "we don't
put stock photos on a salon's profile", "$99 per location", and "you can
change any of it afterwards". The ranking section's three factors are
Google's own (relevance, distance, prominence) and safe to keep. Edit
before sending anyone the link.
No `/offer/<slug>` link exists for it yet; one is a line in `offers.ts` if
the table grows a one-time shape.

**The first-month rail is scroll-driven** (Luke, Nov 3, 2026):
`ProgressRail.tsx` grows the coloured line from the first dot to the last
as the steps list moves up the viewport (0 when its top is at 85% of the
viewport, 1 when its bottom passes the middle) and fills each dot as the
line reaches it. Without JavaScript it is the old static state: first
dot filled, line a third across. The "Not ready? Book a call first" link
under the steps came off the same day.

**The sample report's two maps are real** (Luke, Nov 3, 2026: "take one
of the heatmaps from paige site"): the salon before/after pair from the
platform's results page, saved as `public/images/heatmap-salon-before.webp`
and `-after.webp`, named as the platform's in the caption and
screen-reader text (no tag on the report itself). They are a vendor
customer's results, not Fynd's own, which is why the caption says "on the
platform full management runs on" rather than claiming them. The drawn
5x5 grid they replaced is gone from `JudgeReport.tsx`.

**The website is a $249 one-time add-on, not part of the $297** (Luke,
Nov 3, 2026: "we aren't going to make the website for free"). The website
section moved from before the price card to just above the FAQ, its
badge, heading, body and option pills say $249 one time, and the "What's
included", "Does it come with a website?" and "Can I keep my current
website?" FAQ answers, the tools-replaced row, the feature-table row and
the /optimize comparison table all say so. Hosting, widgets and the scan
of an existing site are still in the plan, but **keeping an existing site
is now the discouraged path** (Luke, Nov 3, 2026: the section's job is to
move people onto our site): option 2 is drawn muted with a "Not
recommended" pill, its items are the drawbacks with orange marks, and a
note says "Our advice: switch"; the "Already have a website?" block and
both website FAQ answers steer the same way. Nothing charges the $249 yet
(no product or checkout for it).

### VSL page — `/watch`

The link to text a lead who has not been on a call yet. Now the same shape
as the homepage and `/website`: the video as the hero, what owners say, a
**plan picker** at `#convert`, the FAQ, the closer. Every "Start now" (hero,
video end-card, closer, sticky pill) scrolls to the picker; "Book a Demo"
opens `/demo` in a new tab as everywhere else. The calendar column that used
to be the only ask is gone from the page (`BookDemo.tsx` and `watch.book`
are still in the tree if wanted back).

- **Plan picker** — `PlanChooser.tsx`: two tabs (Review System $97/mo,
  Website + Reviews $249 today) above one card. The cards are the same
  components the other pages render — `ReviewPlanCard` exported from
  `PricingSection.tsx`, `BundlePlanCard` from `BundlePricing.tsx` — so a
  price change shows up in all three places. Tabs rather than two stacked
  cards because at 390px two full cards are three screens of pricing.
  `?plan=` picks the opening tab; Stripe puts it on the cancel URL so someone
  who backed out of the $249 checkout lands on the $249 card. The navy tab
  fill is one element that slides between the cells (300ms, slight
  overshoot) and the card rises in on each switch (`fynd-panel`, motion-safe
  only). Both cards stay mounted in one grid cell — the one not showing is
  `invisible` + `inert` — so the module is always the taller card's height
  and the page never jumps; each card is a flex column with the list
  absorbing the spare height, so the button sits at the same spot on both.
- **Cancel path** — `CheckoutButton` takes `cancelPath`, validated at
  `/api/checkout` against `CANCEL_PATHS` in `stripe-plans.ts` (only
  `/watch` today), so a backed-out checkout from this page returns here
  rather than to `/` or `/website`.

- **Video is self-hosted** — `public/fynd-split-vsl-vo-web_4.mp4` (1920x1080,
  47.1s, 7.0MB, voiceover) played through a native `<video>` in
  `src/components/sections/review/VslPlayer.tsx`. No YouTube script, no
  iframe. `preload="metadata"` so the file costs nothing until play; the
  poster is `public/fynd-split-vsl-poster.jpg`, a 1280x720 title card of the
  logo lockup on navy-card, composed with PIL from `transparent-fynd.PNG`
  and Poppins Bold (Luke asked for the logo rather than a video frame). The
  lockup sits at 42% height and the play control at 68%, so they never
  overlap. **Autoplays muted** on load (browsers allow nothing louder
  without a gesture) with a "Turn sound on" pill that restarts from 0 with
  audio; falls back to the poster + play button if even the muted start is
  blocked or the visitor prefers reduced motion. `vsl_play` and the
  quartiles only count once sound is on. `preload="auto"`, so the 11MB file
  downloads for every visitor now. Native controls after the sound-on press,
  and an end-card over the last frame with "Book a demo" + "Watch again".
  Fires the same `vsl_play` / `vsl_25|50|75` / `vsl_complete` events the
  YouTube player does. If the file is swapped, update `watch.video.duration`
  in `copy.ts` and re-cut the poster.
- **Testimonials read `src/content/testimonials.ts`** through a new
  `TestimonialBand` (the design.md §9 card in a 1/2/3 grid). The four real
  slots are still `quote: null`. While they are, the band falls back to
  `placeholderTestimonials` — six FICTIONAL quotes, names and businesses,
  added at Luke's request so the section could be looked at. Each carries
  `placeholder: true`, which renders an "Example" chip on the card and a
  note under the grid; the first real quote retires all of them. The type
  also gained an optional `rating` (1–5); the star row only renders when it
  is set. `testimonial-drafts.md` in the repo root has a draft quote per
  real client to text them for approval.
- **Calendar** sits beside the two people you'd be meeting (`BookDemo.tsx`,
  Keegan's idea from the Loom): a "Who you'll be talking to" column with one
  card — a photo of both, both names under a marker stroke, "Co-founders",
  one shared line — and the GHL calendar on the right, stacked on a phone.
  Data is `src/content/team.ts`. The photo is `/public/luke-keegan.png`
  (1195x1316, shown at its own proportions — a landscape crop takes the
  heads off; next/image serves a resized WebP). **The quote is Claude's
  draft** — replace with their own words.
  "Scribbly" is the existing green marker underline, not a handwriting font:
  design.md allows one typeface. `CalendarEmbed` is the bare iframe,
  exported from `CalendarModule.tsx` for this layout. Prefills from `?fn=`,
  `?phone=`, `?email=` like `/demo`; `?cid=` into analytics.
- `StickyCta` `showPrice` is off here, as on `/website`: two prices on the
  page, and naming either on the pill would misquote the other.
- `noindex, nofollow`, like `/start`.
- **NFC review card add-on** is commented out of the $97 card (`AddOn` in
  `PricingSection.tsx`, `pricing.addOn` in copy.ts) at Luke's request. The
  **offer clock** now also sits on the `/website` hero and the $249 card.

### Website + Reviews plan — `/website` ($249 once, then $97/mo)

Keegan asked for "a website refresh + reviews for 249", at the bottom of the
homepage and on its own page. Built as a second **plan**, not an add-on:

- **`/website`** — hero (the two halves as a pair of cards), a two-column
  "what's included" list, the $249 card at `#convert`, four questions, the
  closer. Indexable. Copy is `bundle` in `copy.ts`; the price is
  `offer.bundle.price`.
- **Homepage** — `BundleTeaser` sits between the FAQ and the closer, and the
  "Custom website" add-on card now links to `/website` (same tab) instead of
  the demo calendar.
- **Stripe** — `src/lib/stripe.ts` now has a `PLANS` table. Both plans use
  the same billing shape (a one-time charge at checkout that covers today
  through the anchor, then a subscription from the anchor). They differ only
  in the first charge: **$249 for the website plan, then the same $97/month
  recurring price as the reviews plan** — the site is paid once, the
  reviews recur. `plan` rides on the session metadata and
  `ensureSubscription` reads it back, so the webhook and the welcome page
  need no changes. The $249/month recurring price Luke created in the
  Dashboard (`price_1UExSS3sJGpur4VmhB0pLEyU`) is **unused** and can be
  archived.
- `CheckoutButton` was extracted from `PricingSection` and takes a `plan`.
  `ObjectionFaq` takes `heading`/`items`; `StickyCta` takes `price`.

**Assumptions to confirm with Keegan/Luke** (all in `bundle` in `copy.ts`):
The website scope list — mobile-first
rebuild on their domain, copy from one call, book-now wired to their
software, hosting/updates included, reviews shown on the site — and the
"live in about two weeks", "no design fee", "keep your domain" and "move up
from $97 later" answers are commitments written by Claude, not agreed
policy. Edit before sending anyone the link.

### Onboarding form — `/start/welcome`

Four steps: your details → business type → booking software → connect. Built in
React rather than embedded from GHL, because a GHL form can do neither of the
two things this flow is actually for: reordering its options off an earlier
answer, and handing off to a platform OAuth screen. (The v2 Forms API is also
read-only — forms can only be authored in the GHL UI.) Submissions still reach
GHL through the existing webhook in `src/lib/ghl.ts`.

- `src/content/onboarding.ts` — copy, the 17-platform roster, and the
  per-vertical priority order. Deliberately separate from
  `integrations.platforms` in `copy.ts`: that list is the marketing ring and
  needs a logo per entry, this one is the answer set and includes "Other" and
  "I don't use booking software".
- `src/lib/onboarding.ts` — ordering, search, and the zod schema shared by the
  client and the route handler.
- `src/app/api/onboarding/route.ts` — two payloads on one route, `profile` and
  `connect`.

Decisions worth keeping:

- **Business type is asked before the platform** purely to reorder the platform
  list. A barber sees Booksy first; a Pilates studio sees Mindbody and Mariana
  Tek. It reorders, it never filters — every platform stays reachable, and
  "Other"/"no software" are pinned last so they can't be promoted above a
  platform we support.
- **The profile is saved leaving step 3, before the connect step.** Someone who
  bounces off a consent screen is still a captured customer. Nothing about the
  submit is conditional on the connection working, and "I'll do this later" is
  always available.
- **No password is ever requested.** `oauth` where a public app is provisioned,
  otherwise a limited staff invite the owner creates and can revoke.
- **Errors are `text-ink` with an orange icon and border**, not orange text —
  Fynd Orange fails AA on white at 14px, and red is out per design.md.

### Onboarding writes — GHL v2 API, not the webhook

`src/lib/ghl-contacts.ts`. Onboarding was the first thing collecting data that
could not be reconstructed, and routing it through `notifyGhl` meant a customer
saw "That's everything." over a payload that went in the bin — the stub logs
only the event name, never the body. It now writes directly:

- `POST /contacts/upsert` — keyed on email, so a resubmit updates one record.
- `POST /opportunities/` — opens a card in **Fynd Onboarding**
  (`JusZQJ8z9ceJBLhaypFs`) in the Grady Digital sub-account
  (`irXA1fnhZypBkW6W0cwF`).
- The connect step upserts the status and moves the card: `skipped` →
  *Needs access* (chase these), anything else → *Access pending*.

The profile write is **not** best-effort — a failure returns 502/503 and the
form shows an error. The `notifyGhl` webhook still fires alongside it for
workflow triggers and stays best-effort. The connect write is best-effort in
both channels: the details are already saved by then.

Traps, both of which cost real debugging time:

- **Custom field keys are written WITHOUT the `contact.` prefix.** Reads report
  `contact.fynd_business_type`; writing that exact string returns 200 and is
  then silently ignored. Only the bare `fynd_business_type` lands. There is a
  tripwire in `upsertOnboardingContact` that logs loudly if a contact saves
  with zero custom fields.
- **Fields are TEXT, not dropdowns, on purpose.** A GHL picklist that drifted
  from the roster in `src/content/onboarding.ts` would 422 the upsert and lose
  the customer. Convert them in the UI only once the roster settles.

Needs `GHL_PIT`, `GHL_LOCATION_ID`, `GHL_ONBOARDING_PIPELINE_ID` and
`FYND_INVITE_EMAIL` (all in `.env.example`). The PIT is a secret — server-only,
never `NEXT_PUBLIC_`.

The connect step carries **two** access asks: the booking platform (actioned
there) and the Google Business Profile (emailed afterwards, `connect.gbpBody`).
The GBP notice renders on all three paths — it is unrelated to which platform
they picked. There is no skip link: the only way off step 4 is the confirm
button, so watch the *Form submitted* stage for people who stalled rather than
assuming everything there is a fresh arrival.

### Paid customers enter the pipeline at checkout, not at the form

`recordPaidCustomer` in `src/lib/ghl-contacts.ts`, called from the Stripe
webhook. Before this, a customer who paid and never opened the onboarding form
did not exist in GHL at all — the one person most worth chasing was invisible.
They now land in **Fynd Onboarding** at *Paid — form not started*
(`b72c1e1d-9d97-47ab-b37b-fe2ad6af2d22`), and the form advances that same card
to *Form submitted*.

- **Both entry points dedupe through `findOpportunity`.** Stripe delivers
  at-least-once and the success page races the webhook, so a second delivery
  must return the existing card, not open another. Verified: two deliveries
  returned identical contact and opportunity ids.
- **The GHL write is non-fatal in the webhook.** Stripe must not retry forever
  because GHL had a bad minute, and the subscription is already safe by then.
  Failures are logged with the session id and email so they can be replayed.

`Fynd Demo Calls` (`HvoBX365wwzJCATUViiu`) exists for website demo bookings —
Call booked / Showed / Pitched / Won / No-show / Lost. **Nothing writes to it
yet**: the booking happens inside the GHL calendar widget, so no app code runs.
It needs a GHL workflow (Appointment Booked -> create opportunity), and
workflows are UI-only — the API is list-only.

## Verified

| Check | Result |
|---|---|
| Lighthouse mobile — accessibility | **100** on `/start` and `/call` |
| Lighthouse mobile — best practices | **100** |
| Lighthouse mobile — SEO | 60 — expected, `noindex` is deliberate (§8) |
| LCP / CLS | 91 ms / 0.00 — **localhost, unthrottled**, not a 4G measurement |
| Renders with zero query params | yes |
| Renders with all query params | yes |
| `biz` XSS attempt (`<script>alert(1)</script>…`) | neutralized — tags stripped, capped at 40 chars, React escapes |
| `?exp=` in the past / garbage / negative | falls back to cohort deadline |
| Countdown negative | never — chip hides at expiry |
| Countdown resets on reload | can't — derived from `exp`, no session state |
| Copy readable with JS disabled | yes — zero inline `opacity:0` in SSR HTML |
| Checkout with no Stripe env | 503 + inline note pointing at `/call` |
| Invented testimonials | none — all four slots ship empty by design |
| Typecheck / lint / build | clean |
| ROI estimator math | verified: 40 jobs x 4.33 wk x 50% = 87/mo, 522 at six months |
| Illustrative figures labelled | every proof block carries an `Example` badge + plain-text disclaimer |
| Fabricated social proof | none — grep for "trusted by N"/"N businesses" returns nothing |
| Trust bar / case studies with no data | degrade to an honest line, or render nothing |

## Not done — needs credentials or content

These are the `TODO(integration)` markers in the codebase.

1. **Stripe** — `src/lib/stripe.ts`, `src/app/api/checkout/route.ts`,
   `src/app/api/stripe/webhook/route.ts`. Install `stripe`, uncomment the marked
   blocks. The webhook currently **rejects everything with 501** rather than
   trusting an unverified payload — signature verification must be wired before
   pointing a live endpoint at it.
2. **GHL** — `src/lib/ghl.ts`. Normalized payload shape and idempotency key are
   final; the POST activates once `GHL_INBOUND_WEBHOOK_URL` is set. Calendar
   embed activates on `NEXT_PUBLIC_GHL_CALENDAR_ID`.
3. **Testimonials** — `src/content/testimonials.ts`. Four slots
   (Garabedian Plumbing, Pro Pressure Washing, Greg's Cuts, MrDetails) with
   `quote: null`. The section renders nothing until real quotes are supplied.
   Do not invent these.
4. **VSL** — set `NEXT_PUBLIC_VSL_EMBED_ID`. Until then the demo shows a
   placeholder poster labelled "Demo coming soon" and loads no iframe.
   Quartile tracking (25/50/75/100) is implemented but **untested** — it needs a
   real video to verify.
5. **Welcome / confirmed embeds** — GHL onboarding form and setup-call calendar
   on `/start/welcome`; real `.ics` link on `/call/confirmed`.
6. **Analytics transport** — `src/lib/analytics.ts` pushes to `window.dataLayer`
   and logs in dev. Point `send()` at the real provider.
7. **Capacity + cohort deadline** — `src/content/copy.ts`. `spotsLeft` and
   `cohortDeadlineIso` are set by hand and must be kept current. Deliberately
   not automated: §5 forbids a fake live-decrementing counter.
   **The deadline now holds the free management, not a price.** Set `exp` in
   the GHL workflow to control the window — a short one (call time + 1h) shows
   a live ticking countdown, a long one shows a date. It does not reset on
   reload because it lives in the link, and the expiry genuinely changes the
   price ($197 management), which is what §5 requires. Luke asked for a
   10-minute page-load timer; that was declined once as a session-based
   countdown that restarts, which §5 explicitly lists under "do not build".
8. **Real 4G perf check** — measured on localhost only. Re-run throttled on
   Netlify before trusting the <1.5s LCP target.
9. **Illustrative proof figures** — `proof` and `roi` in `src/content/copy.ts`
   are made up for illustration and labelled as such. Replace with real client
   numbers when they exist, and keep the labelling honest about which is which
   rather than quietly dropping the `Example` badge.
10. **The SMS artifact** shows "Reyes Auto Care" as a stand-in business. Swap for
   a real one if you have permission, or leave it — it reads as an example.
11. **Social proof — `src/content/clients.ts`.** Three empty structures:
   `trustStats` (headline numbers), `clientLogos` (logo wall, files go in
   /public/logos), and `caseStudies` ("X reviews in Y months" + quote). All
   render nothing until filled. This is the single highest-leverage thing to
   supply — roughly a third of a competitive page in this category is social
   proof, and it's the part that can't be written, only earned.

- **No platform OAuth app exists.** `resolveConnectMethod` requires a client id,
  authorize URL and redirect URI (`OAUTH_SQUARE_*`, `OAUTH_ACUITY_*`) before it
  will show a Connect button, so today **every** platform renders the staff-invite
  path. `src/app/api/connect/[platform]/route.ts` gets the owner to the consent
  screen and sets a `state` cookie; **there is no callback handler** — whoever
  builds it owns the token exchange and must verify `state` against that cookie.
- **`FYND_INVITE_EMAIL` is unset.** The invite step degrades to "I'll email you
  the address" rather than printing a placeholder a customer would try to use.
  Set it and step 2 names the address directly.

## Notes for whoever picks this up

- **Env vars**: `.env.example` lists them all. Set them in Netlify's environment
  variables, never in the repo. `.env.local` is gitignored.
- **`--text-muted` (#8A93A6) fails WCAG AA on white (3.09:1) and on Fynd Gray
  (2.80:1).** It's a design.md token but it cannot carry readable text — that's
  what cost the first accessibility run its 100. Use `text-ink-soft` (#5A6478,
  5.95:1) for anything a person needs to read. Same trap with Fynd Orange and
  Fynd Green as small text on white.
- **`cn()` registers custom font sizes with tailwind-merge.** Add any new named
  size (`text-body`, `text-h3`, …) to the list in `src/lib/utils.ts`, or
  tailwind-merge reads it as a colour class and silently strips `text-white`.
- **Scroll reveals are progressive enhancement.** Markup renders visible; the
  hidden start state lives behind `@media (scripting: enabled)`. Don't replace
  this with a JS library that SSRs `opacity: 0` — that breaks the no-JS
  requirement and reintroduces a hydration mismatch.
- **The claim countdown is `useOfferWindow` + `OfferCountdown`.** Ten minutes
  from the visitor's FIRST arrival, with the start timestamp persisted in
  localStorage so a reload continues the countdown instead of handing out a
  fresh ten minutes. That persistence is the point — a timer that restarts is
  what the build spec §5 lists under "do not build", and it is what a
  skeptical trades owner catches. Verified: 588s before reload, 574s after.
  **This is only honest if Luke actually honours the expiry.** The date-based
  `exp`/HMAC logic in `src/lib/offer.ts` still exists unused, if he ever wants
  to go back to a per-prospect deadline set by the GHL workflow.
- **The hero card is `ProfileCard`.** Modelled on a Google Business Profile
  layout, but the dark panel shows REVIEW VOLUME, not map position — the
  reference showed "local map position #2", which contradicts the
  reviews-not-ranking positioning and promises something the product doesn't
  sell. Its floating chips are absolutely positioned; the footnote must stay
  OUTSIDE that `relative` wrapper or `-bottom-4` anchors below the footnote
  and the chip lands on top of the text.
- **Statistics (`content/stats.ts`) are empty and require a `source` per
  entry.** Figures like "92% of consumers read reviews" circulate everywhere
  but are unverifiable from here. Do not populate them from a competitor's
  landing page — pull from the study (BrightLocal's annual Local Consumer
  Review Survey is the usual citation) and cite the year.
- **The logo is a raster** (`public/transparent-fynd.PNG`, 1831x2048). Rendered
  through next/image in `src/components/brand/Logo.tsx`. Two things must stay
  true: give it a **height and `w-auto`, never a square box** (it is 0.894:1 and
  a square squashes it), and **keep the `sizes` prop**. Without `sizes`,
  next/image builds a 1x/2x srcset off the 1831px intrinsic width and a
  retina screen downloads the 3840px candidate — 48KB for a 25px logo instead
  of 1.7KB.
- **Deadline formatting uses a fixed timezone** (`offer.timeZone`,
  America/New_York). Without it server and client format differently and React
  reports a hydration mismatch.
