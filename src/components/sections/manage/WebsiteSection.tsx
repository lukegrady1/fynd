import {
  Check,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/sections/review/Reveal";

/**
 * "Great local & AI SEO starts with a great website. So Paige gives you
 * one.": navy, the argument on the left, the drawn site on the right
 * with the "built while you set up" badge over it and a phone mock
 * tucked into its corner, and under both the two option cards (use the
 * site we build / keep yours).
 *
 * The site is the fictional salon's. ILLUSTRATION: the badge and the
 * fictional name are the label.
 */
export function WebsiteSection() {
  const copy = manage.website;

  return (
    <section className="relative isolate overflow-hidden bg-navy py-14 text-white lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(76,91,255,0.32),transparent_55%)]"
      />

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <Reveal className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-micro uppercase text-white/85">
              <Sparkles aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5 text-fynd-green" />
              {copy.badge}
            </span>
            <h2 className="mt-6 text-h1 lg:text-[48px] lg:leading-[1.1]">
              {copy.lead} <span className="text-fynd-green">{copy.accent}</span>
            </h2>
            <p className="mt-6 text-body text-white/75 lg:text-[18px] lg:leading-[28px]">
              {copy.body}
            </p>
            <ul className="mt-7 flex flex-col gap-4">
              {copy.points.map((point) => {
                const Icon = pointIcon[point.icon] ?? MapPin;
                return (
                  <li key={point.text} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-fynd-green">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                    </span>
                    <span className="pt-1.5 text-body text-white">{point.text}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 pt-6 sm:pb-8 sm:pr-6">
            <SiteMock />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[1.35fr_1fr]">
          {copy.options.map((opt, i) => {
            const featured = "pill" in opt;
            return (
              <Reveal
                key={opt.label}
                delay={i * 0.08}
                className={cn(
                  "rounded-lg border p-6 lg:p-7",
                  featured ? "border-fynd-blue/60 bg-white/[0.04]" : "border-white/15 bg-white/[0.02]",
                )}
              >
                <p className="text-micro uppercase text-white/60">{opt.label}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-h3 text-white lg:text-[22px]">{opt.title}</h3>
                  {featured && (
                    <span className="rounded-full bg-fynd-green/20 px-3 py-1 text-[12px] font-semibold text-fynd-green">
                      {opt.pill}
                    </span>
                  )}
                </div>
                <ul className={cn("mt-4 grid gap-2.5", featured && "sm:grid-cols-2")}>
                  {opt.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body text-white/90">
                      <Check aria-hidden="true" strokeWidth={3} className="mt-1 h-4 w-4 shrink-0 text-fynd-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/** The fictional salon's site in a browser, a phone beside it, an edit request under it. */
function SiteMock() {
  const m = manage.website.mock;

  return (
    <figure aria-hidden="true" className="relative min-w-0">
      <span className="absolute -top-5 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-fynd-blue px-4 py-1.5 text-small font-semibold text-white shadow-blue">
        <Sparkles strokeWidth={2} className="h-3.5 w-3.5" />
        {m.builtLabel}
      </span>
      <span className="absolute -top-5 right-2 z-20 hidden items-center gap-2 rounded-full bg-white px-4 py-1.5 text-small font-semibold text-fynd-green-text shadow-md sm:inline-flex">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fynd-green text-navy">
          <Check strokeWidth={3} className="h-2.5 w-2.5" />
        </span>
        {m.checks}
      </span>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white text-ink shadow-lg">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 bg-navy-card px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          <span className="flex min-w-0 flex-1 items-center justify-center rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/80">
            {m.domain}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fynd-green">
            <span className="h-1.5 w-1.5 rounded-full bg-fynd-green" />
            {m.live}
          </span>
        </div>

        {/* The site */}
        <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="leading-none">
              <span className="block text-[13px] font-bold uppercase tracking-[0.16em] text-ink">{m.brand}</span>
              <span className="block text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-soft">{m.brandSub}</span>
            </span>
            <ul className="hidden gap-4 sm:flex">
              {m.nav.map((item) => (
                <li key={item} className="text-[12px] font-medium text-ink-soft">{item}</li>
              ))}
            </ul>
            <span className="rounded-sm bg-fynd-blue px-3 py-1.5 text-[11px] font-semibold text-white">
              {m.navCta}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fynd-green-text">{m.kicker}</p>
              <p className="mt-2 text-[24px] font-bold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[28px]">
                {m.headline.lead}{" "}
                <span className="text-fynd-green-text">{m.headline.accent}</span>
              </p>
              <p className="mt-2 text-[12px] font-normal leading-snug text-ink-soft">{m.sub}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-sm bg-fynd-blue px-3 py-1.5 text-[11px] font-semibold text-white">{m.cta}</span>
                <span className="text-[11px] font-semibold text-ink">{m.secondary}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3">
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-ink-soft">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} strokeWidth={0} className="h-3 w-3 fill-fynd-green" />
                    ))}
                  </span>
                  {m.rating}
                </span>
                <span className="hidden h-4 w-px bg-line sm:block" />
                <span className="text-[11px] leading-tight text-ink-soft">
                  <strong className="block font-semibold text-ink">{m.promise.title}</strong>
                  {m.promise.sub}
                </span>
              </div>
            </div>

            <div className="relative hidden min-h-[150px] overflow-hidden rounded-md bg-gradient-to-br from-fynd-blue/30 via-fynd-green/20 to-fynd-orange/20 sm:block">
              <div className="absolute left-2 right-2 top-2 rounded-sm bg-white p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fynd-orange/20 text-[9px] font-bold text-ink">
                    {m.review.initials}
                  </span>
                  <p className="text-[10px] font-semibold leading-tight text-ink">{m.review.quote}</p>
                </div>
                <p className="mt-1 pl-8 text-[9px] font-normal text-ink-soft">{m.review.who}</p>
              </div>
              <span className="absolute bottom-2 left-2 rounded-sm bg-navy/80 px-2 py-0.5 text-[9px] font-medium text-white">
                {m.photoLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-line border-l-[3px] border-l-fynd-blue p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-fynd-blue px-2.5 py-0.5 text-[10px] font-semibold text-white">
                <Sparkles strokeWidth={2} className="h-2.5 w-2.5" />
                {m.servicesEdit}
              </span>
              <p className="text-[12px] font-bold text-ink">{m.servicesTitle}</p>
              <span className="text-[10px] font-semibold text-ink-soft">{m.servicesAll}</span>
            </div>
            <ul className="mt-2.5 grid grid-cols-3 gap-2">
              {m.services.map((s) => (
                <li key={s.name} className="rounded-sm bg-fynd-gray p-2">
                  <p className="text-[10px] font-semibold leading-tight text-ink">{s.name}</p>
                  <p className="mt-0.5 hidden text-[9px] font-normal leading-snug text-ink-soft sm:block">{s.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The phone, tucked into the bottom-right corner. */}
      <div className="absolute -bottom-8 -right-4 z-20 hidden w-[150px] rounded-[22px] bg-navy p-1.5 shadow-lg ring-4 ring-navy-card sm:block">
        <div className="rounded-[17px] bg-white p-3 text-ink">
          <div className="flex items-center justify-between text-[9px] font-semibold">
            <span>{m.phone.time}</span>
            <span className="text-ink-soft">▪▪▪</span>
          </div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em]">{m.brand}</p>
          <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.1em] text-fynd-green-text">{m.phone.kicker}</p>
          <p className="mt-1 text-[14px] font-bold leading-tight">{m.phone.headline}</p>
          <span className="mt-2 inline-block rounded-sm bg-fynd-blue px-2 py-1 text-[8px] font-semibold text-white">{m.phone.cta}</span>
          <p className="mt-2 text-[8px] font-medium text-ink-soft">{m.phone.rating}</p>
          <span className="mt-2 block h-10 rounded-sm bg-gradient-to-br from-fynd-blue/30 to-fynd-green/20" />
        </div>
      </div>

      {/* The edit request: change the site by asking. */}
      <figcaption className="mt-5 inline-flex max-w-full items-center gap-3 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-small text-white ring-1 ring-white/15 sm:mr-[140px]">
        <Sparkles strokeWidth={2} className="h-3.5 w-3.5 shrink-0 text-fynd-green" />
        <span className="truncate">{m.edit.request}</span>
        <span className="shrink-0 rounded-full bg-fynd-blue px-3 py-1 text-[12px] font-semibold text-white">
          {m.edit.button}
        </span>
      </figcaption>
    </figure>
  );
}

const pointIcon: Record<string, LucideIcon> = {
  map: MapPin,
  chat: MessageSquare,
  phone: Phone,
};
