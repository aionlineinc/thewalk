import { UserRole } from "@prisma/client";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { updateUserRole } from "./actions";

export const metadata = {
  title: "Users · Admin · inLovingMemory",
};

export default async function AdminUsersPage() {
  await requireStaffSession();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { ilmMemorialsAsPageKeeper: true } },
    },
  });

  const roleOptions = Object.values(UserRole);

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Users</h1>
      <p className="dash-page-lead">Manage user roles and view memorial ownership.</p>

      <div className="dash-card mt-10 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
            {users.length} users
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-earth-100 bg-earth-50/30">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Name</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Email</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Role</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Memorials</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-earth-50/50">
                  <td className="px-6 py-3 font-medium text-earth-900">{u.name || "—"}</td>
                  <td className="px-6 py-3 text-earth-600">{u.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-calm-500 text-white"
                          : u.role === "ORG_ADMIN" || u.role === "ORG_MANAGER"
                            ? "bg-calm-100 text-calm-700"
                            : "bg-earth-100 text-earth-600"
                      }`}
                    >
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-earth-600">{u._count.ilmMemorialsAsPageKeeper}</td>
                  <td className="px-6 py-3">
                    <form action={updateUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="rounded-lg border border-earth-200 bg-white px-2 py-1.5 text-xs text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {r.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-earth-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-earth-900"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
