"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  { href: "/admin", label: "Overview", match: (p: string) => p === "/admin" },
  { href: "/admin/users", label: "Users", match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/organizations", label: "Organizations", match: (p: string) => p.startsWith("/admin/organizations") },
  { href: "/admin/groups", label: "Group requests", match: (p: string) => p.startsWith("/admin/groups") },
  { href: "/admin/articles", label: "Articles", match: (p: string) => p.startsWith("/admin/articles") },
  { href: "/admin/courses", label: "Courses", match: (p: string) => p.startsWith("/admin/courses") },
] as const;

function navLinkClass(active: boolean) {
  return `block rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent/40 ${
    active
      ? "bg-admin-accent text-white shadow-sm shadow-admin-accent/25"
      : "text-admin-ink/80 hover:bg-black/[0.04]"
  }`;
}

export function AdminSidebar({ email, name }: { email?: string | null; name?: string | null }) {
  const pathname = usePathname() ?? "";
  const display = name?.trim() || email?.split("@")[0] || "—";

  return (
    <aside className="w-full shrink-0 md:sticky md:top-[calc(35px+64px+1.5rem)] md:w-60 lg:w-64 xl:w-72">
      <div className="admin-card shadow-admin-sidebar p-4 sm:p-5">
        <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Menu</p>
        <p className="mt-3 truncate px-1 text-base font-semibold tracking-tight text-admin-ink">{display}</p>
        <p className="mt-0.5 truncate px-1 text-xs text-admin-muted">{email ?? ""}</p>

        <nav className="mt-6 space-y-1" aria-label="Admin navigation">
          {items.map(({ href, label, match }) => (
            <Link key={href} href={href} className={navLinkClass(match(pathname))}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-black/[0.06] pt-4">
          <button
            type="button"
            className="w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-admin-ink/75 transition-colors hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-ink/20"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
