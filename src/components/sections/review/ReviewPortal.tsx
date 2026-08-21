import { ExternalLink, Sparkles, ThumbsUp } from "lucide-react";
import { mechanism } from "@/content/copy";
import { cn } from "@/lib/utils";

/**
 * The customer-facing review portal, rendered in Fynd's palette.
 *
 * This is the screen someone lands on after tapping the link in the text, so
 * it is the one artifact on the page a customer actually sees. Excellent and
 * Good route to Google; Ok and Bad route to the private inbox — the option
 * tiles are tinted to make that split visible without explaining it.
 */
export function ReviewPortal({
  business,
  className,
}: {
  business: string;
  className?: string;
}) {
  const { portal } = mechanism.sms;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[380px] rounded-lg border border-line bg-white p-5 shadow-lg lg:p-6",
        className,
      )}
    >
      {/* Business identity — their logo sits here in the real thing. */}
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-[15px] font-bold text-white"
        >
          {business.charAt(0)}
        </span>
        <p className="mt-3 text-[15px] font-semibold text-ink">
          {`${portal.title.replace("?", "")} with ${business}?`}
        </p>
        <p className="mt-1 text-small text-ink-soft">{portal.subtitle}</p>
      </div>

      {/* Four-point scale. Tinting shows where each answer goes. */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {portal.options.map((opt, i) => (
          <div
            key={opt.label}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-md border p-2",
              i === 0
                ? "border-fynd-green bg-fynd-green/10"
                : opt.routesPublic
                  ? "border-line bg-white"
                  : "border-line bg-fynd-gray",
            )}
          >
            <Face kind={opt.face} />
            <span className="text-[11px] font-semibold text-ink">
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className="text-[13px] font-semibold text-ink">{portal.likeMost}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {portal.chips.map((chip, i) => (
            <span
              key={chip}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-small",
                i === 0
                  ? "border-fynd-blue bg-fynd-blue text-white"
                  : "border-fynd-blue/40 bg-white text-fynd-blue",
              )}
            >
              {i === 0 && (
                <ThumbsUp aria-hidden="true" className="h-3 w-3 shrink-0" />
              )}
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* The draft. They read it, edit it, or ignore it. */}
      <div className="mt-5 border-t border-line pt-5">
        <p className="text-[13px] font-semibold text-ink">
          {portal.draftPrompt}
        </p>
        <div className="mt-3 flex gap-2 rounded-md bg-fynd-green/12 p-3">
          <Sparkles
            aria-hidden="true"
            strokeWidth={1.75}
            className="mt-0.5 h-4 w-4 shrink-0 text-[#0F8F6E]"
          />
          <p className="text-small text-ink">{portal.draft}</p>
        </div>

        <span className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-fynd-blue px-4 text-small font-semibold text-white">
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          {portal.postCta}
        </span>
      </div>
    </div>
  );
}

/** Simple drawn faces rather than emoji, so they render identically everywhere. */
function Face({ kind }: { kind: string }) {
  const mouth =
    kind === "grin"
      ? "M6.5 12.5c1 1.8 2.6 2.8 4.5 2.8s3.5-1 4.5-2.8"
      : kind === "smile"
        ? "M7 12.8c.9 1.3 2.3 2 4 2s3.1-.7 4-2"
        : kind === "neutral"
          ? "M7.2 13.5h7.6"
          : "M7 14.6c.9-1.3 2.3-2 4-2s3.1.7 4 2";

  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="h-6 w-6">
      <circle cx="11" cy="11" r="10" fill="#FFB400" />
      <circle cx="7.8" cy="8.6" r="1.3" fill="#0B132B" />
      <circle cx="14.2" cy="8.6" r="1.3" fill="#0B132B" />
      <path
        d={mouth}
        fill={kind === "grin" ? "#0B132B" : "none"}
        stroke="#0B132B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
