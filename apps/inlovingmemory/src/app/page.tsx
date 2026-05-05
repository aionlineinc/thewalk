import { getIlmSession } from "@/lib/auth";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/ui/card";

export default async function IlmHomePage() {
  const session = await getIlmSession();
  const content = await getIlmMarketingContent();

  return (
    <main>
      <section className="border-b border-earth-200/80 bg-earth-50/30">
        <div className="mx-auto max-w-content px-6 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">theWalk Ministries</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-earth-900 sm:text-5xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth-800">{content.heroBody}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            {content.heroLinks.map((l) => (
              <ButtonLink key={l.href} href={l.href} variant="outline">
                {l.label}
              </ButtonLink>
            ))}
            {session?.user ? (
              <ButtonLink href="/dashboard" variant="primary">
                Your memorials
              </ButtonLink>
            ) : (
              <ButtonLink href="/sign-in" variant="primary">
                Page keeper sign in
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-14 sm:px-8 sm:py-18" aria-labelledby="ilm-features">
        <h2 id="ilm-features" className="text-2xl font-semibold tracking-tight text-earth-900">
          Create an online memorial in minutes
        </h2>
        <p className="mt-3 max-w-2xl text-earth-700">
          Simple, modern, and designed to help you celebrate a life story with dignity.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">Create</p>
              <CardTitle className="mt-2">A beautiful memorial page</CardTitle>
              <CardDescription>
                Start with the essentials — name, story, and photos — and expand over time.
              </CardDescription>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">Add</p>
              <CardTitle className="mt-2">Memories and prayers</CardTitle>
              <CardDescription>
                Invite others to contribute. You stay in control with moderation and privacy settings.
              </CardDescription>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">Share</p>
              <CardTitle className="mt-2">A lasting legacy</CardTitle>
              <CardDescription>
                Share a single link that’s easy for family and friends to access — anywhere.
              </CardDescription>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="border-y border-earth-200/70 bg-white/70">
        <div className="mx-auto max-w-content px-6 py-14 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-earth-900">Loved by families</h2>
          <p className="mt-3 max-w-2xl text-earth-700">
            A simple experience that helps people focus on what matters most.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "A beautifully presented tribute page. Easy to share and update as family memories come in.",
                name: "Marissa G",
              },
              {
                quote:
                  "Very easy to create a memorial page. Thank you for providing a place to remember.",
                name: "Menard P",
              },
              {
                quote:
                  "Wonderful to share our memories with others. It reached many people and will last.",
                name: "Lisa D",
              },
            ].map((t) => (
              <Card key={t.name} className="bg-white">
                <CardBody>
                  <p className="text-sm leading-relaxed text-earth-800">“{t.quote}”</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-earth-500">{t.name}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">For business</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-earth-900">
              Funeral homes and ministries
            </h2>
            <p className="mt-4 text-earth-700">
              We’re building tailored flows for organisations that serve families every day — from service details to
              legacy preservation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/resources" variant="outline">
                Learn more
              </ButtonLink>
              <ButtonLink href="/directory" variant="primary">
                View memorials
              </ButtonLink>
            </div>
          </div>
          <Card className="bg-earth-50/60">
            <CardBody>
              <CardTitle>What you can do today</CardTitle>
              <CardDescription>
                Create memorial pages, share photos, and collect guestbook messages and prayers with moderation.
              </CardDescription>
              <ul className="mt-5 space-y-2 text-sm text-earth-700">
                <li>• Public directory or unlisted memorials</li>
                <li>• Keeper dashboard for edits, photos, and moderation</li>
                <li>• Shareable pages with clean typography</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </section>
    </main>
  );
}
