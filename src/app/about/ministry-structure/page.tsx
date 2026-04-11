import type { Metadata } from "next";
import { MinistryStructureArticle } from "./MinistryStructureArticle";

export const metadata: Metadata = {
  title: "Ministry Structure | theWalk Ministries",
  description:
    "How theWalk organizes servant leadership, discipleship, and governance—from Christ as foundation through mission, vision, and core teams.",
};

export default function MinistryStructurePage() {
  return <MinistryStructureArticle />;
}
