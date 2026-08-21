"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** Server can't know the preference; assume motion is allowed and correct on hydration. */
const getServerSnapshot = () => false;

/**
 * Tracks `prefers-reduced-motion: reduce`.
 *
 * Read through useSyncExternalStore so there's no effect-driven setState and
 * no hydration mismatch — the server snapshot is always false and the real
 * value lands on the client's first commit.
 */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
