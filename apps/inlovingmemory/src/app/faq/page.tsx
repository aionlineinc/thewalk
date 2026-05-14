import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { IlmPageHero } from "@/components/ilm-page-hero";

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
      <IlmPageHero
        eyebrow={content.faq.heroEyebrow || "FAQ"}
        title={content.faq.title}
        body={content.faq.intro}
        image={content.faq.heroImage}
      />

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
