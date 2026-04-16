"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavMenu = "about" | "journey" | "teachings" | "shop";

function DotsMenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 276.167 276.167"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M33.144,2.471C15.336,2.471,0.85,16.958,0.85,34.765s14.48,32.293,32.294,32.293s32.294-14.486,32.294-32.293S50.951,2.471,33.144,2.471z" />
      <path d="M137.663,2.471c-17.807,0-32.294,14.487-32.294,32.294s14.487,32.293,32.294,32.293c17.808,0,32.297-14.486,32.297-32.293S155.477,2.471,137.663,2.471z" />
      <path d="M243.873,67.059c17.804,0,32.294-14.486,32.294-32.293S261.689,2.471,243.873,2.471s-32.294,14.487-32.294,32.294S226.068,67.059,243.873,67.059z" />
      <path d="M32.3,170.539c17.807,0,32.297-14.483,32.297-32.293c0-17.811-14.49-32.297-32.297-32.297S0,120.436,0,138.246C0,156.056,14.493,170.539,32.3,170.539z" />
      <path d="M136.819,170.539c17.804,0,32.294-14.483,32.294-32.293c0-17.811-14.478-32.297-32.294-32.297c-17.813,0-32.294,14.486-32.294,32.297C104.525,156.056,119.012,170.539,136.819,170.539z" />
      <path d="M243.038,170.539c17.811,0,32.294-14.483,32.294-32.293c0-17.811-14.483-32.297-32.294-32.297s-32.306,14.486-32.306,32.297C210.732,156.056,225.222,170.539,243.038,170.539z" />
      <path d="M33.039,209.108c-17.807,0-32.3,14.483-32.3,32.294c0,17.804,14.493,32.293,32.3,32.293s32.293-14.482,32.293-32.293S50.846,209.108,33.039,209.108z" />
      <path d="M137.564,209.108c-17.808,0-32.3,14.483-32.3,32.294c0,17.804,14.487,32.293,32.3,32.293c17.804,0,32.293-14.482,32.293-32.293S155.368,209.108,137.564,209.108z" />
      <path d="M243.771,209.108c-17.804,0-32.294,14.483-32.294,32.294c0,17.804,14.49,32.293,32.294,32.293c17.811,0,32.294-14.482,32.294-32.293S261.575,209.108,243.771,209.108z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [activeMenu, setActiveMenu] = useState<NavMenu | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<NavMenu | null>("journey");

  const navLinkClass =
    "text-sm font-medium tracking-wide text-white transition-colors hover:text-white";

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header id="site-header" className="fixed top-[35px] inset-x-0 z-50 flex w-full flex-col items-center px-4 md:px-8">
      <div className="relative w-full max-w-6xl">
        <div
          id="site-header-bar"
          className="relative z-20 flex items-center gap-3 rounded-full border border-white/10 bg-[#1a1a1a]/95 px-6 py-3 text-black shadow-[0px_25px_50px_-5px_rgba(0,0,0,0.25)] backdrop-blur-md md:gap-4"
        >
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <Link
              href="/"
              data-button-link
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
            <nav id="site-header-primary-nav" className="flex items-center gap-8" aria-label="Primary">
              <Link
                href="/about"
                className={navLinkClass}
                onMouseEnter={() => setActiveMenu("about")}
              >
                About
              </Link>
              <Link
                href="/journey"
                className={navLinkClass}
                aria-expanded={activeMenu === "journey"}
                aria-haspopup="true"
                onMouseEnter={() => setActiveMenu("journey")}
              >
                Journey
              </Link>
              <Link
                href="/teachings"
                className={navLinkClass}
                onMouseEnter={() => setActiveMenu("teachings")}
              >
                Teachings
              </Link>
              <Link
                href="/shop"
                className={navLinkClass}
                onMouseEnter={() => setActiveMenu("shop")}
              >
                Shop
              </Link>
            </nav>

            <div
              id="site-header-mega-menu"
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
                        <Link href="/journey/cross-over" className="group flex items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Over
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Enter a place of restoration, support, and profound transformation.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {["Rugged", "Covered", "Exodus"].map((m) => (
                                <span
                                  key={m}
                                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-gray-700"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                        <Link href="/journey/cross-roads" className="group flex items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Roads
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Grow deeply in your identity, absolute truth, and spiritual direction.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {["Bible Study", "Series", "MyWalk"].map((m) => (
                                <span
                                  key={m}
                                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-gray-700"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                        <Link href="/journey/cross-connect" className="group flex items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 transition-colors group-hover:text-red-900">
                              Cross Connect
                            </h5>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              Build enduring community, fellowship, and expand into Kingdom impact.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {["Small Groups", "Prayer", "Ministry Development"].map((m) => (
                                <span
                                  key={m}
                                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-gray-700"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
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
                            href="/about/beliefs"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Our Beliefs
                          </Link>
                          <Link
                            href="/about/ministry-structure"
                            className="text-sm font-medium text-gray-900 transition-colors hover:text-red-900"
                          >
                            Ministry structure
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

          <div id="site-header-actions" className="flex min-w-0 flex-1 items-center justify-end gap-4">
            <Link
              href="/sign-in"
              className="hidden text-sm font-medium text-white transition-colors hover:text-white md:block"
            >
              Login
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-white transition-colors hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <DotsMenuIcon className="h-5 w-5" />}
            </button>
            <Link
              href="/get-involved"
              data-button-link
              className="hidden md:inline-flex rounded-full bg-red-soft px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Join theWalk
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="absolute inset-0 bg-[#101010]/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5">
              <p className="text-sm font-semibold tracking-wide text-white">Menu</p>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="h-[calc(100dvh-74px)] overflow-y-auto px-5 py-6">
              <div className="space-y-4">
                <Link
                  href="/about"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-white"
                    aria-expanded={mobileExpanded === "journey"}
                    onClick={() =>
                      setMobileExpanded((s) => (s === "journey" ? null : "journey"))
                    }
                  >
                    Journey
                    <span className="text-white/70">{mobileExpanded === "journey" ? "−" : "+"}</span>
                  </button>
                  {mobileExpanded === "journey" ? (
                    <div className="border-t border-white/10 px-4 py-4">
                      <div className="space-y-5">
                        <div>
                          <Link
                            href="/journey/cross-over"
                            className="text-sm font-semibold text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            Cross Over
                          </Link>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["Rugged", "Covered", "Exodus"].map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/85"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Link
                            href="/journey/cross-roads"
                            className="text-sm font-semibold text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            Cross Roads
                          </Link>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["Bible Study", "Series", "MyWalk"].map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/85"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Link
                            href="/journey/cross-connect"
                            className="text-sm font-semibold text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            Cross Connect
                          </Link>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["Small Groups", "Prayer", "Ministry Development"].map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/85"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link
                          href="/journey"
                          className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-earth-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          View Journey →
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/teachings"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Teachings
                </Link>
                <Link
                  href="/shop"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/sign-in"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/get-involved"
                  data-button-link
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-red-soft px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Join theWalk
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
