import Image from "next/image";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { AppPillLink } from "@/components/ui/AppPillLink";

export const metadata = {
  title: "Pricing · inLovingMemory",
  description: "Start free. Upgrade for more privacy, media, and a private family vault for generations.",
};

export default async function PricingPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-24">
      {/* Cinematic hero */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <Image
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=85"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Pricing</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            {content.pricing.title}
          </h1>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
            {content.pricing.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <AppPillLink href="/sign-in" variant="primary">
              Get started
            </AppPillLink>
            <AppPillLink href="/faq" variant="ghostOnDark">
              Read FAQ
            </AppPillLink>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="ilm-container py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {content.pricing.tiers.map((t) => {
            const isFeatured = t.name === "Premium";
            const isDim = t.name === "Generations";
            return (
              <div
                key={t.name}
                className={
                  isFeatured
                    ? "relative overflow-hidden rounded-2xl border border-calm-500/30 bg-calm-500 shadow-xl shadow-calm-700/20"
                    : isDim
                      ? "rounded-2xl border border-earth-200 bg-earth-50/60 shadow-sm"
                      : "rounded-2xl border border-earth-200 bg-white shadow-sm"
                }
              >
                <div className="p-8">
                  <p
                    className={
                      isFeatured
                        ? "text-xs font-semibold uppercase tracking-[0.22em] text-white/70"
                        : "text-xs font-semibold uppercase tracking-[0.22em] text-earth-400"
                    }
                  >
                    {t.name}
                  </p>
                  <h2
                    className={
                      isFeatured
                        ? "mt-3 text-xl font-semibold text-white"
                        : "mt-3 text-xl font-semibold text-earth-900"
                    }
                  >
                    {t.summary}
                  </h2>
                  <ul
                    className={`mt-6 space-y-2.5 text-sm ${isFeatured ? "text-white/80" : "text-earth-600"}`}
                  >
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className={`mt-0.5 shrink-0 ${isFeatured ? "text-white/60" : "text-calm-500"}`}>
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA callout */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-earth-900">Need help choosing?</h2>
              <p className="mt-1 text-sm text-earth-600">
                Start with Basic — you can upgrade later without losing anything.
              </p>
            </div>
            <AppPillLink href="/sign-in" variant="primary" className="shrink-0">
              Get started
            </AppPillLink>
          </div>
        </div>
      </section>
    </main>
  );
}
