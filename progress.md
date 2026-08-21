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

### Section order (identical on both, except the conversion module)

1. Sticky offer bar — bottom on mobile, top on desktop
2. Hero + rating counter
3. **Mechanism** — phone artifact, 01/02/03 with You/Fynd actor badges, routing fork
4. Demo / VSL
5. **Proof** — before/after profile cards + rank vs. local competitors
6. **The math** — interactive estimator (jobs/week x response rate)
7. What you get
8. **Fit** — CRM integrations, first-month timeline, trades served
9. Testimonials (renders nothing until real quotes exist)
10. **Conversion module** — Stripe checkout on /start, GHL calendar on /call
11. **Compliance** — why this is inside Google's rules
12. Objection FAQ
13. **Founder note** + guarantee
14. Final CTA

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
8. **Real 4G perf check** — measured on localhost only. Re-run throttled on
   Vercel before trusting the <1.5s LCP target.
9. **Illustrative proof figures** — `proof` and `roi` in `src/content/copy.ts`
   are made up for illustration and labelled as such. Replace with real client
   numbers when they exist, and keep the labelling honest about which is which
   rather than quietly dropping the `Example` badge.
10. **The SMS artifact** shows "Reyes Auto Care" as a stand-in business. Swap for
   a real one if you have permission, or leave it — it reads as an example.

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
- **Deadline formatting uses a fixed timezone** (`offer.timeZone`,
  America/New_York). Without it server and client format differently and React
  reports a hydration mismatch.
