"use client";

import { useId } from "react";

type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const id = `${baseId}-${idx}`;
        return (
          <details
            key={id}
            className="group rounded-2xl border border-earth-100 bg-white p-5 shadow-sm md:p-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-base font-medium tracking-tight text-earth-900 md:text-lg">
                {item.q}
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-100 text-earth-900 transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="pt-4">
              <p className="app-body max-w-3xl">{item.a}</p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
