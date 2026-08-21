import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Bare device shell — bezel, buttons, notch, status bar. Drawn in CSS/SVG
 * rather than photographed, so it costs nothing to load and stays crisp at any
 * size. Shared by the SMS thread and the dashboard mockup.
 */
export function DeviceShell({
  statusTime,
  children,
  className,
}: {
  statusTime: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[300px] rounded-[38px] bg-navy p-2.5 shadow-lg",
        className,
      )}
    >
      {/* side buttons */}
      <span
        aria-hidden="true"
        className="absolute -left-[3px] top-[104px] h-11 w-[3px] rounded-l-sm bg-navy/60"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[3px] top-[128px] h-16 w-[3px] rounded-r-sm bg-navy/60"
      />

      <div className="relative overflow-hidden rounded-[30px] bg-white">
        {/* notch */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 h-6 w-[92px] -translate-x-1/2 rounded-full bg-navy"
        />

        {/* status bar */}
        <div
          aria-hidden="true"
          className="flex items-center justify-between px-5 pb-1 pt-3.5 text-[11px] font-semibold text-ink"
        >
          <span className="tabular-nums">{statusTime}</span>
          <span className="flex items-center gap-1">
            <SignalGlyph />
            <WifiGlyph />
            <BatteryGlyph />
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}

/**
 * A phone showing a text thread. The point is that the SMS inside is the
 * *actual* message, not an abstraction of one.
 */
export function PhoneFrame({
  business,
  statusTime,
  children,
  className,
}: {
  business: string;
  statusTime: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DeviceShell statusTime={statusTime} className={className}>
      {/* conversation header */}
      <div className="border-b border-line px-4 pb-2.5 pt-1.5 text-center">
        <p className="truncate text-[13px] font-semibold text-ink">
          {business}
        </p>
        <p className="text-[10px] font-normal text-ink-soft">Text message</p>
      </div>

      <div className="flex flex-col gap-2.5 px-3 py-4">{children}</div>
    </DeviceShell>
  );
}

/** Incoming message — grey bubble, left aligned, tail bottom-left. */
export function Bubble({
  side = "in",
  time,
  children,
}: {
  side?: "in" | "out";
  time: string;
  children: ReactNode;
}) {
  const out = side === "out";
  return (
    <div className={cn("flex flex-col", out ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[18px] px-3.5 py-2 text-[13px] leading-[1.35]",
          out
            ? "rounded-br-[5px] bg-fynd-blue text-white"
            : "rounded-bl-[5px] bg-fynd-gray text-ink",
        )}
      >
        {children}
      </div>
      <span className="mt-1 px-1 text-[10px] font-normal text-ink-soft tabular-nums">
        {time}
      </span>
    </div>
  );
}

function SignalGlyph() {
  return (
    <svg viewBox="0 0 18 12" className="h-2.5 w-4" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
      <path d="M8 11.2 5.6 8.5a3.6 3.6 0 0 1 4.8 0L8 11.2Z" />
      <path
        d="M3.3 6.1a7 7 0 0 1 9.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M1 3.4a10.6 10.6 0 0 1 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 26 12" className="h-2.5 w-[22px]" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
      <path
        d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
