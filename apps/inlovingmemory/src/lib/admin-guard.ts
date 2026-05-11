import { redirect } from "next/navigation";
import { getIlmSession } from "@/lib/auth";

const STAFF_ROLES = new Set(["SUPER_ADMIN", "ORG_ADMIN", "ORG_MANAGER", "VENDOR"]);

export { STAFF_ROLES };

export async function requireStaffSession() {
  const session = await getIlmSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !STAFF_ROLES.has(role)) {
    redirect("/dashboard");
  }
  return session;
}
