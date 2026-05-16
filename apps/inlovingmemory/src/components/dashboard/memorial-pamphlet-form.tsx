"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MemorialPamphletForm({
  memorialId,
  pdfUrl: initialPdfUrl,
  memorialUrl,
}: {
  memorialId: string;
  pdfUrl: string | null;
  memorialUrl: string;
}) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage(null);
    const url = (formData.get("pdfUrl") as string)?.trim() || "";

    try {
      const res = await fetch("/api/ilm/pamphlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId, pdfUrl: url || null }),
      });
      const data = (await res.json()) as { error?: string; pdfUrl?: string };
      if (!res.ok) {
        setMessage(data.error ?? "Failed to save");
      } else {
        setPdfUrl(data.pdfUrl ?? "");
        setMessage("Saved");
        router.refresh();
      }
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const qrUrl = pdfUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(memorialUrl)}`
    : null;

  return (
    <div className="dash-card-pad mt-8">
      <h2 className="text-lg font-semibold text-earth-900">Order of Service / Pamphlet</h2>
      <p className="mt-1 text-sm text-earth-600">
        Upload a PDF of the funeral programme or order of service to display on the memorial page.
      </p>

      <form action={handleSave} className="mt-4 space-y-4">
        <input type="hidden" name="memorialId" value={memorialId} />
        <div>
          <label htmlFor="pamphletPdfUrl" className="block text-sm font-medium text-earth-800">
            PDF URL
          </label>
          <input
            id="pamphletPdfUrl"
            name="pdfUrl"
            type="url"
            defaultValue={pdfUrl}
            placeholder="https://storage.example.com/pamphlet.pdf"
            className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
          <p className="mt-1 text-xs text-earth-500">
            Upload your PDF to a storage service and paste the public URL here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {message ? (
            <span className="text-sm text-earth-600">{message}</span>
          ) : null}
        </div>
      </form>

      {qrUrl ? (
        <div className="mt-6 border-t border-earth-200 pt-6">
          <h3 className="text-sm font-semibold text-earth-900">QR Code</h3>
          <p className="mt-1 text-xs text-earth-500">
            Print this QR code on the pamphlet to link to the online memorial page.
          </p>
          <div className="mt-3 inline-block overflow-hidden rounded-xl border border-earth-200">
            <img
              src={qrUrl}
              alt="QR code linking to memorial page"
              className="h-32 w-32"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
