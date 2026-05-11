import Link from "next/link";

const memorialLinks = [
  { href: "#photos", label: "Photos" },
  { href: "#shared-memories", label: "Shared memories" },
  { href: "#video-tributes", label: "Video tributes" },
  { href: "#guestbook", label: "Guest book" },
  { href: "#prayer", label: "Prayer wall" },
];

function MemorialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function ServiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

export function MemorialSectionNav({
  slug,
  activeTab,
  primaryColor,
}: {
  slug: string;
  activeTab: string;
  primaryColor?: string;
}) {
  const isFuneral = activeTab === "funeral-service";

  return (
    <nav
      aria-label="Memorial sections"
      className="sticky top-0 z-30 border-b border-earth-200/80 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-1 py-2">
          <Link
            href={`/memorial/${slug}`}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              !isFuneral
                ? "bg-earth-100 text-earth-900"
                : "text-earth-500 hover:bg-earth-50 hover:text-earth-800"
            }`}
            style={!isFuneral && primaryColor ? { backgroundColor: `${primaryColor}18`, color: primaryColor } : undefined}
          >
            <MemorialIcon className="h-4 w-4 shrink-0" />
            Memorial
          </Link>
          <Link
            href={`/memorial/${slug}?tab=funeral-service`}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              isFuneral
                ? "bg-earth-100 text-earth-900"
                : "text-earth-500 hover:bg-earth-50 hover:text-earth-800"
            }`}
            style={isFuneral && primaryColor ? { backgroundColor: `${primaryColor}18`, color: primaryColor } : undefined}
          >
            <ServiceIcon className="h-4 w-4 shrink-0" />
            Funeral Service
          </Link>

          {/* Section jump links */}
          {!isFuneral ? (
            <div className="ml-4 flex gap-1 overflow-x-auto border-l border-earth-200 pl-4">
              {memorialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-earth-500 transition hover:bg-earth-50 hover:text-earth-800"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
