"use client";

import { useId, useMemo, useState } from "react";
import { ArrowLeft, Check, CircleAlert, LoaderCircle, Mail, Search, ShieldCheck } from "lucide-react";

import { businessTypes, onboarding } from "@/content/onboarding";
import {
  orderPlatforms,
  platformById,
  resolveConnectMethod,
  searchPlatforms,
  type BusinessTypeId,
  type Platform,
  type PlatformId,
} from "@/lib/onboarding";
import { emailSchema, phoneSchema } from "@/lib/params";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * The onboarding form.
 *
 * Four steps, and the order is the argument: identify the business, learn the
 * vertical, pick the platform, then connect it. The vertical is asked before
 * the platform purely so the platform list can be reordered around it — a
 * barber should see Booksy first and never scroll past Mindbody.
 *
 * The profile is saved when step 3 completes, BEFORE the connect step is
 * attempted. Someone who bounces off a consent screen is still a captured
 * customer; blocking the save on the connection would lose them.
 */

type Values = {
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: BusinessTypeId | null;
  platform: PlatformId | null;
  otherPlatform: string;
  completionSignal: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const STEP_COUNT = 4;

export function OnboardingForm({
  cid,
  prefill,
  oauthReady,
  inviteEmail,
}: {
  cid?: string;
  prefill: { ownerName?: string; businessName?: string; email?: string; phone?: string };
  oauthReady: Record<string, boolean>;
  inviteEmail: string | null;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    ownerName: prefill.ownerName ?? "",
    businessName: prefill.businessName ?? "",
    email: prefill.email ?? "",
    phone: prefill.phone ?? "",
    businessType: null,
    platform: null,
    otherPlatform: "",
    completionSignal: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clearing on edit rather than re-validating on every keystroke: the error
    // was earned by a submit, and nagging mid-typing reads as hostile.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const platform = values.platform ? platformById(values.platform) : undefined;

  const validateStep = (index: number): Errors => {
    const e: Errors = {};
    if (index === 0) {
      if (!values.ownerName.trim()) e.ownerName = onboarding.errors.ownerName;
      if (!values.businessName.trim()) e.businessName = onboarding.errors.businessName;
      if (!emailSchema.safeParse(values.email.trim()).success) e.email = onboarding.errors.email;
      if (!phoneSchema.safeParse(values.phone.trim()).success) e.phone = onboarding.errors.phone;
    }
    if (index === 1 && !values.businessType) e.businessType = onboarding.errors.businessType;
    if (index === 2) {
      if (!values.platform) e.platform = onboarding.errors.platform;
      else if (values.platform === "other" && !values.otherPlatform.trim())
        e.otherPlatform = onboarding.errors.otherPlatform;
    }
    return e;
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "profile",
          cid: cid ?? null,
          ownerName: values.ownerName.trim(),
          businessName: values.businessName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          businessType: values.businessType,
          platform: values.platform,
          otherPlatform: values.otherPlatform.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      return true;
    } catch {
      setSaveError(onboarding.submit.error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const reportConnect = async (
    status: "oauth_started" | "invite_sent" | "manual" | "skipped",
  ) => {
    // Fire and forget. The profile is already saved, so a failure here costs a
    // status field, not the customer — and blocking the confirmation screen on
    // it would be a worse trade.
    void fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "connect",
        cid: cid ?? null,
        email: values.email.trim(),
        platform: values.platform,
        status,
        completionSignal: values.completionSignal.trim() || undefined,
      }),
    }).catch(() => {});
  };

  const next = async () => {
    const found = validateStep(step);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    // Leaving the software step is the capture point.
    if (step === 2 && !(await saveProfile())) return;
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  };

  const finish = (status: "invite_sent" | "manual") => {
    void reportConnect(status);
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-md border border-line bg-white p-6 lg:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fynd-green/15">
          <Check aria-hidden="true" strokeWidth={2.5} className="h-5 w-5 text-fynd-green-text" />
        </span>
        <h3 className="mt-4 text-h3 text-ink">{onboarding.done.heading}</h3>
        <p className="mt-2 text-body text-ink-soft">{onboarding.done.body}</p>
      </div>
    );
  }

  return (
    <div>
      <StepRail step={step} />

      <div className="mt-6 rounded-md border border-line bg-white p-5 lg:p-7">
        {step === 0 && (
          <DetailsStep
            values={values}
            errors={errors}
            set={set}
            prefilledEmail={Boolean(prefill.email)}
          />
        )}
        {step === 1 && (
          <BusinessTypeStep value={values.businessType} error={errors.businessType} set={set} />
        )}
        {step === 2 && (
          <SoftwareStep values={values} errors={errors} set={set} />
        )}
        {step === 3 && platform && (
          <ConnectStep
            platform={platform}
            method={resolveConnectMethod(platform, oauthReady)}
            inviteEmail={inviteEmail}
            completionSignal={values.completionSignal}
            set={set}
            onFinish={finish}
            onOauth={() => void reportConnect("oauth_started")}
          />
        )}

        {saveError && (
          <p className="mt-5 flex items-start gap-2 text-small text-ink">
            <CircleAlert
              aria-hidden="true"
              strokeWidth={2}
              className="mt-px h-4 w-4 shrink-0 text-fynd-orange"
            />
            {saveError}
          </p>
        )}

        {step < 3 && (
          <div className="mt-7 flex items-center gap-4">
            <Button onClick={next} disabled={saving} arrow={!saving}>
              {saving && (
                <LoaderCircle
                  aria-hidden="true"
                  strokeWidth={2}
                  className="h-4 w-4 animate-spin"
                />
              )}
              {saving ? onboarding.submit.sending : onboarding.submit.next}
            </Button>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 text-small font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                <ArrowLeft aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
                {onboarding.submit.back}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Progress rail. Numbered on desktop; on a 390px phone the four labels can't
 * sit side by side legibly, so it collapses to a bar plus "Step 2 of 4" —
 * which is the only part of the rail that was doing work at that width.
 */
function StepRail({ step }: { step: number }) {
  return (
    <div>
      <ol className="hidden gap-2 sm:flex">
        {onboarding.stepLabels.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "h-1 rounded-full transition-colors duration-200 ease-fynd",
                i <= step ? "bg-fynd-blue" : "bg-line",
              )}
            />
            <span
              className={cn(
                "text-small font-semibold",
                i === step ? "text-ink" : "text-ink-soft",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="sm:hidden">
        <div aria-hidden="true" className="flex gap-1.5">
          {onboarding.stepLabels.map((label, i) => (
            <span
              key={label}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-200 ease-fynd",
                i <= step ? "bg-fynd-blue" : "bg-line",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-small font-semibold text-ink-soft">
          Step {step + 1} of {STEP_COUNT} · {onboarding.stepLabels[step]}
        </p>
      </div>
    </div>
  );
}

function StepHeading({ heading, sub }: { heading: string; sub: string }) {
  return (
    <>
      <h3 className="text-h3 text-ink">{heading}</h3>
      <p className="mt-1.5 text-small text-ink-soft">{sub}</p>
    </>
  );
}

/**
 * Text input.
 *
 * The error message is `text-ink`, not orange: Fynd Orange fails AA on white
 * at this size (AGENTS.md), so the orange carries the signal through the icon
 * and the border while the words stay readable. Red is not an option here.
 */
function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-small font-semibold text-ink">
        {label} <span className="text-fynd-blue">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={type === "tel" ? "tel" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1.5 h-12 w-full rounded-sm border bg-white px-4 text-body text-ink",
          "placeholder:text-ink-muted transition-colors duration-150 ease-fynd",
          error ? "border-fynd-orange" : "border-line hover:border-ink-muted",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-small text-ink">
          <CircleAlert
            aria-hidden="true"
            strokeWidth={2}
            className="mt-px h-4 w-4 shrink-0 text-fynd-orange"
          />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-small text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function DetailsStep({
  values,
  errors,
  set,
  prefilledEmail,
}: {
  values: Values;
  errors: Errors;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
  prefilledEmail: boolean;
}) {
  return (
    <>
      <StepHeading heading={onboarding.details.heading} sub={onboarding.details.sub} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label={onboarding.details.ownerName.label}
          placeholder={onboarding.details.ownerName.placeholder}
          autoComplete="name"
          value={values.ownerName}
          error={errors.ownerName}
          onChange={(v) => set("ownerName", v)}
        />
        <Field
          label={onboarding.details.businessName.label}
          placeholder={onboarding.details.businessName.placeholder}
          autoComplete="organization"
          value={values.businessName}
          error={errors.businessName}
          onChange={(v) => set("businessName", v)}
        />
        <Field
          label={onboarding.details.email.label}
          placeholder={onboarding.details.email.placeholder}
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          hint={prefilledEmail ? onboarding.details.prefillNote : undefined}
          onChange={(v) => set("email", v)}
        />
        <Field
          label={onboarding.details.phone.label}
          placeholder={onboarding.details.phone.placeholder}
          type="tel"
          autoComplete="tel"
          value={values.phone}
          error={errors.phone}
          onChange={(v) => set("phone", v)}
        />
      </div>
    </>
  );
}

/**
 * Choice tile. A real radio input kept `sr-only` behind the label, so arrow-key
 * navigation, grouping and screen-reader semantics come from the platform
 * instead of being re-implemented with aria on buttons.
 */
function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex min-h-12 items-center justify-between gap-3 rounded-sm border px-4 py-3",
          "text-body text-ink transition-all duration-150 ease-fynd",
          "border-line hover:border-ink-muted",
          "peer-checked:border-fynd-blue peer-checked:bg-fynd-blue/6",
          "peer-focus-visible:outline peer-focus-visible:outline-[3px]",
          "peer-focus-visible:outline-fynd-blue/40 peer-focus-visible:outline-offset-2",
        )}
      >
        {children}
        <Check
          aria-hidden="true"
          strokeWidth={2.5}
          className={cn(
            "h-4 w-4 shrink-0 text-fynd-blue transition-opacity duration-150",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </label>
  );
}

function GroupError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-3 flex items-start gap-1.5 text-small text-ink">
      <CircleAlert
        aria-hidden="true"
        strokeWidth={2}
        className="mt-px h-4 w-4 shrink-0 text-fynd-orange"
      />
      {message}
    </p>
  );
}

function BusinessTypeStep({
  value,
  error,
  set,
}: {
  value: BusinessTypeId | null;
  error?: string;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
}) {
  return (
    <fieldset>
      <legend className="contents">
        <StepHeading heading={onboarding.business.heading} sub={onboarding.business.sub} />
      </legend>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {businessTypes.map((type) => (
          <Choice
            key={type.id}
            name="businessType"
            value={type.id}
            checked={value === type.id}
            onChange={() => set("businessType", type.id)}
          >
            {type.label}
          </Choice>
        ))}
      </div>
      <GroupError message={error} />
    </fieldset>
  );
}

function SoftwareStep({
  values,
  errors,
  set,
}: {
  values: Values;
  errors: Errors;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
}) {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const { suggested, rest } = useMemo(
    () => orderPlatforms(values.businessType),
    [values.businessType],
  );
  const results = useMemo(() => searchPlatforms(query), [query]);
  const searching = query.trim().length > 0;

  const renderList = (list: Platform[]) => (
    <div className="grid gap-2.5">
      {list.map((p) => (
        <Choice
          key={p.id}
          name="platform"
          value={p.id}
          checked={values.platform === p.id}
          onChange={() => set("platform", p.id)}
        >
          {p.name}
        </Choice>
      ))}
    </div>
  );

  return (
    <fieldset>
      <legend className="contents">
        <StepHeading heading={onboarding.software.heading} sub={onboarding.software.sub} />
      </legend>

      <div className="relative mt-5">
        <Search
          aria-hidden="true"
          strokeWidth={2}
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={onboarding.software.searchPlaceholder}
          aria-label={onboarding.software.searchLabel}
          className="h-12 w-full rounded-sm border border-line bg-white pl-11 pr-4 text-body text-ink placeholder:text-ink-muted transition-colors duration-150 ease-fynd hover:border-ink-muted"
        />
      </div>

      <div className="mt-4">
        {searching ? (
          results.length ? (
            renderList(results)
          ) : (
            <p className="text-small text-ink-soft">{onboarding.software.noMatches}</p>
          )
        ) : (
          <>
            {suggested.length > 0 && (
              <>
                <p className="text-micro uppercase text-ink-soft">
                  {onboarding.software.suggestedHeading}
                </p>
                <div className="mt-2.5">{renderList(suggested)}</div>
                <p className="mt-5 text-micro uppercase text-ink-soft">
                  {onboarding.software.restHeading}
                </p>
                <div className="mt-2.5">{renderList(rest)}</div>
              </>
            )}
            {suggested.length === 0 && renderList(rest)}
          </>
        )}
      </div>

      <GroupError message={errors.platform} />

      {values.platform === "other" && (
        <div className="mt-4">
          <Field
            label={onboarding.software.otherLabel}
            placeholder={onboarding.software.otherPlaceholder}
            value={values.otherPlatform}
            error={errors.otherPlatform}
            onChange={(v) => set("otherPlatform", v)}
          />
        </div>
      )}
    </fieldset>
  );
}

/**
 * The Google Business Profile ask.
 *
 * Rendered on all three connect paths because it is unrelated to which booking
 * platform they picked — it is the access Fynd needs to post on their behalf,
 * and it arrives by email rather than being actionable here.
 */
function GbpNotice() {
  return (
    <div className="mt-6 rounded-sm border border-fynd-blue/25 bg-fynd-blue/6 p-5">
      <h4 className="flex items-center gap-2 text-body font-semibold text-ink">
        <Mail aria-hidden="true" strokeWidth={2} className="h-4 w-4 shrink-0 text-fynd-blue" />
        {onboarding.connect.gbpHeading}
      </h4>
      <p className="mt-1.5 text-small text-ink-soft">{onboarding.connect.gbpBody}</p>
    </div>
  );
}

/** `{platform}` / `{email}` substitution, so the copy file stays readable. */
const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (out, [key, value]) => out.replaceAll(`{${key}}`, value),
    template,
  );

function ConnectStep({
  platform,
  method,
  inviteEmail,
  completionSignal,
  set,
  onFinish,
  onOauth,
}: {
  platform: Platform;
  method: "oauth" | "invite" | "manual";
  inviteEmail: string | null;
  completionSignal: string;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
  onFinish: (status: "invite_sent" | "manual") => void;
  onOauth: () => void;
}) {
  const c = onboarding.connect;
  const vars = { platform: platform.name, email: inviteEmail ?? "" };

  return (
    <div>
      {method === "manual" ? (
        <>
          <StepHeading heading={c.manualHeading} sub={c.manualBody} />
          <textarea
            rows={4}
            value={completionSignal}
            onChange={(e) => set("completionSignal", e.target.value)}
            placeholder={c.manualPlaceholder}
            aria-label={c.manualHeading}
            className="mt-5 w-full rounded-sm border border-line bg-white p-4 text-body text-ink placeholder:text-ink-muted transition-colors duration-150 ease-fynd hover:border-ink-muted"
          />
          <GbpNotice />
          <div className="mt-6">
            <Button onClick={() => onFinish("manual")} arrow>
              {onboarding.submit.finish}
            </Button>
          </div>
        </>
      ) : (
        <>
          <StepHeading heading={fill(c.heading, vars)} sub={fill(c.body, vars)} />

          {method === "oauth" ? (
            <div className="mt-6">
              {/* A real navigation, not a fetch: OAuth ends on the platform's
                  own domain, so this has to leave the page. */}
              <a
                href={`/api/connect/${platform.id}`}
                onClick={onOauth}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-fynd-blue px-6 text-body font-semibold text-white transition-all duration-150 ease-fynd hover:-translate-y-px hover:bg-[#3F4DF0] hover:shadow-blue sm:h-11"
              >
                {fill(c.oauthCta, vars)}
                <span aria-hidden="true" className="transition-transform duration-150 ease-fynd group-hover:translate-x-[3px]">→</span>
              </a>
              <p className="mt-3 text-small text-ink-soft">{fill(c.oauthNote, vars)}</p>
            </div>
          ) : (
            <div className="mt-6 rounded-sm border border-line bg-fynd-gray p-5">
              <h4 className="text-body font-semibold text-ink">{c.inviteHeading}</h4>
              <p className="mt-1.5 text-small text-ink-soft">{fill(c.inviteBody, vars)}</p>
              <ol className="mt-4 grid gap-3">
                {c.inviteSteps.map((raw, i) => {
                  // Step 2 names the address to invite. With none provisioned,
                  // promising a real one we don't have is worse than saying it
                  // is coming — so that step degrades rather than printing a
                  // placeholder address a customer would actually try to use.
                  const text =
                    i === 1 && !inviteEmail
                      ? "Invite the Fynd address I'll email you — I'll send it as soon as you finish here."
                      : fill(raw, vars);
                  return (
                    <li key={raw} className="flex gap-3 text-small text-ink">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-micro font-semibold tracking-normal text-fynd-blue">
                        {i + 1}
                      </span>
                      {text}
                    </li>
                  );
                })}
              </ol>
              <div className="mt-5">
                <Button onClick={() => onFinish("invite_sent")} arrow>
                  {c.inviteConfirm}
                </Button>
                <p className="mt-3 text-small text-ink-soft">{c.inviteNote}</p>
              </div>
            </div>
          )}

          <GbpNotice />

          <p className="mt-6 flex items-start gap-2 text-small text-ink-soft">
            <ShieldCheck
              aria-hidden="true"
              strokeWidth={2}
              className="mt-px h-4 w-4 shrink-0 text-fynd-green-text"
            />
            {c.security}
          </p>
        </>
      )}
    </div>
  );
}
