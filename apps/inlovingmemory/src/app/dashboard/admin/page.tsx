import Link from "next/link";
import { IlmSubmissionStatus } from "@prisma/client";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin · inLovingMemory",
};

export default async function AdminOverviewPage() {
  await requireStaffSession();

  const [usersCount, memorialsCount, pendingGuestbook, pendingPrayers, recentMemorials, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.ilmMemorial.count(),
      prisma.ilmGuestbookEntry.count({ where: { status: IlmSubmissionStatus.PENDING } }),
      prisma.ilmPrayer.count({ where: { status: IlmSubmissionStatus.PENDING } }),
      prisma.ilmMemorial.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          slug: true,
          displayName: true,
          kind: true,
          tier: true,
          createdAt: true,
          pageKeeper: { select: { email: true } },
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      }),
    ]);

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Admin overview</h1>
      <p className="dash-page-lead">System-wide stats and recent activity.</p>

      {/* Stat cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Users</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900">{usersCount}</p>
        </div>
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Memorials</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900">{memorialsCount}</p>
        </div>
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Pending guestbook</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900">{pendingGuestbook}</p>
        </div>
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Pending prayers</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900">{pendingPrayers}</p>
        </div>
      </div>

      {/* Recent memorials */}
      <div className="dash-card mt-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Recent memorials</p>
          <Link href="/dashboard/admin/memorials" className="dash-link text-xs">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-earth-100">
          {recentMemorials.map((m) => (
            <li key={m.id} className="flex flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-earth-900">{m.displayName}</p>
                <p className="text-sm text-earth-500">
                  {m.kind === "LIVING_LEGACY" ? "Living legacy" : "Memorial"} · {m.tier} ·{" "}
                  {m.pageKeeper.email}
                </p>
              </div>
              <Link className="dash-link text-sm" href={`/memorial/${m.slug}`}>
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent users */}
      <div className="dash-card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Recent users</p>
          <Link href="/dashboard/admin/users" className="dash-link text-xs">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-earth-100">
          {recentUsers.map((u) => (
            <li key={u.id} className="flex flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-earth-900">{u.name || u.email}</p>
                <p className="text-sm text-earth-500">
                  {u.email} · {u.role.replace(/_/g, " ")}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  u.role === "SUPER_ADMIN"
                    ? "bg-calm-500 text-white"
                    : u.role === "ORG_ADMIN" || u.role === "ORG_MANAGER"
                      ? "bg-calm-100 text-calm-700"
                      : "bg-earth-100 text-earth-600"
                }`}
              >
                {u.role.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
