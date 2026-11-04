# Rehearsal: WatchJudgeDemo (the free week on /watch)

Gold: `device-pair` (stageshow). Kept its geometry: 640×420 stage, the
window pinned top-left at a 32px gutter and off the bottom, a phone
straddling the window's right edge, `LockScreen size="satellite"
stack="top"`. Changed: Fynd's look (`src/components/stageshow/fynd.css`);
the dashboard's content (studio with a Live badge, one big number with the
rating, the booking-software strip, a chart, the recent requests); a
sidebar of 88 and a 248px content column; the phone small (224) at the
right gutter (top 96, clock off) so the recent list reads whole beside it
(Luke, Nov 3, 2026: "more of that recent thing on the fake dashboard",
"the phone a little bit smaller and off to the right"). Compact is its own
design (358×470): the sidebar goes, the window is off the right and well
past the bottom with a 300 column, and there is NO phone — Luke tried it
small, large, at the gutter and off the edge and liked none of it with
the dashboard at that width ("remove the phone part from the mobile
viewing"); the dashboard alone, its list whole.

Motion: NOT a Stage script (the Stage runs a keep-alive script that only
waits, because a script-less Stage is a `data-still` and the kit's parts
switch their transitions off — the first cut of this snapped, Luke). The
Stage is the frame, scaling and compact switch; the state lives in the
component like `LiveShop` on /manage
(Luke: "like the one we did on the manage page, where the count just keeps
going up"). On first sight the booking strip goes Connecting… (1.3s) then
Connected with the kit's Check; 1.1s later the first review lands and one
lands every 3.2s after: a row slides in at the top of Recent requests
(Collapse, mounted closed then opened a frame later), the Count rolls up
one, the Chart takes the point, the phone drops in "New 5-star review ·
<name>" while the previous one folds away under it. The list keeps the
last five rows; older ones leave under the window's foot. Nothing resets:
off screen or in a hidden tab it pauses and resumes. Poster: reduced
motion shows Connected, two reviews in, derived not set.

Captured: stills at 1280 and 390 (Connected, a few reviews in) through
the skill's `film.mjs`; the real page in Chrome at both widths through
the devtools MCP. Looks: light only.

Film (`--still`): no framing or crop lines on wide. Compact: `framing:
div.ss-window shows 342x454, narrower than tall for a desktop window` —
deliberate; the window is cropped tall so four live rows of the recent
list show under the chart, which is what the demo is for at that width.
Stands. Transitions checked live: a new row's height grows 0→37px over
about 400ms and the count's reel runs 650ms (the Stage is not a still).

Review (own fresh eye, both beside the gold): the eye lands on the count,
then the newest row, then the phone; one window leads; nothing real is
cut; the phone covers only the window's margin on wide and the list's
right end (the 5-star badges) on compact, by design.

Assumptions: the studio, the names and every figure are fictional and the
caption under the stage says so. `app.fynnd.co/reviews` is a drawn
address.
Unresolved: film's hydration "1 Issue" badge is Next's dev overlay
reacting to the script tagging the stage before React hydrates; the
page's own console is clean.
Not checked: a real iPhone, Safari, a resize across 600 mid-play, a very
long session (the names cycle every twelve reviews; the count has no cap).
