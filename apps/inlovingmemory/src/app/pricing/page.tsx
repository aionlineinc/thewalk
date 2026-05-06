import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = {
  title: "Pricing · inLovingMemory",
  description: "Start free. Upgrade for more privacy, media, and a private family vault for generations.",
};

export default async function PricingPage() {
  const content = await getIlmMarketingContent();
  return (
    <main>
      <section className="border-b border-earth-200/80 bg-earth-50/30">
        <div className="ilm-container py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">Pricing</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.pricing.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.pricing.intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/sign-in" variant="primary">
              Page keeper sign in
            </ButtonLink>
            <ButtonLink href="/faq" variant="outline">
              Read FAQ
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="ilm-container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {content.pricing.tiers.map((t) => (
            <Card
              key={t.name}
              className={
                t.name === "Premium"
                  ? "border-calm-500/25 bg-calm-400/5"
                  : t.name === "Generations"
                    ? "bg-earth-50/40"
                    : undefined
              }
            >
              <CardBody>
                <p
                  className={
                    t.name === "Premium"
                      ? "text-xs font-semibold uppercase tracking-wide text-calm-700"
                      : "text-xs font-semibold uppercase tracking-wide text-earth-500"
                  }
                >
                  {t.name}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-earth-900">{t.summary}</h2>
                <ul className="mt-5 space-y-2 text-sm text-earth-700">
                  {t.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-earth-200 bg-white/70 px-6 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-earth-900">Need help choosing?</h2>
          <p className="mt-2 text-sm text-earth-700">Start with Basic. You can upgrade later without losing anything.</p>
        </div>
      </section>
    </main>
  );
}

