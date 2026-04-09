import Image from "next/image";
import Link from "next/link";
import { JourneyTransformationSection } from "@/components/sections/JourneyTransformationSection";
import { MinistryGroupsSection } from "@/components/sections/MinistryGroupsSection";
import { WalkWithUsSection } from "@/components/sections/WalkWithUsSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[600px] p-2 md:p-4 flex flex-col justify-center items-center font-sans tracking-tight">
        <div className="absolute inset-2 md:inset-4 rounded-[20px] overflow-hidden">
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

        <div className="relative z-10 text-center flex flex-col items-center mt-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-[70px] font-normal leading-[1.1] tracking-tight text-white mb-6 drop-shadow-md">
            Walk in Faith.<br />Grow in Purpose.
          </h1>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            A Christ-centered journey of transformation, discipleship, and community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/journey" className="bg-red-soft hover:bg-red-soft-hover text-white rounded-full px-8 py-3.5 text-lg font-medium transition-all shadow-lg shadow-black/25 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Explore the Journey
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/get-involved" className="bg-transparent border border-white/30 hover:bg-white/10 text-white rounded-full px-8 py-3.5 text-lg font-medium transition-all flex items-center justify-center">
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* What is theWalk */}
      <section className="w-full bg-white pt-24 md:pt-[100px] pb-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6">What is theWalk?</h2>
          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-[650px] mx-auto">
            TheWalk Ministries is a Christian organisation dedicated to enriching the spiritual journeys of believers in Christ Jesus. Through discipleship, fellowship, and intentional development, the ministry seeks to create lasting impact in individuals, communities, and the wider Body of Christ.
          </p>
        </div>
      </section>

      {/* Vision & Mission (Minimalist) */}
      <section className="w-full bg-gray-50 pb-24 md:pb-32 border-b border-gray-100 pt-20">
        <div className="mx-auto w-3/4 max-w-full px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="mb-4 font-medium text-2xl tracking-tight text-gray-900">Vision</h3>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed max-w-md">
                A strengthened and cohesive Body of Christ interconnected across families, congregations, denominations, nations and cultures.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="mb-4 font-medium text-2xl tracking-tight text-gray-900">Mission</h3>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed max-w-md">
                Create a kingdom-focused culture through discipleship and fellowship, which facilitates the manifestation of God’s purposes in all spheres.
              </p>
            </div>

          </div>
        </div>
      </section>

      <JourneyTransformationSection />

      <MinistryGroupsSection />

      <WalkWithUsSection />

      {/* Final CTA */}
      <section className="py-24 md:py-32 border-t border-gray-100 text-center bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-medium text-gray-900 mb-6 tracking-tight">Start Your Journey Today</h2>
          <p className="text-xl md:text-2xl text-gray-500 font-light mb-10">Take the next step into growth, healing, truth, and connection.</p>
          <div className="flex justify-center">
            <Link href="/journey" className="bg-red-soft text-white hover:bg-red-soft-hover rounded-full px-10 py-4 text-lg font-medium shadow-lg shadow-black/20 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900">
              Explore the Journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
