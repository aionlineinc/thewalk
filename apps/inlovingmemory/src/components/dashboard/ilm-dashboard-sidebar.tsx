"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  { href: "/dashboard", label: "Memorials", match: (p: string) => p === "/dashboard" },
  { href: "/dashboard/memorials/new", label: "New memorial", match: (p: string) => p === "/dashboard/memorials/new" },
];

function navLinkClass(active: boolean) {
  return `block rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-calm-500/40 ${
    active
      ? "bg-calm-500 text-white shadow-sm shadow-calm-500/25"
      : "text-earth-900/80 hover:bg-earth-50"
  }`;
}

export function IlmDashboardSidebar({
  email,
  name,
  isStaff,
}: {
  email?: string | null;
  name?: string | null;
  isStaff?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const display = name?.trim() || email?.split("@")[0] || "—";

  return (
    <aside className="w-full shrink-0 md:sticky md:top-24 md:w-60 lg:w-64 xl:w-72">
      <div
        className="dash-card p-4 sm:p-5"
        style={{ boxShadow: "0 8px 40px -16px rgba(62, 54, 47, 0.12)" }}
      >
        <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Menu</p>
        <p className="mt-3 truncate px-1 text-base font-semibold tracking-tight text-earth-900">
          {display}
        </p>
        <p className="mt-0.5 truncate px-1 text-xs text-earth-500">{email ?? ""}</p>

        <nav className="mt-6 space-y-1" aria-label="Dashboard navigation">
          {items.map(({ href, label, match }) => (
            <Link key={href} href={href} className={navLinkClass(match(pathname))}>
              {label}
            </Link>
          ))}
          {isStaff ? (
            <Link
              href="/dashboard/admin"
              className={navLinkClass(pathname.startsWith("/dashboard/admin"))}
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="mt-8 border-t border-earth-200 pt-4">
          <button
            type="button"
            className="w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-earth-900/75 transition-colors hover:bg-earth-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-900/20"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
