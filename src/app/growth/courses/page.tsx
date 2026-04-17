import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BlogHeroCollage } from "@/components/growth/BlogHeroCollage";
import { GROWTH_COURSES } from "@/lib/growth-content";

export const metadata: Metadata = {
  title: "Courses | Growth | theWalk Ministries",
  description: "Structured courses for formation — sign up and walk with others in learning.",
};

export default function GrowthCoursesPage() {
  return (
    <>
      <section
        className="border-b border-gray-100 bg-white pb-12 pt-28 md:pb-16 md:pt-36"
        aria-labelledby="growth-courses-hero-title"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
            <BlogHeroCollage />
            <div className="text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</p>
              <h1 id="growth-courses-hero-title" className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                Courses
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-600 md:mx-0">
                Guided learning with clear outcomes — join a cohort, ask questions, and apply truth in community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24" aria-labelledby="growth-courses-grid-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 id="growth-courses-grid-heading" className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
              Open courses
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-gray-500 md:text-lg md:leading-relaxed">
              Choose a track that fits your season. Registration links to our team so we can place you well.
            </p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-2">
            {GROWTH_COURSES.map((course) => (
              <li key={course.slug}>
                <div className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/[0.06] shadow-sm md:p-5">
                  <div className="relative aspect-[4/3] w-full isolate overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={course.image}
                      alt={course.imageAlt}
                      fill
                      className="rounded-2xl object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-700">
                        {course.duration}
                      </span>
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-700">
                        {course.format}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-medium tracking-tight text-gray-900">{course.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] font-light leading-relaxed text-gray-500">{course.description}</p>
                    <div className="mt-8">
                      <Link
                        href={`/contact?type=course&course=${encodeURIComponent(course.slug)}`}
                        data-button-link
                        className="inline-flex w-full items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 sm:w-auto"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
