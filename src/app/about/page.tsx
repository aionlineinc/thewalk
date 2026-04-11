import { AboutPremiumHero } from "@/components/sections/AboutPremiumHero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { AppPillLink } from "@/components/ui/AppPillLink";
import {
  AppBody,
  AppHeadingCard,
  AppHeadingEarthSection,
} from "@/components/ui/Typography";
import Image from "next/image";

export default function About() {
  return (
    <>
      <AboutPremiumHero />

      <EditorialSplitBlock
        sectionId="about-who-we-are"
        headingId="about-who-we-are-heading"
        bodyId="about-who-we-are-body"
        headline="Who We Are"
        body="TheWalk Ministries is a Christian organisation dedicated to enriching the spiritual journeys of believers in Christ Jesus. By focusing on individual development, the ministry seeks to promote lasting positive impact that resonates throughout communities and beyond."
      />

      <section id="about-vision-mission" className="bg-muted py-24">
        <div className="container mx-auto grid max-w-content-wide grid-cols-1 gap-12 px-4 md:grid-cols-2">
          <div
            id="about-vision"
            className="rounded-2xl border border-earth-100 bg-white p-12 shadow-sm"
          >
            <AppHeadingCard id="about-vision-heading" className="mb-4">
              Our Vision
            </AppHeadingCard>
            <AppBody id="about-vision-body">
              A strengthened and cohesive Body of Christ interconnected across families,
              congregations, denominations, nations and cultures.
            </AppBody>
          </div>
          <div
            id="about-mission"
            className="rounded-2xl border border-earth-100 bg-white p-12 shadow-sm"
          >
            <AppHeadingCard id="about-mission-heading" className="mb-4">
              Our Mission
            </AppHeadingCard>
            <AppBody id="about-mission-body">
              Create a kingdom-focused culture through discipleship and fellowship, which
              facilitates the manifestation of God’s purposes in all spheres.
            </AppBody>
          </div>
        </div>
      </section>

      <EditorialSplitBlock
        sectionId="about-ministry-journey"
        headingId="about-ministry-journey-heading"
        bodyId="about-ministry-journey-body"
        headline="A Ministry Built as a Journey"
        reversed
        body="theWalk is organized around three connected ministry pathways that guide believers through stages of restoration, identity, discipleship, community, and impact: Cross Over, Cross Roads, and Cross Connect."
      />

      <section
        id="about-leadership-structure"
        className="bg-background pb-20 pt-20"
        aria-labelledby="about-leadership-structure-heading"
      >
        <div className="container mx-auto max-w-content-wide px-4">
          <div className="mb-16 text-center">
            <AppHeadingEarthSection
              id="about-leadership-structure-heading"
              className="mb-6"
            >
              Servant Leadership Structure
            </AppHeadingEarthSection>
            <AppBody
              id="about-leadership-structure-body"
              className="mx-auto max-w-[600px]"
            >
              Groups / Layers serve the area(s) directly above them. Groups support those who depend
              upon them, authority flows up.
            </AppBody>
          </div>
        </div>
        <div
          id="about-leadership-structure-diagram"
          className="w-full border border-earth-100 bg-muted"
        >
          <div className="relative h-[650px] w-full overflow-hidden">
            <Image
              src="/assets/servant-leadership-structure.png"
              alt="Servant Leadership Structure"
              fill
              className="object-contain px-8 py-20"
              style={{ top: -1, left: 1, right: 0, bottom: 0 }}
              unoptimized
            />
          </div>
          <div className="mx-auto flex max-w-content-wide justify-center px-4 pb-10 pt-2">
            <AppPillLink href="/about/ministry-structure" variant="outlineEarth">
              Learn more
            </AppPillLink>
          </div>
        </div>
      </section>
    </>
  );
}
