import Link from "next/link";
import { Check, Phone, Search, Star } from "lucide-react";
import { manage } from "@/content/copy";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Layout";
import { DottedWorldMap } from "@/components/textures/Textures";
import { RotatingChannel } from "./RotatingChannel";
import { ScrollButton } from "./ScrollButton";

/**
 * /manage hero, in the shape of the platform's: navy (Fynd's heroes are
 * dark, Luke), the badge, "Get found by customers / in your area on /
 * <channel>" with the channel cycling as its logo and name in the
 * brand's own styling (`RotatingChannel`), then two columns — the
 * paragraph, three checks, the button and the one quiet link to the $99
 * (no call link here, Luke) on the left; on the right the
 * search result drawn as a white card: the query, the business first
 * with a Call button, two competitors under it, a call coming in.
 *
 * ILLUSTRATION (the caption saying so came off, Luke, Nov 3, 2026). The
 * business is "Your business", not a client, and the competitors are
 * lettered. The "new customer calling" bar sits in its row but is raised
 * toward the viewer (shadow, slight scale) and rings every seven seconds
 * (`.fynd-ring` in globals.css).
 */
export function ManageHero({ targetId }: { targetId: string }) {
  const copy = manage.hero;

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-navy pb-14 pt-12 lg:pb-24 lg:pt-20"
    >
      <DottedWorldMap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-micro uppercase text-white/85">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-fynd-green" />
            {copy.badge}
          </span>

          <h1 className="mt-7 text-hero text-white lg:text-[64px] lg:leading-[1.06]">
            <span className="block">{copy.headline.lead}</span>
            <span className="block">{copy.headline.mid}</span>
            <RotatingChannel
              channels={copy.channels}
              sr={copy.wordsSr}
              className="w-full text-[0.95em]"
            />
          </h1>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1120px] items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-body text-white/80 lg:text-[18px] lg:leading-[29px]">
              {copy.body.lead}
              <strong className="font-bold text-white">{copy.body.strong}</strong>
              {copy.body.tail}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {copy.checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fynd-green/20">
                    <Check aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-fynd-green" />
                  </span>
                  <span className="text-body font-semibold text-white">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <ScrollButton targetId={targetId} label={copy.cta} section="hero" />
              <p className="text-small text-white/60">{copy.ctaNote}</p>
            </div>

            <p className="mt-4 text-small text-white/70">
              {copy.onceLink.lead}{" "}
              <Link
                href={copy.onceLink.href}
                className="font-semibold text-white/85 underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white"
              >
                {copy.onceLink.label}
              </Link>
            </p>
          </div>

          <SearchMock />
        </div>
      </Container>
    </section>
  );
}

/** The search result, drawn: the business first, two competitors, a call coming in. */
function SearchMock() {
  const m = manage.hero.mock;

  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-[520px] lg:ml-auto lg:mr-0"
    >
      <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
        <div className="flex items-center gap-3 rounded-full bg-fynd-gray px-4 py-3">
          <Search strokeWidth={2} className="h-4 w-4 shrink-0 text-ink-soft" />
          <span className="text-body font-semibold text-ink">{m.query}</span>
        </div>

        <ul className="mt-3 flex flex-col gap-2.5">
          {m.results.map((r) => (
            <li
              key={r.rank}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3 sm:p-4",
                r.you ? "border-2 border-fynd-blue bg-fynd-blue/[0.05]" : "border-line bg-white",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                  r.you ? "bg-fynd-blue text-white" : "bg-fynd-gray text-ink-soft",
                )}
              >
                {r.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-body font-semibold", r.you ? "text-ink" : "text-ink-soft")}>
                  {r.name}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] font-medium text-ink-soft">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        strokeWidth={0}
                        className={cn(
                          "h-3 w-3",
                          i < r.stars
                            ? r.you
                              ? "fill-fynd-green"
                              : "fill-ink-muted"
                            : "fill-line",
                        )}
                      />
                    ))}
                  </span>
                  {r.meta}
                </p>
              </div>
              {r.you && (
                <span className="rounded-sm bg-fynd-blue/10 px-3 py-1.5 text-[13px] font-bold text-fynd-blue">
                  {r.action}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* In its row, but raised toward the viewer: a deep shadow, a
            hairline, and a touch of scale, which the ring also pops. */}
        <div className="fynd-ring relative z-10 mt-3 flex items-center gap-3 rounded-md bg-navy px-4 py-3 text-white shadow-lg ring-1 ring-white/15">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fynd-green text-navy">
            <span className="absolute inset-0 rounded-full bg-fynd-green/60 motion-safe:animate-ping" />
            <Phone strokeWidth={2} className="relative h-4 w-4" />
          </span>
          <span className="text-small font-semibold">{m.calling}</span>
        </div>
      </div>
    </div>
  );
}
