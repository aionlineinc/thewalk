import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "FAQ · inLovingMemory",
  description: "Answers to common questions about memorial privacy, moderation, and getting started.",
};

function Item({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-earth-200 bg-white/80 px-6 py-5 shadow-sm">
      <h2 className="text-base font-semibold text-earth-900">{q}</h2>
      <p className="mt-2 text-sm leading-relaxed text-earth-700">{a}</p>
    </div>
  );
}

export default async function FaqPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">FAQ</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.faq.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.faq.intro}</p>

      <div className="mt-12 space-y-4">
        {content.faq.items.map((it) => (
          <Item key={it.q} q={it.q} a={it.a} />
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/how-it-works"
          className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
        >
          How it works
        </Link>
        <Link
          href="/directory"
          className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
        >
          Find a memorial
        </Link>
      </div>
    </main>
  );
}

