import Image from "next/image";
import Link from "next/link";

/**
 * About hero: full-bleed card width matching home hero gutters (px-2/md:px-4); 600px tall; copy left, graphic right.
 */
export function AboutPremiumHero() {
  return (
    <section className="relative w-full px-2 pb-8 pt-1 font-sans tracking-tight md:px-4 md:pb-12 md:pt-2">
      {/* Same horizontal inset as home hero (`p-2 md:p-4`); full width, no max-w cap */}
      <div className="relative w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-[#081a2d] via-[#0b2a46] to-[#04080f] shadow-xl">
        <div className="relative h-[600px] min-h-[600px]">
          <div
            className="absolute bottom-0 right-0 top-[75px] z-[1] w-[36%] min-w-[10rem] bg-transparent sm:w-[38%] md:w-[42%] lg:w-[44%] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)]"
          >
            <Image
              src="/assets/617fac9d-80f5-40be-b010-93207da51565-2026-03-29.png"
              alt="Servant leadership structure: pathways from Christ through vision, mission, and public ministry"
              fill
              priority
              sizes="(max-width: 768px) 42vw, 38vw"
              className="origin-right scale-[0.88] object-contain object-right object-center bg-transparent p-4 md:p-6"
            />
          </div>

          <div className="relative z-[2] flex h-full min-h-[600px] flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
            <div className="relative z-[3] w-full max-w-[min(36rem,calc(100%-max(10.5rem,38%)))] sm:max-w-[min(38rem,calc(100%-max(11rem,40%)))] md:max-w-[min(40rem,calc(100%-max(12rem,44%)))] lg:max-w-[min(42rem,calc(100%-max(13rem,46%)))]">
              <h1 className="mb-6 text-4xl font-normal leading-[1.1] tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-[70px]">
                About theWalk
              </h1>
              <p className="mb-8 max-w-xl text-lg font-light leading-relaxed text-white/90">
                A ministry committed to spiritual growth, discipleship, fellowship, and transformation—meeting you where
                you are and walking with you toward Christ-centered purpose.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  href="/journey"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-soft px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-black/25 transition-all hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore the Journey
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/get-involved"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-8 py-3.5 text-lg font-medium text-white transition-all hover:bg-white/10"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
