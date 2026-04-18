import type { Metadata } from "next";

import { CrossConnectFallback } from "./_components/CrossConnectFallback";
import { GetInvolvedStoriesCarousel } from "@/components/get-involved/GetInvolvedStoriesCarousel";
import { PathwayPageRenderer } from "@/components/journey/cms/PathwayPageRenderer";
import { getPage } from "@/lib/cms";

const SLUG = "journey/cross-connect";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return {
    title: page?.seo_title ?? "Cross Connect | theWalk Ministries",
    description:
      page?.seo_description ??
      "Build enduring community, fellowship, and expand into Kingdom impact.",
  };
}

export default async function CrossConnectPage() {
  const page = await getPage(SLUG);
  return (
    <>
      <PathwayPageRenderer
        page={page}
        slug="cross-connect"
        fallback={<CrossConnectFallback />}
      />
      <GetInvolvedStoriesCarousel />
    </>
  );
}
