# Grady Digital — Review System Landing Pages

Build spec for Claude Code. Two pages, one codebase, ~85% shared. The only structural
difference is the conversion module at the bottom: **instant checkout** vs. **book a call**.

---

## 0. Context: where these pages sit in the funnel

```
SMS blast ──▶ positive reply ──▶ phone call
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            they have time now            "call me back later"
                    │                               │
                    ▼                               ▼
          gradydigital.com/start          gradydigital.com/call
          (offer + demo + Stripe)         (offer + demo + GHL calendar)
                    │                               │
                    ▼                               ▼
            Stripe subscription            booked appt + SMS reminders
                    │                               │
                    └──────────▶ GHL onboarding ◀───┘
```

Both links get texted to the prospect **while I'm on the phone with them** or right after.
That means:

- **Mobile is not the responsive afterthought. Mobile is the product.** Design mobile-first at
  390px, then scale up. Desktop is a courtesy.
- **The URL has to be short.** `/start` and `/call`. Not `/review-system-landing-page-v2`.
- **The page loads while they're still on the phone with me.** Sub-1.5s LCP on 4G. No
  render-blocking video, no 2MB hero image.
- They already know who I am — they just talked to me. Skip the "who we are" throat-clearing.

---

## 1. Stack

Match the existing Grady Digital client stack:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (used sparingly — see §4)
- Deployed to Vercel
- Stripe Checkout (subscription mode) for `/start`
- GoHighLevel calendar embed + inbound webhooks for `/call`

Single repo, single deploy. Do **not** build two separate projects.

```
app/
  layout.tsx
  start/page.tsx           # checkout page
  start/welcome/page.tsx   # post-purchase success
  call/page.tsx            # booking page
  call/confirmed/page.tsx  # post-booking confirmation
  api/checkout/route.ts
  api/stripe/webhook/route.ts
components/
  sections/                # shared, see §3
  ui/
lib/
  offer.ts                 # single source of truth for pricing + deadline logic
  ghl.ts
  stripe.ts
content/
  copy.ts                  # all copy lives here, not inline in JSX
  testimonials.ts
```

**All copy lives in `content/copy.ts`.** I need to A/B and rewrite headlines without touching
component code.

---

## 2. Design direction

If Grady Digital brand tokens already exist in the repo, use those and skip this section.
Otherwise:

**The subject is Google star ratings.** Every design decision comes out of that world — stars,
rating numbers, review counts, the Google-blue-adjacent chrome of a business profile. Don't
reach for generic SaaS gradients.

### Color — three jobs, three colors, no overlap

```css
--ink:    #12161C;  /* text, dark sections */
--paper:  #FFFFFF;
--mist:   #EEF1F5;  /* alternating section bg */
--star:   #FFB400;  /* RESERVED: stars and rating numerals only. Never a button. */
--action: #0E7C5A;  /* RESERVED: CTAs only. Nothing else is this green. */
--alert:  #C2410C;  /* RESERVED: deadline chip, crossed-out price. Used 2x per page max. */
```

The discipline is the point: gold means "rating," green means "click this," rust means "clock
is running." If a fourth color shows up, delete it.

### Type

- Display: **Archivo** (700/800, tight tracking) — headlines, section heads
- Body: **IBM Plex Sans** (400/500)
- Data: **IBM Plex Mono** (500) — rating counters, the deadline timer, price numerals

Load via `next/font/google`, subset latin, `display: swap`. The mono numerals on prices and
ratings are what make it look like a dashboard instead of a template.

### Signature element

The hero contains a **live rating counter**: a Google-business-profile-style card where the
star rating ticks from `4.2 ★★★★☆` up to `4.8 ★★★★★` and the review count climbs `31 → 94`,
animating once on load. That single moment *is* the product pitch — no headline explains it
faster. Everything else on the page stays quiet so this lands.

Respect `prefers-reduced-motion`: show the end state, no animation.

### Restraint

