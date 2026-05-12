import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "About · inLovingMemory",
  description: "inLovingMemory was born from the conviction that every life deserves to be honoured with dignity and remembered with love.",
};

export default async function AboutPage() {
  const content = await getIlmMarketingContent();
  return (
    <main className="pb-24">
      {/* Cinematic hero */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=85"
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">About</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">{content.about.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="ilm-container py-14">
        <p className="max-w-2xl text-lg leading-relaxed text-earth-800">{content.about.body}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {content.about.links.map((l, idx) => (
            <ButtonLink key={l.href} href={l.href} variant={idx === 0 ? "primary" : "outline"}>
              {l.label}
            </ButtonLink>
          ))}
        </div>

        {/* Value cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-earth-200 bg-white px-6 py-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">The service</p>
            <h2 className="mt-2 text-xl font-semibold text-earth-900">Honor the moment</h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-700">
              A memorial page ready before the day — service details, a digital program, and a gathering place for family who could not be there in person.
            </p>
          </div>
          <div className="rounded-2xl border border-calm-500/20 bg-calm-500/5 px-6 py-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-calm-700">The community</p>
            <h2 className="mt-2 text-xl font-semibold text-earth-900">You were never meant to grieve alone</h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-700">
              Grief counselling, prayer, and pastoral care from theWalk Ministries — alongside a memorial that grows with your family through every season.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
