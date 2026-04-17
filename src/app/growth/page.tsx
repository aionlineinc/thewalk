import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth | theWalk Ministries",
  description: "Articles, courses, resources, and services for spiritual formation with theWalk.",
};

const LINKS = [
  {
    href: "/growth/articles",
    title: "Articles",
    description: "Teaching, studies, and series — filter by topic and read at your pace.",
  },
  {
    href: "/growth/courses",
    title: "Courses",
    description: "Structured learning in cohorts — sign up and grow with others.",
  },
  {
    href: "/growth/resources",
    title: "Resources",
    description: "Downloads, templates, and links — search and browse by category.",
  },
  {
    href: "/growth/services",
    title: "Services",
    description: "Pastoral care, training, and placement — how theWalk comes alongside you.",
  },
] as const;

export default function GrowthHubPage() {
  return (
    <section className="border-b border-gray-100 bg-white pb-24 pt-28 md:pb-32 md:pt-40" aria-labelledby="growth-hub-title">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Cross Roads</p>
          <h1 id="growth-hub-title" className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Growth
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
            Deepen identity, truth, and direction — content and courses designed for real life in Christ.
          </p>
        </div>
        <ul className="mt-16 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                data-button-link
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50/80 p-8 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
              >
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-red-900">
                  {item.title}
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">{item.description}</p>
                <span className="mt-6 text-sm font-medium text-red-900">Open</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
