# DESIGN.md — Fynd

Design and brand system spec. Treat this file as the source of truth. Do not introduce colors, fonts, radii, or component patterns that aren't defined here.

---

## 1. Brand

**Name:** Fynd
**Tagline (lockup):** BEING FOUND EVERYWHERE.
**Headline tagline (marketing):** Be found. Everywhere.
**Supporting line:** One platform. Total presence.

**Brand description (use verbatim for meta descriptions, about sections, decks):**

> Fynd helps businesses get found—everywhere. Our AI-powered platform maximizes your local visibility across Google, Maps, AI search, directories, and more. One platform. Total presence.

**Positioning line for hero subcopy:** AI-powered local visibility across search, maps, directories, and AI.

**Voice:** Confident, plain-spoken, benefit-first. Short declarative sentences. Periods used as rhythm ("Clean. Modern. Data-driven."). Never hype-y, never jargon-y. Active voice, sentence case in UI, title case avoided except in nav.

### The four pillars

Use these as the canonical feature/benefit quadrant. Each has a fixed icon, accent color, and one-line description.

| Pillar | Icon | Accent | Line |
|---|---|---|---|
| Visibility | Map pin | Fynd Blue | Show up where customers search. |
| Reputation | Star in speech/circle | Fynd Green | Build trust with reviews that win. |
| Growth | Trending-up arrow | Fynd Orange | More visibility. More customers. |
| Control | Shield with check | Fynd Blue | One platform. Everything in sync. |

---

## 2. Logo

**Mark:** A stylized "F" built from three elements:
1. Blue leaf/flag form (top arm) — Fynd Blue, curving right
2. Green leaf/flag form (lower arm) — Fynd Green, curving right, overlapping the blue
3. Orange circle at the base-left of the stem — Fynd Orange

**Wordmark:** "Fynd" in Poppins Bold, white on dark, Deep Navy on light. Lowercase except the F.

**Full lockup:** Mark + wordmark, with the tagline `BEING FOUND EVERYWHERE.` set below the wordmark in all caps, wide letterspacing (~0.25em), small size, aligned to the wordmark's width.

### Rules
- **Safe zone:** clear space on all four sides equal to the height of the "F" mark. Nothing — text, image edges, buttons — enters that zone.
- **Minimum sizes:** full lockup with tagline = **120px** wide minimum. Mark-only / compact = **32px** minimum. Below 120px, drop the tagline. Below 64px, use the mark alone.
- **Approved backgrounds:** Deep Navy, white, Light Gray, or a solid brand color (mark reversed to white/navy as needed).
- **Never:** recolor the mark outside the three brand colors, add drop shadows or strokes, rotate, stretch, place on a busy photo without a navy scrim, or reorder the blue/green/orange elements.

### App / social icon variants
All square with generous rounding (~22% of width, iOS-style squircle) or full circle:
- Navy square + full-color mark (primary app icon)
- White square + full-color mark
- Solid Fynd Blue circle + white mark
- Solid Fynd Green circle + white mark
- Solid Fynd Orange circle + white mark

---

## 3. Color system

```
Deep Navy    #0B132B   Primary dark surface, text on light, footer, app icon
Fynd Blue    #4C5BFF   Primary action, links, primary data series
Fynd Green   #19D3A2   Success, secondary action, positive deltas, accent word in headlines
Fynd Orange  #FF8A1F   Attention, tertiary data series, automations/integrations
Light Gray   #F2F4F7   Section backgrounds, cards on white, dividers, input fills
White        #FFFFFF   Base light surface
```

### Gradients
```
Fynd Blue Gradient    #4C5BFF → #7A5CFF
Fynd Green Gradient   #19D3A2 → #16B98A
Hero Mesh             #4C5BFF → #19D3A2 (diagonal, 135deg) — decorative blocks only
```
Gradients are for decorative blocks, texture panels, and occasional emphasis. **Do not** gradient body text or primary buttons.

### Usage ratios
Roughly 60% neutral (navy or white/light gray), 25% blue, 10% green, 5% orange. Orange is a spice — never a section background, never a large fill.

### Derived tokens
```
Text on navy:        #FFFFFF (primary), rgba(255,255,255,0.72) (secondary)
Text on light:       #0B132B (primary), #5A6478 (secondary), #8A93A6 (muted)
Border (light):      #E3E7EE
Border (dark):       rgba(255,255,255,0.10)
Card (light):        #FFFFFF on #F2F4F7 page, or #F2F4F7 on #FFFFFF page
Card (dark):         #121B36 on #0B132B
Focus ring:          #4C5BFF at 40% opacity, 3px offset 2px
```

