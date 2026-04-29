import type { Metadata } from "next";

import { GrowthImmersiveScroller } from "@/components/growth/GrowthImmersiveScroller";

export const metadata: Metadata = {
  title: "Growth | theWalk Ministries",
  description: "Articles, courses, resources, and services for spiritual formation with theWalk.",
};

export default function GrowthHubPage() {
  return <GrowthImmersiveScroller />;
}
