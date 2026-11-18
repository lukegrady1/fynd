"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { manage } from "@/content/copy";

/**
 * A link out to the free Google Business Profile audit
 * (`manage.audit.url`), in a new tab so the sales page stays open behind
 * it. Counted as a `cta_click` with its own section, like the checkout
 * buttons, so the audit's pull shows up beside theirs.
 */
export function AuditLink({
  section,
  className,
  children,
}: {
  section: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={manage.audit.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("cta_click", { cta: manage.audit.cta, section })}
      className={className}
    >
      {children}
      <span className="sr-only"> {manage.audit.newTabSr}</span>
    </a>
  );
}
