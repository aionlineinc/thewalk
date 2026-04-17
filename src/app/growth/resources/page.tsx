import type { Metadata } from "next";
import { GrowthResourcesClient } from "@/components/growth/GrowthResourcesClient";

export const metadata: Metadata = {
  title: "Resources | Growth | theWalk Ministries",
  description:
    "Downloads, policies, templates, and links — organized by topic with search. Services connect to practical help from theWalk.",
};

export default function GrowthResourcesPage() {
  return <GrowthResourcesClient />;
}
