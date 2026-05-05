import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "Pricing · inLovingMemory",
  description: "Start free. Upgrade for more privacy, media, and a private family vault for generations.",
};

export default async function PricingPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">Pricing</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.pricing.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.pricing.intro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {content.pricing.tiers.map((t) => (
          <section
            key={t.name}
            className={
              t.name === "Premium"
                ? "rounded-2xl border border-calm-600/25 bg-calm-500/5 p-6 shadow-sm"
                : t.name === "Generations"
                  ? "rounded-2xl border border-earth-200 bg-earth-50/40 p-6 shadow-sm"
                  : "rounded-2xl border border-earth-200 bg-white/80 p-6 shadow-sm"
            }
          >
            <p
              className={
                t.name === "Premium"
                  ? "text-xs font-semibold uppercase tracking-wide text-calm-700"
                  : "text-xs font-semibold uppercase tracking-wide text-earth-500"
              }
            >
              {t.name}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-earth-900">{t.summary}</h2>
            <ul className="mt-5 space-y-2 text-sm text-earth-700">
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-earth-200 bg-white/70 px-6 py-5 shadow-sm">
        <h2 className="text-lg font-semibold text-earth-900">Need help choosing?</h2>
        <p className="mt-2 text-sm text-earth-700">
          Start with Basic. You can upgrade later without losing anything.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href="/faq"
            className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
          >
            Read FAQ
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Page keeper sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

