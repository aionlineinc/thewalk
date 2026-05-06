import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "How it works · inLovingMemory",
  description: "Create a memorial, personalise it, share it, and preserve a legacy for the generations that follow.",
};

export default async function HowItWorksPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="ilm-container py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">How it works</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.howItWorks.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.howItWorks.intro}</p>

      <ol className="mt-12 space-y-8">
        {content.howItWorks.steps.map((s, idx) => (
          <li key={s.title} className="rounded-2xl border border-earth-200 bg-white/70 px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">Step {idx + 1}</p>
            <h2 className="mt-2 text-lg font-semibold text-earth-900">{s.title}</h2>
            <p className="mt-2 text-earth-700">{s.body}</p>
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
    </main>
  );
}

