"use client";

import { useMemo, useSyncExternalStore } from "react";

import { offer } from "@/content/copy";

/**
 * A seven-day clock that rolls over every Sunday at midnight, in the offer's
 * fixed timezone so every visitor sees the same number.
 *
 * Recorded plainly because it matters: reaching zero does NOT change the
 * price. It rolls to a fresh seven days and $97 stays $97. That is a product
 * decision, made knowingly, and it is the pattern the build spec's §5 warns
 * about ("a timer whose expiry doesn't actually change the price"). Nothing
 * downstream should treat this as a pricing signal — it is presentation only,
 * which is why this module no longer exports a price.
 *
 * Read through useSyncExternalStore so there is no effect-driven setState and
 * no hydration mismatch: the server snapshot is null and the real value lands
 * on the client's first commit.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const partsFormatter = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: offer.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

/**
 * Milliseconds until the next Sunday 00:00 in `offer.timeZone`.
 *
 * Landing exactly on the boundary yields a full week rather than zero, so the
 * clock never shows 0d 00:00:00. DST weeks are an hour out either way; for a
 * presentational counter that is not worth a date library.
 */
const msUntilReset = (now: number): number => {
  const parts = partsFormatter().formatToParts(new Date(now));
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "0";

  const weekday = WEEKDAY_INDEX[get("weekday")] ?? 0;
  // "24" appears at midnight under hour12: false in some engines.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  const second = Number(get("second"));

  const daysAhead = (7 - weekday) % 7 || 7;
  const elapsedToday = (hour * 3600 + minute * 60 + second) * 1000;

  return daysAhead * DAY_MS - elapsedToday;
};

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
};

export type OfferWeek =
  /** Server render and first hydration — render nothing rather than guess. */
  | { state: "unknown" }
  | {
      state: "open";
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      /** Preformatted "3d 04:48:10", for anywhere wanting one string. */
      label: string;
    };

const pad = (n: number) => String(n).padStart(2, "0");

export function useOfferWeek(): OfferWeek {
  const store = useMemo(
    () => ({
      subscribe,
      getSnapshot: () => Math.ceil(msUntilReset(Date.now()) / 1000),
      getServerSnapshot: (): number | null => null,
    }),
    [],
  );

  const secondsLeft = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  if (secondsLeft === null) return { state: "unknown" };

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return {
    state: "open",
    days,
    hours,
    minutes,
    seconds,
    label: `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}
