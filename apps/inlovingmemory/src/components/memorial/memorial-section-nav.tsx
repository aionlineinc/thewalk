import Link from "next/link";

const items = [
  { id: "story", label: "Memorial" },
  { id: "service", label: "Order of service" },
  { id: "gallery", label: "Photo gallery" },
  { id: "guestbook", label: "Guest book" },
  { id: "prayer", label: "Prayer wall" },
];

export function MemorialSectionNav() {
  return (
    <nav
      aria-label="Memorial sections"
      className="sticky top-0 z-30 border-y border-earth-200/80 bg-earth-50/70 backdrop-blur"
    >
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <ul className="flex gap-2 overflow-x-auto py-3 text-sm">
          {items.map((it) => (
            <li key={it.id} className="shrink-0">
              <Link
                href={`#${it.id}`}
                className="inline-flex items-center justify-center rounded-full border border-earth-200 bg-white px-3 py-1.5 font-medium text-earth-800 shadow-sm transition hover:bg-earth-100"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

