import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
import { createCollection, renameCollection, deleteCollection } from "../actions";

export const metadata = { title: "Vault collections · inLovingMemory" };

export default async function VaultCollectionsPage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true, displayName: true, pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) notFound();

  let vault = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorial.id },
    include: {
      collections: {
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!vault) {
    vault = await prisma.ilmGenerationsVault.create({
      data: { linkedMemorialId: memorial.id, ownerId: userId! },
      include: {
        collections: { include: { _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } },
      },
    });
  }

  return (
    <section className="w-full">
      <Link href={`/dashboard/memorials/${memorial.id}/vault`} className="dash-link text-sm">
        ← Vault
      </Link>
      <h1 className="dash-page-title mt-6">Collections</h1>
      <p className="dash-page-lead">Organise vault items into named collections.</p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      {/* New collection form */}
      <div className="dash-card-pad mt-6">
        <h2 className="text-sm font-semibold text-earth-900">New collection</h2>
        <form action={createCollection} className="mt-3 flex gap-3">
          <input type="hidden" name="memorialId" value={memorial.id} />
          <input
            name="name"
            type="text"
            required
            maxLength={200}
            placeholder="Collection name"
            className="block flex-1 rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-600"
          >
            Create
          </button>
        </form>
      </div>

      {/* Collections list */}
      {vault.collections.length === 0 ? (
        <div className="dash-card-pad mt-6 text-center text-sm text-earth-500">
          No collections yet. Create one above.
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {vault.collections.map((c) => (
            <div key={c.id} className="dash-card-pad flex items-center justify-between gap-4">
              <Link
                href={`/dashboard/memorials/${memorial.id}/vault/collections/${c.id}`}
                className="min-w-0 flex-1"
              >
                <span className="font-medium text-calm-600 hover:text-calm-700">{c.name}</span>
                <span className="ml-2 text-sm text-earth-500">{c._count.items} items</span>
              </Link>

              <div className="flex shrink-0 gap-2">
                {/* Rename form (inline) */}
                <form action={renameCollection} className="flex gap-1">
                  <input type="hidden" name="memorialId" value={memorial.id} />
                  <input type="hidden" name="collectionId" value={c.id} />
                  <input
                    name="name"
                    type="text"
                    defaultValue={c.name}
                    maxLength={200}
                    className="w-36 rounded-lg border border-earth-200 bg-white px-2 py-1 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-earth-100 px-2 py-1 text-xs font-medium text-earth-700 hover:bg-earth-200"
                  >
                    Rename
                  </button>
                </form>

                {/* Delete form */}
                <form action={deleteCollection}>
                  <input type="hidden" name="memorialId" value={memorial.id} />
                  <input type="hidden" name="collectionId" value={c.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
