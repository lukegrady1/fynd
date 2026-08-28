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

The recurring product's Stripe **description** carries the standing billing
policy and renders in the order summary. It lives in the Stripe Dashboard, not
in this repo.

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
