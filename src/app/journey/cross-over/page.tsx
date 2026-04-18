import type { Metadata } from "next";

import { CrossOverFallback } from "./_components/CrossOverFallback";
import { GetInvolvedStoriesCarousel } from "@/components/get-involved/GetInvolvedStoriesCarousel";
import { PathwayPageRenderer } from "@/components/journey/cms/PathwayPageRenderer";
import { getPage } from "@/lib/cms";

const SLUG = "journey/cross-over";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return {
    title: page?.seo_title ?? "Cross Over | theWalk Ministries",
    description:
      page?.seo_description ??
      "Enter a place of restoration, support, and profound transformation.",
  };
}

export default async function CrossOverPage() {
  const page = await getPage(SLUG);
  return (
    <>
      <PathwayPageRenderer
        page={page}
        slug="cross-over"
        fallback={<CrossOverFallback />}
      />
      <GetInvolvedStoriesCarousel />
    </>
  );
}
