"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/admin", label: "Overview", match: (p: string) => p === "/dashboard/admin" },
  { href: "/dashboard/admin/users", label: "Users", match: (p: string) => p.startsWith("/dashboard/admin/users") },
  { href: "/dashboard/admin/memorials", label: "Memorials", match: (p: string) => p.startsWith("/dashboard/admin/memorials") },
  { href: "/dashboard/admin/guestbook", label: "Guestbook", match: (p: string) => p.startsWith("/dashboard/admin/guestbook") },
  { href: "/dashboard/admin/prayers", label: "Prayers", match: (p: string) => p.startsWith("/dashboard/admin/prayers") },
  { href: "/dashboard/admin/banners", label: "Banners", match: (p: string) => p.startsWith("/dashboard/admin/banners") },
  { href: "/dashboard/admin/services", label: "Service providers", match: (p: string) => p.startsWith("/dashboard/admin/services") },
  { href: "/dashboard/admin/funeral", label: "Funeral services", match: (p: string) => p.startsWith("/dashboard/admin/funeral") },
];

function navLinkClass(active: boolean) {
  return `block rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-calm-500/40 ${
    active
      ? "bg-calm-500 text-white shadow-sm shadow-calm-500/25"
      : "text-earth-900/80 hover:bg-earth-50"
  }`;
}

export function IlmAdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="w-full shrink-0 md:sticky md:top-24 md:w-60 lg:w-64 xl:w-72">
      <div
        className="dash-card p-4 sm:p-5"
        style={{ boxShadow: "0 8px 40px -16px rgba(62, 54, 47, 0.12)" }}
      >
        <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Admin</p>

        <nav className="mt-3 space-y-1" aria-label="Admin navigation">
          {items.map(({ href, label, match }) => (
            <Link key={href} href={href} className={navLinkClass(match(pathname))}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-earth-200 pt-4">
          <Link
            href="/dashboard"
            className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-earth-900/75 transition-colors hover:bg-earth-50"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