One bold thing (the counter). Everything else: flat cards, generous whitespace, one hairline
divider weight, `rounded-lg` consistently. No glassmorphism, no floating gradient blobs, no
scroll-jacking, no parallax.

---

## 3. Shared page structure

Both pages run this section stack. `/start` and `/call` differ **only** at §3.7.

| # | Section | On `/start` | On `/call` |
|---|---------|-------------|------------|
| 3.1 | Sticky offer bar | ✅ | ✅ |
| 3.2 | Hero + rating counter | ✅ | ✅ |
| 3.3 | Demo / VSL | ✅ | ✅ |
| 3.4 | How it works (3 steps) | ✅ | ✅ |
| 3.5 | What you get | ✅ | ✅ |
| 3.6 | Testimonials | ✅ | ✅ |
| 3.7 | **Conversion module** | **Stripe checkout** | **GHL calendar** |
| 3.8 | Objection FAQ | ✅ | ✅ |
| 3.9 | Final CTA | scroll to checkout | scroll to calendar |

### 3.1 Sticky offer bar

Thin bar, pinned to top on scroll (fades in after hero exits viewport). Contains:

`~~$197/mo~~  $97/mo · no contract` + CTA button ("Start for $97" / "Pick a time")

On mobile, the bar pins to the **bottom** instead — thumb reach. This is the highest-leverage
element on the page; the CTA should never be more than one thumb-tap away.

### 3.2 Hero

```
┌─────────────────────────────────────────┐
│  [deadline chip: rust, mono, small]     │
│                                         │
│  H1 — outcome, not feature               │
│  Subhead — one sentence, mechanism       │
│                                         │
│  ┌───────────────────────────────┐      │
│  │  ★★★★★  4.8   ← counter       │      │
│  │  94 Google reviews             │      │
│  │  [business profile card]       │      │
│  └───────────────────────────────┘      │
│                                         │
│  [ Primary CTA ]  [ text-link: watch    │
│                     the 2-min demo ]    │
│                                         │
│  price block: ~~$197~~ $97/mo           │
└─────────────────────────────────────────┘
```

Copy (in `copy.ts`, edit freely):

- **H1:** "Get more Google reviews without asking for them."
- **Sub:** "Every time you finish a job, your customer gets a text with a one-tap review link.
  You do nothing. Reviews show up."
- **CTA `/start`:** "Start for $97/mo" → scrolls to checkout
- **CTA `/call`:** "Pick a time to talk" → scrolls to calendar

### 3.3 Demo / VSL

Not an autoplay hero video. A clearly-labeled, click-to-play embed:

- Poster frame with a duration badge ("2:14") and a play button
- Lazy-load the iframe on click (`react-lite-youtube-embed` or equivalent) — never let an
  embed block LCP
- Caption underneath: "Watch the actual system send a review request and a review come back."
- Fire an analytics event at 25/50/75/100% watched (see §7)

If the VSL isn't recorded yet, build the component with a placeholder poster and a
`VSL_EMBED_ID` env var so I can drop it in without a code change.

### 3.4 How it works — 3 steps

Numbered `01 / 02 / 03` is justified here because it's a real sequence.

1. **You finish the job.** Mark it done in your CRM, or just text a number. Takes 5 seconds.
2. **We text your customer.** Personalized, from your business name, with a one-tap link
   straight to your Google review page.
3. **The review posts.** Happy customers go public. Unhappy ones get routed privately to you
   first, so you hear it before Google does.

Step 3's second sentence is the whole objection-killer for the "what if someone's mad" worry.
Don't cut it.

### 3.5 What you get

Simple two-column checklist, no icon soup:

- Automated review requests by text and email
- Private feedback routing for anything under 4 stars
- Reply-to-reviews assistance
- NFC review cards for the truck / front counter
- A dashboard showing rating, review velocity, and where you rank vs. local competitors
- Setup done for you — you're live in under a week

### 3.6 Testimonials

**Use only real client quotes.** Pull from `content/testimonials.ts`. If I haven't supplied a
real quote for a slot, render nothing — do not write placeholder testimonials that read as
real, and do not invent names, businesses, or numbers.

