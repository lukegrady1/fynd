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
   Vercel before trusting the <1.5s LCP target.
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

## Notes for whoever picks this up

- **Env vars**: `.env.example` lists all eight. Set them in Vercel's environment
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
