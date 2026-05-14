import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { IlmPageHero } from "@/components/ilm-page-hero";

export const metadata = {
  title: "Resources · inLovingMemory",
  description: "Support for grief, remembrance, and spiritual care — curated by theWalk.",
};

export default async function ResourcesPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-24">
      <IlmPageHero
        eyebrow={content.resources.heroEyebrow || "Resources"}
        title={content.resources.title}
        body={content.resources.intro}
        image={content.resources.heroImage}
      />

      {/* Resource cards */}
      <div className="ilm-container py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {content.resources.cards.map((c, idx) => (
            <section
              key={c.title}
              className={
                idx === 1
                  ? "rounded-2xl border border-calm-500/20 bg-calm-500/5 px-6 py-5 shadow-sm"
                  : "rounded-2xl border border-earth-200 bg-white px-6 py-5 shadow-sm"
              }
            >
              <h2 className="text-lg font-semibold text-earth-900">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-earth-700">{c.body}</p>
              {c.cta ? (
                <div className="mt-5">
                  <Link className="text-sm font-medium text-calm-500 underline-offset-4 hover:underline" href={c.cta.href}>
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
          <Link href="/resources/blog" className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900">Read the blog</Link>
          <Link href="/about" className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50">About inLovingMemory</Link>
          <Link href="/pricing" className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900">View pricing</Link>
        </div>
      </div>
    </main>
  );
}
