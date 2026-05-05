"use client";

import { useState } from "react";

export function MemorialShareBar({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border border-earth-200 bg-white px-4 py-2 text-sm font-medium text-earth-800 shadow-sm transition hover:border-earth-300 hover:bg-earth-50"
      >
        {copied ? "Copied" : "Copy page link"}
      </button>
      <span className="max-w-xs truncate font-mono text-xs text-earth-500">{shareUrl}</span>
    </div>
  );
}
