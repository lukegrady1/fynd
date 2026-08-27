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

Stripe Checkout is live in `src/lib/stripe.ts`: subscription mode, billed on
the 1st. `billing_cycle_anchor` is midnight `America/New_York` on the 1st of
next month (`src/lib/billing-anchor.ts`) and `proration_behavior` is
`create_prorations`, so Stripe bills the part-month at signup. **Never compute
a prorated amount here** — it would disagree with the invoice Stripe issues.

There is **no Stripe webhook**. Nothing in the app knows whether a customer is
currently paying; Stripe bills correctly on its own, but renewals, failed
payments and cancellations go unobserved. Build the receiver before anything
depends on subscription state.

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
