"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type PresetRow = { id: string; label: string; storageUrl: string };

export function AdminBannersClient({ presets: initial }: { presets: PresetRow[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !label.trim()) {
      setError("Label and file are required.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use JPEG, PNG, WebP, or GIF.");
      return;
    }

    setError(null);
    setBusy(true);

    try {
      const fd = new FormData();
      fd.append("label", label.trim());
      fd.append("file", file);

      const res = await fetch("/api/admin/banners", { method: "POST", body: fd });
      const json = (await res.json()) as { error?: string; uploadUrl?: string };

      if (!res.ok) {
        setError(json.error ?? "Upload failed.");
        return;
      }

      // PUT the file to S3
      const put = await fetch(json.uploadUrl!, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setError("Upload to storage failed. Check bucket CORS.");
        return;
      }

      setLabel("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this banner preset?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Banner presets</h1>
      <p className="dash-page-lead">Upload custom banner images available as presets for all memorial pages.</p>

      {/* Upload form */}
      <div className="dash-card-pad mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Add preset</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="blabel" className="block text-sm font-medium text-earth-700">
              Label
            </label>
            <input
              id="blabel"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={100}
              placeholder="e.g. Mountain Sunrise"
              className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Image</label>
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              disabled={busy}
              className="mt-1.5 text-sm text-earth-800 file:mr-3 file:rounded-lg file:border-0 file:bg-earth-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
            />
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void upload()}
            className="dash-btn-primary shrink-0"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {/* Preset list */}
      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
            {initial.length} custom presets
          </p>
        </div>
        {initial.length === 0 ? (
          <p className="px-6 py-8 text-sm text-earth-500">No custom presets yet.</p>
        ) : (
          <ul className="divide-y divide-earth-100">
            {initial.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                <img
                  src={p.storageUrl}
                  alt={p.label}
                  className="h-16 w-24 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="flex-1 text-sm font-medium text-earth-900">{p.label}</p>
                <button
                  type="button"
                  disabled={busy}
                  className="text-sm font-medium text-red-800 underline-offset-4 hover:underline disabled:opacity-50"
                  onClick={() => void remove(p.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
