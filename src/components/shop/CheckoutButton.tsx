"use client";

import { useCallback, useState } from "react";

type Props = {
  priceId: string;
  label?: string;
  className?: string;
};

export function CheckoutButton({ priceId, label = "Buy", className }: Props) {
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, quantity: 1 }),
      });
      const json = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "Checkout failed");
      }
      window.location.assign(json.url);
    } catch (err) {
      console.error(err);
      alert("Checkout is temporarily unavailable. Please try again in a moment.");
      setLoading(false);
    }
  }, [loading, priceId]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={
        className ??
        "inline-flex w-full items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 sm:w-auto"
      }
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}

