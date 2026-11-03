# Rehearsal: WatchJudgeDemo (the free week on /watch)

Gold: `device-pair` (stageshow). Kept its geometry whole: 640×420 stage, the
window pinned top-left at a 32px gutter and off the bottom, the phone (236,
pro, dark, the kit wallpaper) straddling the window's right edge at top 84,
`LockScreen size="satellite" stack="top"`. Changed: Fynd's look
(`src/components/stageshow/fynd.css`), the dashboard's content (studio, day
chip, one big number with the rating, the booking-software strip, chart,
recent requests), a sidebar of 88 not 112 and a 232px content column so
nothing real sits under the phone, a window of 526 so its content fills it.
Motion borrowed from `subscriptions`: a rolling count, a second scene as
the reset. Compact is its own design (358×500): the sidebar goes, the
window is whole in height (342, so what shows is square) and off the right,
the phone is 320 wide and straddles the window's bottom edge over the
filler rows with its clock off; the real request rows are filler there, so
the review lands on the phone and the count.

Beats (loop ≈ 21s, two studios): wave sent (frame one, the first
notification) · a review lands at 1.1s (count 31→32, the second
notification drops in) · a second at 3.4s (→33) · booking software
Connecting… at 5.3s, Connected and Day 7 at 6.2s · payoff holds · scene
crossfades to the second studio at 9.3s and plays the same week · back to
the first at ~19s. Poster: the first studio's payoff.

Captured: stills at 1280 and 390 (opening, payoff), loops at both widths,
`--reduced` at 1280 (the poster, complete). Looks: light only (the page is
white). Browser: headless Chrome via the skill's `film.mjs`, plus the real
page in Chrome at 1280 and 390 through the devtools MCP.

Film (`--gate`, wide and phone):
- `jump: span "0".."9" y +280px` and `settle snap … 280px` at the `scene`
  mark → the `Count` reel inside the studio that just left, resetting
  33→31 while its scene is `opacity: 0; visibility: hidden`. The kit's
  Count jumps on purpose when it can't be seen (kit.md: "it jumps inside a
  snap or offscreen"); `a.set` instead of `a.snap` and a plain-text swap
  were both tried and the film reports the same or worse (a mount with no
  entrance). The frame shows nothing: the reel is in a hidden scene. Stands.
- `small text: 9:41 renders at 9.0px` (390) → the notification's time stamp
  on a 320-wide phone. The body is 11.4px. A wider phone would either sit
  flush to the stage edge or cut the banner. Stands.
- `kit override: .ss-phone__*` → appears only on the Next page, not on the
  playground gold; computed geometry of the status bar, island and screen
  matches the kit's. The site's reduced-motion `*` rule and Tailwind's
  preflight are the only global rules; neither changes those boxes. Noted,
  not acted on.
- `same-box content change: ss-chart` → the chart easing to the new count
  (manual line, watched in motion: smooth).
- Fixed on the way: "Booking software" wrapping (column width, label
  sizes), the strip's state under the phone (content column capped), the
  payoff mark caught mid-roll (mark moved after the roll), `Sent` vanishing
  in one frame (Swap → States), the leaving studio's notification changing
  its name mid-fold (one Collapse per studio), the compact window narrower
  than tall (its own stacked layout), content short of the window's foot
  at both widths.

Review (own fresh eye, both sheets beside the gold): the eye lands on the
count and the Connected strip, then the phone; one window leads; nothing
real is cut; the crossfade briefly overlays the two studios' names, as the
subscriptions gold does.

Assumptions: the studios and every figure are fictional and the caption
under the stage says so. `app.fynnd.co/reviews` is a drawn address.
Unresolved: the hydration "1 Issue" badge in the film shots is Next's dev
overlay reacting to film.mjs tagging the stage before React hydrates; the
page's own console is clean without the script.
Not checked: a real iPhone (touch pause/resume), Safari, the loop after a
tab is hidden and shown again, a resize across 600 mid-play.
