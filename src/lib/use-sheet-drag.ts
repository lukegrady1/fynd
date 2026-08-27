"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Past this many pixels, letting go dismisses rather than springs back. */
const DISMISS_PX = 110;

/** …or a flick: px per ms, so a fast short drag also dismisses. */
const DISMISS_VELOCITY = 0.5;

/** Movement before a touch counts as a drag rather than a tap or a scroll. */
const START_SLOP = 8;

/** Long enough for the sheet to clear the screen before it unmounts. */
const EXIT_MS = 220;

/**
 * Drag-down-to-dismiss for the bottom sheets.
 *
 * Phones only. From `sm` up these panels are a centred dialog and a side
 * drawer, where a downward drag means nothing — the check is on the viewport
 * rather than on pointer type, because that is what actually decides which
 * shape is on screen.
 *
 * Two things make it coexist with the sheet's own scrolling:
 *
 *   - It only arms when every scrollable ancestor under the finger is already
 *     at the top. Otherwise a pull-down inside a long modal would drag the
 *     sheet instead of scrolling its content.
 *   - It waits for ~8px of downward movement before claiming the gesture, and
 *     only then captures the pointer. Claiming it on touchstart would swallow
 *     taps on buttons and links inside the sheet.
 *
 * On dismiss the sheet is sent the rest of the way off-screen and unmounted a
 * beat later, so it leaves the way it was pushed rather than vanishing.
 */
export function useSheetDrag({
  open,
  onDismiss,
}: {
  /**
   * Whether the sheet is showing. Load-bearing: the offset that carried the
   * sheet off-screen on dismiss lives in state, and the hook outlives the
   * panel — the caller renders it every time and only the portal comes and
   * goes. Without resetting on `open`, the next sheet mounts already pushed
   * off the bottom of the screen and never appears.
   */
  open: boolean;
  onDismiss: () => void;
}) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startedAt = useRef(0);
  const armed = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    armed.current = false;
    setDragging(false);
    setDragY(0);
  }, [open]);

  /** True when nothing between the touch and the sheet is scrolled down. */
  const atTop = useCallback((target: EventTarget | null) => {
    let el = target as HTMLElement | null;
    while (el && el !== rootRef.current) {
      if (el.scrollHeight > el.clientHeight + 1 && el.scrollTop > 0) {
        return false;
      }
      el = el.parentElement;
    }
    return true;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse") return;
      if (!window.matchMedia("(max-width: 639px)").matches) return;
      if (!atTop(e.target)) return;

      armed.current = true;
      startY.current = e.clientY;
      startedAt.current = performance.now();
    },
    [atTop],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!armed.current) return;
      const dy = e.clientY - startY.current;

      if (!dragging) {
        // Upward first: the content wants to scroll, not the sheet to move.
        if (dy < 0) {
          armed.current = false;
          return;
        }
        if (dy < START_SLOP) return;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }

      setDragY(Math.max(0, dy));
    },
    [dragging],
  );

  const end = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!armed.current) return;
      armed.current = false;

      if (!dragging) return;
      setDragging(false);

      const dy = Math.max(0, e.clientY - startY.current);
      const velocity = dy / Math.max(performance.now() - startedAt.current, 1);

      if (dy > DISMISS_PX || velocity > DISMISS_VELOCITY) {
        setDragY(window.innerHeight);
        exitTimer.current = setTimeout(onDismiss, EXIT_MS);
        return;
      }

      setDragY(0);
    },
    [dragging, onDismiss],
  );

  return {
    rootRef,
    dragging,
    /** Spread onto the sheet. */
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
    },
    /**
     * Inline transform while a drag is live or settling. Undefined the rest of
     * the time so the open/close classes keep control of the sheet.
     */
    style: dragY
      ? ({
          transform: `translateY(${dragY}px)`,
          transition: dragging ? "none" : undefined,
        } as React.CSSProperties)
      : undefined,
  };
}
