"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A dialog: centred panel from `sm` up, bottom sheet on phones.
 *
 * The sheet is not a stylistic flourish — on a phone the thumb is at the
 * bottom of the screen and every native sheet arrives from there, so a centred
 * box that has to be dismissed by reaching for a corner reads as a web popup.
 *
 * Portalled to `document.body` because callers live inside `Reveal`, and
 * `.js-reveal` sets a transform before it becomes visible. A transformed
 * ancestor becomes the containing block for `position: fixed`, which would pin
 * the dialog to the card that opened it instead of the viewport.
 *
 * Handles the whole contract: Escape, scrim click, scroll lock, a Tab trap,
 * and returning focus to whatever opened it.
 */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  closeLabel = "Close",
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  closeLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Animate in on the frame after mount, so there is a state to move from.
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    returnFocusRef.current = document.activeElement as HTMLElement;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className={cn(
          // Darkened and blurred: these dialogs carry mockups of their own, and
          // a page still legible behind them competes for the eye. backdrop-blur
          // needs a translucent tint to sit on, so the two go together.
          "absolute inset-0 h-full w-full cursor-default bg-navy/70 backdrop-blur-md transition-opacity duration-250 motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-lg bg-white shadow-2xl outline-none transition-all duration-300 ease-fynd motion-reduce:transition-none",
          "sm:max-h-[88vh] sm:max-w-[680px] sm:rounded-lg lg:max-w-[900px]",
          shown
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-full opacity-100 sm:translate-y-0 sm:scale-[0.98] sm:opacity-0",
        )}
      >
        <span
          aria-hidden="true"
          className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden"
        />

        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 lg:px-8 lg:py-6">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-micro uppercase tracking-[0.08em] text-ink-soft">
                {eyebrow}
              </p>
            )}
            <h3 id="modal-title" className="mt-1 text-h3 text-ink lg:text-h2">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:bg-fynd-gray hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fynd-blue"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
          {children}
        </div>

        {footer && (
          <div className="border-t border-line px-6 py-5 lg:px-8">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
