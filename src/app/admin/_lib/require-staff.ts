import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

const STAFF_ROLES = new Set(["SUPER_ADMIN", "ORG_ADMIN", "ORG_MANAGER"]);

export async function requireStaffSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !STAFF_ROLES.has(role)) return null;
  return session;
}
