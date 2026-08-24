/**
 * Third-party market statistics for the trust bar.
 *
 * `source` is optional but strongly wanted. These three came in without
 * citations, and the figures below are the ones that circulate rather than
 * ones this repo has verified against a report. Before launch, check each
 * against the primary source and fill `source` in — the bar renders it next
 * to the stat automatically, and a cited number is worth several uncited ones
 * to the kind of owner who will go and look it up.
 *
 * Likely primary sources, to verify rather than to copy:
 *  - 92% reading reviews  -> BrightLocal, Local Consumer Review Survey
 *  - 72% won't act        -> widely repeated in marketing write-ups; the
 *                            original study is not obvious, so this is the
 *                            one most worth pinning down or dropping.
 *  - 54% more revenue     -> Womply, review/revenue study
 *
 * Do not invent a citation to fill the field. An attributed figure that turns
 * out to be misattributed is worse than an unattributed one.
 */

export type Stat = {
  /** e.g. "92%" */
  value: string;
  /** e.g. "of consumers read reviews before choosing a local business." */
  body: string;
  /** e.g. "BrightLocal, Local Consumer Review Survey 2025". */
  source?: string;
};

export const stats: Stat[] = [
  {
    value: "92%",
    body: "Of consumers read online reviews before choosing a local business.",
  },
  {
    value: "72%",
    body: "Of customers won't take action until they read a positive review.",
  },
  {
    value: "54%",
    body: "More revenue is earned by businesses with 40+ reviews than by their competitors.",
  },
];

export const suppliedStats = () => stats.filter((s) => s.value && s.body);