Each card: quote, name, business, town, and a small before→after rating stat if I've given one
(`4.1 → 4.7, 62 reviews added`). Photos optional; a business logo beats a stock headshot.

Slots to fill from existing clients (I'll supply the actual copy):
Garabedian Plumbing · Pro Pressure Washing · Greg's Cuts · MrDetails

### 3.7 Conversion module — **the only fork**

#### `/start` — instant checkout

```tsx
// Card, --action border, mono numerals
Review System — $97/mo
~~$197/mo~~  ← --alert, strikethrough, 0.8em
No contract. Cancel anytime.
Locked at $97 for as long as you stay.

[ Start for $97/mo ]   ← full-width, --action, 56px tall min

Below button, small:
🔒 Secure checkout by Stripe · First charge today, then monthly
```

Flow:

1. Button POSTs to `/api/checkout` with `{ cid, plan: 'review-system' }`
2. Route handler creates a Stripe Checkout Session:
   - `mode: 'subscription'`
   - `line_items: [{ price: process.env.STRIPE_PRICE_REVIEW_97, quantity: 1 }]`
   - `metadata: { ghl_contact_id: cid, source: 'start-page' }`
   - `success_url: /start/welcome?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url: /start?cancelled=1`
   - `allow_promotion_codes: true`
3. Redirect to the session URL. Do **not** build a custom card form — Stripe Checkout handles
   SCA, wallets, and Apple Pay (which matters a lot on mobile).
4. `/api/stripe/webhook` listens for `checkout.session.completed`, verifies the signature, and
   POSTs to the GHL inbound webhook (§6) to tag the contact and fire onboarding.
5. `/start/welcome` renders: confirmation, what happens next (3 bullets, with timing), and an
   embedded GHL onboarding form (business name, Google Business Profile URL, CRM, who to
   contact). Then a calendar embed for the 15-min setup call.

If `?cancelled=1` is present, show a quiet, non-guilt-trippy inline note above the checkout
card: "No charge was made. Still deciding? [Book a call instead →]" linking to `/call`.

**Alternative worth considering:** GHL's native payment/subscription products would keep
billing and CRM in one system and avoid the webhook plumbing entirely. Stripe Checkout wins on
conversion (Apple Pay, better mobile UX) and on not being locked into GHL's billing. Build
Stripe first; keep `lib/stripe.ts` thin enough that swapping is a one-file change.

#### `/call` — book a discovery call

```tsx
Card, same dimensions as the checkout card so the pages feel like twins:

"Grab 15 minutes."
"I'll show you your current rating, what your competitors have, and
 exactly what the system would do for you. No pitch deck."

[ GHL calendar iframe embed ]

Below:
Prefer to text? Reply to my message and I'll answer there.
```

- Embed the GHL calendar with `?prefill=true` and pass through `first_name`, `phone`, `email`
  from query params so they don't retype anything on a phone keyboard.
- Set the iframe to a fixed min-height (700px mobile / 620px desktop) so the page doesn't
  jump as the embed loads. Skeleton loader underneath.
- The offer block **still appears** on this page, above the calendar: `~~$197~~ $97/mo`, with
  the line "This is what we'll be talking about. Same price whether you buy today or Friday —
  the $97 rate is held until [deadline]." That keeps price transparency and pre-frames the
  call so nobody shows up thinking it's free consulting.
- On booking success, GHL redirects to `/call/confirmed` — which restates the time, adds an
  "add to calendar" link, and puts the `/start` link at the bottom: "Already sold? You can skip
  the call and start now →". Some people book and then buy before the call. Let them.

### 3.8 Objection FAQ

Accordion, 6 items. These are the real ones from the phone:

- "What if I get a bad review?" → private routing, explain the under-4-stars flow
- "Is this against Google's rules?" → no; we ask every customer, we don't gate or incentivize
- "How long until I see reviews?" → typically first ones inside a week
- "Do I have to do anything?" → describe the 5-second version, and the fully-automatic CRM
  version (ServiceTitan / Jobber integration)
- "Am I locked in?" → month to month, cancel anytime, you keep the reviews
- "Why is it $97 when it says $197?" → answer this honestly, see §5

### 3.9 Final CTA

Dark section (`--ink` bg). One line restating the outcome, the price block, one button that
scrolls back to §3.7. No new information.

---

## 4. Motion

Total motion budget for the page:

1. Rating counter animates once on load (~1.2s, ease-out)
2. Sections fade+rise 12px on scroll into view, `once: true`, 300ms
3. Buttons: 100ms scale/darken on press

That's it. No staggered letter reveals, no marquee, no animated gradient background. Wrap
everything in a `useReducedMotion()` check.

---

## 5. Urgency — make it real, not fake

I want urgency, but a countdown timer that resets when you reload the page will get noticed by
exactly the kind of skeptical trades owner I'm selling to, and it's the sort of thing the FTC
has been going after. So the deadline has to be **true**. Three honest mechanics, use all
three:

### 5.1 A real per-prospect deadline

The GHL workflow that sends the link appends `?exp=<unix_timestamp>` set to **call time + 72
hours**. The page reads it and renders:

> **$97 rate held until Monday, 6:00 PM** — mono type, `--alert`, in the sticky bar and hero chip.

Show a live countdown only when under 24 hours remain; above that, show the date and time.
A ticking clock at 68 hours is theater; a date is information.

If `exp` is missing or already past, fall back to the cohort deadline (§5.2) — never render a
broken or negative timer, and never silently reset the clock.

Optional but recommended: HMAC-sign the `exp` param (`?exp=...&sig=...`) so a forwarded link
can't be edited. Low stakes, cheap to add.

### 5.2 Real capacity limit

I onboard a limited number of accounts a month because setup is hands-on. That's true, so say
it:

> "I take 5 new accounts a month so setup stays hands-on. **2 spots left in September.**"

Drive the number from a value in `content/copy.ts` that I update manually. Do **not** fake a
live-decrementing counter.

### 5.3 The price story — explain it

The crossed-out $197 needs a reason or it reads as a fake anchor. Pick one and use it
consistently everywhere (page, phone script, SMS):

- **Founding rate:** "$97 is the founding-client rate while I build out case studies in your
  trade. It goes to $197 once I have 25 accounts. You keep $97 as long as you stay."

That's the recommended one — it's true, it explains both the discount and the deadline, and it
makes staying subscribed feel like holding an asset. Put a one-line version directly under the
price block and the long version in the FAQ.

**Do not build:** a session-based countdown that restarts, fake "3 people are viewing this,"
fake recent-purchase popups, or a timer whose expiry doesn't actually change the price.

---

## 6. GoHighLevel integration

### Query params in, on both pages

| Param | Purpose |
|-------|---------|
| `cid` | GHL contact ID — carried into Stripe metadata and all analytics |
| `fn` | first name — prefills forms, optional light personalization |
| `biz` | business name — renders in H1 as "…for {biz}" |
| `exp` | offer deadline, unix seconds |
| `sig` | optional HMAC of `exp` |

Sanitize `fn` and `biz` hard (strip HTML, cap at 40 chars, title-case). They come from a CRM
field and end up in the DOM.

If `biz` is absent, fall back to the generic H1 — never render "for undefined" or an empty
gap.

### Webhooks out

Single helper in `lib/ghl.ts` → `POST` to `GHL_INBOUND_WEBHOOK_URL` with a normalized payload:

```json
{
  "event": "checkout_completed" | "checkout_started" | "calendar_viewed" | "vsl_watched_50",
  "ghl_contact_id": "...",
  "page": "start" | "call",
  "timestamp": "ISO-8601",
  "meta": { }
}
```

Same normalized shape as the other Grady Digital webhooks so the GHL workflows stay
consistent. Include an idempotency key so a retry doesn't double-fire a workflow.

### SMS reminder sequence (built in GHL, spec'd here so the pages match it)

**Booked-call sequence** — triggered by the `/call` calendar booking:

| When | Channel | Message |
|------|---------|---------|
| Immediately | SMS | "You're set for {time}. I'll call {phone}. Here's the demo again if you want a head start: {start_link}" |
| 24h before | SMS | "Talking tomorrow at {time} — still good?" (reply Y/N handling) |
| 1h before | SMS | short confirm |
| 10 min before | SMS | "Calling you in 10." |
| No-show +5 min | SMS | "Just tried you — want to grab another time? {reschedule_link}" |
| No-show +1 day | SMS | one re-book attempt, then stop |

Respect quiet hours (no sends before 8am / after 8pm local) and stop-on-reply, same as the
existing outreach workflows.

**Abandoned-checkout sequence** — triggered when `checkout_started` fires without a matching
`checkout_completed` inside 30 minutes:

| When | Message |
|------|---------|
| +30 min | "Saw you got to the checkout page — anything I can answer? Happy to just get on the phone: {call_link}" |
| +24h | one nudge referencing the real deadline from `exp` |
| after that | stop, move to nurture |

Two messages. Not five.

---

## 7. Tracking

Fire on both pages, to whatever analytics is already wired up (and mirror the key ones to GHL
via §6):

`page_view` · `vsl_play` · `vsl_25/50/75/complete` · `cta_click` (with which CTA and section) ·
`faq_open` (which question — tells me what the real objections are) · `checkout_started` ·
`checkout_completed` · `calendar_loaded` · `booking_completed` · `scroll_depth_50/90`

Include `cid` and `page` on every event so I can tie it back to the SMS list.

---

## 8. Technical requirements

- **`noindex, nofollow`** on both pages. These prices differ from public site pricing and I
  don't want them competing with the main site or getting found by existing clients.
- LCP < 1.5s on simulated 4G. No layout shift from the video poster, the calendar iframe, or
  the rating counter — reserve space for all three.
- Next `<Image>` with explicit dimensions everywhere.
- Buttons: 48px minimum tap target, 56px for primary CTAs.
- Real focus states (`--action` ring, 2px offset). Full keyboard nav through the FAQ accordion
  and calendar.
- Semantic headings, one `h1`, alt text on everything meaningful.
- Works with JS disabled to the extent that copy and the phone number are readable.
- Env vars: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_REVIEW_97`, `STRIPE_WEBHOOK_SECRET`,
  `GHL_INBOUND_WEBHOOK_URL`, `GHL_CALENDAR_ID`, `NEXT_PUBLIC_VSL_EMBED_ID`, `OFFER_HMAC_SECRET`.
  Fail loudly at build time if any are missing.

---

## 9. Build order

1. Shared layout, tokens, type scale, `copy.ts`
2. Sections 3.2–3.6, 3.8, 3.9 as shared components
3. `/call` end to end (calendar embed, confirmed page) — it's the simpler fork
4. `/start` end to end (Stripe route handler, webhook, welcome page)
5. Deadline + capacity logic (§5)
6. Analytics + GHL webhooks
7. Lighthouse pass on mobile, fix CLS/LCP
8. Screenshot both pages at 390px and 1280px and self-critique against §2 before calling it done

## 10. Acceptance checklist

- [ ] Both pages render correctly with **zero** query params
- [ ] Both pages render correctly with all query params, including a weird `biz` value
- [ ] `?exp=` in the past falls back cleanly to the cohort deadline
- [ ] Countdown never shows negative time and never resets on reload
- [ ] Stripe test-mode purchase completes → webhook verified → GHL payload sent → welcome page
- [ ] GHL booking completes → redirects to `/call/confirmed` → reminder sequence fires
- [ ] Checkout cancel returns to `/start?cancelled=1` with the inline note
- [ ] No testimonial on the page that I didn't personally supply
- [ ] Sticky CTA reachable by thumb at every scroll position on a 390px screen
- [ ] `prefers-reduced-motion` kills all animation, counter shows end state
- [ ] Lighthouse mobile: performance ≥ 90, accessibility 100