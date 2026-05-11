"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardTopBar({ isStaff }: { isStaff: boolean }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/dashboard/admin");

  return (
    <header className="sticky top-[72px] z-40 border-b border-earth-200/60 bg-earth-50/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="truncate text-lg font-semibold tracking-tight text-earth-900 transition-opacity hover:opacity-80"
            data-button-link
          >
            inLovingMemory
          </Link>
          {isAdmin ? (
            <>
              <span className="shrink-0 rounded-full bg-calm-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm sm:text-[11px] sm:px-3">
                Admin
              </span>
              <Link
                href="/dashboard"
                className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-earth-500 shadow-sm ring-1 ring-earth-200 transition hover:bg-earth-50 sm:text-[11px] sm:px-3"
                data-button-link
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-earth-500 shadow-sm ring-1 ring-earth-200 sm:text-[11px] sm:px-3">
                Dashboard
              </span>
              {isStaff ? (
                <Link
                  href="/dashboard/admin"
                  className="shrink-0 rounded-full bg-calm-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-calm-600 sm:text-[11px] sm:px-3"
                  data-button-link
                >
                  Admin
                </Link>
              ) : null}
            </>
          )}
        </div>
        <Link
          href={isAdmin ? "/dashboard" : "/"}
          className="dash-link hidden text-sm sm:inline"
        >
          {isAdmin ? "Back to dashboard" : "View site"}
        </Link>
      </div>
    </header>
  );
}
