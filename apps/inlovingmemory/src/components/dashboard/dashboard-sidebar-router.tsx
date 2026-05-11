"use client";

import { usePathname } from "next/navigation";
import { IlmDashboardSidebar } from "@/components/dashboard/ilm-dashboard-sidebar";
import { IlmAdminSidebar } from "@/components/dashboard/ilm-admin-sidebar";

export function DashboardSidebarRouter({
  email,
  name,
  isStaff,
}: {
  email?: string | null;
  name?: string | null;
  isStaff: boolean;
}) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/dashboard/admin");

  if (isAdmin && isStaff) {
    return <IlmAdminSidebar />;
  }

  return <IlmDashboardSidebar email={email} name={name} isStaff={isStaff} />;
}
