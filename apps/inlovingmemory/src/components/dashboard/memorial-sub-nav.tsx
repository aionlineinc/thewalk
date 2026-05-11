"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MemorialSubNav({ memorialId, slug }: { memorialId: string; slug: string }) {
  const pathname = usePathname() ?? "";

  const links = [
    { href: `/dashboard/memorials/${memorialId}/edit`, label: "Edit details" },
    { href: `/dashboard/memorials/${memorialId}/media`, label: "Photos & media" },
    { href: `/dashboard/memorials/${memorialId}/community`, label: "Community" },
    { href: `/memorial/${slug}`, label: "View page →" },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1" aria-label="Memorial sections">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "?");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-calm-500 text-white shadow-sm"
                : "text-earth-600 hover:bg-earth-100 hover:text-earth-900"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
