"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavMenu = "about" | "journey" | "teachings" | "shop";

export function Header() {
  const [activeMenu, setActiveMenu] = useState<NavMenu | null>(null);

  const navLinkClass = (key: NavMenu) =>
    `text-sm font-medium tracking-wide transition-colors ${
      activeMenu === key ? "text-white" : "text-white/80 hover:text-white"
    }`;

  return (
    <header className="fixed top-[35px] inset-x-0 z-50 flex w-full flex-col items-center px-4 md:px-8">
      <div className="relative w-full max-w-6xl">
        <div className="relative z-20 flex items-center gap-3 rounded-full border border-white/10 bg-[#2a2a2a]/95 px-6 py-3 shadow-2xl backdrop-blur-md md:gap-4">
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <Link
              href="/"
              className="relative flex min-h-8 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              aria-label="theWalk Ministries home"
            >
              <Image
                src="/assets/logo/white-logo.png"
                alt="theWalk ministries"
                width={220}
                height={72}
                className="h-7 w-auto max-w-[9.5rem] object-contain object-left md:h-8 md:max-w-[11rem]"
                priority
              />
            </Link>
          </div>

          {/* Nav + separate dropdowns — hover only on these items, not logo / CTAs */}
          <div
            className="relative hidden shrink-0 md:block"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <nav className="flex items-center gap-8" aria-label="Primary">
              <Link
                href="/about"
                className={navLinkClass("about")}
                onMouseEnter={() => setActiveMenu("about")}
              >
                About
              </Link>
              <button
                type="button"
                className={`flex cursor-default items-center border-0 bg-transparent p-0 py-1 ${navLinkClass("journey")}`}
                aria-expanded={activeMenu === "journey"}
                aria-haspopup="true"
                onMouseEnter={() => setActiveMenu("journey")}
              >
                Journey
              </button>
              <Link
                href="/teachings"
                className={navLinkClass("teachings")}
                onMouseEnter={() => setActiveMenu("teachings")}
              >
                Teachings
              </Link>
              <Link
                href="/shop"
                className={navLinkClass("shop")}
                onMouseEnter={() => setActiveMenu("shop")}
              >
                Shop
              </Link>
            </nav>

            <div
              className={`absolute left-1/2 top-full z-30 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition-all duration-300 origin-top ${
                activeMenu
                  ? "visible translate-y-0 opacity-100 pointer-events-auto"
                  : "invisible -translate-y-4 opacity-0 pointer-events-none"
              }`}
            >
              {activeMenu === "journey" && (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex flex-col gap-8 px-6 py-6 md:flex-row lg:gap-12">
                    <div className="relative flex min-h-[280px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:min-h-[340px] md:w-[35%]">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <Image
                        src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                      <div className="relative z-20">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">
                          Learn more about your faith
                        </p>
                        <h3 className="text-2xl font-medium leading-tight lg:text-3xl">
                          Begin your spiritual
                          <br />
                          transformation
                          <br />
                          today
                        </h3>
                      </div>
                    </div>

                    <div className="flex-1 py-2 md:py-6">
                      <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Journey
                      </h4>
                      <div className="flex flex-col gap-6">
                        <Link href="/journey/cross-over" className="group flex items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-soft/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <span className="relative z-10 text-lg font-bold text-gray-400 transition-colors group-hover:text-red-900">
                              1
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Over
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Enter a place of restoration, support, and profound transformation.
                            </p>
                          </div>
                        </Link>
                        <Link href="/journey/cross-roads" className="group flex items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-soft/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <span className="relative z-10 text-lg font-bold text-gray-400 transition-colors group-hover:text-red-900">
                              2
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Roads
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Grow deeply in your identity, absolute truth, and spiritual direction.
                            </p>
                          </div>
                        </Link>
                        <Link href="/journey/cross-connect" className="group flex items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-soft/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <span className="relative z-10 text-lg font-bold text-gray-400 transition-colors group-hover:text-red-900">
                              3
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Connect
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Build enduring community, fellowship, and expand into Kingdom impact.
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-10 py-2 md:w-[25%] md:py-6">
                      <div>
                        <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Learn more
                        </h4>
                        <div className="flex flex-col gap-4">
                          <Link
                            href="/teachings"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Teachings &amp; Media
                          </Link>
                          <Link
                            href="/about"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Our Why
                          </Link>
                          <Link
                            href="/donations"
                            className="flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Give{" "}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                              [Impact]
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Other</h4>
                        <div className="flex flex-col gap-4">
                          <Link
                            href="/shop"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Shop Resources
                          </Link>
                          <Link
                            href="/contact"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "about" && (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex flex-col gap-8 px-6 py-6 md:flex-row md:gap-10">
                    <div className="relative flex min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:min-h-[300px] md:w-[42%]">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <Image
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <div className="relative z-20">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">
                          Who we are
                        </p>
                        <h3 className="text-2xl font-medium leading-tight">Christ-centered community for every step of the walk.</h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-8 py-2">
                      <div>
                        <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Explore</h4>
                        <div className="flex flex-col gap-4">
                          <Link
                            href="/about"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Our story &amp; mission
                          </Link>
                          <Link
                            href="/contact"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Contact
                          </Link>
                          <Link
                            href="/get-involved"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Get involved
                          </Link>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500">
                        Discover why theWalk exists and how we serve people in restoration, growth, and impact.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "teachings" && (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex flex-col gap-8 px-6 py-6 md:flex-row md:gap-10">
                    <div className="relative flex min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:min-h-[300px] md:w-[42%]">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <Image
                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <div className="relative z-20">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">
                          Feed your faith
                        </p>
                        <h3 className="text-2xl font-medium leading-tight">Teaching that equips you for real life.</h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-6 py-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Teachings</h4>
                      <Link
                        href="/teachings"
                        className="text-base font-medium text-gray-900 transition-colors hover:text-red-900"
                      >
                        Browse teachings &amp; media →
                      </Link>
                      <p className="text-sm leading-relaxed text-gray-500">
                        Messages, series, and resources to strengthen your walk with God and your community.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "shop" && (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex flex-col gap-8 px-6 py-6 md:flex-row md:gap-10">
                    <div className="relative flex min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:min-h-[300px] md:w-[42%]">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <div className="relative z-20">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">
                          Resources
                        </p>
                        <h3 className="text-2xl font-medium leading-tight">Tools and merch that support the mission.</h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-6 py-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shop</h4>
                      <div className="flex flex-col gap-4">
                        <Link
                          href="/shop"
                          className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                        >
                          Shop resources
                        </Link>
                        <Link
                          href="/donations"
                          className="flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                        >
                          Give{" "}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">[Impact]</span>
                        </Link>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500">
                        Every purchase and gift helps us reach more people with the gospel.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
            <Link
              href="/sign-in"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white md:block"
            >
              Login
            </Link>
            <Link
              href="/get-involved"
              className="rounded-full bg-red-soft px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Join theWalk
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
