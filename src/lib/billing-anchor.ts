import { fromZonedTime } from "date-fns-tz";

/**
 * IANA zone, never a fixed offset.
 *
 * "EST" is -05:00 all year; Eastern is -05:00 in winter and -04:00 in summer.
 * A fixed offset would put the anchor an hour out for roughly eight months of
 * the year, which for a midnight anchor means billing at 11pm on the last day
 * of the previous month.
 */
export const BILLING_TIME_ZONE = "America/New_York";

/**
 * Unix seconds for midnight Eastern on the first of next month.
 *
 * This is the whole billing design: Stripe charges a prorated amount for the
 * rest of the current month at checkout, then the full price on this anchor,
 * then the 1st of every month after.
 *
 * The current month has to be read *in Eastern*, not in the server's zone.
 * A signup at 9pm ET on 31 January is already 02:00 UTC on 1 February — a
 * UTC-based reading would roll to March and bill the customer for a month
 * they had not reached yet.
 *
 * `now` is injectable so the boundaries can be tested without waiting for
 * a month to turn over.
 */
export const firstOfNextMonthEastern = (now: Date = new Date()): number => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BILLING_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const field = (type: "year" | "month") =>
    Number(parts.find((part) => part.type === type)?.value);

  const year = field("year");
  const month = field("month");

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  // A wall-clock string with no offset, resolved *as* Eastern by fromZonedTime.
  // Building a Date and calling setMonth would resolve it in the server's zone
  // instead, which is the bug this whole module exists to avoid.
  const midnightEastern = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00`;

  return Math.floor(fromZonedTime(midnightEastern, BILLING_TIME_ZONE).getTime() / 1000);
};
