"use client";

import { useEffect, useRef, useState } from "react";
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
  Window,
  WALLPAPER,
  type Act,
} from "@/components/stageshow/kit";
import "@/components/stageshow/fynd.css";
import "./watch-judge-demo.css";

/**
 * The free week, as the product shows it: a device pair (stageshow's
 * `device-pair` gold, Fynd's look). The hero is the reviews dashboard,
 * pinned top-left and off the bottom: the studio with a Live badge, the
 * one big number (reviews) with the rating, the booking-software strip,
 * a chart, and the recent requests. The satellite is a small phone on
 * the right, lock screen up, with the owner's notifications.
 *
 * It runs like the storefront on /manage (Luke, Nov 3, 2026: "I want it
 * like the one we did on the manage page, where the count just keeps
 * going up"): the booking software connects first (Connecting… →
 * Connected), then a review lands every few seconds for as long as the
 * card is on screen — a new row slides in at the top of Recent requests,
 * the count rolls up, the chart takes the point, the phone gets the
 * notification — and nothing ever resets. Off screen or in a hidden tab
 * it pauses and carries on from where it was. The Stage is used for its
 * frame, scaling and compact design only; the state lives here, not in
 * a looping script, because a script's loop would rewind the count.
 *
 * ILLUSTRATION: the studio is fictional, the names are made up and every
 * figure is drawn, not measured; the caption under the stage says so.
 */

const STUDIO = "Marlow Hair Studio";
const START_COUNT = 31;
const RATING = "4.8";
const HISTORY = [20, 21, 21, 23, 24, 24, 26, 27, 29, 30];
const NAMES = ["Dana M.", "Priya S.", "Jordan K.", "Amelia R.", "Marcus T.", "Sofia M.", "Elena K.", "Devon S.", "Jenna L.", "Theo B.", "Nia W.", "Casey O."];

/**
 * A Stage with no script is a still: it marks itself `data-still` and the
 * kit's motion parts (Collapse, Count, Roll) switch their transitions off,
 * which made every arrival snap. This script does nothing but keep the
 * stage live; the scene is driven from the component's own state.
 */
const keepAlive = async (a: Act<Record<string, never>>) => {
  await a.wait(60_000);
};

const CONNECT_MS = 1300;
const FIRST_MS = 1100;
const CYCLE_MS = 3200;
/** Rows kept in the list; older ones have scrolled off the window's foot. */
const KEEP = 5;

type Connect = "off" | "pending" | "on";
type Review = { id: number; name: string; shown: boolean };

