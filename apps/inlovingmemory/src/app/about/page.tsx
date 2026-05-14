import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { IlmPageHero } from "@/components/ilm-page-hero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About inLovingMemory — Honouring Lives, Preserving Legacies",
  description: "inLovingMemory was built by theWalk Ministries to give every life the honour it deserves — and every family the support they need.",
};

export default async function AboutPage() {
  const content = await getIlmMarketingContent();
  const a = content.about;

  return (
    <main>
      <IlmPageHero
        eyebrow={a.heroEyebrow || "About"}
        title={a.title}
        body={a.body}
        image={a.heroImage}
        ctas={a.heroCtas}
      />

      {/* Our Story — 2-column with photo */}
      {a.story ? (
        <section className="border-t border-earth-200/80 bg-white py-20 md:py-28">
          <div className="ilm-container">
            <div className="grid items-center gap-12 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{a.story.heading}</p>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-earth-700">
                  {a.story.body.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={a.story.imageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Our Belief — dark section */}
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

      {/* What We Offer — photo background with overlay */}
      {a.offering ? (
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0">
            <img
              src={a.offering?.backgroundImageUrl || "https://images.unsplash.com/photo-1506815928480-bc4456a7e4fe?w=1920&q=80"}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/90" aria-hidden />
          </div>
          <div className="relative ilm-container">
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

      {/* Partners */}
      {a.partners ? (
        <section className="border-t border-earth-200/80 bg-earth-50/30 py-20 md:py-28">
          <div className="ilm-container text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{a.partners.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-earth-900 md:text-3xl">{a.partners.heading}</h2>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {a.partners.items.map((p) => (
                <div key={p.name} className="flex items-center justify-center rounded-2xl bg-white px-4 py-6 shadow-sm">
                  <span className="text-sm font-semibold text-earth-500">{p.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-earth-500">
              {a.partners.ctaLabel.split("→")[0]}
              <a href={a.partners.ctaHref} className="font-medium text-calm-500 underline-offset-4 hover:underline">
                {" "}{a.partners.ctaLabel.includes("→") ? "→" : ""}
              </a>
            </p>
          </div>
        </section>
      ) : null}

      {/* Testimonial */}
      {a.testimonial ? (
        <section className="relative overflow-hidden bg-[#0f0b08] py-20 md:py-28">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-900/10 blur-3xl" aria-hidden />
          <div className="relative ilm-container text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Testimonial</p>
            <blockquote className="mx-auto mt-8 max-w-2xl">
              <p className="text-xl leading-relaxed text-white/80 md:text-2xl">
                &ldquo;{a.testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <p className="text-base font-semibold text-white">{a.testimonial.author}</p>
                <p className="mt-1 text-sm text-white/50">{a.testimonial.attribution}</p>
              </footer>
            </blockquote>
          </div>
        </section>
      ) : null}

      {/* Connection to theWalk — 2-column */}
      {a.connection ? (
        <section className="bg-white py-20 md:py-28">
          <div className="ilm-container">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
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
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={a.connection.imageUrl || "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80"}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
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
              <a href={a.closing.primaryCta.href} className="app-pill-primary" data-button-link>
                {a.closing.primaryCta.label}
              </a>
              <a href={a.closing.secondaryCta.href} className="app-pill-ghost-dark" data-button-link>
                {a.closing.secondaryCta.label}
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
