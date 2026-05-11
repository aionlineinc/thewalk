"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "next-auth";
import { SignOutButton } from "@/components/sign-out-button";

const STAFF_ROLES = new Set(["SUPER_ADMIN", "ORG_ADMIN", "ORG_MANAGER"]);

function DotsMenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 276.167 276.167" aria-hidden="true" className={className} fill="currentColor">
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
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function IlmHeader({ session }: { session: Session | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = !!role && STAFF_ROLES.has(role);
  const isSignedIn = !!session?.user;

  const close = useCallback(() => setMobileOpen(false), []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen, close]);

  const navLinks = (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Explore</p>
        <div className="mt-3 space-y-1">
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/how-it-works" onClick={close}>How it works</Link>
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/directory" onClick={close}>Find a memorial</Link>
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/services" onClick={close}>Services</Link>
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/pricing" onClick={close}>Pricing</Link>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Learn</p>
        <div className="mt-3 space-y-1">
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/about" onClick={close}>About</Link>
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/faq" onClick={close}>FAQ</Link>
          <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/resources" onClick={close}>Resources</Link>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Account</p>
        <div className="mt-3 space-y-1">
          {isSignedIn ? (
            <>
              <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/dashboard" onClick={close}>Dashboard</Link>
              {isStaff ? (
                <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/dashboard/admin" onClick={close}>Admin</Link>
              ) : null}
              <div className="pt-3">
                <SignOutButton className="text-base font-medium text-white/60 underline-offset-4 transition hover:text-white hover:underline" />
              </div>
            </>
          ) : (
            <Link className="block py-2 text-lg font-medium text-white/80 transition hover:text-white" href="/sign-in" onClick={close}>Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 sm:top-7">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between gap-4 rounded-full bg-[#0d0906]/95 px-5 py-3 shadow-lg shadow-black/30 backdrop-blur-lg">
            <Link href="/" className="shrink-0">
              <img
                src="/weblogo-w.png"
                alt="inLovingMemory — Remember. Celebrate. Cherish."
                width={180}
                height={48}
                className="h-8 w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </Link>

            {/* Desktop nav with mega menu */}
            <div className="relative hidden md:block" onMouseLeave={() => setActiveMenu(null)}>
              <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
                <Link className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white" href="/how-it-works">How it works</Link>
                <Link className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white" href="/directory">Find a memorial</Link>
                <button
                  type="button"
                  className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                  onMouseEnter={() => setActiveMenu("services")}
                  aria-expanded={activeMenu === "services"}
                >
                  Services
                  <svg className={`ml-1 inline h-3 w-3 transition-transform ${activeMenu === "services" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button
                  type="button"
                  className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                  onMouseEnter={() => setActiveMenu("more")}
                  aria-expanded={activeMenu === "more"}
                >
                  More
                  <svg className={`ml-1 inline h-3 w-3 transition-transform ${activeMenu === "more" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isSignedIn ? (
                  <>
                    <Link className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white" href="/dashboard">Dashboard</Link>
                    {isStaff ? (
                      <Link className="rounded-full px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white" href="/dashboard/admin">Admin</Link>
                    ) : null}
                    <SignOutButton className="ml-2 text-sm font-medium text-white/60 underline-offset-4 transition hover:text-white hover:underline" />
                  </>
                ) : (
                  <Link className="rounded-full bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20" href="/sign-in">Sign in</Link>
                )}
              </nav>

              {/* Mega menu panel */}
              <div
                className={`absolute left-1/2 top-full z-30 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition-all duration-300 origin-top ${
                  activeMenu
                    ? "visible translate-y-0 opacity-100 pointer-events-auto"
                    : "invisible -translate-y-4 opacity-0 pointer-events-none"
                }`}
              >
                {activeMenu === "services" && (
                  <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                    <div className="flex flex-col gap-8 px-6 py-6 md:flex-row lg:gap-12">
                      <div className="relative flex min-h-[240px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:w-[35%]">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <img
                          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="relative z-20">
                          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">Find the right support</p>
                          <h3 className="text-xl font-medium leading-tight">Trusted providers<br />for every need</h3>
                        </div>
                      </div>
                      <div className="flex-1 py-2 md:py-4">
                        <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Services</h4>
                        <div className="grid grid-cols-2 gap-1">
                          <Link href="/services?category=flowers" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Florists</Link>
                          <Link href="/services?category=funeral-home" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Funeral Homes</Link>
                          <Link href="/services?category=church" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Churches</Link>
                          <Link href="/services?category=videographer" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Videographers</Link>
                          <Link href="/services?category=graphics" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Graphics &amp; Printing</Link>
                          <Link href="/services?category=counsellor" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Counsellors</Link>
                          <Link href="/services?category=caregiver" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Care Givers</Link>
                          <Link href="/services?category=hospice" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Hospice Services</Link>
                        </div>
                        <div className="mt-4 border-t border-gray-100 pt-3">
                          <Link href="/services" onClick={() => setActiveMenu(null)} className="text-sm font-semibold text-calm-500 transition hover:text-calm-600">All services →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeMenu === "more" && (
                  <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                    <div className="flex flex-col gap-8 px-6 py-6 md:flex-row lg:gap-12">
                      <div className="relative flex min-h-[240px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-earth-900 p-8 text-white md:w-[35%]">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <img
                          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80"
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="relative z-20">
                          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/80">Learn & connect</p>
                          <h3 className="text-xl font-medium leading-tight">Everything you need<br />to know</h3>
                        </div>
                      </div>
                      <div className="flex-1 py-2 md:py-4">
                        <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">More</h4>
                        <div className="grid grid-cols-2 gap-1">
                          <Link href="/about" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">About</Link>
                          <Link href="/pricing" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Pricing</Link>
                          <Link href="/faq" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">FAQ</Link>
                          <Link href="/resources" onClick={() => setActiveMenu(null)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-calm-600">Resources</Link>
                        </div>
                        <div className="mt-4 border-t border-gray-100 pt-3">
                          <Link href="/services/register" onClick={() => setActiveMenu(null)} className="text-sm font-semibold text-calm-500 transition hover:text-calm-600">Register as provider →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 -mr-1 text-white transition-colors hover:text-white/90 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <DotsMenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-[#0d0906]/98 backdrop-blur-md" onClick={close} />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Menu</p>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close menu"
                onClick={close}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navLinks}
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
