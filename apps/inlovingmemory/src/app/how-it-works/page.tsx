import Image from "next/image";
import Link from "next/link";
import { AppPillLink } from "@/components/ui/AppPillLink";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";

export const metadata = {
  title: "How it works · inLovingMemory",
  description: "Create a memorial page in minutes, invite family to contribute, and preserve a lasting legacy for generations.",
};

const STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  "https://images.unsplash.com/photo-1474649107449-ea4f014b7e9f?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=800&q=80",
];

const PRIVACY_FEATURES = [
  {
    title: "You decide who sees it",
    body: "Keep it fully public, share only via link, or password-protect it for family. Full control from day one.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "A community praying with you",
    body: "Every memorial includes a prayer wall. Family receive a weekly summary of how many people have prayed for them — a quiet, ongoing comfort.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Preserved for generations",
    body: "Photos, stories, and memories stored securely — no expiry, no disappearing. There when the next generation comes looking.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

const TRIBUTE_FEATURES = [
  "Service details, order of service & digital program",
  "Life story, photos, and short video clips",
  "Prayer wall — on every memorial, free or paid",
  "Guestbook messages and tributes (moderated)",
  "Grief counselling sessions matched to your family",
  "Shareable by link, QR code, or email invite",
];

export default async function HowItWorksPage() {
  const content = await getIlmMarketingContent();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4" aria-labelledby="hiw-hero-heading">
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
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">How it works</p>
          <h1
            id="hiw-hero-heading"
            className="mt-3 max-w-2xl text-4xl font-medium tracking-tight text-white md:text-[52px] md:leading-[1.1]"
          >
            Honor the service. Preserve the story.
          </h1>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
            Set up a page before the service, share it on the day, then let it grow into a memorial your family can return to for years.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <AppPillLink href="/sign-in" variant="primary">
              Create your first memorial
            </AppPillLink>
            <AppPillLink href="/pricing" variant="ghostOnDark">
              View pricing
            </AppPillLink>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="bg-white py-20 md:py-24" aria-labelledby="hiw-steps-heading">
        <div className="ilm-container">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-calm-500">Get started</p>
            <h2
              id="hiw-steps-heading"
              className="mt-4 text-3xl font-medium tracking-tight text-earth-900 md:text-4xl"
            >
              {content.howItWorks.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-light leading-relaxed text-earth-500 md:text-lg">
              {content.howItWorks.intro}
            </p>
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {content.howItWorks.steps.map((s, idx) => (
              <li
                key={s.title}
                className="group overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden bg-earth-100">
                  {STEP_PHOTOS[idx] && (
                    <img
                      src={STEP_PHOTOS[idx]}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex h-8 w-8 items-center justify-center rounded-md bg-calm-500 font-mono text-sm font-semibold text-white shadow-md ring-2 ring-white/30">
                    {idx + 1}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold tracking-tight text-earth-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-earth-500">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {content.howItWorks.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  l.href === "/pricing" || l.href === "/sign-in"
                    ? "inline-flex rounded-full bg-calm-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
                    : "inline-flex rounded-full border border-earth-300 bg-white px-7 py-3 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature showcase ── */}
      <section className="relative overflow-hidden bg-[#0f0b08] py-20 md:py-28" aria-labelledby="hiw-feature-heading">
        <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-amber-900/15 blur-3xl" aria-hidden />
        <div className="ilm-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Photo */}
            <div className="relative h-[420px] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1511895426328-dc8714191011?w=1000&q=80"
                alt="Family sharing memories together."
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-calm-400">The memorial</p>
              <h2
                id="hiw-feature-heading"
                className="mt-4 text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-[38px] lg:leading-[1.1]"
              >
                Everything in one place — from service day to forever
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-white/60 md:text-lg">
                Begin with the practical — service details, a digital program, and a way for those who can’t attend to still feel present. Then let it grow: photos, life stories, and a guestbook that keeps building long after the day.
              </p>
              <ul className="mt-8 space-y-3">
                {TRIBUTE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-white/75">
                    <span className="mt-0.5 shrink-0 text-calm-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <AppPillLink href="/sign-in" variant="primary">
                  Create your memorial
                </AppPillLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy & dignity ── */}
      <section className="bg-white py-20 md:py-24" aria-labelledby="hiw-privacy-heading">
        <div className="ilm-container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-calm-500">Privacy &amp; dignity</p>
            <h2
              id="hiw-privacy-heading"
              className="mt-4 text-3xl font-medium tracking-tight text-earth-900 md:text-4xl"
            >
              Care, prayer, and control — always
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-light leading-relaxed text-earth-500">
              The page keeper decides what the world sees. theWalk community surrounds the family with prayer. And the memorial remains — long after the service, long after the hard season passes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PRIVACY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-earth-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-calm-500/10 text-calm-600">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-earth-900">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Additional services ── */}
      <section className="border-t border-earth-100 bg-earth-50/50 py-20 md:py-24" aria-labelledby="hiw-services-heading">
        <div className="ilm-container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-calm-500">Additional services</p>
            <h2
              id="hiw-services-heading"
              className="mt-4 text-3xl font-medium tracking-tight text-earth-900 md:text-4xl"
            >
              More support when you need it most
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-light leading-relaxed text-earth-500">
              Some families need a hand getting started. Others need deeper care over time. Both are available.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Concierge */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm">
              <div className="relative h-52 overflow-hidden bg-earth-100">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80"
                  alt=""
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="inline-block rounded-full bg-calm-500 px-3 py-1 text-xs font-semibold text-white">
                    Concierge — $299 one-time
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-400">Done for you</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-earth-900">
                  We’ll build the memorial with you
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">
                  A dedicated specialist creates and populates your memorial from scratch — biography, photos, service details, and digital program. Everything ready before the day, built with care.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-earth-600">
                  {[
                    "Expert builds and populates your page",
                    "30-minute virtual meeting with your family",
                    "Service details and digital program included",
                    "Ongoing support after setup",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-calm-500">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <AppPillLink href="/contact" variant="primary">
                    Enquire about concierge
                  </AppPillLink>
                </div>
              </div>
            </div>

            {/* Extended grief counselling */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm">
              <div className="relative h-52 overflow-hidden bg-earth-100">
                <img
                  src="https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=900&q=80"
                  alt=""
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="inline-block rounded-full bg-earth-800 px-3 py-1 text-xs font-semibold text-white">
                    Extended counselling — fee set by counsellor
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-400">Deeper care</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-earth-900">
                  Ongoing grief support, for as long as you need it
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">
                  Premium membership includes initial grief counselling sessions matched to your family. For those who need longer-term or specialist support — extended sessions are available directly with the counsellor.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-earth-600">
                  {[
                    "Initial sessions included with Premium",
                    "Specialisations: trauma, child bereavement, sudden loss, spiritual care & more",
                    "Matched by type of loss, language & timezone",
                    "Extended sessions at the counsellor's rate",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-calm-500">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <AppPillLink href="/pricing" variant="primary">
                    Get Premium
                  </AppPillLink>
                  <Link
                    href="/resources"
                    className="inline-flex items-center rounded-full border border-earth-300 bg-white px-7 py-3 text-sm font-semibold text-earth-900 transition hover:border-earth-400 hover:bg-earth-50"
                  >
                    Learn about counselling
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Dark closing CTA ── */}
      <section className="relative overflow-hidden bg-[#0d0906] py-24 md:py-32" aria-labelledby="hiw-cta-heading">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-900/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-orange-900/15 blur-3xl" aria-hidden />
        <div className="relative ilm-container text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Ready to begin</p>
          <h2
            id="hiw-cta-heading"
            className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-[44px] lg:leading-[1.15]"
          >
            Begin with the service. Build a legacy.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-white/55">
            Free to create. Simple to share. A memorial that lasts from the service to forever.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <AppPillLink href="/sign-in" variant="primary">
              Create your memorial
            </AppPillLink>
            <AppPillLink href="/directory" variant="ghostOnDark">
              Find a memorial
            </AppPillLink>
          </div>
        </div>
      </section>
    </main>
  );
}
