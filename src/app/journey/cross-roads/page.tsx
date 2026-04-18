import type { Metadata } from "next";

import { CrossRoadsFallback } from "./_components/CrossRoadsFallback";
import { GetInvolvedStoriesCarousel } from "@/components/get-involved/GetInvolvedStoriesCarousel";
import { PathwayPageRenderer } from "@/components/journey/cms/PathwayPageRenderer";
import { getPage } from "@/lib/cms";

const SLUG = "journey/cross-roads";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return {
    title: page?.seo_title ?? "Cross Roads | theWalk Ministries",
    description:
      page?.seo_description ??
      "Grow deeply in your identity, absolute truth, and spiritual direction.",
  };
}

export default async function CrossRoadsPage() {
  const page = await getPage(SLUG);
  return (
    <>
      <PathwayPageRenderer
        page={page}
        slug="cross-roads"
        fallback={<CrossRoadsFallback />}
      />
      <GetInvolvedStoriesCarousel />
    </>
  );
}
