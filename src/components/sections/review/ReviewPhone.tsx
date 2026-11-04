import { Star } from "lucide-react";
import { mechanism } from "@/content/copy";
import { Bubble, PhoneFrame } from "./PhoneFrame";

/**
 * The review request as the customer sees it: the studio's text and the
 * "How did we do?" star prompt, on the drawn phone (`mechanism.sms`, the
 * same thread the homepage mechanism section draws). ILLUSTRATION: the
 * studio and the customer are the site's fictional ones.
 */
export function ReviewPhone({ className }: { className?: string }) {
  const sms = mechanism.sms;
  return (
    <div aria-hidden="true" className={className}>
      <PhoneFrame business={sms.business} statusTime={sms.statusTime}>
        <Bubble time={sms.outbound.time}>{sms.outbound.body}</Bubble>
        <div className="flex flex-col items-start">
          <div className="w-[88%] rounded-[18px] rounded-bl-[5px] border border-line bg-white p-3 shadow-sm">
            <p className="text-[13px] font-semibold text-ink">{sms.prompt.title}</p>
            <p className="mt-0.5 text-[11px] font-normal text-ink-soft">{sms.prompt.subtitle}</p>
            <div className="mt-2.5 flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} strokeWidth={1.5} className="h-6 w-6 fill-fynd-green/15 text-fynd-green" />
              ))}
            </div>
          </div>
          <span className="mt-1 px-1 text-[10px] font-normal tabular-nums text-ink-soft">{sms.prompt.time}</span>
        </div>
      </PhoneFrame>
    </div>
  );
}
