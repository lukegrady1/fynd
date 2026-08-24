import Image from "next/image";
import { clientFaces, clientRating } from "@/content/clients";
import { heroProof } from "@/content/copy";
import { colors } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Faces + stars + "Trusted by local businesses", sitting under the hero CTA.
 *
 * Renders nothing until there are real faces or a real rating in
 * content/clients.ts — same rule as the testimonials and case studies. A row
 * of stock headshots under that caption is an invented client list with
 * pictures attached, and five filled stars is a rating claim.
 */
export function HeroProof({ className }: { className?: string }) {
  // Bound to a local so the null check narrows for <Stars />.
  const rating = clientRating;
  const hasFaces = clientFaces.length > 0;

  if (!hasFaces && rating === null) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {hasFaces && <Faces />}

      <div className="flex flex-col gap-1">
        {rating !== null && <Stars rating={rating} />}
        <p className="text-small text-white/65">{heroProof.label}</p>
      </div>
    </div>
  );
}

/** Overlapping stack. The navy ring separates each face from the one behind. */
function Faces() {
  return (
    <ul className="flex -space-x-2.5">
      {clientFaces.map((face) => (
        <li key={face.src}>
          <Image
            src={face.src}
            alt={face.name}
            width={36}
            height={36}
            sizes="36px"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-navy"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Whole and half stars, so a 4.8 doesn't get silently rounded up to a clean
 * five. Orange rather than green: green fails as a small filled shape against
 * navy, and orange is the palette's rating colour elsewhere on the page.
 */
function Stars({ rating }: { rating: number }) {
  return (
    <p
      className="flex items-center gap-0.5"
      aria-label={heroProof.ratingLabel(rating)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return <Star key={i} fill={fill} />;
      })}
    </p>
  );
}

function Star({ fill }: { fill: number }) {
  const id = `hp-star-${Math.round(fill * 100)}`;
  const path =
    "m12 2.7 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.3l6.2-.9L12 2.7Z";

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      {fill > 0 && fill < 1 && (
        <defs>
          <linearGradient id={id}>
            <stop offset={`${fill * 100}%`} stopColor={colors.orange} />
            <stop offset={`${fill * 100}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d={path}
        fill={fill >= 1 ? colors.orange : fill > 0 ? `url(#${id})` : "none"}
        stroke={colors.orange}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
