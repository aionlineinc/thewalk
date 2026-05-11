import { IlmSubmissionStatus } from "@prisma/client";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { setPrayerStatus } from "./actions";

export const metadata = {
  title: "Prayers · Admin · inLovingMemory",
};

export default async function AdminPrayersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await requireStaffSession();

  const filter = (typeof searchParams.status === "string" ? searchParams.status : "PENDING") as IlmSubmissionStatus;

  const [entries, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    prisma.ilmPrayer.findMany({
      where: { status: filter },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, authorName: true, content: true, notifyAuthor: true, status: true, createdAt: true,
        memorial: { select: { displayName: true, slug: true } },
      },
      take: 100,
    }),
    prisma.ilmPrayer.count({ where: { status: "PENDING" } }),
    prisma.ilmPrayer.count({ where: { status: "APPROVED" } }),
    prisma.ilmPrayer.count({ where: { status: "REJECTED" } }),
  ]);

  const tabs = [
    { status: "PENDING" as const, label: "Pending", count: pendingCount },
    { status: "APPROVED" as const, label: "Approved", count: approvedCount },
    { status: "REJECTED" as const, label: "Rejected", count: rejectedCount },
  ];

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Prayers</h1>
      <p className="dash-page-lead">All prayer wall entries across memorials.</p>

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <a
            key={t.status}
            href={`/dashboard/admin/prayers?status=${t.status}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === t.status
                ? "bg-calm-500 text-white"
                : "bg-white text-earth-600 hover:bg-earth-50"
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </a>
        ))}
      </div>

      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
            {entries.length} {filter.toLowerCase().replace(/_/g, " ")} entries
          </p>
        </div>
        {entries.length === 0 ? (
          <p className="px-6 py-8 text-sm text-earth-500">No entries.</p>
        ) : (
          <ul className="divide-y divide-earth-100">
            {entries.map((e) => (
              <li key={e.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-earth-900">{e.authorName}</p>
                    <p className="mt-0.5 text-xs text-earth-500">
                      {e.memorial.displayName}
                      {e.notifyAuthor ? " · open to follow-up" : null} ·{" "}
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(e.createdAt)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-earth-800 line-clamp-3">
                      {e.content}
                    </p>
                  </div>
                  {e.status === "PENDING" ? (
                    <div className="flex shrink-0 gap-2">
                      <form action={setPrayerStatus}>
                        <input type="hidden" name="prayerId" value={e.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button type="submit" className="rounded-lg bg-calm-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-calm-600">Approve</button>
                      </form>
                      <form action={setPrayerStatus}>
                        <input type="hidden" name="prayerId" value={e.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button type="submit" className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-800 shadow-sm transition hover:bg-red-50">Reject</button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
