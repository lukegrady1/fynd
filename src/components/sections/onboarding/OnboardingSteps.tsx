"use client";

import { useId, useSyncExternalStore } from "react";
import Script from "next/script";
import { ArrowRight, Check, ExternalLink } from "lucide-react";

import { onboardingPage, type OnboardingStep, type ServiceOnboarding } from "@/content/onboarding-steps";
import { GHL_EMBED_HOST, GHL_EMBED_SCRIPT } from "@/lib/ghl-embed";
import { Eyebrow } from "@/components/ui/Layout";
import { cn } from "@/lib/utils";

/**
 * The post-checkout steps for one service, with a checklist the customer
 * ticks off as they go.
 *
 * The ticks live in this browser only (localStorage, keyed by the session
 * id). They are for the customer's own sense of where they are; they tell us
 * nothing, and the page still works when storage is blocked (the ticks just
 * don't stick). What we
 * actually receive arrives through the GHL form and the access invites.
 */
type Props = {
  sessionId: string;
  content: ServiceOnboarding;
  /** FYND_GBP_ACCESS_URL, or null to say the link is coming by email. */
  gbpAccessUrl: string | null;
  /** GHL_ONBOARDING_FORM_ID, or null to say reply to the welcome email. */
  formId: string | null;
  prefill: { email: string; name: string | null; phone: string | null };
};

const storageKey = (sessionId: string) => `fynd-onboarding:${sessionId}`;

/*
 * The ticks as an external store over localStorage, so the server render and
 * the first client render agree (nothing ticked) and the saved ticks arrive
 * straight after. The snapshot is the raw string, which compares by value.
 */
const CHANGE = "fynd-onboarding-change";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
};

const readRaw = (key: string): string => {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
};

