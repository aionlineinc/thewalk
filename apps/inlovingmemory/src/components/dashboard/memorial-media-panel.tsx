"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  ILM_MEDIA_TITLE_BANNER,
  ILM_MEDIA_TITLE_PROFILE,
  galleryCaption,
} from "@/lib/ilm-media-slots";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Slot = "gallery" | "profile" | "banner";

export type MediaRow = {
  id: string;
  storageUrl: string;
  title: string | null;
};

export function MemorialMediaPanel({
  memorialId,
  storageConfigured,
  items,
}: {
  memorialId: string;
  storageConfigured: boolean;
  items: MediaRow[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [slot, setSlot] = useState<Slot>("gallery");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  async function uploadOne(file: File, sharedCaption?: string) {
    const pres = await fetch("/api/ilm/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memorialId,
        slot,
        fileName: file.name,
        contentType: file.type,
        byteSize: file.size,
      }),
    });
    const presJson = (await pres.json()) as { error?: string; uploadUrl?: string; key?: string };
    if (!pres.ok) throw new Error(presJson.error ?? "Could not start upload.");

    const put = await fetch(presJson.uploadUrl!, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!put.ok) throw new Error("Upload to storage failed. Check bucket CORS and credentials.");

    const complete = await fetch("/api/ilm/media/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memorialId,
        key: presJson.key,
        slot,
        caption: slot === "gallery" ? sharedCaption?.trim() || undefined : undefined,
        byteSize: file.size,
      }),
    });
    const completeJson = (await complete.json()) as { error?: string };
    if (!complete.ok) throw new Error(completeJson.error ?? "Could not save photo.");
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const fileList = Array.from(files);

    // Validate all files before starting
    const invalid = fileList.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) {
      setError("All files must be JPEG, PNG, WebP, or GIF.");
      return;
    }

    const sharedCaption = slot === "gallery" ? caption : undefined;
    setBusy(true);
    setTotalFiles(fileList.length);
    setUploaded(0);

    const errors: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      try {
        await uploadOne(fileList[i], sharedCaption);
        setUploaded((n) => n + 1);
      } catch (e) {
        errors.push(`${fileList[i].name}: ${e instanceof Error ? e.message : "Upload failed"}`);
      }
    }

    setBusy(false);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";

    if (errors.length > 0) {
      setError(errors.join("\n"));
    }

    router.refresh();
  }

  async function deleteMedia(id: string) {
    if (!confirm("Remove this image from the memorial and storage?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/ilm/media/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Delete failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!storageConfigured) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Photo uploads need S3-compatible storage. Set{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">ILM_S3_BUCKET</code>,{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">ILM_S3_ENDPOINT</code>,{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">ILM_S3_ACCESS_KEY_ID</code>,{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">ILM_S3_SECRET_ACCESS_KEY</code>, and{" "}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">ILM_S3_PUBLIC_BASE_URL</code>{" "}
        (see README).
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-earth-200 bg-earth-50/30 px-5 py-6">
        <h2 className="text-lg font-semibold text-earth-900">Add photos</h2>
        <p className="mt-2 text-sm text-earth-600">
          Basic plan: up to 20 gallery images (5 MB each) plus one profile and one banner image.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <span className="text-sm font-medium text-earth-800">Upload as</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {(
                [
                  ["gallery", "Gallery"],
                  ["profile", "Profile"],
                  ["banner", "Banner"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="slot"
                    value={value}
                    checked={slot === value}
                    onChange={() => setSlot(value)}
                    className="border-earth-300 text-earth-800"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {slot === "gallery" ? (
            <div>
              <label htmlFor="cap" className="text-sm font-medium text-earth-800">
                Caption <span className="font-normal text-earth-500">(optional)</span>
              </label>
              <input
                id="cap"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={200}
                className="mt-2 w-full max-w-md rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900"
              />
            </div>
          ) : null}

          <div>
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple={slot === "gallery"}
              disabled={busy}
              className="text-sm text-earth-800 file:mr-3 file:rounded-lg file:border-0 file:bg-earth-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-earth-900"
              onChange={(e) => void handleFiles(e.target.files)}
            />
            {slot === "gallery" ? (
              <p className="mt-1.5 text-xs text-earth-500">You can select multiple photos at once for gallery uploads.</p>
            ) : null}
          </div>
          {error ? (
            <p className="whitespace-pre-wrap text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          {busy ? (
            <p className="text-sm text-earth-500">
              {totalFiles > 1 ? `Uploading ${uploaded} of ${totalFiles}…` : "Uploading…"}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-earth-900">Current images</h2>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-earth-600">No photos yet.</p>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {items.map((m) => (
              <li
                key={m.id}
                className="flex gap-4 rounded-xl border border-earth-200 bg-white p-3 shadow-sm"
              >
                <img
                  src={m.storageUrl}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-earth-500">
                    {m.title === ILM_MEDIA_TITLE_PROFILE
                      ? "Profile"
                      : m.title === ILM_MEDIA_TITLE_BANNER
                        ? "Banner"
                        : "Gallery"}
                  </p>
                  {galleryCaption(m.title) ? (
                    <p className="mt-1 text-sm text-earth-800">{galleryCaption(m.title)}</p>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    className="mt-3 text-sm font-medium text-red-800 underline-offset-4 hover:underline disabled:opacity-50"
                    onClick={() => void deleteMedia(m.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
