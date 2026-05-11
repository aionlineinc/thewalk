import Link from "next/link";
import { getIlmSession } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/admin-guard";
import { DashboardSidebarRouter } from "@/components/dashboard/dashboard-sidebar-router";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getIlmSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = !!role && STAFF_ROLES.has(role);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-earth-50">
      <DashboardTopBar isStaff={isStaff} />

      {/* Sidebar + content */}
      <div className="flex w-full flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:gap-8 md:px-8 md:py-8 xl:gap-10">
        <DashboardSidebarRouter
          email={session?.user?.email}
          name={session?.user?.name}
          isStaff={isStaff}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
