"use client";

import { useEffect } from "react";
import {
  setAnalyticsContext,
  trackOnce,
  type PageId,
} from "@/lib/analytics";

/**
 * Sets the analytics context (so every event carries `cid` and `page`), fires
 * page_view, and reports scroll depth at 50% and 90%.
 */
export function PageTracking({ page, cid }: { page: PageId; cid?: string }) {
  useEffect(() => {
    setAnalyticsContext({ page, cid });
    trackOnce("page_view");

    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      if (pct >= 50) trackOnce("scroll_depth_50");
      if (pct >= 90) trackOnce("scroll_depth_90");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, cid]);

  return null;
}
