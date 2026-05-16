"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  tier: "PREMIUM" | "GENERATIONS" | "CONCIERGE";
  label: string;
  disabled?: boolean;
};

export function PricingBuyButton({ tier, label, disabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (res.status === 401) {
        router.push("/sign-in?redirect=/pricing");
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }, [tier, router]);

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={
          tier === "PREMIUM"
            ? "mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white/90 px-6 py-2.5 text-sm font-semibold text-calm-700 hover:bg-white disabled:opacity-50"
            : tier === "GENERATIONS"
              ? "mt-6 inline-flex w-full items-center justify-center rounded-lg bg-calm-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-calm-600 disabled:opacity-50"
              : "mt-6 inline-flex w-full items-center justify-center rounded-lg border border-earth-300 bg-white px-6 py-2.5 text-sm font-semibold text-earth-700 hover:bg-earth-50 disabled:opacity-50"
        }
      >
        {loading ? "Loading…" : disabled ? "You have this plan" : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
