import Image from "next/image";
import { AppPillLink } from "@/components/ui/AppPillLink";
import { AppHeadingDisplay, AppLeadOnDark } from "@/components/ui/Typography";

/**
 * About hero: full-bleed card width matching home hero gutters (px-2/md:px-4); 600px tall; copy left, graphic right.
 */
export function AboutPremiumHero() {
  return (
    <section
      id="about-hero"
      className="relative w-full px-2 pb-8 pt-1 font-sans tracking-tight md:px-4 md:pb-12 md:pt-2"
      aria-labelledby="about-hero-title"
    >
      {/* Same horizontal inset as home hero (`p-2 md:p-4`); full width, no max-w cap */}
      <div className="relative flex w-full flex-wrap overflow-hidden rounded-[20px] bg-gradient-to-br from-[#081a2d] via-[#0b2a46] to-[#04080f] shadow-xl">
        <div className="relative mx-auto h-[600px] min-h-[600px] w-[1017px] max-w-full text-center">
          <div
            className="absolute bottom-0 right-0 top-[75px] z-[1] w-[36%] min-w-[10rem] bg-transparent sm:w-[38%] md:w-[42%] lg:w-[44%] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)]"
          >
            <Image
              src="/assets/617fac9d-80f5-40be-b010-93207da51565-2026-03-29.png"
              alt="Servant leadership structure: pathways from Christ through vision, mission, and public ministry"
              fill
              priority
              sizes="(max-width: 768px) 42vw, 38vw"
              className="origin-right scale-[0.88] bg-transparent object-contain object-center object-right p-4 md:p-6"
            />
          </div>

          <div className="relative z-[2] flex h-full min-h-[600px] flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
            <div className="relative z-[3] w-full max-w-[min(36rem,calc(100%-max(10.5rem,38%)))] sm:max-w-[min(38rem,calc(100%-max(11rem,40%)))] md:max-w-[min(40rem,calc(100%-max(12rem,44%)))] lg:max-w-[min(42rem,calc(100%-max(13rem,46%)))]">
              <AppHeadingDisplay variant="about" id="about-hero-title" className="mb-6 text-left">
                About theWalk
              </AppHeadingDisplay>
              <AppLeadOnDark
                id="about-hero-description"
                className="mb-8 max-w-xl text-left"
              >
                A ministry committed to spiritual growth, discipleship, fellowship, and
                transformation—meeting you where you are and walking with you toward Christ-centered
                purpose.
              </AppLeadOnDark>
              <div id="about-hero-actions" className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <AppPillLink href="/journey" variant="primary">
                  Explore the Journey
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </AppPillLink>
                <AppPillLink href="/get-involved" variant="ghostOnDark">
                  Get Involved
                </AppPillLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
