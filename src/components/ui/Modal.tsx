"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Wider modals for support flow */
  size?: "md" | "lg";
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={`relative max-h-[min(90vh,880px)] w-full ${maxW} overflow-y-auto rounded-2xl border border-earth-100 bg-white p-6 shadow-2xl md:p-8`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-sans text-xl font-semibold text-earth-900 md:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-earth-200 px-3 py-1 text-sm text-earth-600 transition-colors hover:bg-earth-100"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
