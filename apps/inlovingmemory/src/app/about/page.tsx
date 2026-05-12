import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About inLovingMemory — Honouring Lives, Preserving Legacies",
  description: "inLovingMemory was built by theWalk Ministries to give every life the honour it deserves — and every family the support they need.",
};

export default async function AboutPage() {
  const content = await getIlmMarketingContent();
  const a = content.about;

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <img
            src={a.heroImage || "https://images.unsplash.com/photo-1475776408506-9a5371e7a068?w=1920&q=85"}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">About</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            {a.title}
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="ilm-container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl leading-relaxed text-earth-800 md:text-2xl">{a.body}</p>
        </div>
      </section>

      {/* Our Story */}
      {a.story ? (
        <section className="border-t border-earth-200/80 bg-white py-20 md:py-28">
          <div className="ilm-container">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{a.story.heading}</p>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-earth-700">
                {a.story.body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Our Belief */}
      {a.belief ? (
        <section className="relative overflow-hidden bg-[#0f0b08] py-20 md:py-28">
          <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-amber-900/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 left-0 h-[400px] w-[400px] rounded-full bg-amber-900/10 blur-3xl" aria-hidden />
          <div className="relative ilm-container">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{a.belief.heading}</p>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-white/75">
                {a.belief.body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <blockquote className="mt-10 border-l-2 border-calm-500/40 pl-5">
                <p className="text-lg italic leading-relaxed text-white/60">{a.belief.verse}</p>
                <footer className="mt-3 text-sm text-white/40">— {a.belief.verseRef}</footer>
              </blockquote>
            </div>
          </div>
        </section>
      ) : null}

      {/* What We Offer */}
      {a.offering ? (
        <section className="border-t border-earth-200/80 bg-white py-20 md:py-28">
          <div className="ilm-container">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{a.offering.heading}</p>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-earth-700">
                {a.offering.body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Connection to theWalk */}
      {a.connection ? (
        <section className="bg-earth-50/50 py-20 md:py-28">
          <div className="ilm-container">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{a.connection.heading}</p>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-earth-700">
                {a.connection.body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {a.connection.cta ? (
                <div className="mt-8">
                  <a
                    href={a.connection.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-earth-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
                  >
                    {a.connection.cta.label} →
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Closing CTA */}
      {a.closing ? (
        <section className="relative overflow-hidden bg-[#0f0b08] py-20 md:py-28">
          <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-amber-900/15 blur-3xl" aria-hidden />
          <div className="relative ilm-container text-center">
            <h2 className="text-3xl font-medium tracking-tight text-white md:text-4xl">{a.closing.heading}</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={a.closing.primaryCta.href}
                className="app-pill-primary"
                data-button-link
              >
                {a.closing.primaryCta.label}
              </a>
              <a
                href={a.closing.secondaryCta.href}
                className="app-pill-ghost-dark"
                data-button-link
              >
                {a.closing.secondaryCta.label}
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
