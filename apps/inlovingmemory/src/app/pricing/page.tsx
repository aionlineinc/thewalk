import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { IlmPageHero } from "@/components/ilm-page-hero";
import { AppPillLink } from "@/components/ui/AppPillLink";
import { PricingBuyButton } from "@/components/ui/PricingBuyButton";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Pricing · inLovingMemory",
  description: "Start free. Upgrade for more privacy, media, and a private family vault for generations.",
};

async function getUserActiveTiers(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const purchases = await prisma.ilmPlanPurchase.findMany({
    where: { userId, status: "ACTIVE" },
    select: { tier: true },
  });
  return new Set(purchases.map((p) => p.tier));
}

const prices: Record<string, string> = {
  PREMIUM: "$89",
  GENERATIONS: "$49/yr",
  CONCIERGE: "$299",
};

export default async function PricingPage() {
  const content = await getIlmMarketingContent();
  const session = await getServerSession(getAuthOptions());
  const activeTiers = await getUserActiveTiers(session?.user?.id);

  const tierToEnum: Record<string, string> = {
    Premium: "PREMIUM",
    Generations: "GENERATIONS",
    Concierge: "CONCIERGE",
  };

  return (
    <main className="pb-24">
      <IlmPageHero
        eyebrow={content.pricing.heroEyebrow || "Pricing"}
        title={content.pricing.title}
        body={content.pricing.intro}
        image={content.pricing.heroImage}
        ctas={content.pricing.heroCtas}
      />

      {/* Pricing tiers */}
      <section className="ilm-container py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {content.pricing.tiers.map((t) => {
            const isFeatured = t.name === "Premium";
            const isDim = t.name === "Generations";
            const tierEnum = tierToEnum[t.name];
            const hasTier = tierEnum ? activeTiers.has(tierEnum) : false;
            const price = tierEnum ? prices[tierEnum] : "";

            let buyLabel = "";
            if (t.name === "Premium") buyLabel = hasTier ? "You have Premium" : `Buy Premium — ${price}`;
            else if (t.name === "Generations") buyLabel = hasTier ? "You have Generations" : `Buy Generations — ${price}`;
            else if (t.name === "Concierge") buyLabel = "Contact us";

            return (
              <div
                key={t.name}
                className={
                  isFeatured
                    ? "relative flex flex-col overflow-hidden rounded-2xl border border-calm-500/30 bg-calm-500 shadow-xl shadow-calm-700/20"
                    : isDim
                      ? "flex flex-col rounded-2xl border border-earth-200 bg-earth-50/60 shadow-sm"
                      : "flex flex-col rounded-2xl border border-earth-200 bg-white shadow-sm"
                }
              >
                <div className="flex-1 p-8">
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

                {t.name === "Concierge" ? (
                  <div className="px-8 pb-8">
                    <a
                      href="/services/register"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-earth-300 bg-white px-6 py-2.5 text-sm font-semibold text-earth-700 hover:bg-earth-50"
                    >
                      Contact us
                    </a>
                  </div>
                ) : tierEnum ? (
                  <div className="px-8 pb-8">
                    <PricingBuyButton
                      tier={tierEnum as "PREMIUM" | "GENERATIONS"}
                      label={buyLabel}
                      disabled={hasTier}
                    />
                  </div>
                ) : null}
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
