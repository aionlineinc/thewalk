import Link from "next/link";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard · inLovingMemory",
};

export default async function DashboardPage() {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : "";
  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] ?? session?.user?.email?.split("@")[0] ?? "there";

  const memorials = await prisma.ilmMemorial.findMany({
    where: { pageKeeperId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      displayName: true,
      kind: true,
      privacyLevel: true,
    },
  });

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Welcome back, {firstName}</h1>
      <p className="dash-page-lead">
        Create and manage legacy pages you keep — all in one place.
      </p>

      {/* Stat card */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Memorials</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900 sm:text-4xl">
            {memorials.length}
          </p>
          <p className="mt-2 text-sm text-earth-500">Memorial pages you keep.</p>
        </div>

        <div className="dash-card-pad flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Create new</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-earth-900">
              Start a memorial page
            </p>
            <p className="mt-2 text-sm text-earth-500">
              Honor a loved one or create a living legacy in minutes.
            </p>
          </div>
          <Link
            href="/dashboard/memorials/new"
            className="dash-btn-primary mt-5 w-full"
            data-button-link
          >
            New memorial
          </Link>
        </div>
      </div>

      {/* Memorial list */}
      {memorials.length === 0 ? (
        <div className="dash-card-pad mt-10 text-center">
          <p className="text-earth-800">You do not have any memorials yet.</p>
          <Link
            href="/dashboard/memorials/new"
            className="dash-btn-primary mt-6"
            data-button-link
          >
            Create your first memorial
          </Link>
        </div>
      ) : (
        <div className="dash-card mt-10 overflow-hidden">
          <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
              Your memorials
            </p>
          </div>
          <ul className="divide-y divide-earth-100">
            {memorials.map((m) => (
              <li
                key={m.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-earth-900">{m.displayName}</p>
                  <p className="mt-0.5 text-sm text-earth-500">
                    {m.kind === "LIVING_LEGACY" ? "Living legacy" : "Memorial"} ·{" "}
                    {m.privacyLevel.replace(/_/g, " ")} ·{" "}
                    <span className="font-mono text-earth-600">/{m.slug}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link className="dash-link" href={`/memorial/${m.slug}`}>
                    View
                  </Link>
                  <Link className="dash-link" href={`/dashboard/memorials/${m.id}/edit`}>
                    Edit
                  </Link>
                  <Link className="dash-link" href={`/dashboard/memorials/${m.id}/media`}>
                    Photos
                  </Link>
                  <Link className="dash-link" href={`/dashboard/memorials/${m.id}/community`}>
                    Community
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
