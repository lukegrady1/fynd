import { MapPin, MessageSquare, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { pillars } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Signature pattern 2 — four-pillar row on a navy band.
 * Circled outline icon → pillar name (H3) → one-line description.
 * Icon colors follow the pillar table; outline icons only, no fills.
 */
export function PillarRow({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-t border-white/10 bg-navy py-12 lg:py-16",
        className,
      )}
    >
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pillars.map((p, i) => (
            <div
              key={p.key}
              className="reveal flex flex-col items-start"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px]"
                style={{ borderColor: p.color }}
              >
                <PillarIcon name={p.icon} color={p.color} />
              </span>
              <h3 className="mt-4 text-h3 text-white">{p.name}</h3>
              <p className="mt-2 text-small text-white/72">{p.line}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PillarIcon({ name, color }: { name: string; color: string }) {
  const props = {
    className: "h-6 w-6",
    strokeWidth: 1.75,
    style: { color },
    "aria-hidden": true as const,
  };

  switch (name) {
    case "MapPin":
      return <MapPin {...props} />;
    case "TrendingUp":
      return <TrendingUp {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "MessageSquareStar":
      // Speech bubble + star, composed from two outline glyphs.
      return (
        <span className="relative flex h-6 w-6 items-center justify-center">
          <MessageSquare {...props} className="h-6 w-6" />
          <Star
            aria-hidden="true"
            strokeWidth={1.75}
            style={{ color }}
            className="absolute h-2.5 w-2.5 -translate-y-[2px]"
          />
        </span>
      );
    default:
      return <MapPin {...props} />;
  }
}
