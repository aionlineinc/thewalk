import type { Metadata } from "next";

import { JourneyImmersiveScroller } from "@/components/journey/JourneyImmersiveScroller";
import { JourneyScrollerSection } from "@/components/journey/cms/JourneyScrollerSection";
import { getPage } from "@/lib/cms";
import { findSection } from "@/lib/cms/schemas";

const SLUG = "journey";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return {
    title: page?.seo_title ?? "The Journey | theWalk Ministries",
    description:
      page?.seo_description ??
      "Cross Over, Cross Roads, and Cross Connect — pathways for restoration, growth, and kingdom impact.",
  };
}

export default async function JourneyPage() {
  const page = await getPage(SLUG);
  const scroller = findSection(page?.sections, "section_journey_scroller");
  if (!scroller || scroller.slides.length === 0) {
    // Fallback: render the existing scroller with its hardcoded default
    // slides so the page is never empty when Directus is unreachable or
    // the page hasn't been seeded yet.
    return <JourneyImmersiveScroller />;
  }
  return <JourneyScrollerSection section={scroller} />;
}
