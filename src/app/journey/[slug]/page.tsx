import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/ui/Hero";

const PATHWAYS: Record<
  string,
  {
    title: string;
    subtext: string;
    body: string;
  }
> = {
  "cross-over": {
    title: "Cross Over",
    subtext: "Enter a place of restoration, support, and profound transformation.",
    body:
      "Cross Over is where healing and new beginnings take shape — through ministries like Rugged, Covered, and Exodus, designed to meet people in hardship and hope.",
  },
  "cross-roads": {
    title: "Cross Roads",
    subtext: "Grow deeply in your identity, absolute truth, and spiritual direction.",
    body:
      "Cross Roads deepens discipleship through Bible study, teaching series, and MyWalk — so faith is grounded in Scripture and lived with clarity.",
  },
  "cross-connect": {
    title: "Cross Connect",
    subtext: "Build enduring community, fellowship, and expand into Kingdom impact.",
    body:
      "Cross Connect gathers the Body through small groups, prayer, and ministry development — strengthening believers to serve and multiply impact together.",
  },
};

export function generateStaticParams() {
  return Object.keys(PATHWAYS).map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const p = PATHWAYS[params.slug];
  if (!p) return {};
  return {
    title: `${p.title} | theWalk Ministries`,
    description: p.subtext,
  };
}

export default function JourneyPathPage({ params }: Props) {
  const p = PATHWAYS[params.slug];
  if (!p) {
    notFound();
  }

  return (
    <>
      <Hero headline={p.title} subtext={p.subtext} />
      <section className="border-b border-gray-100 bg-muted py-16 md:py-24">
        <div className="container mx-auto max-w-[650px] px-4">
          <p className="text-center text-base font-light leading-relaxed text-gray-600">{p.body}</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/journey"
              className="text-sm font-medium text-gray-600 underline-offset-4 transition-colors hover:text-[#fb5e32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb5e32]"
            >
              ← All pathways
            </Link>
            <Link
              href="/get-involved"
              className="rounded-full bg-[#fb5e32] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-[#fb5e32]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb5e32]"
            >
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
