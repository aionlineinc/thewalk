import Link from "next/link";
import { UserRole } from "@prisma/client";
import { addMembership, removeMembership, updateUserRole } from "./actions";
import { adminUsersPageData } from "@/server/admin/queries";

export default async function AdminUsersPage() {
  const { users, orgs } = await adminUsersPageData();

  return (
    <section className="w-full">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-lead">
        Roles and organization memberships. Changes apply on the next session refresh for signed-in users.
      </p>

      <div className="admin-card mt-8 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">
          <span>Email</span>
          <span>Role</span>
          <span>Organizations</span>
          <span>Created</span>
        </div>
        <ul className="divide-y divide-black/[0.05]">
          {users.map((u) => (
            <li key={u.id} className="px-6 py-4">
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-admin-ink">{u.email}</p>
                  {u.name ? <p className="mt-0.5 truncate text-xs text-admin-muted">{u.name}</p> : null}
                </div>

                <form
                  action={async (formData) => {
                    "use server";
                    await updateUserRole(formData);
                  }}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <input type="hidden" name="userId" value={u.id} />
                  <select
                    name="role"
                    defaultValue={u.role}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                  >
                    {Object.values(UserRole).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-admin-accent px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-admin-accent-hover"
                  >
                    Save
                  </button>
                </form>

                <div className="min-w-0">
                  {u.memberships.length ? (
                    <ul className="space-y-2">
                      {u.memberships.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-admin-canvas/60 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-admin-ink">{m.organization.name}</p>
                            <p className="mt-0.5 truncate text-xs text-admin-muted">
                              {m.organization.slug} · {m.role}
                            </p>
                          </div>
                          <form
                            action={async (formData) => {
                              "use server";
                              await removeMembership(formData);
                            }}
                          >
                            <input type="hidden" name="membershipId" value={m.id} />
                            <button
                              type="submit"
                              className="rounded-full border border-black/[0.1] bg-white px-3 py-1.5 text-xs font-semibold text-admin-ink transition-colors hover:bg-black/[0.03]"
                            >
                              Remove
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-admin-muted">No orgs yet.</p>
                  )}

                  <form
                    action={async (formData) => {
                      "use server";
                      await addMembership(formData);
                    }}
                    className="mt-3 flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="organizationId"
                      className="min-w-[180px] flex-1 rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Add to organization…
                      </option>
                      {orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.slug})
                        </option>
                      ))}
                    </select>
                    <select
                      name="role"
                      defaultValue={UserRole.MEMBER}
                      className="rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                    >
                      <option value={UserRole.MEMBER}>MEMBER</option>
                      <option value={UserRole.ORG_MANAGER}>ORG_MANAGER</option>
                      <option value={UserRole.ORG_ADMIN}>ORG_ADMIN</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-full bg-admin-accent px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-admin-accent-hover"
                      disabled={orgs.length === 0}
                    >
                      Add
                    </button>
                  </form>
                </div>

                <p className="pt-2 text-sm text-admin-muted">{u.createdAt.toISOString().slice(0, 10)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm text-admin-muted">
        Back to <Link href="/admin" className="admin-link">Admin overview</Link>.
      </p>
    </section>
  );
}