### CSS variables
```css
:root {
  --fynd-navy: #0B132B;
  --fynd-blue: #4C5BFF;
  --fynd-blue-2: #7A5CFF;
  --fynd-green: #19D3A2;
  --fynd-green-2: #16B98A;
  --fynd-orange: #FF8A1F;
  --fynd-gray: #F2F4F7;
  --fynd-white: #FFFFFF;

  --text-primary: #0B132B;
  --text-secondary: #5A6478;
  --text-muted: #8A93A6;
  --border: #E3E7EE;

  --grad-blue: linear-gradient(135deg, #4C5BFF 0%, #7A5CFF 100%);
  --grad-green: linear-gradient(135deg, #19D3A2 0%, #16B98A 100%);
  --grad-mesh: linear-gradient(135deg, #4C5BFF 0%, #19D3A2 100%);
}
```

### Tailwind config
```js
theme: {
  extend: {
    colors: {
      navy:  { DEFAULT: '#0B132B', card: '#121B36' },
      fynd:  {
        blue:   '#4C5BFF',
        blue2:  '#7A5CFF',
        green:  '#19D3A2',
        green2: '#16B98A',
        orange: '#FF8A1F',
        gray:   '#F2F4F7',
      },
      ink:  { DEFAULT: '#0B132B', soft: '#5A6478', muted: '#8A93A6' },
      line: '#E3E7EE',
    },
    fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
    backgroundImage: {
      'grad-blue':  'linear-gradient(135deg,#4C5BFF,#7A5CFF)',
      'grad-green': 'linear-gradient(135deg,#19D3A2,#16B98A)',
      'grad-mesh':  'linear-gradient(135deg,#4C5BFF,#19D3A2)',
    },
  }
}
```

---

## 4. Typography

**Single family: Poppins.** Weights used: Bold (700), Semibold (600), Medium (500), Regular (400). No secondary typeface. No serif anywhere.

Load: `Poppins:wght@400;500;600;700` (latin subset), `display=swap`.

### Scale (size/line-height in px)

| Role | Weight | Size / Line | Notes |
|---|---|---|---|
| H1 | Bold 700 | 40 / 48 | Marketing hero can scale to 56/64 desktop, 32/40 mobile |
| H2 | Semibold 600 | 28 / 36 | Section headings |
| H3 | Semibold 600 | 20 / 28 | Card titles, subsection heads |
| Body | Medium 500 | 16 / 24 | Default paragraph and UI text |
| Small | Regular 400 | 14 / 20 | Captions, labels, helper text, table cells |
| Micro | Semibold 600 | 12 / 16, 0.12em tracking, uppercase | Eyebrows, section labels, badges |
| Tagline | Medium 500 | 11–14, 0.25em tracking, uppercase | Logo lockup only |
| Data XL | Bold 700 | 32–40 / 1.1 | KPI numbers (e.g. 24.5K, 87) |

### Rules
- Body copy is **Medium (500)**, not Regular — this is a deliberate brand trait. Regular is reserved for small/caption text.
- Headline color treatment: line one in white (dark bg) or navy (light bg), line two in **Fynd Green**. Example: "Be found." / "**Everywhere.**"
- Max measure for paragraphs: 65ch (~640px).
- Tracking: −0.01em on H1/H2, 0 on body, positive tracking only on uppercase micro/tagline.
- Sentence case in UI and body. Never all-caps except micro labels and the logo tagline.

---

## 5. Textures & backgrounds

Four approved background treatments. One per section maximum; never stack two.

1. **Dot grid** — evenly spaced 3–4px dots on a 24px grid, in Fynd Green and Fynd Blue at 20–40% opacity, fading out toward edges. Light or dark base.
2. **Dark topographic** — thin contour lines (1px, `rgba(255,255,255,0.06)`) over Deep Navy. Used behind hero and dark sections.
3. **Light topographic** — same contour pattern in `#E3E7EE` at low opacity over white.
4. **Gradient block** — blue→green mesh, always in a rounded container (radius 24px), used as an image stand-in, accent panel, or card backdrop. Never full-bleed behind text.

**Dotted world map:** a signature background — a world map rendered as a field of small dots in blue/white on navy, with colored map pins (blue, green, orange) dropped on it. Use in the landing hero and dark presentation slides. Keep dots at low contrast so headline text stays readable.

---

## 6. Photography

**Direction:** Clean. Modern. Data-driven. Real business.

Approved subjects:
- Real urban/local business environments (city skylines, storefronts, service work) — with an optional map-pin overlay
- Hands holding a phone showing the Fynd dashboard
- Abstract dark globe / network data visualizations with glowing pins
- Laptop or desktop screens showing analytics UI

