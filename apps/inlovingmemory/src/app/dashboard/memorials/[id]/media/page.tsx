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
      tier: true,
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
    <section className="w-full">
      <Link href="/dashboard" className="dash-link text-sm">
        ← Dashboard
      </Link>
      <h1 className="dash-page-title mt-6">Photos</h1>
      <p className="dash-page-lead">
        {memorial.displayName} · <span className="font-mono text-sm">/{memorial.slug}</span>
      </p>
      <div className="dash-card-pad mt-10">
        <MemorialMediaPanel
          memorialId={memorial.id}
          storageConfigured={storageConfigured}
          items={memorial.media}
          tier={memorial.tier}
        />
      </div>
      <p className="mt-10 flex flex-wrap gap-6 text-sm">
        <Link className="dash-link" href={`/memorial/${memorial.slug}`}>
          View public page
        </Link>
        <Link className="dash-link" href={`/dashboard/memorials/${memorial.id}/edit`}>
          Edit details
        </Link>
      </p>
    </section>
  );
}
