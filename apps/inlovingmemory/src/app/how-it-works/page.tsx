import Image from "next/image";
import Link from "next/link";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "How it works · inLovingMemory",
  description: "Create a memorial, personalise it, share it, and preserve a legacy for the generations that follow.",
};

const STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "https://images.unsplash.com/photo-1474649107449-ea4f014b7e9f?w=800&q=80",
];

export default async function HowItWorksPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-24">
      {/* Cinematic hero */}
      <section className="relative flex h-[58vh] min-h-[440px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <Image
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&q=85"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">How it works</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            {content.howItWorks.title}
          </h1>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
            {content.howItWorks.intro}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="ilm-container py-16 md:py-20" aria-label="How it works steps">
        <ol className="grid gap-6 md:grid-cols-3">
          {content.howItWorks.steps.map((s, idx) => (
            <li
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {STEP_PHOTOS[idx] && (
                <div className="relative h-44 w-full overflow-hidden bg-earth-100">
                  <img
                    src={STEP_PHOTOS[idx]}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
              <div className="p-7">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-calm-500/15 font-mono text-sm font-semibold text-calm-700 ring-1 ring-calm-500/20">
                  {idx + 1}
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-earth-900">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">{s.body}</p>
              </div>
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
                  ? "inline-flex rounded-full bg-calm-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
                  : "inline-flex rounded-full border border-earth-300 bg-white px-7 py-3 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
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
