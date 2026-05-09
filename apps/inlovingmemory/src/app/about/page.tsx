import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = {
  title: "About · inLovingMemory",
  description:
    "inLovingMemory was born from the conviction that every life deserves to be honoured with dignity and remembered with love.",
};

export default async function AboutPage() {
  const content = await getIlmMarketingContent();
  return (
    <main>
      <section className="border-b border-earth-200/80 bg-earth-50/30">
        <div className="ilm-container py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">About</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">{content.about.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.about.body}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            {content.about.links.map((l, idx) => (
              <ButtonLink key={l.href} href={l.href} variant={idx === 0 ? "primary" : "outline"}>
                {l.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </section>

      <section className="ilm-container py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">The service</p>
              <h2 className="mt-2 text-xl font-semibold text-earth-900">Honor the moment</h2>
              <p className="mt-3 text-sm leading-relaxed text-earth-700">
                A memorial page ready before the day — service details, a digital program, and a gathering place for family who couldn’t be there in person.
              </p>
            </CardBody>
          </Card>
          <Card className="bg-calm-500/5">
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-calm-700">The community</p>
              <h2 className="mt-2 text-xl font-semibold text-earth-900">You were never meant to grieve alone</h2>
              <p className="mt-3 text-sm leading-relaxed text-earth-700">
                Grief counselling, prayer, and pastoral care from theWalk Ministries — alongside a memorial that grows with your family through every season.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </main>
  );
}

