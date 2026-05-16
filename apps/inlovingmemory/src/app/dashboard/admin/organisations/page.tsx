import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GroupRegistrationStatus } from "@prisma/client";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Organisations · inLovingMemory" };

async function approveRegistration(formData: FormData) {
  "use server";
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const regId = (formData.get("regId") as string) || "";
  const orgName = (formData.get("orgName") as string)?.trim() || "";
  const kind = (formData.get("kind") as string) || "FUNERAL_HOME";
  const adminUserId = (formData.get("adminUserId") as string) || "";
  if (!regId || !orgName || !adminUserId) return;

  const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

  await prisma.ilmOrgAccount.create({
    data: {
      kind: kind as "FUNERAL_HOME" | "MINISTRY",
      name: orgName,
      slug,
      tier: "starter",
      adminUserId,
    },
  });

  await prisma.groupRegistration.update({
    where: { id: regId },
    data: { status: GroupRegistrationStatus.APPROVED, reviewedAt: new Date() },
  });

  revalidatePath("/dashboard/admin/organisations");
}

async function rejectRegistration(formData: FormData) {
  "use server";
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const regId = (formData.get("regId") as string) || "";
  if (!regId) return;

  await prisma.groupRegistration.update({
    where: { id: regId },
    data: { status: GroupRegistrationStatus.REJECTED, reviewedAt: new Date() },
  });

  revalidatePath("/dashboard/admin/organisations");
}

export default async function AdminOrganisationsPage() {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const [orgs, pendingRegs, users] = await Promise.all([
    prisma.ilmOrgAccount.findMany({
      include: {
        adminUser: { select: { name: true, email: true } },
        _count: { select: { memorials: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.groupRegistration.findMany({
      where: { status: GroupRegistrationStatus.PENDING },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MANAGER"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dash-page-title">Organisations</h1>
          <p className="dash-page-lead">Manage funeral home and ministry accounts.</p>
        </div>
        <Link href="/dashboard/admin/organisations/new" className="dash-btn-primary">
          New organisation
        </Link>
      </div>

      {/* Pending registrations */}
      {pendingRegs.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-earth-900">
            Pending registrations ({pendingRegs.length})
          </h2>
          <div className="mt-3 space-y-2">
            {pendingRegs.map((reg) => (
              <div key={reg.id} className="dash-card-pad flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-earth-900">{reg.organizationName}</p>
                  <p className="text-sm text-earth-500">
                    {reg.contactName} · {reg.contactEmail}
                    {reg.phone ? ` · ${reg.phone}` : ""}
                  </p>
                  {reg.notes && <p className="mt-1 text-sm text-earth-600">{reg.notes}</p>}
                </div>
                <form action={approveRegistration} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="regId" value={reg.id} />
                  <input type="hidden" name="orgName" value={reg.organizationName} />
                  <div>
                    <label className="block text-xs text-earth-500">Type</label>
                    <select name="kind" className="rounded-lg border border-earth-200 bg-white px-2 py-1 text-sm">
                      <option value="FUNERAL_HOME">Funeral Home</option>
                      <option value="MINISTRY">Ministry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-earth-500">Admin</label>
                    <select name="adminUserId" required className="rounded-lg border border-earth-200 bg-white px-2 py-1 text-sm">
                      <option value="">Select…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-calm-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-calm-600"
                  >
                    Approve
                  </button>
                </form>
                <form action={rejectRegistration}>
                  <input type="hidden" name="regId" value={reg.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Existing orgs */}
      <h2 className="mt-8 text-lg font-semibold text-earth-900">
        Active organisations ({orgs.length})
      </h2>
      {orgs.length === 0 ? (
        <p className="dash-card-pad mt-3 text-sm text-earth-500">No organisations yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {orgs.map((org) => (
            <div key={org.id} className="dash-card-pad flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-earth-900">{org.name}</p>
                <p className="text-sm text-earth-500">
                  <span className="inline-block rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                    {org.kind === "FUNERAL_HOME" ? "Funeral Home" : "Ministry"}
                  </span>
                  {" · "}Admin: {org.adminUser.name || org.adminUser.email}
                  {" · "}{org._count.memorials} memorials
                  {" · "}{org.tier}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
