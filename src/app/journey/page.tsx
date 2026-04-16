import type { Metadata } from "next";
import { JourneyImmersiveScroller } from "@/components/journey/JourneyImmersiveScroller";

export const metadata: Metadata = {
  title: "The Journey | theWalk Ministries",
  description:
    "Cross Over, Cross Roads, and Cross Connect — pathways for restoration, growth, and kingdom impact.",
};

export default function JourneyPage() {
  return (
    <>
      <JourneyImmersiveScroller />
    </>
  );
}
