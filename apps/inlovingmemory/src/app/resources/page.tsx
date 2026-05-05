import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "Resources · inLovingMemory",
  description: "Support for grief, remembrance, and spiritual care — curated by theWalk.",
};

export default async function ResourcesPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">Resources</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.resources.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.resources.intro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {content.resources.cards.map((c, idx) => (
          <section
            key={c.title}
            className={
              idx === 1
                ? "rounded-2xl border border-calm-600/25 bg-calm-500/5 px-6 py-5 shadow-sm"
                : "rounded-2xl border border-earth-200 bg-white/80 px-6 py-5 shadow-sm"
            }
          >
            <h2 className="text-lg font-semibold text-earth-900">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-earth-700">{c.body}</p>
            {c.cta ? (
              <div className="mt-5">
                <Link className="text-sm font-medium text-calm-700 underline-offset-4 hover:underline" href={c.cta.href}>
                  {c.cta.label} →
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-xs text-earth-500">Coming soon</p>
            )}
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/about"
          className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
        >
          About inLovingMemory
        </Link>
        <Link
          href="/pricing"
          className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
        >
          View pricing
        </Link>
      </div>
    </main>
  );
}

