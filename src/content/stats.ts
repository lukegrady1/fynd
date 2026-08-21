/**
 * Third-party market statistics.
 *
 * EMPTY ON PURPOSE. Numbers like "92% of consumers read reviews" circulate
 * widely, but printing an unverifiable figure as fact on a page you sell from
 * is a real risk — especially to the sort of owner who will look it up.
 *
 * Every entry needs a `source` naming the study and year. If you cannot name
 * the source, do not add the stat. The section renders nothing while this is
 * empty, and appears automatically once entries exist.
 *
 * The usual citation for local-review statistics is BrightLocal's annual
 * Local Consumer Review Survey. Pull the current year's figures from the
 * report itself rather than from a competitor's landing page.
 */

export type Stat = {
  /** e.g. "92%" */
  value: string;
  /** e.g. "of consumers read reviews before choosing a local business." */
  body: string;
  /** e.g. "BrightLocal, Local Consumer Review Survey 2025" — required. */
  source: string;
};

export const stats: Stat[] = [];

export const suppliedStats = () => stats.filter((s) => s.value && s.source);
