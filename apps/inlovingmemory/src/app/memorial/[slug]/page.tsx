import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: params.slug },
    select: {
      displayName: true,
      kind: true,
      biography: true,
      birthDate: true,
      deathDate: true,
    },
  });

  if (!memorial) notFound();

  return (
    <main className="mx-auto max-w-content px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">
        {memorial.kind === "LIVING_LEGACY" ? "Living legacy" : "In loving memory"}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-earth-900">{memorial.displayName}</h1>
      <p className="mt-6 whitespace-pre-wrap text-earth-800">{memorial.biography ?? "—"}</p>
    </main>
  );
}
