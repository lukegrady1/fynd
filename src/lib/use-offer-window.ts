"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * A short claim window that starts on the visitor's FIRST visit and survives
 * reloads.
 *
 * The start timestamp is persisted, so refreshing the page does not hand the
 * visitor a fresh ten minutes. That matters: a countdown that silently
 * restarts is the thing the build spec warns gets noticed, and it is the
 * difference between a real deadline and theatre. The window only resets if
 * the visitor clears storage or arrives in a different browser.
 *
 * Read through useSyncExternalStore so there is no effect-driven setState and
 * no hydration mismatch — the server snapshot is null, and the real value
 * lands on the client's first commit.
 */

export const OFFER_WINDOW_MS = 10 * 60 * 1000;

const STORAGE_KEY = "fynd:offer-window-start";

/** Returns the persisted start, creating it on first visit. */
const readStart = (): number => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;

    const now = Date.now();
    window.localStorage.setItem(STORAGE_KEY, String(now));
    return now;
  } catch {
    // Private browsing or storage disabled — fall back to this session.
    return Date.now();
  }
};

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
};

export type OfferWindow =
  /** Server render and first hydration — render nothing rather than guess. */
  | { state: "unknown" }
  | { state: "open"; secondsLeft: number; label: string }
  | { state: "closed" };

const pad = (n: number) => String(n).padStart(2, "0");

export function useOfferWindow(): OfferWindow {
  const store = useMemo(() => {
    const getSnapshot = () => {
      const remaining = readStart() + OFFER_WINDOW_MS - Date.now();
      if (remaining <= 0) return -1;
      return Math.ceil(remaining / 1000);
    };

    return {
      subscribe,
      getSnapshot,
      getServerSnapshot: (): number | null => null,
    };
  }, []);

  const secondsLeft = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  if (secondsLeft === null) return { state: "unknown" };
  if (secondsLeft < 0) return { state: "closed" };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    state: "open",
    secondsLeft,
    label: `${minutes}:${pad(seconds)}`,
  };
}
