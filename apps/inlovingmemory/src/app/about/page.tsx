import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "About · inLovingMemory",
  description:
    "inLovingMemory was born from the conviction that every life deserves to be honoured with dignity and remembered with love.",
};

export default async function AboutPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">About</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.about.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-earth-800">{content.about.body}</p>
      <div className="mt-10 space-y-4 text-earth-700">
        <p>
          We are more than a memorial platform. We are a community of remembrance, grief support, and generational
          legacy.
        </p>
        <p>
          When someone’s walk in this life ends, their story does not. We help families create a beautiful place to
          honour, share, and carry a life forward — one memory at a time.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {content.about.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              l.href === "/how-it-works" || l.href === "/pricing"
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

