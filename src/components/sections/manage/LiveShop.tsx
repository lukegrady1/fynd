"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { manage } from "@/content/copy";
import { Count } from "@/components/stageshow/kit";
import "./live-shop.css";

/**
 * The storefront in the "Your business. Everywhere." card, alive: a
 * customer walks in from the right, the door swings open, they step
 * inside, the door closes and the customer count rolls up by one. Then
 * the next one. It runs for as long as the card is on screen and the
 * count never comes back down (Luke, Nov 3, 2026: "repeated over and over
 * ... with the count just continually going up until someone refreshes
 * the page"). Off screen or in a hidden tab it pauses where it is and
 * carries on from there; a reload is the only reset.
 *
 * Built in the stageshow way without a Stage: the kit's `Count` rolls the
 * number, the walk and the door are CSS transitions driven by a phase
 * state, and the figures are the storefront drawing's own (the same
 * head-hair-body-legs people the platform's illustration has, in a few
 * colourways). Under reduced motion nothing moves and the count stays
 * where it started.
 *
 * ILLUSTRATION: the count starts at the copy's figure and is not a
 * measurement; the panel is captioned "Illustrative activity" and the
 * screen-reader text says so.
 */

/** away: at the edge, unseen · walk: along the pavement · open: the door
    swings while the walker covers the last stretch · enter: steps in ·
    close: the door shuts and the count rolls. */
type Phase = "away" | "walk" | "open" | "enter" | "close";

/** Where the walker stands (SVG x) at each phase; y is the pavement. The
    drawing overflows its box (the plants and shadow need it), so "away" is
    just past the right edge and the walker is invisible there. */
const X = { away: 246, door: 149 };
const WALK_MS = 1700;
/** How far before the walker arrives the door starts to open (Luke, Nov 3,
    2026: "slightly earlier"): the last stretch of the walk. */
const DOOR_LEAD_MS = 520;
const DOOR_MS = 380;
const ENTER_MS = 520;
const REST_MS = 900;

/** Hair, skin, shirt: the drawing's own palette, a few people's worth. */
const PEOPLE = [
  { skin: "#e3b598", hair: "#68525c", shirt: "#7399e5" },
  { skin: "#ad795c", hair: "#493a47", shirt: "#8ebdaf" },
  { skin: "#f1c9a8", hair: "#2f2a33", shirt: "#f0a86b" },
  { skin: "#c58d6a", hair: "#3b2f2f", shirt: "#c58be0" },
  { skin: "#e8c0a2", hair: "#8a5a3c", shirt: "#4c5bff" },
];

