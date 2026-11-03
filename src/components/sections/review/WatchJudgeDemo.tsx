"use client";

import { Star } from "lucide-react";
import {
  Avatar,
  Badge,
  Bar,
  Chart,
  Check,
  Collapse,
  Count,
  LockScreen,
  Notification,
  Phone,
  Roll,
  Stage,
  States,
  Window,
  WALLPAPER,
  type Act,
} from "@/components/stageshow/kit";
import "@/components/stageshow/fynd.css";
import "./watch-judge-demo.css";

/**
 * The free week, as the product shows it: a device pair (stageshow's
 * `device-pair` gold, Fynd's look). The hero is the reviews dashboard,
 * pinned top-left and off the bottom: the studio, a day chip, the one big
 * number (reviews) with the rating beside it, a chart, the booking
 * software strip, and the recent requests. The satellite is a phone
 * straddling its right edge, lock screen up, with the owner's
 * notifications from the Fynd app.
 *
 * A system story, no cursor, in five beats: the wave is out (frame one),
 * a review lands (the count rolls, a notification drops in), a second
 * lands, the booking software connects, and the day chip rolls to 7.
 * The payoff holds, then the scene crossfades to a second studio (the
 * subscriptions gold's reset: a different business on the same product,
 * so nothing rewinds in view) and plays once more before returning.
 *
 * ILLUSTRATION. Both studios are fictional (Marlow is the homepage's
 * made-up salon; the second is one of the placeholder testimonials), and
 * every figure is drawn, not measured; the caption under the stage says
 * so. Nothing here claims a result.
 */

type Scene = {
  studio: string;
  reviews: number;
  rating: string;
  history: number[];
  people: [string, string];
};

const SCENES: Scene[] = [
  {
    studio: "Marlow Hair Studio",
    reviews: 31,
    rating: "4.8",
    history: [20, 21, 21, 23, 24, 24, 26, 27, 29, 30, 31],
    people: ["Dana M.", "Priya S."],
  },
  {
    studio: "Bright Lane Nail Studio",
    reviews: 19,
    rating: "4.9",
    history: [9, 10, 10, 12, 13, 13, 15, 16, 17, 18, 19],
    people: ["Jordan K.", "Amelia R."],
  },
];

type Connect = "off" | "pending" | "on";
type S = {
  scene: number;
  /** Per scene: reviews landed (0–2), day on the chip, the second notification shown, the booking connection. */
  landed: [number, number];
  day: [number, number];
  note: [boolean, boolean];
  connect: [Connect, Connect];
};

const START: S = { scene: 0, landed: [0, 0], day: [1, 1], note: [false, false], connect: ["off", "off"] };
/** The payoff: the week done on the first studio. */
const POSTER: S = { ...START, landed: [2, 0], day: [7, 1], note: [true, false], connect: ["on", "off"] };

const set2 = <T,>(pair: [T, T], i: number, v: T): [T, T] => (i === 0 ? [v, pair[1]] : [pair[0], v]);

async function week(a: Act<S>, sc: number) {
  // The first review lands: the count rolls and the phone hears about it
  await a.set((s) => ({ landed: set2(s.landed, sc, 1), note: set2(s.note, sc, true) }));
  await a.wait(2300);
  // A second lands; said once on the phone, so only the dashboard moves
  await a.set((s) => ({ landed: set2(s.landed, sc, 2) }));
  await a.wait(1900);
  // The wave is done, so the booking software is connected
  await a.set((s) => ({ connect: set2(s.connect, sc, "pending") }));
  await a.wait(900);
  await a.set((s) => ({ connect: set2(s.connect, sc, "on"), day: set2(s.day, sc, 7) }));
}

async function script(a: Act<S>) {
  await a.wait(1100);
  await week(a, 0);
  // The mark lands after the roll, so a frame at it is never mid-change
  await a.wait(800);
  a.mark("payoff");
  await a.wait(1800);

  // The second studio: the scene change is the reset. The studio that
  // left is put back while hidden; with `set`, not `snap`, so its count
  // rolls down out of sight rather than jumping (a hidden reel that jumps
  // still reads as a hop to the film).
  a.mark("scene");
  await a.set({ scene: 1 });
  await a.wait(700);
  await a.set((s) => ({ landed: set2(s.landed, 0, 0), day: set2(s.day, 0, 1), note: set2(s.note, 0, false), connect: set2(s.connect, 0, "off") }));
  await a.wait(600);
  await week(a, 1);
  await a.wait(2400);

  await a.set({ scene: 0 });
  await a.wait(700);
  await a.set((s) => ({ landed: set2(s.landed, 1, 0), day: set2(s.day, 1, 1), note: set2(s.note, 1, false), connect: set2(s.connect, 1, "off") }));
  await a.wait(900);
}

/** Filler rows under the two real ones: requests that were there already. */
const OLD = [
  { name: 62, status: 34 },
  { name: 78, status: 40 },
  { name: 54, status: 34 },
];

