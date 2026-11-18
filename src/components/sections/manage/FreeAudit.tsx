import { ArrowUpRight, Check, ClipboardCheck } from "lucide-react";
import { manage } from "@/content/copy";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";
import { AuditLink } from "@/components/sections/manage/AuditLink";

/**
 * The free profile audit (Luke, Nov 17, 2026): the owner signs in with
 * Google, picks their Business Profile and gets a full report. A link out,
 * not an embed: the sign-in is Google's, and Google refuses to run its
 * sign-in inside another site's iframe. (The tool's `/light-audit/search`
 * URL is the embeddable, no-sign-in version, for running audits on leads.)
 *
 * On /manage between "your business, everywhere" and the first month, and
 * on the homepage, /reviews and /website too (Luke, Nov 17, 2026: "I want
 * everyone to basically run this audit", since the report sells full
 * management). A self-contained navy band, so it sits between sections of
 * any colour. `section` names the placement in analytics.
 */
type AuditCopy = {
  eyebrow: string;
  lead: string;
  accent: string;
  body: string;
  points: readonly string[];
};

export function FreeAudit({
  section = "free_audit",
  copy: override,
}: {
  section?: string;
  /** A page's own wording for the band (/website's); the button stays the same. */
  copy?: AuditCopy;
}) {
  const copy: AuditCopy & { cta: string } = { ...manage.audit, ...override };

  return (
    <section className="border-y border-white/10 bg-navy py-12 text-white lg:py-16">
      <Container>
        <Reveal className="mx-auto grid max-w-[960px] items-center gap-8 rounded-lg bg-navy-card p-6 ring-1 ring-white/10 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:p-10">
          <div>
            <p className="flex items-center gap-2 text-micro uppercase text-fynd-green">
              <ClipboardCheck className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-h2 text-white">
              {copy.lead} <span className="text-fynd-green">{copy.accent}</span>
            </h2>
            <p className="mt-3 text-body text-white/75">{copy.body}</p>
          </div>

          <div>
            <ul className="space-y-3">
              {copy.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body font-semibold text-white">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-fynd-green" strokeWidth={2.5} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <AuditLink
              section={section}
              className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-fynd-green px-6 text-body font-semibold text-navy transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-fynd-green2 hover:shadow-[0_6px_16px_rgba(25,211,162,.28)]"
            >
              {copy.cta}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                strokeWidth={2}
                aria-hidden="true"
              />
            </AuditLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
