"use client";

import { usePathname } from "next/navigation";
import { IlmDashboardSidebar } from "@/components/dashboard/ilm-dashboard-sidebar";
import { IlmAdminSidebar } from "@/components/dashboard/ilm-admin-sidebar";
import { IlmVendorSidebar } from "@/components/dashboard/ilm-vendor-sidebar";

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
  const isVendor = pathname.startsWith("/dashboard/vendor");

  if (isAdmin && isStaff) return <IlmAdminSidebar />;
  if (isVendor) return <IlmVendorSidebar />;

  return <IlmDashboardSidebar email={email} name={name} isStaff={isStaff} />;
}
