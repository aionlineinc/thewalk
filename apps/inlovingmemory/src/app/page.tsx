import Image from "next/image";
import { getIlmSession } from "@/lib/auth";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IlmJourneyCards } from "@/components/ilm-journey-cards";
import { IlmTestimonialsCarousel } from "@/components/ilm-testimonials-carousel";
import { AppPillLink } from "@/components/ui/AppPillLink";
import { AppHeadingDisplay, AppLeadOnDark } from "@/components/ui/Typography";

export default async function IlmHomePage() {
  const session = await getIlmSession();
  const content = await getIlmMarketingContent();

  return (
    <main>
      <section
        id="ilm-hero"
        className="relative flex h-[90vh] min-h-[620px] flex-col items-center justify-center p-2 font-sans tracking-tight md:p-4"
        aria-labelledby="ilm-hero-title"
      >
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="absolute inset-0">
            <Image
              src="/ilm-hero.svg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, min(100vw, 1280px)"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/45 to-black/20" aria-hidden />
          <div className="absolute bottom-0 right-0 h-full w-full bg-calm-500/20 mix-blend-overlay" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto mt-12 flex max-w-4xl flex-col items-center px-4 text-center">
          <AppHeadingDisplay variant="home" id="ilm-hero-title" className="mb-6">
            {content.heroTitle}
          </AppHeadingDisplay>
          <AppLeadOnDark id="ilm-hero-description" className="mx-auto mb-10 max-w-2xl">
            {content.heroBody}
          </AppLeadOnDark>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AppPillLink href="/how-it-works" variant="primary">
              Get Started
              <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppPillLink>
            <AppPillLink href="/directory" variant="ghostOnDark">
              Find a memorial
            </AppPillLink>
          </div>

          <p className="mt-10 text-xs text-white/70">
            {session?.user ? "Welcome back — manage your memorials in the dashboard." : "Page keepers can sign in to manage memorials."}
          </p>
        </div>
      </section>

      <IlmJourneyCards />

      <section className="bg-white" aria-labelledby="ilm-assistance-heading">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-earth-50/80 ring-1 ring-earth-200/60">
              <Image
                src="/ilm-journey-remember.svg"
                alt="Soft horizon illustration suggesting remembrance and a life story shared online."
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, min(50vw, 640px)"
              />
            </div>
            <div>
              <h2
                id="ilm-assistance-heading"
                className="text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl lg:text-[35px] lg:leading-[1.1]"
              >
                Get assistance with your memorial page
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-neutral-500 md:text-lg md:leading-relaxed">
                Our support team offers expert guidance and personalized support to help you create a lasting digital legacy.
              </p>
              <div className="mt-10">
                <AppPillLink href="/how-it-works" variant="primary">
                  Get assistance
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </AppPillLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IlmTestimonialsCarousel />

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
              <AppPillLink href="/resources" variant="primary">
                Learn more
                <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </AppPillLink>
              <AppPillLink href="/directory" variant="ghostOnDark" className="border-earth-200 bg-white text-earth-900 hover:bg-earth-100">
                View memorials
              </AppPillLink>
            </div>
          </div>
          <Card className="bg-earth-50/60">
            <div className="px-8 py-8 md:px-10 md:py-10">
              <CardTitle>What you can do today</CardTitle>
              <CardDescription>
                Create memorial pages, share photos, and collect guestbook messages and prayers with moderation.
              </CardDescription>
              <ul className="mt-5 space-y-2 text-sm text-earth-700">
                <li>• Public directory or unlisted memorials</li>
                <li>• Keeper dashboard for edits, photos, and moderation</li>
                <li>• Shareable pages with clean typography</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
