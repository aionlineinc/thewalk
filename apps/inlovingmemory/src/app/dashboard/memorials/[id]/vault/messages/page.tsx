import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";

export const metadata = { title: "Vault messages · inLovingMemory" };

export default async function VaultMessagesPage({ params }: { params: { id: string } }) {
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
      messages: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!vault) {
    vault = await prisma.ilmGenerationsVault.create({
      data: { linkedMemorialId: memorial.id, ownerId: userId! },
      include: {
        messages: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  return (
    <section className="w-full">
      <Link href={`/dashboard/memorials/${memorial.id}/vault`} className="dash-link text-sm">
        ← Vault
      </Link>
      <h1 className="dash-page-title mt-6">Messages</h1>
      <p className="dash-page-lead">
        Write letters to loved ones — delivered now or at a future time.
      </p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      {/* New message CTA */}
      <Link
        href={`/dashboard/memorials/${memorial.id}/vault/messages/new`}
        className="dash-btn-primary mt-6 inline-flex"
      >
        Write a message
      </Link>

      {/* Messages list */}
      {vault.messages.length === 0 ? (
        <div className="dash-card-pad mt-6 text-center text-sm text-earth-500">
          No messages yet.
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {vault.messages.map((m) => (
            <div key={m.id} className="dash-card-pad">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-earth-600">
                    {m.recipientEmail ? (
                      <>To: <span className="font-medium text-earth-900">{m.recipientEmail}</span></>
                    ) : (
                      <span className="italic text-earth-500">Unaddressed</span>
                    )}
                    {m.lockedAt && (
                      <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                        Locked
                      </span>
                    )}
                    {!m.lockedAt && (
                      <span className="ml-2 inline-block rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                        Draft
                      </span>
                    )}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-earth-500">
                    {m.body || "(no content)"}
                  </p>
                  <p className="mt-1 text-xs text-earth-400">
                    Created {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
