import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CrossOverMinistryTabs } from "./_components/CrossOverMinistryTabs";
import { GetInvolvedStoriesCarousel } from "@/components/get-involved/GetInvolvedStoriesCarousel";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop";

export const metadata: Metadata = {
  title: "Cross Over | theWalk Ministries",
  description: "Enter a place of restoration, support, and profound transformation.",
};

export default function CrossOverPage() {
  return (
    <>
      <section
        id="cross-over-hero"
        className="border-b border-neutral-100 bg-white"
        aria-labelledby="cross-over-hero-title"
      >
        <div className="mx-auto w-full p-4">
          <div className="relative w-full overflow-hidden rounded-[20px] ring-1 ring-black/[0.06]">
            <div className="relative min-h-[520px] md:min-h-[600px]">
              <Image
                src={HERO_IMAGE}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-neutral-950/55" aria-hidden />
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_20%_25%,rgba(255,255,255,0.14),transparent_55%)]"
                aria-hidden
              />
            </div>

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-6xl px-4 pb-6 md:px-8 md:pb-10">
                <div className="max-w-2xl rounded-[18px] border border-white/15 bg-black/35 p-6 backdrop-blur-md md:p-8">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Pathway
                  </p>
                  <h1
                    id="cross-over-hero-title"
                    className="font-sans text-4xl font-normal leading-[1.04] tracking-tight text-white md:text-6xl"
                  >
                    Cross Over
                  </h1>
                  <p className="mt-4 text-base font-light leading-relaxed text-white/85 md:text-lg">
                    Enter a place of restoration, support, and profound transformation.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {["Rugged", "Covered", "Exodus"].map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/get-involved"
                      data-button-link
                      className="inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                    >
                      Get involved
                    </Link>
                    <Link
                      href="/journey"
                      className="text-sm font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                    >
                      ← Back to Journey
                    </Link>
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-sm font-light leading-relaxed text-white/70 md:text-base">
                  Cross Over helps us discover our place and purpose in God, the Church, and within our wider
                  communities—supporting believers as new experiences shape the next step of the walk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cross-over-about"
        className="border-b border-earth-100 bg-white py-16 md:py-24"
        aria-labelledby="cross-over-about-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-500">About</p>
              <h2
                id="cross-over-about-heading"
                className="mt-4 font-sans text-4xl font-semibold tracking-tight text-earth-900 md:text-5xl"
              >
                Cross Over for all.
              </h2>
              <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-muted-foreground md:text-lg">
                Crossover, a core ministry of theWalk, focuses on supporting believers through new experiences as they
                progress in their journey with God.
              </p>
            </div>

            <div className="min-w-0">
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-earth-900 md:text-lg">
                    For new experiences
                  </h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                    Crossover helps us to discover our place and purpose in God, the Church and within our wider
                    communities.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-earth-900 md:text-lg">
                    For purpose and belonging
                  </h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                    This ministry exists on the fringes of the faith, helping persons to enter and remain on the path
                    toward deeper fellowship with Christ.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-earth-900 md:text-lg">
                    For deeper fellowship
                  </h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                    Through Rugged, Covered, and Exodus, we meet people in hardship and hope—then walk with them toward
                    lasting freedom.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contact?type=journey&pathway=Cross%20Over"
                    data-button-link
                    className="inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                  >
                    Talk to our team
                  </Link>
                  <Link
                    href="/get-involved"
                    className="inline-flex w-fit items-center justify-center rounded-full border border-earth-200 bg-white px-6 py-3 text-sm font-medium text-earth-900 shadow-sm transition-colors hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                  >
                    Get involved
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <CrossOverMinistryTabs />
      </Suspense>

      <GetInvolvedStoriesCarousel />
    </>
  );
}

