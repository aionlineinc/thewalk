import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "The Journey | theWalk Ministries",
  description:
    "Cross Over, Cross Roads, and Cross Connect — pathways for restoration, growth, and kingdom impact.",
};

const pathways = [
  {
    slug: "cross-over",
    title: "Cross Over",
    blurb: "Restoration, support, and transformation as you begin.",
  },
  {
    slug: "cross-roads",
    title: "Cross Roads",
    blurb: "Identity, truth, and spiritual direction in discipleship.",
  },
  {
    slug: "cross-connect",
    title: "Cross Connect",
    blurb: "Community, fellowship, and expanding kingdom impact.",
  },
] as const;

export default function JourneyPage() {
  return (
    <>
      <Hero
        headline="The Journey"
        subtext="Three connected pathways meet you where you are and equip you for what is next."
      />
      <section className="border-b border-gray-100 bg-muted py-16 md:py-24">
        <div className="container mx-auto max-w-[850px] px-4">
          <ul className="grid list-none gap-6 p-0 m-0 md:grid-cols-3">
            {pathways.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/journey/${p.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-earth-100 bg-white p-8 shadow-sm transition-colors hover:border-red-soft/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                >
                  <h2 className="text-xl font-medium tracking-tight text-gray-900">{p.title}</h2>
                  <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-gray-500">{p.blurb}</p>
                  <span className="mt-6 text-sm font-medium text-red-500 group-hover:text-red-900">Learn more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
