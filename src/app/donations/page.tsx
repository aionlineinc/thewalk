import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "Support & Giving | theWalk Ministries",
  description: "Partner financially with theWalk to sustain discipleship, fellowship, and kingdom-focused ministry.",
};

export default function DonationsPage() {
  return (
    <>
      <Hero
        sectionId="donations-hero"
        titleId="donations-hero-title"
        subtextId="donations-hero-description"
        headline="Support the Work"
        subtext="Your generosity helps fund discipleship, community, and sustainable ministry impact."
      />
      <section
        id="donations-content"
        className="border-b border-gray-100 bg-muted py-16 md:py-24"
        aria-label="Giving information"
      >
        <div className="container mx-auto max-w-[650px] px-4 text-center">
          <p id="donations-body" className="text-base font-light leading-relaxed text-gray-600">
            Online giving and project-based options will be connected here as they are finalized. For now, reach out and we will guide your next step.
          </p>
          <Link
            id="donations-contact-cta"
            href="/contact"
            data-button-link
            className="mt-10 inline-flex rounded-full bg-red-soft px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact us about giving
          </Link>
        </div>
      </section>
    </>
  );
}
