import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "FAQ · inLovingMemory",
  description: "Answers to common questions about memorial privacy, moderation, and getting started.",
};

function Item({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-earth-200 bg-white px-6 py-5 shadow-sm">
      <h2 className="text-base font-semibold text-earth-900">{q}</h2>
      <p className="mt-2 text-sm leading-relaxed text-earth-700">{a}</p>
    </div>
  );
}

export default async function FaqPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-24">
      {/* Cinematic hero */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">FAQ</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">{content.faq.title}</h1>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">{content.faq.intro}</p>
        </div>
      </section>

      {/* FAQ items */}
      <div className="ilm-container py-12">
        <div className="space-y-4">
          {content.faq.items.map((it) => (
            <Item key={it.q} q={it.q} a={it.a} />
          ))}
        </div>
      </div>
    </main>
  );
}
