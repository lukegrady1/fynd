import { fromZonedTime } from "date-fns-tz";

/**
 * IANA zone, never a fixed offset.
 *
 * "EST" is -05:00 all year; Eastern is -05:00 in winter and -04:00 in summer.
 * A fixed offset would put the anchor an hour out for roughly eight months of
 * the year, which for a midnight anchor means billing at 11pm on the last day
 * before it.
 */
export const BILLING_TIME_ZONE = "America/New_York";

/**
 * Days of the month everyone is consolidated onto.
 *
 * Two, not one. A single billing day on the 1st would mean someone signing up
 * on the 2nd waits 60 days for their second payment; the 15th halves the worst
 * case to 46 days.
 */
export const BILLING_DAYS = [1, 15] as const;

/** Calendar fields of an instant as they read in Eastern. */
const easternParts = (at: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BILLING_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(at);

  const field = (type: "year" | "month" | "day") =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: field("year"), month: field("month"), day: field("day") };
};

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * Unix seconds for midnight Eastern on the first billing day falling on or
 * after one month from now.
 *
 * BILLING SHAPE: the customer pays the full price up front and that payment
 * carries them to this date — always at least a full month, usually a little
 * more. Nothing is prorated in either direction: the extra days are given
 * away deliberately, in exchange for collecting a whole month on day one.
 *
 * Worked examples, with billing days of the 1st and 15th:
 *
 *   signs up 1 Aug  -> 1 Sep   (31 days)
 *   signs up 5 Aug  -> 15 Sep  (41 days)
 *   signs up 16 Aug -> 1 Oct   (46 days, the worst case)
 *   signs up 25 Aug -> 1 Oct   (37 days)
 *
 * The current date has to be read *in Eastern*, not in the server's zone. A
 * signup at 9pm ET on 31 January is already 02:00 UTC on 1 February, and a UTC
 * reading would push the anchor a whole month past where it belongs.
 *
 * `now` is injectable so the boundaries can be tested without waiting for a
 * month to turn over.
 */
export const nextBillingAnchor = (now: Date = new Date()): number => {
  const { year, month, day } = easternParts(now);

  // One month on, clamping to the shortest month — 31 Jan + 1 month is 28 Feb,
  // never 3 March. The clamp only ever shortens, and the search below then
  // walks forward to a real billing day, so no month is skipped.
  let y = month === 12 ? year + 1 : year;
  let m = month === 12 ? 1 : month + 1;
  let d = Math.min(day, daysInMonth(y, m));

  // First billing day on or after that date.
  const target = [...BILLING_DAYS].sort((a, b) => a - b).find((bd) => d <= bd);

  if (target === undefined) {
    // Past the last billing day of that month — roll to the first of the next.
    y = m === 12 ? y + 1 : y;
    m = m === 12 ? 1 : m + 1;
    d = BILLING_DAYS[0];
  } else {
    d = target;
  }

  // A wall-clock string with no offset, resolved *as* Eastern by fromZonedTime.
  // Building a Date and calling setMonth would resolve it in the server's zone
  // instead, which is the bug this whole module exists to avoid.
  const midnight = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T00:00:00`;

  return Math.floor(fromZonedTime(midnight, BILLING_TIME_ZONE).getTime() / 1000);
};

/** "October 1, 2026" — formatted in Eastern so server and client agree. */
export const formatAnchor = (unixSeconds: number): string =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: BILLING_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(unixSeconds * 1000));

/**
 * "1st" or "15th" — which of the two billing days this customer landed on.
 *
 * Read back out of the anchor rather than recomputed, so it cannot drift from
 * the date actually sent to Stripe.
 */
export const anchorDayOrdinal = (unixSeconds: number): string => {
  const day = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: BILLING_TIME_ZONE,
      day: "numeric",
    }).format(new Date(unixSeconds * 1000)),
  );

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix}`;
};
