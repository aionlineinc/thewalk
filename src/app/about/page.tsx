import { AboutPremiumHero } from "@/components/sections/AboutPremiumHero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import Image from "next/image";

export default function About() {
  return (
    <>
      <AboutPremiumHero />

      <EditorialSplitBlock 
        headline="Who We Are" 
        body="TheWalk Ministries is a Christian organisation dedicated to enriching the spiritual journeys of believers in Christ Jesus. By focusing on individual development, the ministry seeks to promote lasting positive impact that resonates throughout communities and beyond." 
      />

      <section className="py-24 bg-muted">
        <div className="container mx-auto max-w-[800px] px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-2xl p-12 bg-white border border-earth-100 shadow-sm">
            <h3 className="text-2xl font-medium text-earth-900 mb-4">Our Vision</h3>
            <p className="text-[15px] font-light text-muted-foreground leading-relaxed">
              A strengthened and cohesive Body of Christ interconnected across families, congregations, denominations, nations and cultures.
            </p>
          </div>
          <div className="rounded-2xl p-12 bg-white border border-earth-100 shadow-sm">
            <h3 className="text-2xl font-medium text-earth-900 mb-4">Our Mission</h3>
            <p className="text-[15px] font-light text-muted-foreground leading-relaxed">
              Create a kingdom-focused culture through discipleship and fellowship, which facilitates the manifestation of God’s purposes in all spheres.
            </p>
          </div>
        </div>
      </section>

      <EditorialSplitBlock 
        headline="A Ministry Built as a Journey" 
        reversed
        body="theWalk is organized around three connected ministry pathways that guide believers through stages of restoration, identity, discipleship, community, and impact: Cross Over, Cross Roads, and Cross Connect." 
      />

      <section className="bg-background pt-20 h-[950px]">
        <div className="container mx-auto px-4 max-w-[1049px]">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-earth-900 mb-6">
              Servant Leadership Structure
            </h2>
            <p className="text-[15px] font-light text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
              Groups / Layers serve the area(s) directly above them. Groups support those who depend upon them, authority flows up.
            </p>
          </div>
        </div>
        <div className="w-full border border-earth-100 bg-muted">
          <div className="relative w-full h-[650px] overflow-hidden">
            <Image
              src="https://thewalk.org/wp-content/uploads/2020/06/leadership-structure.png"
              alt="Servant Leadership Structure"
              fill
              className="object-contain px-8 py-20"
              style={{ top: -1, left: 1, right: 0, bottom: 0 }}
              unoptimized
            />
          </div>
        </div>
      </section>
    </>
  );
}
