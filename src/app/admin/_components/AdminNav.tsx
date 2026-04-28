"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const linkClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${
    active ? "bg-earth-900 text-white" : "text-earth-800 hover:bg-earth-900/5"
  }`;

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-earth-100 bg-white p-3 shadow-sm">
      <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
        <Link href="/admin" className={linkClass(pathname === "/admin")}>
          Overview
        </Link>
        <Link href="/admin/users" className={linkClass(pathname.startsWith("/admin/users"))}>
          Users
        </Link>
        <Link href="/admin/organizations" className={linkClass(pathname.startsWith("/admin/organizations"))}>
          Organizations
        </Link>
      </nav>

      <button
        type="button"
        className="rounded-full bg-red-soft px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900/40"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </button>
    </div>
  );
}

