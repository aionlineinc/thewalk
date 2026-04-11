"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
} from "react";
import { createPortal } from "react-dom";

type Props = { reference: string; display: string };

const GAP = 8;
const VIEW_MARGIN = 8;

/** Estimate before tooltip is measured (loading state). */
const ESTIMATED_HEIGHT = 140;

function fitTooltip(btn: DOMRect, tip: DOMRect | null, maxW: number) {
  const tipH = tip?.height ?? ESTIMATED_HEIGHT;
  const tipW = tip?.width ?? maxW;

  let left = Math.max(VIEW_MARGIN, Math.min(btn.left, window.innerWidth - tipW - VIEW_MARGIN));

  const belowTop = btn.bottom + GAP;
  const aboveTop = btn.top - GAP - tipH;

  const bottomIfBelow = belowTop + tipH;
  const overflowsBottom = bottomIfBelow > window.innerHeight - VIEW_MARGIN;
  const overflowsAbove = aboveTop < VIEW_MARGIN;

  let top: number;
  if (!overflowsBottom) {
    top = belowTop;
  } else if (!overflowsAbove) {
    top = aboveTop;
  } else {
    const roomBelow = window.innerHeight - belowTop - VIEW_MARGIN;
    const roomAbove = btn.top - GAP - VIEW_MARGIN;
    top =
      roomBelow >= roomAbove
        ? Math.max(VIEW_MARGIN, window.innerHeight - VIEW_MARGIN - tipH)
        : VIEW_MARGIN;
  }

  top = Math.max(VIEW_MARGIN, Math.min(top, window.innerHeight - VIEW_MARGIN - tipH));

  return { top, left, maxW };
}

export function ScriptureReferenceMark({ reference, display }: Props) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string>("");
  const [failed, setFailed] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const [coords, setCoords] = useState({ top: 0, left: 0, maxW: 360 });

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  }, [cancelClose]);

  const updatePosition = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const br = el.getBoundingClientRect();
    const maxW = Math.min(400, Math.max(260, window.innerWidth - 2 * VIEW_MARGIN));
    const tipEl = tooltipRef.current;
    const tipRect = tipEl?.getBoundingClientRect() ?? null;
    setCoords(fitTooltip(br, tipRect, maxW));
  }, []);

  const load = useCallback(async () => {
    if (body !== null || failed) return;
    try {
      const res = await fetch(`/api/scripture?ref=${encodeURIComponent(reference)}`);
      if (!res.ok) {
        setFailed(true);
        setBody("This passage could not be loaded.");
        return;
      }
      const data = (await res.json()) as { text?: string; translationName?: string };
      setBody(data.text ?? "");
      setTranslation(data.translationName ?? "");
    } catch {
      setFailed(true);
      setBody("This passage could not be loaded.");
    }
  }, [reference, body, failed]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, body, failed, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const tip = tooltipRef.current;
    if (!tip || typeof ResizeObserver === "undefined") {
      const t = requestAnimationFrame(() => updatePosition());
      return () => cancelAnimationFrame(t);
    }
    const ro = new ResizeObserver(() => updatePosition());
    ro.observe(tip);
    return () => ro.disconnect();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePosition]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, cancelClose]);

  const showTooltip = open && typeof document !== "undefined";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="cursor-help border-0 border-b border-dotted border-earth-500/80 bg-transparent p-0 font-inherit text-inherit underline-offset-[3px] hover:border-earth-700"
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        aria-label={`Bible reference: ${display}`}
        onMouseEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        onBlur={scheduleClose}
      >
        {display}
      </button>
      {showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="fixed z-[200] flex max-h-[min(55vh,calc(100dvh-24px))] flex-col overflow-hidden rounded-lg border border-earth-200 bg-white text-left text-earth-900 shadow-lg"
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth: coords.maxW,
            }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="shrink-0 border-b border-earth-100 bg-earth-100/70 px-3 py-2">
              <p className="text-[13px] font-semibold tracking-wide text-earth-900">{display}</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3 text-xs font-normal leading-relaxed">
              {body === null && !failed ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : (
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{body}</p>
              )}
            </div>
            {body !== null && (
              <div className="shrink-0 border-t border-earth-100 px-3 py-2 text-[10px] text-earth-500">
                {translation || "World English Bible (public domain)"}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
