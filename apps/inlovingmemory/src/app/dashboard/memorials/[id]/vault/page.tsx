import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";

export const metadata = { title: "Generations Vault · inLovingMemory" };

export default async function VaultPage({ params }: { params: { id: string } }) {
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
      _count: { select: { collections: true, messages: true, members: true } },
      collections: {
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" },
      },
      members: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!vault) {
    vault = await prisma.ilmGenerationsVault.create({
      data: {
        linkedMemorialId: memorial.id,
        ownerId: userId!,
      },
      include: {
        _count: { select: { collections: true, messages: true, members: true } },
        collections: { include: { _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } },
        members: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } },
      },
    });
  }

  return (
    <section className="w-full">
      <Link href={`/dashboard/memorials/${memorial.id}/edit`} className="dash-link text-sm">
        ← Edit memorial
      </Link>
      <h1 className="dash-page-title mt-6">Generations Vault</h1>
      <p className="dash-page-lead">
        A private archive for {memorial.displayName} — documents, letters, media, and messages to the future.
      </p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="dash-card-pad text-center">
          <p className="text-3xl font-semibold text-calm-500">{vault._count.collections}</p>
          <p className="mt-1 text-sm text-earth-500">Collections</p>
        </div>
        <div className="dash-card-pad text-center">
          <p className="text-3xl font-semibold text-calm-500">
            {vault.collections.reduce((sum, c) => sum + c._count.items, 0)}
          </p>
          <p className="mt-1 text-sm text-earth-500">Items</p>
        </div>
        <div className="dash-card-pad text-center">
          <p className="text-3xl font-semibold text-calm-500">{vault._count.members}</p>
          <p className="mt-1 text-sm text-earth-500">Members</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href={`/dashboard/memorials/${memorial.id}/vault/collections`}
          className="dash-card-pad group block transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-earth-900 group-hover:text-calm-600">
            Collections
          </h2>
          <p className="mt-1 text-sm text-earth-500">Organise documents, photos, and media</p>
        </Link>
        <Link
          href={`/dashboard/memorials/${memorial.id}/vault/messages`}
          className="dash-card-pad group block transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-earth-900 group-hover:text-calm-600">
            Messages
          </h2>
          <p className="mt-1 text-sm text-earth-500">Write time-locked letters to loved ones</p>
        </Link>
        <Link
          href={`/dashboard/memorials/${memorial.id}/vault/members`}
          className="dash-card-pad group block transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-earth-900 group-hover:text-calm-600">
            Members
          </h2>
          <p className="mt-1 text-sm text-earth-500">Invite family to view or contribute</p>
        </Link>
      </div>

      {/* Recent collections */}
      {vault.collections.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-earth-900">Collections</h2>
          <div className="mt-3 space-y-2">
            {vault.collections.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/memorials/${memorial.id}/vault/collections/${c.id}`}
                className="dash-card-pad flex items-center justify-between transition hover:shadow-md"
              >
                <span className="font-medium text-earth-900">{c.name}</span>
                <span className="text-sm text-earth-500">{c._count.items} items</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