Rules: natural light, high clarity, cool-neutral grade. No stock-y handshakes, no posed office-team clichés, no heavy filters. Dark images pair with navy sections; bright images pair with white sections. Overlay a navy scrim (`rgba(11,19,43,0.6)`) whenever text sits on a photo. Image corners: 16px radius (24px for large feature images).

---

## 7. Iconography

**Style:** outline only, 1.75–2px stroke, rounded caps and joins, 24×24 grid, no fills, no duotone. Lucide is the closest match — use it as the base set.

**Color by domain:**

| Icon | Meaning | Color |
|---|---|---|
| Map pin | Locations | Fynd Blue |
| Bar chart | Analytics | Fynd Blue |
| Speech bubble + star | Reviews | Fynd Green |
| Storefront | Listings | Fynd Blue |
| Magnifier + "AI" | AI Search | Fynd Blue |
| Document + pie | Reports | Fynd Blue |
| Chat bubble | Inbox | Fynd Green |
| Robot | Automations | Fynd Orange |
| People | Team | Fynd Blue |
| Puzzle piece | Integrations | Fynd Orange |
| Trending arrow (in circle) | Growth | Fynd Orange |
| Shield + check | Control | Fynd Blue |

Feature-card icons may sit inside a 48px circle with a 1.5px stroke ring in the icon's own color (as in the four-pillar row).

---

## 8. Components

### Buttons
All buttons: **Poppins Semibold 14–16px**, radius **8px**, height 44px (desktop) / 48px (mobile touch), horizontal padding 24px, right-side arrow `→` with 8px gap. Arrow translates 3px right on hover.

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| Primary | Fynd Blue `#4C5BFF` | White | none | darken 6%, lift 1px, shadow `0 6px 16px rgba(76,91,255,.28)` |
| Secondary | Fynd Green `#19D3A2` | White | none | → `#16B98A`, same lift |
| Outline | transparent | Fynd Blue | 1.5px Fynd Blue | 8% blue tint fill |
| Text link | none | Fynd Blue | none | underline, arrow slides |

On navy backgrounds, Outline uses white border + white text. Disabled: 40% opacity, no lift. Focus: 3px `rgba(76,91,255,.4)` ring, 2px offset.

### Cards
- Radius **16px** (small/data cards) or **24px** (feature/hero cards)
- Light: white fill, 1px `#E3E7EE` border, shadow `0 2px 8px rgba(11,19,43,.05)`
- Dark: `#121B36` fill, 1px `rgba(255,255,255,.08)` border
- Padding 24px (small) / 32px (large)
- Hover on interactive cards: border → Fynd Blue at 40%, shadow deepens, 2px lift, 180ms ease

