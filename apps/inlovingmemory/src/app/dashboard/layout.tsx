import Link from "next/link";
import { getIlmSession } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/admin-guard";
import { IlmDashboardSidebar } from "@/components/dashboard/ilm-dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getIlmSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = !!role && STAFF_ROLES.has(role);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-earth-50">
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
          </div>
          <Link href="/" className="dash-link hidden text-sm sm:inline">
            View site
          </Link>
        </div>
      </header>

      {/* Sidebar + content */}
      <div className="flex w-full flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:gap-8 md:px-8 md:py-8 xl:gap-10">
        <IlmDashboardSidebar
          email={session?.user?.email}
          name={session?.user?.name}
          isStaff={isStaff}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
