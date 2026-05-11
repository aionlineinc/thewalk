import Link from "next/link";
import { notFound } from "next/navigation";
import { IlmMediaKind, IlmSubmissionStatus } from "@prisma/client";
import { MemorialMediaPanel } from "@/components/dashboard/memorial-media-panel";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
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
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>
      <div className="dash-card-pad mt-6">
        <MemorialMediaPanel
          memorialId={memorial.id}
          storageConfigured={storageConfigured}
          items={memorial.media}
          tier={memorial.tier}
        />
      </div>
    </section>
  );
}