const parse = (raw: string): string[] => {
  try {
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
};

export function OnboardingSteps({ sessionId, content, gbpAccessUrl, formId, prefill }: Props) {
  const key = storageKey(sessionId);
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => "[]");
  const done = parse(raw);

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage blocked: the tick can't be kept */
    }
    window.dispatchEvent(new Event(CHANGE));
  };

  const allSteps = content.groups.flatMap((g) => g.steps);
  const doneCount = allSteps.filter((s) => done.includes(s.id)).length;

  return (
    <div>
      <h1 className="text-h1 text-ink">{content.heading}</h1>
      <p className="mt-3 text-body text-ink-soft">{content.intro}</p>

      <div className="mt-6" aria-live="polite">
        <div className="flex items-center justify-between text-small text-ink-soft">
          <span>{onboardingPage.progress(doneCount, allSteps.length)}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fynd-gray">
          <div
            className="h-full rounded-full bg-fynd-green transition-[width] duration-300 ease-fynd"
            style={{ width: `${(doneCount / allSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {content.groups.map((group, gi) => (
        <section key={gi} className="mt-10">
          {group.title && (
            <h2 className="mb-4">
              <Eyebrow>{group.title}</Eyebrow>
            </h2>
          )}
          <ol className="space-y-4">
            {group.steps.map((step) => {
              return (
                <StepCard
                  key={step.id}
                  number={allSteps.indexOf(step) + 1}
                  step={step}
                  done={done.includes(step.id)}
                  onToggle={() => toggle(step.id)}
                  gbpAccessUrl={gbpAccessUrl}
                  formId={formId}
                  prefill={prefill}
                />
              );
            })}
          </ol>
        </section>
      ))}

      <div className="mt-10 rounded-md bg-fynd-gray p-5">
        <h2 className="text-body font-semibold text-ink">{onboardingPage.nextHeading}</h2>
        {content.next.map((line, i) => (
          <p key={i} className="mt-2 text-body text-ink">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-6 text-small text-ink-soft">{onboardingPage.help}</p>
    </div>
  );
}

function StepCard({
  number,
  step,
  done,
  onToggle,
  gbpAccessUrl,
  formId,
  prefill,
}: {
  number: number;
  step: OnboardingStep;
  done: boolean;
  onToggle: () => void;
} & Pick<Props, "gbpAccessUrl" | "formId" | "prefill">) {
  return (
    <li className={cn("rounded-lg border bg-white p-5 sm:p-6", done ? "border-fynd-green" : "border-line")}>
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-small font-semibold text-white",
            done ? "bg-fynd-green" : "bg-fynd-blue",
          )}
        >
          {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : number}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-h3 text-ink">{step.title}</h3>

          {step.body.map((p, i) => (
            <p key={i} className="mt-2 text-body text-ink-soft">
              {withLinks(p, step.links)}
            </p>
          ))}

          {step.options && (
            <dl className="mt-3 space-y-3">
              {step.options.map((o) => (
                <div key={o.label} className="rounded-md bg-fynd-gray p-4">
                  <dt className="text-body font-semibold text-ink">{withLinks(o.label, step.links)}</dt>
                  <dd className="mt-1 text-body text-ink-soft">{withLinks(o.text, step.links)}</dd>
                </div>
              ))}
            </dl>
          )}

          {step.action === "gbp-access" &&
            (gbpAccessUrl ? (
              <a
                href={gbpAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] hover:shadow-blue sm:h-11"
              >
                {onboardingPage.gbpButton}
                <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-3 text-body text-ink">{onboardingPage.gbpPending}</p>
            ))}

          {step.action === "customer-form" &&
            (formId ? (
              <GhlForm formId={formId} prefill={prefill} />
            ) : (
              <p className="mt-3 text-body text-ink">{onboardingPage.formPending}</p>
            ))}

          {step.helpLink && (
            <a
              href={step.helpLink.path}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-small font-semibold text-fynd-blue hover:underline underline-offset-4"
            >
              {step.helpLink.label}
              <ArrowRight className="ml-1 inline h-4 w-4 align-[-3px]" strokeWidth={2} aria-hidden="true" />
            </a>
          )}

          {step.help && <p className="mt-2 text-small text-ink-soft">{step.help}</p>}

          <button
            type="button"
            onClick={onToggle}
            aria-pressed={done}
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-sm text-small font-semibold",
              done ? "text-fynd-green-text" : "text-fynd-blue hover:underline underline-offset-4",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px]",
                done ? "border-fynd-green-text bg-fynd-green-text text-white" : "border-fynd-blue",
              )}
            >
              {done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            {done ? onboardingPage.done : onboardingPage.markDone}
          </button>
        </div>
      </div>
    </li>
  );
}

/** Turns every occurrence of each link's text into an outbound link. */
function withLinks(text: string, links: OnboardingStep["links"]): React.ReactNode {
  if (!links?.length) return text;
  const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${links.map((l) => escape(l.text)).join("|")})`, "g");
  return text.split(pattern).map((part, i) => {
    const link = links.find((l) => l.text === part);
    return link ? (
      <a
        key={i}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-fynd-blue underline underline-offset-4 hover:no-underline"
      >
        {part}
      </a>
    ) : (
      part
    );
  });
}

/**
 * The GHL form with the customer-list upload and the CRM dropdown, prefilled
 * with what Stripe already knows so the customer doesn't retype it. GHL fills
 * standard fields from matching query params; any it doesn't recognise it
 * ignores. form_embed.js resizes the iframe by id, so the id has to survive
 * hydration (useId, as CalendarEmbed does).
 */
function GhlForm({ formId, prefill }: { formId: string; prefill: Props["prefill"] }) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frameId = `inline-${formId}_${reactId}`;

  const src = new URL(`https://${GHL_EMBED_HOST}/widget/form/${formId}`);
  src.searchParams.set("email", prefill.email);
  if (prefill.name) {
    const [first, ...rest] = prefill.name.trim().split(/\s+/);
    src.searchParams.set("first_name", first);
    if (rest.length) src.searchParams.set("last_name", rest.join(" "));
  }
  if (prefill.phone) src.searchParams.set("phone", prefill.phone);

  return (
    <>
      <iframe
        id={frameId}
        src={src.toString()}
        title={onboardingPage.formTitle}
        data-layout="{'id':'INLINE'}"
        data-form-id={formId}
        className="mt-4 block min-h-[560px] w-full bg-white"
      />
      <Script src={GHL_EMBED_SCRIPT} strategy="lazyOnload" />
    </>
  );
}