export function LiveShop() {
  const c = manage.everywhere.centre;
  const [count, setCount] = useState(Number(c.count));
  const [phase, setPhase] = useState<Phase>("away");
  const [who, setWho] = useState(0);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The loop: runs only while the card is on screen and the tab is visible.
  // Each pass is one customer; the timers are cleared on pause and the
  // walker is put back at the edge, so a pause mid-walk resumes with a
  // fresh approach rather than a jump.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    let onScreen = false;
    let running = false;
    let timer = 0;
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));

    const run = async () => {
      if (running) return;
      running = true;
      try {
        while (onScreen && !document.hidden) {
          setWho((w) => (w + 1) % PEOPLE.length);
          setPhase("walk");
          await wait(WALK_MS - DOOR_LEAD_MS);
          if (!running) return;
          setPhase("open");
          await wait(DOOR_LEAD_MS);
          if (!running) return;
          setPhase("enter");
          await wait(ENTER_MS);
          if (!running) return;
          setCount((n) => n + 1);
          setPhase("close");
          await wait(DOOR_MS);
          if (!running) return;
          setPhase("away");
          await wait(REST_MS);
        }
      } finally {
        running = false;
      }
    };
    const stop = () => {
      running = false;
      window.clearTimeout(timer);
      setPhase("away");
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

  const person = PEOPLE[who];
  const x = phase === "away" ? X.away : X.door;
  const doorOpen = phase === "open" || phase === "enter";
  // Seen while walking (the door opening is still the walk): invisible at
  // the edge, gone once inside.
  const shown = phase === "walk" || phase === "open";

  return (
    <>
      <div ref={root} className="relative mx-auto mt-1.5 h-[98px] w-full max-w-[224px] sm:mt-2 sm:h-[116px]">
        <svg viewBox="0 0 240 144" fill="none" className="ls h-full w-full overflow-visible" data-phase={phase}>
          <defs>
            <linearGradient id="fynd-shop-wall" x1="60" y1="45" x2="180" y2="130" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffefa" />
              <stop offset="1" stopColor="#d9eaf8" />
            </linearGradient>
            <linearGradient id="fynd-shop-glass" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff5c9" />
              <stop offset="1" stopColor="#f7d8a8" />
            </linearGradient>
          </defs>
          <ellipse cx="119" cy="132" rx="88" ry="7" fill="#6188ba" opacity=".18" />
          <path d="M52 55h136v72a5 5 0 0 1-5 5H57a5 5 0 0 1-5-5Z" fill="url(#fynd-shop-wall)" stroke="#9bbadb" />
          <path d="M61 24h118a5 5 0 0 1 5 5v24H56V29a5 5 0 0 1 5-5Z" fill="#dceaff" stroke="#9bb7e8" />
          <rect x="90" y="32" width="60" height="14" rx="7" fill="#fffaf4" />
          <circle cx="104" cy="39" r="2" fill="#5eab88" />
          <text x="124" y="41.5" textAnchor="middle" fill="#659178" fontFamily="inherit" fontWeight="650" fontSize="7" letterSpacing="1.5">
            OPEN
          </text>
          <rect x="65" y="75" width="48" height="38" rx="3" fill="url(#fynd-shop-glass)" stroke="#d7b689" />
          <path d="m69 92 13-13m-9 23 23-23m-7 21 20-20" stroke="white" strokeOpacity=".6" strokeWidth="3" />
          <path d="M89 76v37M65 95h48" stroke="#c3a385" strokeWidth="1.3" />

          {/* The door: the frame, the dark inside, then the panel on a hinge
              at its left edge that swings toward the viewer (a scaleX from
              the hinge) when someone goes in. */}
          <rect x="128" y="73" width="42" height="58" rx="3" fill="#3a48d6" />
          <rect x="132" y="77" width="34" height="53" rx="1.5" fill="#1c2a55" />

          {/* The customer. Walks along the pavement from the right, steps
              through the open door and is gone. */}
          <g
            className="ls-walker"
            style={{ transform: `translate(${x}px, 120px) scale(.8)`, opacity: shown ? 1 : 0 }}
          >
            <circle cy="-20" r="5.2" fill={person.skin} />
            <path d="M-5-21c-1-8 12-9 11 1l-3-3-8 2Z" fill={person.hair} />
            <path d="M-7-8q0-8 7-8t7 8v9H-7Z" fill={person.shirt} />
            <path className="ls-leg ls-leg--l" d="M-4 1v10" stroke="#445c7b" strokeWidth="3.5" strokeLinecap="round" />
            <path className="ls-leg ls-leg--r" d="M4 1v10" stroke="#445c7b" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          <g className="ls-door" data-open={doorOpen || undefined}>
            <rect x="132" y="77" width="34" height="53" rx="1.5" fill="#c6dfff" />
            <rect x="132" y="77" width="34" height="53" rx="1.5" fill="#fff0c9" opacity=".26" />
            <path d="m136 98 25-18m-18 28 18-13" stroke="white" strokeOpacity=".42" strokeWidth="2" />
            <path d="M161 105v9" stroke="#315291" strokeWidth="2" strokeLinecap="round" />
          </g>

          <path d="M57 49h126l12 14H45Z" fill="#4c5bff" stroke="#3a48d6" />
          <path d="m72 49-6 14h22l3-14m19 0-1 14h22l-1-14m19 0 3 14h22l-6-14" fill="#e4eeff" />
          <path d="M45 63h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Zm43 0h21v5c0 9-21 9-21 0Z" fill="#4c5bff" />
          <path d="M66 63h22v5c0 9-22 9-22 0Zm43 0h22v5c0 9-22 9-22 0Zm43 0h22v5c0 9-22 9-22 0Z" fill="#e4eeff" />
          <path d="M38 130h-9l-2-14h13Z" fill="#ddbeab" />
          <path d="M33 117V98m0 12c-12-2-13-9-10-10 7-1 10 7 10 7m0-1c11-2 12-9 8-10-6-1-8 8-8 8" fill="#8ab295" stroke="#76a182" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M207 130h-9l-2-14h13Z" fill="#ddbeab" />
          <path d="M203 117V98m0 12c-12-2-13-9-10-10 7-1 10 7 10 7m0-1c11-2 12-9 8-10-6-1-8 8-8 8" fill="#8ab295" stroke="#76a182" strokeWidth="1.5" strokeLinecap="round" />
          {/* The one standing customer, at the window, from the drawing. */}
          <g transform="translate(53 123) scale(.85)">
            <circle cy="-20" r="5.2" fill="#ad795c" />
            <path d="M-5-23c0-6 11-6 10 1" fill="#493a47" />
            <path d="M-7-8q0-8 7-8t7 8v9H-7Z" fill="#8ebdaf" />
            <path d="M-4 1v10m8-10v10" stroke="#445c7b" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
        <span className="absolute -right-1 top-1 flex items-center gap-1 rounded-[9px] bg-[#fffefa] px-2 py-1.5 text-[8px] font-semibold text-[#3b8469] shadow-[0_5px_18px_rgba(23,55,112,0.13),0_0_0_1px_rgba(115,182,155,0.18)] sm:text-[9px]">
          <CalendarCheck strokeWidth={2} className="h-3 w-3" />
          {c.receipt}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-2 border-t border-[#356aa6]/[0.13] pt-2 text-left sm:gap-[11px] sm:pt-[11px]">
        <p data-count={count} className="whitespace-nowrap text-[36px] font-semibold leading-none tracking-[-2px] tabular-nums sm:text-[43px]">
          <span className="align-[4px] text-[23px] font-normal text-fynd-blue sm:mr-0.5 sm:text-[26px]">+</span>
          {/* ls-count: on phones the digit boxes are pulled together (live-shop.css) */}
          <Count value={count} duration={650} className="ls-count" />
        </p>
        <p className="text-[9px] font-medium leading-[1.4] text-[#365372] sm:text-[10px]">
          {c.countLabel}
          <span className="mt-0.5 block text-[7px] font-normal text-[#72899d] sm:text-[8px]">{c.countSub}</span>
        </p>
      </div>
    </>
  );
}
