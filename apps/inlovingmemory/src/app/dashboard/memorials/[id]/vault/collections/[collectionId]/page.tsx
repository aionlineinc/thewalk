import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
import { addItemToCollection, deleteVaultItem } from "../../actions";

export const metadata = { title: "Collection · inLovingMemory" };

function kindLabel(kind: string): string {
  const labels: Record<string, string> = {
    PHOTO: "Photo",
    VIDEO: "Video",
    AUDIO: "Audio",
    DOCUMENT: "Document",
  };
  return labels[kind] ?? kind;
}

export default async function VaultCollectionItemsPage({
  params,
}: {
  params: { id: string; collectionId: string };
}) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true, displayName: true, pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) notFound();

  const vault = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorial.id },
  });

  if (!vault) notFound();

  // Verify the collection belongs to this vault
  const collection = await prisma.ilmVaultCollection.findFirst({
    where: { id: params.collectionId, vaultId: vault.id },
    include: {
      items: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!collection) notFound();

  return (
    <section className="w-full">
      <Link
        href={`/dashboard/memorials/${memorial.id}/vault/collections`}
        className="dash-link text-sm"
      >
        ← Collections
      </Link>
      <h1 className="dash-page-title mt-6">{collection.name}</h1>
      <p className="dash-page-lead">Items in this collection.</p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      {/* Add item form */}
      <div className="dash-card-pad mt-6">
        <h2 className="mb-3 text-sm font-semibold text-earth-900">Add an item</h2>
        <p className="mb-4 text-xs text-earth-500">
          Items are linked by URL. Add a title and a URL to a photo, video, audio, or document.
        </p>
        <form action={addItemToCollection} className="space-y-3">
          <input type="hidden" name="memorialId" value={memorial.id} />
          <input type="hidden" name="collectionId" value={collection.id} />

          <div>
            <label className="block text-sm font-medium text-earth-800">Title</label>
            <input
              name="title"
              type="text"
              maxLength={200}
              className="mt-1 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-800">Storage URL</label>
            <input
              name="storageUrl"
              type="text"
              required
              className="mt-1 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-800">Type</label>
            <select
              name="kind"
              className="mt-1 w-full max-w-xs rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            >
              <option value="DOCUMENT">Document</option>
              <option value="PHOTO">Photo</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-600"
          >
            Add item
          </button>
        </form>
      </div>

      {/* Items list */}
      {collection.items.length === 0 ? (
        <div className="dash-card-pad mt-6 text-center text-sm text-earth-500">
          No items in this collection yet.
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {collection.items.map((item) => (
            <div key={item.id} className="dash-card-pad flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-earth-900">
                  {item.title || "Untitled"}
                </span>
                <span className="ml-2 inline-block rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                  {kindLabel(item.kind)}
                </span>
                {item.storageUrl && (
                  <a
                    href={item.storageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-calm-500 hover:text-calm-600"
                  >
                    Open
                  </a>
                )}
              </div>

              {/* Delete form */}
              <form action={deleteVaultItem}>
                <input type="hidden" name="memorialId" value={memorial.id} />
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
