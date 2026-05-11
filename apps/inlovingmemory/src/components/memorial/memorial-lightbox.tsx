"use client";

import { useCallback, useEffect, useState } from "react";
import { MemorialAudioPlayer } from "@/components/memorial/memorial-audio-player";

export type LightboxItem = {
  id: string;
  storageUrl: string;
  kind: string;
  authorGuestName: string | null;
  title: string | null;
  createdAt: Date;
};

export function MemorialLightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: LightboxItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(items.length - 1, i + 1)), [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  if (!item) return null;

  const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(item.createdAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="View media"
    >
      <div
        className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev / Next */}
        {hasPrev ? (
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : null}
        {hasNext ? (
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : null}

        {/* Media */}
        {item.kind === "AUDIO" ? (
          <div className="p-6">
            <MemorialAudioPlayer src={item.storageUrl} authorName={item.authorGuestName} />
          </div>
        ) : (
          <img src={item.storageUrl} alt={item.title ?? ""} className="max-h-[70vh] w-full object-contain" />
        )}

        {/* Details */}
        <div className="border-t border-earth-200 px-6 py-4">
          {item.authorGuestName ? (
            <p className="text-sm font-medium text-earth-900">{item.authorGuestName}</p>
          ) : null}
          {item.title ? (
            <p className="mt-1 text-sm text-earth-700">{item.title}</p>
          ) : null}
          <p className="mt-2 text-xs text-earth-500">{date}</p>
        </div>

        {/* Counter */}
        <div className="border-t border-earth-100 px-6 py-2 text-center text-xs text-earth-500">
          {index + 1} of {items.length}
        </div>
      </div>
    </div>
  );
}
