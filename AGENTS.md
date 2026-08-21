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

<!-- END:fynd-project-rules -->
