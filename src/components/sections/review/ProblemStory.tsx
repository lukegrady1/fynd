"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Check, Star, X } from "lucide-react";
import { problemStory } from "@/content/copy";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";

type State = (typeof problemStory.states)[number];

/**
 * The problem, as one object the visitor operates rather than four paragraphs.
 *
 * Structure is headline -> one dominant card -> four controls. The card keeps
 * a fixed profile header and swaps only its body, so switching states reads as
 * the same profile restating the same problem four ways rather than four
 * unrelated graphics. The explanation is held back in a drawer until asked
 * for: the default view is a number and a link, and the detail is one click
 * deep.
 *
 * Requires JavaScript, unlike the Reveal pattern — it is a control, not
 * content styling. The server render is state 01 complete and readable, and
 * the four control labels are always visible, so a no-JS visitor still gets
 * the section's argument. The four states' full prose lives in `problem`,
 * which the FAQ and other sections still draw on.
 */
export function ProblemStory() {
  const [active, setActive] = useState(0);
  const [openState, setOpenState] = useState<State | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const states = problemStory.states;
  const current = states[active];

  const openDrawer = (state: State) => {
    track("problem_drawer_open", { state: state.n });
    setOpenState(state);
  };

  /** Roving focus, so the tablist is one tab stop and arrows move within it. */
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = states.length - 1;
    let next = i;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;

    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="bg-fynd-gray py-14 lg:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{problemStory.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">{problemStory.heading}</h2>
          <p className="measure mt-3 text-body text-ink-soft">
            {problemStory.sub}
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="mx-auto max-w-[760px]">
            <ProfileCard
              state={current}
              onOpen={() => openDrawer(current)}
            />

            <div
              role="tablist"
              aria-label={problemStory.heading}
              className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
            >
              {states.map((state, i) => (
                <button
                  key={state.n}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`problem-tab-${state.n}`}
                  aria-selected={i === active}
                  aria-controls="problem-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "group/tab rounded-md border p-3 text-left transition-all duration-200 ease-fynd focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue motion-reduce:transition-none",
                    i === active
                      ? "border-fynd-orange/45 bg-white shadow-sm"
                      : "border-line bg-white/50 hover:border-line hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "text-micro tabular-nums transition-colors duration-200",
                      i === active ? "text-ink" : "text-ink-soft",
                    )}
                  >
                    {state.n}
                  </span>
                  <span className="mt-1 block text-small font-semibold text-ink">
                    {state.tab}
                  </span>
                  {/* The active marker, scaled rather than width-animated so
                      it runs on the compositor. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-2 block h-[3px] origin-left rounded-full bg-fynd-orange transition-transform duration-250 ease-fynd motion-reduce:transition-none",
                      i === active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      <Drawer state={openState} onClose={() => setOpenState(null)} />
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Fixed profile chrome, swapping body.
 *
 * The header never changes — same business, same rating, same review count —
 * which is what makes the four states read as one situation rather than four.
 */
function ProfileCard({
  state,
  onOpen,
}: {
  state: State;
  onOpen: () => void;
}) {
  const { profile } = problemStory;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 lg:px-7 lg:py-5">
        <div className="min-w-0">
          <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
            {profile.label}
          </p>
          <p className="mt-1 text-h3 text-ink">{profile.business}</p>
          <p className="mt-0.5 text-small text-ink-soft">{profile.category}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="flex items-center justify-end gap-1.5">
            <span className="text-h3 font-bold tabular-nums text-ink">
              {profile.rating}
            </span>
            <Stars />
          </p>
          <p className="mt-1 text-small tabular-nums text-ink-soft">
            {profile.reviews} reviews
          </p>
        </div>
      </div>

      {/* key: remounts on switch so the enter animation replays. */}
      <div
        key={state.n}
        id="problem-panel"
        role="tabpanel"
        aria-labelledby={`problem-tab-${state.n}`}
        className="motion-safe:animate-[fynd-panel_260ms_var(--ease-fynd)_both]"
      >
        <div className="px-5 py-6 lg:px-7 lg:py-7">
          <Panel state={state} />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group/hook flex w-full items-center justify-between gap-4 border-t border-line bg-fynd-gray px-5 py-4 text-left transition-colors duration-200 ease-fynd hover:bg-[#eceff5] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fynd-blue motion-reduce:transition-none lg:px-7"
        >
          <span className="min-w-0">
            <span className="block text-body font-semibold text-ink">
              {state.hook}
            </span>
            <span className="mt-0.5 block text-small text-ink-soft">
              {state.linkLabel}
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-all duration-200 ease-fynd group-hover/hook:border-fynd-orange/50 group-hover/hook:translate-x-0.5 motion-reduce:transition-none">
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

/** One body per state. Each is bespoke — that is the point of the section. */
function Panel({ state }: { state: State }) {
  const { profile } = problemStory;

  if ("counts" in state) {
    return (
      <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
        <Figure value={profile.appointments} label={state.counts.leftLabel} />
        <Figure
          value={profile.reviews}
          label={state.counts.rightLabel}
          muted
        />
      </div>
    );
  }

  if ("day" in state) {
    return (
      <div>
        <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
          {state.day.label}
        </p>
        <ul className="mt-3 divide-y divide-line">
          {state.day.appointments.map((slot) => (
            <li
              key={slot.time}
              className="flex items-center gap-3 py-2 text-small"
            >
              <span className="w-14 shrink-0 tabular-nums text-ink-soft">
                {slot.time}
              </span>
              <span className="flex-1 text-ink">{slot.service}</span>
              <Check
                aria-hidden="true"
                strokeWidth={2.5}
                className="h-4 w-4 shrink-0 text-fynd-green-text"
              />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t-2 border-ink/10 pt-4">
          <span className="text-small text-ink-soft">
            {state.day.sentLabel}
          </span>
          <span className="text-h2 font-bold leading-none tabular-nums text-fynd-orange">
            {state.day.sent}
          </span>
        </div>
      </div>
    );
  }

  if ("message" in state) {
    return (
      <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:gap-8">
        <div>
          <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
            {state.message.fromLabel}
          </p>
          <div className="mt-2 rounded-[16px] rounded-tl-[4px] border border-line bg-fynd-gray p-4">
            <Stars />
            <p className="mt-2 text-body text-ink">
              &ldquo;{state.message.quote}&rdquo;
            </p>
            <p className="mt-2 text-micro tabular-nums text-ink-soft">
              {state.message.time}
            </p>
          </div>
        </div>

        <div className="sm:border-l sm:border-line sm:pl-8">
          <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
            {state.message.outcomeLabel}
          </p>
          <p
            aria-hidden="true"
            className="mt-2 text-h1 leading-none text-ink/15"
          >
            &mdash;
          </p>
          <p className="mt-2 text-body font-semibold text-fynd-orange">
            {state.message.outcome}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
        {state.search.query}
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {state.search.rows.map((row) => (
          <li
            key={row.name}
            className={cn(
              "flex items-center gap-3 rounded-md border p-3",
              "you" in row && row.you
                ? "border-fynd-orange/45 bg-fynd-orange/[0.06]"
                : "border-line bg-white",
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fynd-gray text-micro tabular-nums text-ink-soft">
              {row.rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-semibold text-ink">
                {row.name}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5">
                <span className="text-small tabular-nums text-ink">
                  {row.rating}
                </span>
                <Stars />
              </span>
            </span>
            <span className="shrink-0 text-small font-semibold tabular-nums text-ink">
              {row.reviews}
              <span className="ml-1 font-normal text-ink-soft">reviews</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Figure({
  value,
  label,
  muted,
}: {
  value: number;
  label: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-[44px] font-bold leading-none tracking-[-0.02em] tabular-nums",
          muted ? "text-fynd-orange" : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-small text-ink-soft">{label}</p>
    </div>
  );
}

function Stars() {
  return (
    <span aria-hidden="true" className="flex gap-px">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-[#FFB400] text-[#FFB400]"
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The detail, one click deep.
 *
 * Portalled to body rather than rendered in place: the card sits inside a
 * `Reveal`, and `.js-reveal` sets a transform before it becomes visible. A
 * transformed ancestor becomes the containing block for `position: fixed`,
 * which would pin the drawer to the card instead of the viewport.
 */
function Drawer({
  state,
  onClose,
}: {
  state: State | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Slide in on the frame after mount, so there is a state to transition from.
  useEffect(() => {
    if (!state) {
      setShown(false);
      return;
    }
    returnFocusRef.current = document.activeElement as HTMLElement;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [state]);

  // Escape closes; the page behind does not scroll; focus stays inside.
  useEffect(() => {
    if (!state) return;

    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus();
    };
  }, [state, onClose]);

  const goToSolution = useCallback(() => {
    track("cta_click", {
      cta: problemStory.ctaLabel,
      section: "problem_drawer",
    });
    onClose();
    document
      .getElementById(problemStory.ctaTargetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [onClose]);

  if (!mounted || !state) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={problemStory.closeLabel}
        onClick={onClose}
        className={cn(
          "absolute inset-0 h-full w-full cursor-default bg-navy/45 transition-opacity duration-250 motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-drawer-title"
        tabIndex={-1}
        className={cn(
          // Bottom sheet on phones, right drawer from sm up. A sheet that
          // slides in from the side is a desktop idiom; on a phone the thumb
          // is at the bottom of the screen and every native sheet arrives from
          // there. Height is content-based up to 88vh, so a short drawer hugs
          // its content instead of stranding the CTA at the bottom of the
          // viewport.
          "absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-y-auto rounded-t-lg bg-white shadow-2xl outline-none transition-transform duration-300 ease-fynd motion-reduce:transition-none",
          "sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-[420px] sm:rounded-none",
          // Two axes: the closed position differs per breakpoint, the open
          // one is the origin either way.
          shown
            ? "translate-x-0 translate-y-0"
            : "translate-x-0 translate-y-full sm:translate-x-full sm:translate-y-0",
        )}
      >
        {/* Grabber. Purely a signal that this is a sheet — the scrim, the
            close button and Escape all still dismiss it. */}
        <span
          aria-hidden="true"
          className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden"
        />

        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
              {state.n} &middot; {state.tab}
            </p>
            <h3
              id="problem-drawer-title"
              className="mt-1 text-h3 text-ink"
            >
              {state.drawer.title}
            </h3>
            <p className="mt-1 text-small text-ink-soft">
              {state.drawer.when}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={problemStory.closeLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:bg-fynd-gray hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <ol className="flex flex-col px-6 py-5">
          {state.drawer.steps.map((step, i) => (
            <li key={step.label} className="relative flex gap-3.5 pb-6 last:pb-0">
              {/* Spine between markers, stopping at the last one. */}
              {i < state.drawer.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px bg-line"
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2",
                  step.done
                    ? "border-fynd-green-text bg-fynd-green-text text-white"
                    : "border-line bg-white",
                )}
              >
                {step.done && <Check strokeWidth={3} className="h-3 w-3" />}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-body font-semibold",
                    step.done ? "text-ink" : "text-ink-soft",
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-small",
                    step.done ? "text-ink-soft" : "text-fynd-orange",
                  )}
                >
                  {step.note}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-auto border-t border-line px-6 py-6">
          {state.drawer.punch.map((line, i) => (
            <p
              key={line}
              className={cn(
                "text-h3",
                i === state.drawer.punch.length - 1
                  ? "text-ink"
                  : "text-ink-soft",
              )}
            >
              {line}
            </p>
          ))}

          <button
            type="button"
            onClick={goToSolution}
            className="group mt-5 flex h-13 w-full items-center justify-center rounded-sm bg-fynd-blue px-6 py-4 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:bg-[#3F4DF0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue motion-reduce:transition-none"
          >
            {problemStory.ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="ml-2 h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]"
            />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