function Dashboard({ sc, s, compact }: { sc: number; s: S; compact: boolean }) {
  const scene = SCENES[sc];
  const landed = s.landed[sc];
  const total = scene.reviews + landed;
  const data = [...scene.history.slice(0, -1), total];
  const connect = s.connect[sc];

  return (
    <div className="wj-scene" data-on={s.scene === sc || undefined} aria-hidden={s.scene !== sc || undefined}>
      <aside className="wj-sidebar">
        <span className="wj-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- a 16px mark inside a drawn window */}
          <img src="/transparent-fynd.PNG" alt="" />
          Fynd
        </span>
        {[46, 58, 40, 52, 36].map((w, i) => (
          <div key={i} className="wj-nav" data-active={i === 1 || undefined}>
            <Bar w={10} h={10} r={3} tone={i === 1 ? 4 : 2} />
            <Bar w={w} h={5} tone={i === 1 ? 4 : 2} />
          </div>
        ))}
      </aside>

      <div className="wj-main">
        <div className="wj-content">
        <div className="wj-head">
          <span className="wj-studio">{scene.studio}</span>
          <Badge tone="accent">
            <Roll variant="fade">{`Day ${s.day[sc]}`}</Roll>
          </Badge>
        </div>

        <section className="wj-figure">
          <span className="wj-label">Google reviews</span>
          <div className="wj-count">
            <Count className="wj-total" value={total} duration={900} />
            <span className="wj-rating">
              <Star size={12} strokeWidth={0} fill="currentColor" aria-hidden />
              {scene.rating}
            </span>
          </div>
        </section>

        {/* Under the number, above the chart, so it stays clear of the phone
            at both widths: the last beat has to be seen. */}
        <div className="wj-connect" data-on={connect === "on" || undefined}>
          <Check on={connect === "on"} pending={connect === "pending"} size={16} />
          <span>Booking software</span>
          <span className="wj-connect__state">
            <Roll variant="fade">{connect === "on" ? "Connected" : connect === "pending" ? "Connecting…" : "Waiting"}</Roll>
          </span>
        </div>

        <Chart data={data} width={224} height={compact ? 48 : 64} className="wj-chart" />

        <div className="wj-list">
          <div className="wj-list__title">Recent requests</div>
          {/* Compact: the phone covers the list, so its rows are all filler
              there and the review lands on the phone and the count only. */}
          {(compact ? [] : scene.people).map((name, i) => {
            const done = landed > i;
            return (
              <div key={name} className="wj-row">
                <Avatar name={name} size={22} />
                <span className="wj-name">{name}</span>
                {/* One slot, the two badges crossfaded in it (States holds
                    the larger), so "Sent" fades out rather than vanishing */}
                <States
                  value={done ? "done" : "sent"}
                  align="end"
                  states={{
                    sent: <Badge>Sent</Badge>,
                    done: (
                      <Badge tone="success" icon={<Star size={10} strokeWidth={0} fill="currentColor" aria-hidden />}>
                        5 stars
                      </Badge>
                    ),
                  }}
                />
              </div>
            );
          })}
          {/* Compact's window is 342 tall: one filler row fills it, more would run past its foot */}
          {(compact ? OLD.slice(0, 1) : OLD).map((r, i) => (
            <div key={i} className="wj-row wj-row--old">
              <Bar w={22} h={22} r={11} tone={2} />
              <Bar w={r.name} h={5} tone={3} />
              <Bar w={r.status} h={5} tone={2} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

function NoteIcon() {
  return (
    <span className="wj-note-icon">
      {/* eslint-disable-next-line @next/next/no-img-element -- the app's own mark on its notification */}
      <img src="/transparent-fynd.PNG" alt="" />
    </span>
  );
}

export function WatchJudgeDemo() {
  return (
    <Stage<S>
      width={640}
      height={420}
      compact={{ below: 600, width: 358, height: 500 }}
      initial={START}
      poster={POSTER}
      script={script}
      className="look-fynd wj-demo"
    >
      {(s, _rect, layout) => {
        const sc = s.scene;
        const compact = layout === "compact";
        return (
          <>
            <Window url="app.fynnd.co/reviews" className="wj-window">
              <div className="wj-scenes">
                <Dashboard sc={0} s={s} compact={compact} />
                <Dashboard sc={1} s={s} compact={compact} />
              </div>
            </Window>

            <Phone width={compact ? 320 : 236} frame="pro" dark wallpaper={WALLPAPER} className="wj-phone">
              <LockScreen size="satellite" stack="top" clock={!compact}>
                <Notification icon={<NoteIcon />} title="Review requests sent" body="Your past customers have been asked" time="9:41" />
                {/* One per studio, so the leaving scene's review folds away
                    with its own name on it and the next arrives as new */}
                {SCENES.map((scene, i) => (
                  <Collapse key={scene.studio} open={s.scene === i && s.note[i]} reveal="drop">
                    <Notification icon={<NoteIcon />} title="New 5-star review" body={`${scene.people[0]} · reply posted in your voice`} />
                  </Collapse>
                ))}
              </LockScreen>
            </Phone>
          </>
        );
      }}
    </Stage>
  );
}
