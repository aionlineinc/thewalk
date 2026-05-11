"use client";

import { useRef, useState } from "react";

export function MemorialEventRsvpForm({ eventIds, memorialSlug }: { eventIds: string[]; memorialSlug: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (eventIds.length === 0) return null;

  async function submit(formData: FormData) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/ilm/public/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: formData.get("eventId"),
          guestName: formData.get("guestName"),
          guestEmail: (formData.get("guestEmail") as string)?.trim() || undefined,
          guestCount: Number(formData.get("guestCount")) || 1,
          message: (formData.get("message") as string)?.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Something went wrong.");
        return;
      }
      setDone(true);
      formRef.current?.reset();
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="ilm-container mt-8">
        <div className="rounded-xl border border-earth-200 bg-earth-50 px-5 py-4 text-sm text-earth-800">
          Thank you — your attendance has been noted.
        </div>
      </section>
    );
  }

  return (
    <section className="ilm-container mt-8" aria-labelledby="rsvp-heading">
      <h2 id="rsvp-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        RSVP
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Let the family know you plan to attend.
      </p>

      <form ref={formRef} action={submit} className="mt-6 max-w-xl space-y-4">
        <input type="hidden" name="eventId" value={eventIds[0]} />
        <div>
          <label htmlFor="rsvp-name" className="block text-sm font-medium text-earth-800">
            Your name
          </label>
          <input
            id="rsvp-name"
            name="guestName"
            required
            maxLength={120}
            className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
          />
        </div>
        <div>
          <label htmlFor="rsvp-email" className="block text-sm font-medium text-earth-800">
            Email <span className="font-normal text-earth-500">(optional)</span>
          </label>
          <input
            id="rsvp-email"
            name="guestEmail"
            type="email"
            maxLength={320}
            className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="rsvp-count" className="block text-sm font-medium text-earth-800">
              Guests
            </label>
            <select
              id="rsvp-count"
              name="guestCount"
              defaultValue={1}
              className="mt-1.5 rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="rsvp-msg" className="block text-sm font-medium text-earth-800">
            Message <span className="font-normal text-earth-500">(optional)</span>
          </label>
          <textarea
            id="rsvp-msg"
            name="message"
            rows={3}
            maxLength={1000}
            className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
          />
        </div>
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900 disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send RSVP"}
        </button>
      </form>
    </section>
  );
}
