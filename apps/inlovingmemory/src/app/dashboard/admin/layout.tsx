import Link from "next/link";
import { requireStaffSession } from "@/lib/admin-guard";
import { IlmAdminSidebar } from "@/components/dashboard/ilm-admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaffSession();

  return (
    <div className="w-full">
      {/* Top bar */}
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
            <span className="shrink-0 rounded-full bg-calm-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm sm:text-[11px] sm:px-3">
              Admin
            </span>
          </div>
          <Link href="/dashboard" className="dash-link hidden text-sm sm:inline">
            Back to dashboard
          </Link>
        </div>
      </header>

      {/* Sidebar + content */}
      <div className="flex w-full flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:gap-8 md:px-8 md:py-8 xl:gap-10">
        <IlmAdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
