"use client";

import { useState } from "react";
import { watch } from "@/content/copy";
import { track } from "@/lib/analytics";
import type { CancelPath, Plan } from "@/lib/stripe-plans";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "./Reveal";
import { CancelledNote, ReviewCheckout, ReviewPlanCard } from "./PricingSection";
import { BundlePlanCard } from "./BundlePricing";

/**
 * Both plans in one module — the conversion module on /watch, at #convert.
 *
 * The homepage sells the $97 system and /website sells the $249 plan, each
 * with one card. This page gets a link texted to someone who has only seen
 * the video, so it has to offer both without deciding for them. Two tabs
 * above one card rather than two cards: on a phone two full cards stack into
 * three screens of pricing. The tabs carry the names only; the prices live
 * on the cards, with the strikethrough and the clock beside them.
 *
 * The cards are the same components the other two pages render, so a change
 * to either price shows up here without a second edit.
 *
 * `initialPlan` comes from ?plan=, which Stripe puts on the cancel URL: a
 * visitor who backed out of the $249 checkout gets the $249 card back, not
 * the default.
 */
/** Tab order, left to right. */
const PLANS: readonly Plan[] = ["review-system", "website-reviews"];

export function PlanChooser({
  cid,
  cancelled,
  initialPlan = "review-system",
  cancelPath,
}: {
  cid?: string;
  cancelled: boolean;
  initialPlan?: Plan;
  /** Where a backed-out checkout returns to — this page. */
  cancelPath: CancelPath;
}) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const copy = watch.plans;

  const choose = (next: Plan) => {
    if (next === plan) return;
    setPlan(next);
    track("cta_click", { cta: `plan_tab:${next}`, section: "plan_chooser" });
  };

  return (
    <section id="convert" className="scroll-mt-20 bg-fynd-gray py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[560px] text-center">
          <Eyebrow variant="pill">{copy.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-ink">
            <span className="block">{copy.lead}</span>
            <span className="block text-fynd-green-text">{copy.accent}</span>
          </h2>

          {cancelled && <CancelledNote className="bg-white" />}

          <div
            role="tablist"
            aria-label={copy.pickerLabel}
            className="relative mt-8 grid grid-cols-2 gap-1 rounded-md border border-line bg-white p-1"
          >
            {/* The navy fill is one element that slides between the two
                cells rather than a background each tab paints for itself:
                the eye follows it across, so the switch reads as one thing
                moving instead of two things blinking. It sits behind the
                buttons (they are stacked above it) and takes no clicks.
                Width is half the strip minus the gap; the second position
                is one width plus the gap along. A touch of overshoot on the
                curve so it settles rather than stops. */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-sm bg-navy shadow-md",
                "transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.3,0.64,1)]",
                plan === "review-system"
                  ? "translate-x-0"
                  : "translate-x-[calc(100%+0.25rem)]",
              )}
            />
            <PlanTab
              id="review-system"
              selected={plan === "review-system"}
              onSelect={choose}
              name={copy.review.name}
              blurb={copy.review.blurb}
            />
            <PlanTab
              id="website-reviews"
              selected={plan === "website-reviews"}
              onSelect={choose}
              name={copy.bundle.name}
              blurb={copy.bundle.blurb}
            />
          </div>

          {/* Both cards stay mounted, stacked in the same grid cell, so the
              cell is as tall as the taller card at any width and the page
              does not jump when the plan changes. The one not showing is
              invisible and inert: it still takes up its height, and it
              cannot be tabbed to, read out, or clicked. Each card fills the
              cell so the two borders are the same size, and each pushes its
              button to the bottom so the two buttons line up.

              The rise-in is a class toggle rather than a remount: the
              animation starts each time it is added. motion-safe only, like
              the problem story's panels — under reduced motion nothing
              starts hidden. */}
          <div className="mt-4 grid">
            {PLANS.map((id) => {
              const showing = id === plan;
              return (
                <div
                  key={id}
                  role="tabpanel"
                  id={`plan-panel-${id}`}
                  aria-labelledby={`plan-tab-${id}`}
                  aria-hidden={!showing}
                  inert={!showing}
                  className={cn(
                    "col-start-1 row-start-1",
                    showing
                      ? "motion-safe:animate-[fynd-panel_260ms_var(--ease-fynd)_both]"
                      : "invisible",
                  )}
                >
                  {id === "review-system" ? (
                    <ReviewPlanCard
                      className="h-full"
                      action={
                        <ReviewCheckout
                          cid={cid}
                          section="plan_chooser"
                          cancelPath={cancelPath}
                        />
                      }
                    />
                  ) : (
                    <BundlePlanCard
                      className="h-full"
                      cid={cid}
                      section="plan_chooser"
                      cancelPath={cancelPath}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * One tab: the plan's name and a line on what it is.
 * The selected one sits on the navy slider — the same fill as the sticky
 * pill — so which card is showing reads at a glance, and the unselected one
 * stays legible rather than greyed out, because it is the other real option.
 *
 * The button itself paints no background; the slider behind it does. Only
 * the text colours change here, on the same clock as the slide, so the
 * words turn white as the navy arrives under them.
 */
function PlanTab({
  id,
  selected,
  onSelect,
  name,
  blurb,
}: {
  id: Plan;
  selected: boolean;
  onSelect: (plan: Plan) => void;
  name: string;
  blurb: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`plan-tab-${id}`}
      aria-selected={selected}
      aria-controls={`plan-panel-${id}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(id)}
      className={cn(
        "relative flex min-h-[64px] flex-col items-start justify-center rounded-sm px-3 py-2.5 text-left transition-colors duration-300 ease-fynd active:scale-[0.99] sm:px-4",
        selected ? "text-white" : "text-ink hover:bg-fynd-gray",
      )}
    >
      <span className="text-body font-semibold leading-tight">{name}</span>
      <span
        className={cn(
          "mt-1 text-micro normal-case tracking-normal transition-colors duration-300 ease-fynd",
          selected ? "text-white/72" : "text-ink-soft",
        )}
      >
        {blurb}
      </span>
    </button>
  );
}
