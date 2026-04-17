import Link from "next/link";
import { getServerSession } from "next-auth";
import { GroupRegistrationStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminStatSegmentBar } from "./_components/AdminStatSegmentBar";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] ?? session?.user?.email?.split("@")[0] ?? "there";

  const [usersCount, orgsCount, membershipsCount, pendingGroups, recentUsers, recentOrgs] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.organizationMembership.count(),
    prisma.groupRegistration.count({ where: { status: GroupRegistrationStatus.PENDING } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
    prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, kind: true, createdAt: true, _count: { select: { memberships: true } } },
    }),
  ]);

  const totalNav = usersCount + orgsCount + pendingGroups + membershipsCount || 1;

  return (
    <section className="w-full max-w-4xl">
      <h1 className="admin-page-title">Welcome back, {firstName}</h1>
      <p className="admin-page-lead">
        Manage people, organizations, content, and ministry registrations from one place — the same calm, card-based layout
        as your reference dashboards.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="admin-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Directory</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-admin-ink sm:text-4xl">{usersCount + orgsCount}</p>
          <p className="mt-2 text-sm text-admin-muted">Users and organizations in the system.</p>
          <AdminStatSegmentBar
            segments={[
              { key: "u", className: "bg-admin-bar-green", flex: usersCount },
              { key: "o", className: "bg-admin-bar-violet", flex: Math.max(orgsCount, 1) },
              { key: "m", className: "bg-admin-accent/90", flex: Math.max(membershipsCount, 1) },
              { key: "p", className: "bg-admin-bar-amber", flex: Math.max(pendingGroups * 3, 1) },
            ]}
          />
          <p className="mt-2 text-[11px] text-admin-muted">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-admin-bar-green" /> Users</span>
            {" · "}
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-admin-bar-violet" /> Orgs</span>
            {" · "}
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-admin-accent" /> Memberships</span>
            {" · "}
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-admin-bar-amber" /> Pending groups (weighted)</span>
          </p>
        </div>

        <div className="admin-card flex flex-col justify-between rounded-[1.35rem] bg-admin-ink p-6 text-white shadow-admin-card sm:p-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Group requests</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">{pendingGroups}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Pending ministry registrations waiting for review.
            </p>
          </div>
          <Link
            href="/admin/groups"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-admin-ink transition-colors hover:bg-white/90"
            data-button-link
          >
            Review queue
          </Link>
        </div>

        <div className="admin-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Users</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-admin-ink">{usersCount}</p>
          <p className="mt-3 text-sm text-admin-muted">
            Roles and org assignments in{" "}
            <Link href="/admin/users" className="admin-link">
              Users
            </Link>
            .
          </p>
        </div>

        <div className="admin-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Organizations</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-admin-ink">{orgsCount}</p>
          <p className="mt-3 text-sm text-admin-muted">
            Create and edit in{" "}
            <Link href="/admin/organizations" className="admin-link">
              Organizations
            </Link>
            .
          </p>
        </div>

        <div className="admin-card-pad sm:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Memberships</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-admin-ink">{membershipsCount}</p>
            </div>
            <p className="text-sm text-admin-muted">Assign from the Users page.</p>
          </div>
          <AdminStatSegmentBar
            segments={[
              { key: "a", className: "bg-admin-bar-green", flex: Math.round((usersCount / totalNav) * 100) || 25 },
              { key: "b", className: "bg-admin-accent/85", flex: Math.round((membershipsCount / totalNav) * 100) || 25 },
              { key: "c", className: "bg-admin-bar-amber", flex: Math.round((pendingGroups / totalNav) * 100) || 8 },
              { key: "d", className: "bg-admin-bar-violet/80", flex: Math.round((orgsCount / totalNav) * 100) || 20 },
            ]}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="admin-card overflow-hidden">
          <div className="border-b border-black/[0.06] bg-black/[0.02] px-6 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Recent users</p>
          </div>
          <ul className="divide-y divide-black/[0.05]">
            {recentUsers.map((u) => (
              <li key={u.id} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                <p className="truncate text-sm font-medium text-admin-ink">{u.email}</p>
                <p className="mt-0.5 text-xs text-admin-muted">
                  {u.role} · {u.createdAt.toISOString().slice(0, 10)}
                </p>
              </li>
            ))}
            {recentUsers.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-admin-muted">No users yet.</li>
            ) : null}
          </ul>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="border-b border-black/[0.06] bg-black/[0.02] px-6 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Recent organizations</p>
          </div>
          <ul className="divide-y divide-black/[0.05]">
            {recentOrgs.map((o) => (
              <li key={o.id} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                <p className="truncate text-sm font-medium text-admin-ink">{o.name}</p>
                <p className="mt-0.5 text-xs text-admin-muted">
                  <span className="font-medium text-admin-ink/70">{o.slug}</span> · {o.kind} · {o._count.memberships}{" "}
                  members
                </p>
              </li>
            ))}
            {recentOrgs.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-admin-muted">No organizations yet.</li>
            ) : null}
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-admin-muted">
        Public group form:{" "}
        <Link href="/register/group" className="admin-link">
          /register/group
        </Link>
      </p>
    </section>
  );
}
