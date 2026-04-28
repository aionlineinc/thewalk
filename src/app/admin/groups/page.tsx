import Link from "next/link";
import { GroupRegistrationStatus } from "@prisma/client";
import { approveGroupRegistration, rejectGroupRegistration } from "./actions";
import { adminGroupsPageData } from "@/server/admin/queries";

export default async function AdminGroupsPage() {
  const { rows } = await adminGroupsPageData();

  const pending = rows.filter((r) => r.status === GroupRegistrationStatus.PENDING);
  const done = rows.filter((r) => r.status !== GroupRegistrationStatus.PENDING);

  return (
    <section className="w-full">
      <h1 className="admin-page-title">Group registration</h1>
      <p className="admin-page-lead">
        Ministry and group onboarding requests. Approving creates an organization with a URL-safe slug (from the preferred
        slug or group name).
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Pending</h2>
          <ul className="mt-4 space-y-4">
            {pending.length === 0 ? (
              <li className="admin-card px-6 py-10 text-center text-sm text-admin-muted">No pending requests.</li>
            ) : null}
            {pending.map((r) => (
              <li key={r.id} className="admin-card p-6 sm:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="text-lg font-semibold tracking-tight text-admin-ink">{r.organizationName}</p>
                    <p className="text-sm text-admin-muted">
                      {r.contactName} · <span className="font-medium text-admin-ink">{r.contactEmail}</span>
                      {r.phone ? ` · ${r.phone}` : ""}
                    </p>
                    {r.desiredSlug ? (
                      <p className="text-xs text-admin-muted">
                        Preferred slug: <span className="font-mono text-admin-ink">{r.desiredSlug}</span>
                      </p>
                    ) : null}
                    {r.notes ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-admin-ink/90">{r.notes}</p> : null}
                    <p className="mt-2 text-xs text-admin-muted">Submitted {r.createdAt.toISOString().slice(0, 10)}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <form
                      action={async (fd) => {
                        "use server";
                        await approveGroupRegistration(fd);
                      }}
                    >
                      <input type="hidden" name="registrationId" value={r.id} />
                      <button type="submit" className="admin-btn-primary rounded-full px-5 py-2.5 text-sm">
                        Approve &amp; create org
                      </button>
                    </form>
                    <form
                      action={async (fd) => {
                        "use server";
                        await rejectGroupRegistration(fd);
                      }}
                    >
                      <input type="hidden" name="registrationId" value={r.id} />
                      <button type="submit" className="admin-btn-ghost rounded-full px-5 py-2.5 text-sm">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Processed</h2>
          <div className="admin-card mt-4 overflow-hidden">
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">
              <span>Group</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            <ul className="divide-y divide-black/[0.05]">
              {done.length === 0 ? (
                <li className="px-6 py-8 text-sm text-admin-muted">No processed requests yet.</li>
              ) : null}
              {done.map((r) => (
                <li key={r.id} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                  <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-admin-ink">{r.organizationName}</p>
                      <p className="truncate text-xs text-admin-muted">{r.contactEmail}</p>
                    </div>
                    <span className="text-sm font-medium text-admin-ink">{r.status}</span>
                    <p className="text-sm text-admin-muted">{r.reviewedAt?.toISOString().slice(0, 10) ?? "—"}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-admin-muted">
        Public form: <Link href="/register/group" className="admin-link">/register/group</Link> ·{" "}
        <Link href="/admin" className="admin-link">Admin overview</Link>
      </p>
    </section>
  );
}
