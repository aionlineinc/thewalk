"use client";

import { useState } from "react";

type FlowerDonation = {
  id: string;
  label: string;
  url: string | null;
  description: string | null;
  kind: string;
  providerId?: string | null;
  memorialId?: string;
};

export function MemorialFlowersDonations({
  items,
  memorialId,
  memorialSlug,
}: {
  items: FlowerDonation[];
  memorialId: string;
  memorialSlug: string;
}) {
  if (items.length === 0) return null;

  const flowers = items.filter((i) => i.kind === "FLOWERS");
  const donations = items.filter((i) => i.kind === "DONATION");

  return (
    <section className="ilm-container mt-8" aria-labelledby="flowers-heading">
      <h2 id="flowers-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Flowers &amp; donations
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Flower items */}
        {flowers.map((item) => (
          <FlowerCard key={item.id} item={item} memorialId={memorialId} memorialSlug={memorialSlug} />
        ))}

        {/* Donation items */}
        {donations.map((item) => (
          <DonationCard key={item.id} item={item} memorialId={memorialId} />
        ))}

        {/* Always show a general donation option */}
        <DonationCard
          item={{
            id: "general",
            label: "Make a donation",
            url: null,
            description: "Support the family with a financial contribution.",
            kind: "DONATION",
            memorialId,
          }}
          memorialId={memorialId}
        />
      </div>
    </section>
  );
}

/* ── Flower Card ──────────────────────────────── */

function FlowerCard({
  item,
  memorialId,
  memorialSlug,
}: {
  item: FlowerDonation;
  memorialId: string;
  memorialSlug: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isVendor = !!item.providerId;

  async function handleOrder() {
    if (!name || !email || !amount) { setError("Name, email, and amount required."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: item.providerId,
          memorialId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          description: desc || undefined,
          amount: parseFloat(amount),
        }),
      });
      const json = (await res.json()) as { error?: string; clientSecret?: string };
      if (!res.ok) { setError(json.error ?? "Payment failed."); return; }
      setDone(true);
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm font-medium text-earth-900">Order placed — thank you!</p>
        <p className="mt-1 text-sm text-earth-600">{item.label} will be notified.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-earth-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Flowers</p>
      <p className="mt-1 text-base font-semibold text-earth-900">{item.label}</p>
      {item.description ? <p className="mt-1 text-sm text-earth-600">{item.description}</p> : null}

      {isVendor ? (
        showForm ? (
          <div className="mt-4 space-y-3 border-t border-earth-100 pt-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What would you like to order?" rows={2} className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} step={0.01} placeholder="Amount ($)" className="w-32 rounded-lg border border-earth-200 px-3 py-2 text-sm" />
            {error ? <p className="text-sm text-red-800">{error}</p> : null}
            <button onClick={handleOrder} disabled={busy} className="w-full rounded-lg bg-calm-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-calm-600 disabled:opacity-60">{busy ? "Processing…" : "Pay & place order"}</button>
            <button onClick={() => setShowForm(false)} className="block w-full text-center text-sm text-earth-500 hover:text-earth-700">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="mt-3 rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white hover:bg-calm-600">Order flowers</button>
        )
      ) : item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-calm-500 underline-offset-4 hover:underline">Order flowers →</a>
      ) : null}
    </div>
  );
}

/* ── Donation Card ────────────────────────────── */

function DonationCard({ item, memorialId }: { item: FlowerDonation; memorialId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleDonate() {
    if (!name || !email || !amount) { setError("Name, email, and amount required."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId,
          donorName: name,
          donorEmail: email,
          amount: parseFloat(amount),
          message: message || undefined,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) { setError(json.error ?? "Payment failed."); return; }
      setDone(true);
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm font-medium text-earth-900">Thank you for your donation!</p>
        <p className="mt-1 text-sm text-earth-600">Your contribution means so much.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-earth-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Donation</p>
      <p className="mt-1 text-base font-semibold text-earth-900">{item.label}</p>
      {item.description ? <p className="mt-1 text-sm text-earth-600">{item.description}</p> : null}

      {item.url && !showForm ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-calm-500 underline-offset-4 hover:underline">Donate →</a>
      ) : showForm ? (
        <div className="mt-4 space-y-3 border-t border-earth-100 pt-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} step={0.01} placeholder="Amount ($)" className="w-32 rounded-lg border border-earth-200 px-3 py-2 text-sm" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message (optional)" rows={2} className="w-full rounded-lg border border-earth-200 px-3 py-2 text-sm" />
          {error ? <p className="text-sm text-red-800">{error}</p> : null}
          <button onClick={handleDonate} disabled={busy} className="w-full rounded-lg bg-calm-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-calm-600 disabled:opacity-60">{busy ? "Processing…" : "Donate"}</button>
          <button onClick={() => setShowForm(false)} className="block w-full text-center text-sm text-earth-500 hover:text-earth-700">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="mt-3 rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white hover:bg-calm-600">Donate</button>
      )}
    </div>
  );
}
