import Link from "next/link";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard · inLovingMemory",
};

export default async function DashboardPage() {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : "";

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
    <main className="mx-auto max-w-content px-6 py-12 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-earth-900">Your memorials</h1>
          <p className="mt-2 text-earth-700">Create and manage legacy pages you keep.</p>
        </div>
        <Link
          href="/dashboard/memorials/new"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-earth-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
        >
          New memorial
        </Link>
      </div>

      {memorials.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-earth-200 bg-earth-50/50 px-8 py-14 text-center">
          <p className="text-earth-800">You do not have any memorials yet.</p>
          <Link
            href="/dashboard/memorials/new"
            className="mt-6 inline-flex rounded-lg bg-earth-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Create your first memorial
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-earth-200 rounded-2xl border border-earth-200 bg-white">
          {memorials.map((m) => (
            <li key={m.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-earth-900">{m.displayName}</p>
                <p className="mt-1 text-sm text-earth-600">
                  {m.kind === "LIVING_LEGACY" ? "Living legacy" : "Memorial"} · {m.privacyLevel.replace(/_/g, " ")}{" "}
                  ·{" "}
                  <span className="font-mono text-earth-700">/{m.slug}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href={`/memorial/${m.slug}`}>
                  View
                </Link>
                <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href={`/dashboard/memorials/${m.id}/edit`}>
                  Edit
                </Link>
                <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href={`/dashboard/memorials/${m.id}/media`}>
                  Photos
                </Link>
                <Link className="font-medium text-calm-600 underline-offset-4 hover:underline" href={`/dashboard/memorials/${m.id}/community`}>
                  Community
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
