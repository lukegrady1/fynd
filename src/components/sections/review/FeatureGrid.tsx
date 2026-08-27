"use client";

import { useState } from "react";
import {
  BarChart3,
  Check,
  MessageSquare,
  Plug,
  Sparkles,
  Star,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { demoCta, features, mechanism, reviewReplies } from "@/content/copy";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { DeviceShell, PhoneFrame, Bubble } from "./PhoneFrame";
import { Delta, MetricBar, ScoreGauge } from "@/components/ui/DataViz";
import { IntegrationRing } from "./BookingIntegrations";
import { Modal } from "./Modal";
import { useDemoHref } from "./DemoCta";
import { Reveal } from "./Reveal";

type Feature = (typeof features.items)[number];

/**
 * Everything included — four names, and the detail one click away.
 *
 * The list used to print a title and a sentence for each of the four beside a
 * dashboard mockup. That is four paragraphs to read before anything happens,
 * and only one of the four had a picture. Now the section is four names, which
 * is the fastest possible read of "what do I get", and each opens a modal that
 * shows the thing rather than describing it: the actual SMS, the actual
 * integration ring, a review with its drafted reply, the dashboard.
 *
 * The visuals are the real components, not screenshots — the integrations
 * modal renders the whole Fit argument, and the dashboard is drawn with the
 * same data-viz primitives. Nothing here can go stale.
 *
 * Navy, since the Fit section that used to carry the dark band on this part of
 * the page has moved inside the integrations modal. The dialogs stay light:
 * they are surfaces above the page, not part of it.
 */
export function FeatureGrid({ business }: { business?: string }) {
  const [open, setOpen] = useState<Feature | null>(null);

  return (
    <section className="bg-navy py-14 text-white lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[620px] text-center">
          <Eyebrow tone="light" variant="pill">{features.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-white">{features.heading}</h2>
          <p className="measure mx-auto mt-3 text-body text-white/70">
            {features.sub}
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-12">
          {features.items.map((item, i) => (
            <li key={item.title} className="flex">
              <Reveal delay={i * 0.05} className="flex w-full">
                <button
                  type="button"
                  onClick={() => {
                    track("feature_modal_open", { feature: item.visual });
                    setOpen(item);
                  }}
                  className="group flex w-full items-center gap-4 rounded-lg border border-white/10 bg-navy-card p-5 text-left transition-all duration-250 ease-fynd hover:-translate-y-0.5 hover:border-fynd-blue/50 hover:bg-[#16204079] hover:shadow-lg hover:shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-6"
                >
                  <FeatureIcon name={item.icon} />

                  <span className="min-w-0 flex-1">
                    <span className="block text-h3 text-white">{item.title}</span>
                    <span className="mt-0.5 block text-small text-white/55">
                      {features.modalCta}
                    </span>
                  </span>

                  {/* A plus, not a chevron: this opens a panel, it does not
                      navigate or expand in place. */}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 group-hover:border-fynd-blue group-hover:bg-fynd-blue group-hover:text-white motion-reduce:transition-none"
                  >
                    <Plus strokeWidth={2} className="h-4 w-4" />
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        eyebrow={features.eyebrow}
        title={open?.title ?? ""}
      >
        {open && <FeatureDetail item={open} business={business} />}
      </Modal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One shape for all four, taken from the Fit section this modal replaced:
 * headline with the payoff in green, a sub, the visual, the specifics, then a
 * footer offering a call.
 *
 * Full-bleed navy inside a white dialog — the negative margins cancel the
 * Modal's own padding so the panel reaches the edges. The mockups are drawn
 * for dark surfaces anyway, and it stops the dialog reading as a text box
 * with a picture dropped in it.
 */
function FeatureDetail({
  item,
  business,
}: {
  item: Feature;
  business?: string;
}) {
  const demoHref = useDemoHref();

  /**
   * The phone mockups are tall and narrow; the ring and the review cards are
   * wide. At 900px a 260px phone centred above the copy leaves most of the
   * modal empty, so the tall two sit beside their points and the wide two keep
   * the full width they need.
   */
  const tall = item.visual === "sms" || item.visual === "dashboard";

  const points = (
    <ul className="flex flex-col gap-3">
      {item.points.map((point) => (
        <li key={point} className="flex gap-3">
          <Check
            aria-hidden="true"
            strokeWidth={2.5}
            className="mt-1 h-3.5 w-3.5 shrink-0 text-fynd-green"
          />
          <span className="text-small text-white/70">{point}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="-mx-6 -my-6 bg-navy px-6 py-8 text-white lg:-mx-8 lg:-my-8 lg:px-8 lg:py-10">
      <h4 className="text-h2 text-white">
        {item.heading.lead}{" "}
        <span className="text-fynd-green">{item.heading.accent}</span>{" "}
        {item.heading.tail}
      </h4>

      <p className="measure mt-5 text-body text-white/70">{item.sub}</p>

      {tall ? (
        <div className="mt-8 lg:grid lg:grid-cols-[300px_1fr] lg:items-center lg:gap-9">
          <FeatureVisual visual={item.visual} business={business} />
          <div className="mt-6 lg:mt-0">{points}</div>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <FeatureVisual visual={item.visual} business={business} />
          </div>
          <div className="mt-6">{points}</div>
        </>
      )}

      <div className="mt-10 flex flex-col items-start gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-white/70">
          <span className="font-semibold text-white">{item.footer.lead}</span>{" "}
          {item.footer.body}
        </p>
        <a
          href={demoHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("cta_click", { cta: demoCta.label, section: "feature_modal" })
          }
          className="group inline-flex shrink-0 items-center gap-2 text-body font-semibold text-fynd-green underline-offset-4 hover:underline"
        >
          {item.footer.ctaLabel}
          <span className="sr-only"> ({demoCta.newTabHint})</span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-150 ease-fynd group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
        </a>
      </div>
    </div>
  );
}

/** One mockup per feature. Real components throughout, never a screenshot. */
function FeatureVisual({
  visual,
  business,
}: {
  visual: Feature["visual"];
  business?: string;
}) {
  if (visual === "sms") return <SmsVisual business={business} />;
  if (visual === "integrations") return <IntegrationRing />;
  if (visual === "reviews") return <ReviewsVisual />;
  return <DashboardVisual business={business} />;
}

/** The message the customer actually gets. */
function SmsVisual({ business }: { business?: string }) {
  const { sms } = mechanism;

  return (
    <div className="flex justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6">
      <div className="w-[230px] lg:w-[260px]">
        <PhoneFrame
          business={business ?? sms.business}
          statusTime={sms.statusTime}
        >
          <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>

          <div className="mt-3 rounded-[14px] border border-line bg-white p-3 shadow-sm">
            <p className="text-[11px] font-semibold text-ink">
              {sms.prompt.title}
            </p>
            <p className="mt-0.5 text-[10px] text-ink-soft">
              {sms.prompt.subtitle}
            </p>
            <div className="mt-2 flex gap-1 text-fynd-green">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5" strokeWidth={1.8} />
              ))}
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

/**
 * Approving a drafted reply, then teaching it your tone.
 *
 * Every control here is a span, not a button — this is a picture of the
 * product, and a real button that does nothing is worse than an image of one.
 * The whole block is aria-hidden for the same reason: the claims it makes are
 * in the copy around it, so a screen reader gets them without wading through
 * a mock interface.
 */
function ReviewsVisual() {
  const { approve, train } = reviewReplies;

  return (
    <div
      aria-hidden="true"
      className="rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:p-5"
    >
      {/* Approve */}
      <div className="rounded-md border border-white/10 bg-navy-card p-4">
        <p className="text-micro uppercase tracking-[0.08em] text-white/50">
          {approve.label}
        </p>

        <span className="mt-3 flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5 fill-[#FFB400] text-[#FFB400]"
              strokeWidth={0}
            />
          ))}
        </span>

        <p className="mt-2 text-small text-white/85">{approve.review}</p>

        <div className="mt-3 rounded-md border border-fynd-green/35 bg-white/[0.04] p-3">
          <p className="text-micro uppercase tracking-[0.08em] text-fynd-green">
            {approve.replyLabel}
          </p>
          <p className="mt-1.5 text-small text-white/75">{approve.reply}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-micro text-white/50">{approve.note}</p>
          <span className="rounded-sm bg-fynd-green px-3.5 py-1.5 text-small font-semibold text-navy">
            {approve.cta}
          </span>
        </div>
      </div>

      {/* Train */}
      <p className="mt-6 text-micro uppercase tracking-[0.08em] text-fynd-green">
        {train.eyebrow}
      </p>
      <p className="mt-1 text-body font-semibold text-white">{train.heading}</p>

      <div className="mt-3 rounded-md border border-white/10 bg-navy-card p-4">
        <p className="text-micro uppercase tracking-[0.08em] text-white/50">
          {train.label}
        </p>

        <div className="mt-3 rounded-sm border border-white/15 bg-navy p-3">
          <p className="text-small text-white/75">{train.note}</p>
        </div>

        <p className="mt-2 text-micro text-white/40">{train.example}</p>

        <div className="mt-3 flex items-center justify-end gap-2">
          <span className="rounded-sm border border-white/15 px-3 py-1.5 text-small font-semibold text-white/60">
            {train.cancel}
          </span>
          <span className="rounded-sm bg-fynd-blue px-3.5 py-1.5 text-small font-semibold text-white">
            {train.save}
          </span>
        </div>
      </div>
    </div>
  );
}

/** The dashboard, drawn with the real data-viz components. */
function DashboardVisual({ business }: { business?: string }) {
  return (
    <div className="flex justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6">
      <div className="w-[240px] lg:w-[260px]">
        <DeviceShell statusTime="9:41">
          <div className="border-b border-line px-4 pb-2.5 pt-1.5">
            <p className="text-[13px] font-semibold text-ink">
              {features.mockup.label}
            </p>
            <p className="text-[10px] font-normal text-ink-soft">
              {business ?? mechanism.sms.business} · {features.mockup.range}
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-fynd-gray px-3 py-4">
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-[11px] font-semibold text-ink">
                Reputation score
              </p>
              <div className="mt-2 flex justify-center">
                <ScoreGauge score={87} label="Excellent" />
              </div>
              <p className="mt-3 flex justify-center">
                <Delta value="12% vs. last month" />
              </p>
            </div>

            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-[11px] font-semibold text-ink">
                Where reviews came from
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <MetricBar label="Google" value="128" percent={78} index={0} />
                <MetricBar label="SMS" value="61" percent={48} index={1} />
                <MetricBar label="NFC card" value="18" percent={19} index={2} />
              </div>
            </div>
          </div>
        </DeviceShell>
      </div>
    </div>
  );
}

/** Outline icons only, 1.75px stroke, coloured by domain (design.md §7). */
function FeatureIcon({ name }: { name: string }) {
  const props = {
    strokeWidth: 1.75,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  const map: Record<string, { node: React.ReactNode; tone: string }> = {
    MessageSquare: {
      node: <MessageSquare {...props} />,
      tone: "border-fynd-green/25 bg-fynd-green/[0.10] text-fynd-green",
    },
    Plug: {
      node: <Plug {...props} />,
      tone: "border-fynd-orange/25 bg-fynd-orange/[0.10] text-fynd-orange",
    },
    Sparkles: {
      node: <Sparkles {...props} />,
      tone: "border-fynd-blue2/25 bg-fynd-blue2/[0.10] text-fynd-blue2",
    },
    BarChart3: {
      node: <BarChart3 {...props} />,
      tone: "border-fynd-blue/25 bg-fynd-blue/[0.12] text-fynd-blue",
    },
  };

  const entry = map[name] ?? map.BarChart3;

  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border",
        entry.tone,
      )}
    >
      {entry.node}
    </span>
  );
}