export function WatchJudgeDemo() {
  const [connect, setConnect] = useState<Connect>("off");
  const [count, setCount] = useState(START_COUNT);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const next = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    let onScreen = false;
    let running = false;
    let timer = 0;
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));

    const land = async () => {
      const id = next.current++;
      const name = NAMES[id % NAMES.length];
      // Mounted closed, then opened a frame later, so the row slides in
      // rather than appearing; the oldest beyond KEEP is let go.
      setReviews((rs) => [{ id, name, shown: false }, ...rs].slice(0, KEEP));
      await wait(40);
      setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, shown: true } : r)));
      setCount((n) => n + 1);
    };

    const run = async () => {
      if (running) return;
      running = true;
      try {
        // First time only: the booking software connects, then the reviews start.
        if (next.current === 0) {
          setConnect("pending");
          await wait(CONNECT_MS);
          if (!running) return;
          setConnect("on");
          await wait(FIRST_MS);
          if (!running) return;
        }
        while (onScreen && !document.hidden) {
          await land();
          if (!running) return;
          await wait(CYCLE_MS);
        }
      } finally {
        running = false;
      }
    };
    const stop = () => {
      running = false;
      window.clearTimeout(timer);
    };
    const sync = () => (onScreen && !document.hidden ? void run() : stop());

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [reduced]);

  // Reduced motion: the picture a few reviews in, still, derived rather
  // than set so nothing moves and nothing is written in an effect.
  const shownConnect: Connect = reduced ? "on" : connect;
  const shownCount = reduced ? START_COUNT + 2 : count;
  const shownReviews: Review[] = reduced ? STILL_REVIEWS : reviews;
  const latest = shownReviews[0];
  const data = [...HISTORY.slice(-10), shownCount];

  return (
    <div ref={root}>
      <Stage<Record<string, never>>
        width={640}
        height={420}
        compact={{ below: 600, width: 358, height: 470 }}
        initial={{}}
        script={keepAlive}
        className="look-fynd wj-demo"
      >
        {(_s, _rect, layout) => {
          const compact = layout === "compact";
          return (
            <>
              <Window url="app.fynnd.co/reviews" className="wj-window">
                <div className="wj-scene">
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
                        <span className="wj-studio">{STUDIO}</span>
                        <Badge tone="success" dot>
                          Live
                        </Badge>
                      </div>

                      <section className="wj-figure">
                        <span className="wj-label">Google reviews</span>
                        <div className="wj-count">
                          <Count className="wj-total" value={shownCount} duration={650} />
                          <span className="wj-rating">
                            <Star size={12} strokeWidth={0} fill="currentColor" aria-hidden />
                            {RATING}
                          </span>
                        </div>
                      </section>

                      <div className="wj-connect" data-on={shownConnect === "on" || undefined}>
                        <Check on={shownConnect === "on"} pending={shownConnect === "pending"} size={16} />
                        <span>Booking software</span>
                        <span className="wj-connect__state">
                          <Roll variant="fade">{shownConnect === "on" ? "Connected" : shownConnect === "pending" ? "Connecting…" : "Waiting"}</Roll>
                        </span>
                      </div>

                      <Chart data={data} width={compact ? 300 : 248} height={compact ? 44 : 56} className="wj-chart" />

                      <div className="wj-list">
                        <div className="wj-list__title">Recent requests</div>
                        {shownReviews.map((r) => (
                          <Collapse key={r.id} open={r.shown} reveal="clip">
                            <div className="wj-row">
                              <Avatar name={r.name} size={22} />
                              <span className="wj-name">{r.name}</span>
                              <Badge tone="success" icon={<Star size={10} strokeWidth={0} fill="currentColor" aria-hidden />}>
                                5 stars
                              </Badge>
                            </div>
                          </Collapse>
                        ))}
                        {OLD.map((o, i) => (
                          <div key={i} className="wj-row wj-row--old">
                            <Bar w={22} h={22} r={11} tone={2} />
                            <Bar w={o.name} h={5} tone={3} />
                            <Bar w={o.status} h={5} tone={2} style={{ marginLeft: "auto" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Window>

              {/* No phone on phones (Luke, Nov 3, 2026: it never sat well with
                  the dashboard at that width); the dashboard alone, its list
                  whole. Desktop keeps the pair. */}
              {!compact && (
                <Phone width={224} frame="pro" dark wallpaper={WALLPAPER} className="wj-phone">
                  <LockScreen size="satellite" stack="top" clock={false}>
                    <Notification icon={<NoteIcon />} title="Review requests sent" body="Your past customers have been asked" time="9:41" />
                    {/* The latest review, and the one before it folding away under it */}
                    {shownReviews.slice(0, 2).map((r) => (
                      <Collapse key={r.id} open={r.shown && r.id === latest?.id} reveal="drop">
                        <Notification icon={<NoteIcon />} title="New 5-star review" body={`${r.name} · reply posted in your voice`} />
                      </Collapse>
                    ))}
                  </LockScreen>
                </Phone>
              )}
            </>
          );
        }}
      </Stage>
    </div>
  );
}

/** The reduced-motion still: two reviews in. */
const STILL_REVIEWS: Review[] = [1, 0].map((i) => ({ id: i, name: NAMES[i], shown: true }));

/** Filler rows under the live ones: requests that were there already. */
const OLD = [
  { name: 62, status: 34 },
  { name: 78, status: 40 },
  { name: 54, status: 34 },
];

function NoteIcon() {
  return (
    <span className="wj-note-icon">
      {/* eslint-disable-next-line @next/next/no-img-element -- the app's own mark on its notification */}
      <img src="/transparent-fynd.PNG" alt="" />
    </span>
  );
}
