import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "How it works · inLovingMemory",
  description: "Create a memorial, personalise it, share it, and preserve a legacy for the generations that follow.",
};

export default async function HowItWorksPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-20">
      <section className="border-b border-earth-200/80 bg-earth-50/30">
        <div className="ilm-container py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">How it works</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900 md:text-4xl">
            {content.howItWorks.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.howItWorks.intro}</p>
        </div>
      </section>

      <section className="ilm-container py-14" aria-label="How it works steps">
        <ol className="grid gap-6 md:grid-cols-3">
          {content.howItWorks.steps.map((s, idx) => (
            <li
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-earth-200 bg-white/80 p-7 shadow-sm transition-shadow hover:shadow"
            >
              <div
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-md bg-calm-400/25 font-mono text-sm font-semibold text-calm-700 ring-1 ring-calm-500/20"
                aria-hidden
              >
                {idx + 1}
              </div>
              <h2 className="pr-12 text-lg font-semibold tracking-tight text-earth-900">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-earth-700">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-4">
          {content.howItWorks.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.href === "/pricing"
                  ? "inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
                  : "inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

