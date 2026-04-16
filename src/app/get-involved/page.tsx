import type { Metadata } from "next";
import { GetInvolvedDriftingStatements } from "@/components/get-involved/GetInvolvedDriftingStatements";
import { GetInvolvedImmersiveHero } from "@/components/get-involved/GetInvolvedImmersiveHero";
import { GetInvolvedPathwaysInteractive } from "@/components/get-involved/GetInvolvedPathwaysInteractive";
import { GetInvolvedStoriesCarousel } from "@/components/get-involved/GetInvolvedStoriesCarousel";
import { GetInvolvedTransitionStrip } from "@/components/get-involved/GetInvolvedTransitionStrip";
import { GetInvolvedFinalCta, GetInvolvedTurningPoint } from "@/components/get-involved/GetInvolvedSections";

export const metadata: Metadata = {
  title: "Get Involved | theWalk Ministries",
  description:
    "Find your place in the walk—serve, support, partner, and step into purpose with theWalk Ministries.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <GetInvolvedImmersiveHero />
      <GetInvolvedDriftingStatements />
      <GetInvolvedTransitionStrip />
      <GetInvolvedTurningPoint />
      <GetInvolvedStoriesCarousel />
      <GetInvolvedPathwaysInteractive />
      <GetInvolvedFinalCta />
    </>
  );
}