### Testimonial card
Light Gray `#F2F4F7` fill, 24px radius, 32px padding. Large decorative quote glyph (") top-left in Fynd Blue at ~30% opacity, ~40px. Quote in Body Medium 16/26, navy. Below: 48px circular avatar + name (Semibold 15) + role/company (Regular 13, `#5A6478`), then a 5-star row in **Fynd Green**.

### Data visualization

Chart color order is fixed: **Fynd Blue → Fynd Green → Fynd Orange → Deep Navy**. Never introduce a fifth hue; extend with tints of blue.

- **Score gauge:** circular donut ring, 10px stroke, Fynd Green progress on `#E3E7EE` track. Center: score in Data XL Bold navy, label beneath in Micro (e.g. "Excellent"). Below the ring: delta line — `↑12% vs. last month` in Fynd Green (down/negative uses Fynd Orange, not red).
- **Metric bars:** horizontal, 6px height, fully rounded, on `#E3E7EE` track; label left (Small 14, navy), value right (Semibold 14). Color-cycle blue / green / orange down the list.
- **Line chart:** 2px Fynd Blue line, soft blue area fill fading to transparent, no point markers except on hover, horizontal gridlines only in `#E3E7EE`, axis labels Small Regular `#8A93A6`.
- **Donut chart:** 24px ring thickness, hollow center, 2px white gaps between segments, legend as a left-aligned list with 8px color dots, label, and right-aligned percentage.
- **KPI block:** big number (Data XL) with the delta pill beside it in green (`↑18%`), metric name above in Small.

Card headers for charts: H3 Semibold 20/28 or Small Semibold 14 depending on density; always navy.

### Navigation (marketing site)
Navy bar, transparent over hero then solid on scroll. Logo left. Links center-right: Product, Solutions, Pricing, Resources — Medium 15, `rgba(255,255,255,.8)`, hover white. Then Login (text link, white) and **Book a Demo** (primary button). Mobile: hamburger → full-screen navy sheet.

### Forms
Inputs: 44px height, 8px radius, 1px `#E3E7EE` border, white fill (light) or `rgba(255,255,255,.06)` (dark), 14px Medium text, `#8A93A6` placeholder. Focus: Fynd Blue border + focus ring. Labels: Small Semibold navy, 6px above. Errors: Fynd Orange text + border, message in Small Regular. Success: Fynd Green.

---

## 9. Layout

- **Grid:** 12 columns, 24px gutters, max content width **1200px**, 24px page padding (16px mobile).
- **Spacing scale (8px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Section padding:** 96–128px vertical desktop, 64px tablet, 48px mobile.
- **Radii:** 8px (buttons, inputs, small chips), 16px (cards, images), 24px (large cards, gradient blocks, texture panels), full (pills, avatars, dots).
- **Shadows:** `sm 0 2px 8px rgba(11,19,43,.05)` · `md 0 8px 24px rgba(11,19,43,.08)` · `lg 0 16px 48px rgba(11,19,43,.12)` · colored `0 6px 16px rgba(76,91,255,.28)` for primary buttons only.
- **Section rhythm:** alternate navy and white/light-gray sections. Never two navy sections back to back without a distinct texture change.
- **Breakpoints:** 640 / 768 / 1024 / 1280.

---

## 10. Signature patterns (reusable page blocks)

1. **Hero (dark):** Deep Navy + dotted world map with colored pins. H1 in two lines, second line Fynd Green. Subcopy in Body Medium `rgba(255,255,255,.75)`, max 520px. Buttons: `Book a Demo` (primary) + `Watch Video` (outline, white). Optional product screenshot floated right with a soft blue glow.
2. **Four-pillar row:** navy band, four columns, circled outline icon → pillar name (H3) → one-line description (Small, muted white). Icon colors follow the pillar table.
3. **Dashboard proof section:** light gray background, real UI cards (score gauge, impressions line chart, source donut) arranged in a 3-up or 2+1 grid.
4. **Testimonial band:** white or light gray, 1–3 testimonial cards.
5. **CTA closer:** gradient mesh or navy block, centered H2 "Be found. Everywhere.", one primary button.

---

## 11. Brand applications (reference specs)

- **Business card:** front — navy, mark + wordmark centered-left, nothing else. Back — white, name (Semibold 16 navy), role (Regular 13 `#5A6478`), then contact rows each led by a small outline icon: email, phone, website.
- **Presentation slide:** navy, dotted map faded at ~15%, headline "Be found." white / "Everywhere." green, supporting line "One platform. Total presence.", footer eyebrow "Visibility · Reputation · Growth" in Micro.
- **Email signature:** white, mark + wordmark, name (Semibold), role, then `email | phone` and website on separate lines in Small, followed by a row of 24px social icons in navy.
- **Mobile app dashboard:** navy header with back arrow + "Overview", white content area, score gauge card then KPI card (24.5K, ↑18%) with sparkline, 16px card radius, 16px page gutters.
- **App icon:** navy squircle, full-color mark centered at ~60% of the canvas, no wordmark.

---

## 12. Motion

- Durations: 150ms (micro/hover), 250ms (cards, dropdowns), 400ms (section reveals).
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- Scroll reveals: 16px translate-Y + fade, 60ms stagger between siblings.
- Hero map pins may pulse gently (2s loop, opacity ring) — the only ambient animation allowed.
- Counters may count up once on first view.
- Respect `prefers-reduced-motion: reduce` — disable transforms, keep opacity fades only.

---

## 13. Accessibility floor

- Body text on navy and on white must clear 4.5:1. Fynd Green `#19D3A2` and Fynd Orange `#FF8A1F` **fail** on white for small text — use them for fills, icons, borders, chart series, and large bold display text only. For green text on white, darken to `#0F8F6E`.
- White on Fynd Blue passes; navy on Fynd Green passes.
- Every interactive element has a visible focus ring (never `outline: none` without a replacement).
- Icons that carry meaning get `aria-label`; decorative ones get `aria-hidden`.
- Charts always pair color with a text label or value — color is never the only signal.
- Touch targets ≥44×44px.

---

## 14. Do / Don't

**Do**
- Split headlines across two lines with the payoff word in Fynd Green
- Keep body copy at Medium 500
- Use outline icons only, colored by domain
- Let orange appear sparingly, as an accent
- Round everything: 8 / 16 / 24
- Show real product UI as proof

**Don't**
- Add a second typeface, or use serifs anywhere
- Use pure black `#000` or pure red for errors — navy and orange cover both
- Gradient text or gradient primary buttons
- Use filled/solid or duotone icon sets
- Place text on unscrimmed photography
- Introduce chart colors outside the four-color order
- Stack two background textures in one section