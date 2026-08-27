"use client";

/**
 * Thin analytics shim. Every event carries `cid` and `page` so events tie back
 * to the SMS list. Swap the transport in `send` once an analytics provider is
 * wired up — nothing else needs to change.
 */

export type AnalyticsEvent =
  | "page_view"
  | "vsl_play"
  | "vsl_25"
  | "vsl_50"
  | "vsl_75"
  | "vsl_complete"
  | "cta_click"
  | "faq_open"
  /** Problem-story drawer opened; `state` carries which of the four. */
  | "problem_drawer_open"
  /** Feature modal opened; `feature` carries which of the four. */
  | "feature_modal_open"
  | "checkout_started"
  | "checkout_completed"
  | "calendar_loaded"
  | "booking_completed"
  | "scroll_depth_50"
  | "scroll_depth_90";

export type PageId =
  | "home"
  | "demo"
  | "start"
  | "call"
  | "welcome"
  | "confirmed";

type Props = Record<string, string | number | boolean | undefined>;

let context: { cid?: string; page: PageId } = { page: "start" };

export const setAnalyticsContext = (next: { cid?: string; page: PageId }) => {
  context = next;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const send = (event: AnalyticsEvent, props: Props) => {
  if (typeof window === "undefined") return;

  const payload = { event, ...context, ...props };

  // TODO(integration): point this at the real analytics provider.
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
};

/** Events that should fire at most once per page load. */
const fired = new Set<string>();

export const track = (event: AnalyticsEvent, props: Props = {}) =>
  send(event, props);

export const trackOnce = (event: AnalyticsEvent, props: Props = {}) => {
  const key = `${event}:${JSON.stringify(props)}`;
  if (fired.has(key)) return;
  fired.add(key);
  send(event, props);
};
