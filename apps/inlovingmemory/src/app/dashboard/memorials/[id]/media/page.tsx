import Link from "next/link";
import { notFound } from "next/navigation";
import { IlmMediaKind, IlmSubmissionStatus } from "@prisma/client";
import { MemorialMediaPanel } from "@/components/dashboard/memorial-media-panel";
import { getIlmSession } from "@/lib/auth";
import { getIlmStorageEnv } from "@/lib/ilm-storage-config";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Photos · inLovingMemory",
};

export default async function MemorialMediaPage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      displayName: true,
      slug: true,
      pageKeeperId: true,
      media: {
        where: {
          kind: IlmMediaKind.PHOTO,
          status: IlmSubmissionStatus.APPROVED,
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, storageUrl: true, title: true },
      },
    },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    notFound();
  }

  const storageConfigured = getIlmStorageEnv().configured;

  return (
    <main className="ilm-container py-12">
      <Link href="/dashboard" className="text-sm font-medium text-earth-800 underline-offset-4 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-earth-900">Photos</h1>
      <p className="mt-2 text-earth-700">
        {memorial.displayName} · <span className="font-mono text-sm">/{memorial.slug}</span>
      </p>
      <div className="mt-10">
        <MemorialMediaPanel
          memorialId={memorial.id}
          storageConfigured={storageConfigured}
          items={memorial.media}
        />
      </div>
      <p className="mt-12 flex flex-wrap gap-6 text-sm">
        <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href={`/memorial/${memorial.slug}`}>
          View public page
        </Link>
        <Link
          className="font-medium text-earth-800 underline-offset-4 hover:underline"
          href={`/dashboard/memorials/${memorial.id}/edit`}
        >
          Edit details
        </Link>
      </p>
    </main>
  );
}
