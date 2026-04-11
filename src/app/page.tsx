import Image from "next/image";
import { CurrentSeriesSection } from "@/components/sections/CurrentSeriesSection";
import { JourneyTransformationSection } from "@/components/sections/JourneyTransformationSection";
import { MinistryGroupsSection } from "@/components/sections/MinistryGroupsSection";
import { WalkWithUsSection } from "@/components/sections/WalkWithUsSection";
import { AppPillLink } from "@/components/ui/AppPillLink";
import {
  AppHeadingDisplay,
  AppHeadingPromo,
  AppHeadingSection,
  AppLead,
  AppLeadOnDark,
} from "@/components/ui/Typography";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        id="home-hero"
        className="relative flex h-[95vh] min-h-[600px] flex-col items-center justify-center p-2 font-sans tracking-tight md:p-4"
        aria-labelledby="home-hero-title"
      >
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="absolute inset-0">
            <Image
              src="/assets/hero/hero-bokeh-forest.png"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, min(100vw, 1280px)"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/45 to-black/20" />
          <div className="absolute bottom-0 right-0 h-full w-full bg-red-soft/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto mt-12 flex max-w-4xl flex-col items-center px-4 text-center">
          <AppHeadingDisplay variant="home" id="home-hero-title" className="mb-6">
            Walk in Faith.
            <br />
            Grow in Purpose.
          </AppHeadingDisplay>
          <AppLeadOnDark id="home-hero-description" className="mx-auto mb-10 max-w-2xl">
            A Christ-centered journey of transformation, discipleship, and community.
          </AppLeadOnDark>

          <div
            id="home-hero-actions"
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <AppPillLink href="/journey" variant="primary">
              Explore the Journey
              <svg
                className="ml-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </AppPillLink>
            <AppPillLink href="/get-involved" variant="ghostOnDark">
              Get Involved
            </AppPillLink>
          </div>
        </div>
      </section>

      {/* What is theWalk */}
      <section
        id="home-about-teaser"
        className="w-full bg-white pb-20 pt-24 text-center md:pt-[100px]"
        aria-labelledby="home-about-teaser-heading"
      >
        <div className="container mx-auto max-w-4xl px-4">
          <AppHeadingSection id="home-about-teaser-heading" className="mb-6">
            What is theWalk?
          </AppHeadingSection>
          <AppLead id="home-about-teaser-body" className="mx-auto max-w-[650px]">
            TheWalk Ministries is a Christian organisation dedicated to enriching the spiritual
            journeys of believers in Christ Jesus. Through discipleship, fellowship, and intentional
            development, the ministry seeks to create lasting impact in individuals, communities,
            and the wider Body of Christ.
          </AppLead>
        </div>
      </section>

      <JourneyTransformationSection />

      <MinistryGroupsSection />

      <CurrentSeriesSection />

      <WalkWithUsSection />

      {/* Final CTA */}
      <section
        id="home-final-cta"
        className="border-t border-gray-100 bg-gray-50 py-24 text-center md:py-32"
        aria-labelledby="home-final-cta-heading"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <AppHeadingPromo id="home-final-cta-heading" className="mb-6">
            Start Your Journey Today
          </AppHeadingPromo>
          <p
            id="home-final-cta-body"
            className="mb-10 text-xl font-light text-gray-500 md:text-2xl"
          >
            Take the next step into growth, healing, truth, and connection.
          </p>
          <div id="home-final-cta-actions" className="flex justify-center">
            <AppPillLink href="/journey" variant="primaryLarge">
              Explore the Journey
            </AppPillLink>
          </div>
        </div>
      </section>
    </>
  );
}
