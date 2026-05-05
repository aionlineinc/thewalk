"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type Props = {
  shareUrl?: string | null;
  showContribute: boolean;
};

type Tab = "Photos" | "Story" | "Video" | "Audio";

export function MemorialCtaRow({ shareUrl, showContribute }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("Photos");

  const tabs = useMemo(() => ["Photos", "Story", "Video", "Audio"] as const, []);

  return (
    <>
      <div className="mx-auto mt-8 max-w-3xl px-6 sm:px-8">
        <div className="flex flex-wrap gap-3">
          {shareUrl ? (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                } catch {
                  window.location.href = shareUrl;
                }
              }}
            >
              Share
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={() => (window.location.hash = "#guestbook")}>
            Share memories
          </Button>
          <Button type="button" variant="secondary" onClick={() => (window.location.hash = "#prayer")}>
            Share prayer
          </Button>
          {showContribute ? (
            <Button type="button" variant="primary" onClick={() => setOpen(true)}>
              Add photos / story
            </Button>
          ) : null}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Share precious moments and lasting tributes" size="lg">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "rounded-full bg-earth-900 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-earth-200 bg-white px-4 py-2 text-sm font-semibold text-earth-800 hover:bg-earth-100"
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-earth-200 bg-earth-50/40 p-5">
          <p className="text-sm font-semibold text-earth-900">{tab}</p>
          <p className="mt-2 text-sm leading-relaxed text-earth-700">
            This contribution flow is being styled to match the inlovingmemory layout. Next step is wiring it to the
            existing ILM media and story pipelines (with moderation and tier limits).
          </p>
        </div>
      </Modal>
    </>
  );
}

