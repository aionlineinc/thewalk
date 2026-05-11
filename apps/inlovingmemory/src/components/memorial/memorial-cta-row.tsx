"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { submitGuestbookFromForm } from "@/lib/ilm-community-actions";

type Props = {
  shareUrl?: string | null;
  showContribute: boolean;
  primaryColor?: string;
  accentColor?: string;
  memorialSlug?: string;
};

type Tab = "Photos" | "Story" | "Audio";

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm"];

export function MemorialCtaRow({ shareUrl, showContribute, primaryColor, accentColor, memorialSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("Photos");

  const tabs = useMemo(() => ["Photos", "Story", "Audio"] as const, []);

  return (
    <>
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 md:px-8">
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

        <div className="mt-6">
          {tab === "Photos" ? <PhotosTab memorialSlug={memorialSlug} /> : null}
          {tab === "Story" ? <StoryTab memorialSlug={memorialSlug} /> : null}
          {tab === "Audio" ? <AudioTab memorialSlug={memorialSlug} /> : null}
        </div>
      </Modal>
    </>
  );
}

/* ── Photos Tab ────────────────────────────────────── */

function PhotosTab({ memorialSlug }: { memorialSlug?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [authorName, setAuthorName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !authorName.trim() || !memorialSlug) {
      setError("Your name and a photo are required.");
      return;
    }
    if (!PHOTO_TYPES.includes(file.type)) {
      setError("Use JPEG, PNG, WebP, or GIF.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const pres = await fetch("/api/ilm/public/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialSlug,
          fileName: file.name,
          contentType: file.type,
          byteSize: file.size,
          authorName: authorName.trim(),
          kind: "PHOTO",
        }),
      });
      const pj = (await pres.json()) as { error?: string; uploadUrl?: string; key?: string };
      if (!pres.ok) { setError(pj.error ?? "Could not start upload."); return; }

      const put = await fetch(pj.uploadUrl!, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) { setError("Upload failed."); return; }

      await fetch("/api/ilm/public/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialSlug, key: pj.key, authorName: authorName.trim(), kind: "PHOTO" }),
      });

      setDone(true);
      if (fileRef.current) fileRef.current.value = "";
      setAuthorName("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-sm text-earth-800">Thank you — your photo was received and will appear after the page keeper approves it.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-earth-800">Your name</label>
        <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={120} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
      </div>
      <div>
        <label className="block text-sm font-medium text-earth-800">Photo</label>
        <input ref={fileRef} type="file" accept={PHOTO_TYPES.join(",")} disabled={busy} className="mt-1.5 text-sm text-earth-800 file:mr-3 file:rounded-lg file:border-0 file:bg-earth-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" />
      </div>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button type="button" disabled={busy} onClick={() => void upload()} className="rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900 disabled:opacity-60">
        {busy ? "Uploading…" : "Upload photo"}
      </button>
    </div>
  );
}

/* ── Story Tab ─────────────────────────────────────── */

function StoryTab({ memorialSlug }: { memorialSlug?: string }) {
  return (
    <form action={submitGuestbookFromForm} className="space-y-4">
      <input type="hidden" name="__ilmSlug" value={memorialSlug ?? ""} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cta-first" className="block text-sm font-medium text-earth-800">First Name</label>
          <input id="cta-first" name="firstName" maxLength={60} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
        </div>
        <div>
          <label htmlFor="cta-last" className="block text-sm font-medium text-earth-800">Last Name</label>
          <input id="cta-last" name="lastName" maxLength={60} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
        </div>
      </div>
      <div>
        <label htmlFor="cta-email" className="block text-sm font-medium text-earth-800">Email <span className="font-normal text-earth-500">(optional)</span></label>
        <input id="cta-email" name="authorEmail" type="email" maxLength={320} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
      </div>
      <div>
        <label htmlFor="cta-story" className="block text-sm font-medium text-earth-800">Your memory</label>
        <textarea id="cta-story" name="content" required rows={4} maxLength={5000} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-earth-700">
        <input type="checkbox" required className="h-4 w-4 rounded border-earth-300 text-calm-500 focus:ring-calm-500" />
        I am human
      </label>
      <button type="submit" className="rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900">
        Share memory
      </button>
    </form>
  );
}

/* ── Audio Tab ─────────────────────────────────────── */

function AudioTab({ memorialSlug }: { memorialSlug?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [authorName, setAuthorName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !authorName.trim() || !memorialSlug) {
      setError("Your name and an audio file are required.");
      return;
    }
    if (!AUDIO_TYPES.includes(file.type)) {
      setError("Use MP3, MP4, WAV, or WebM audio.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const pres = await fetch("/api/ilm/public/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialSlug,
          fileName: file.name,
          contentType: file.type,
          byteSize: file.size,
          authorName: authorName.trim(),
          kind: "AUDIO",
        }),
      });
      const pj = (await pres.json()) as { error?: string; uploadUrl?: string; key?: string };
      if (!pres.ok) { setError(pj.error ?? "Could not start upload."); return; }

      const put = await fetch(pj.uploadUrl!, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) { setError("Upload failed."); return; }

      await fetch("/api/ilm/public/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialSlug, key: pj.key, authorName: authorName.trim(), kind: "AUDIO" }),
      });

      setDone(true);
      if (fileRef.current) fileRef.current.value = "";
      setAuthorName("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-sm text-earth-800">Thank you — your audio was received and will appear after the page keeper approves it.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-earth-800">Your name</label>
        <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={120} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
      </div>
      <div>
        <label className="block text-sm font-medium text-earth-800">Audio file</label>
        <input ref={fileRef} type="file" accept={AUDIO_TYPES.join(",")} disabled={busy} className="mt-1.5 text-sm text-earth-800 file:mr-3 file:rounded-lg file:border-0 file:bg-earth-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" />
        <p className="mt-1 text-xs text-earth-500">MP3, WAV, or WebM audio.</p>
      </div>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button type="button" disabled={busy} onClick={() => void upload()} className="rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900 disabled:opacity-60">
        {busy ? "Uploading…" : "Upload audio"}
      </button>
    </div>
  );
}
