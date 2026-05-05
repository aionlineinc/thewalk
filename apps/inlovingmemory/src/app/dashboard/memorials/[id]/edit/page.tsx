import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteMemorialForm } from "@/app/dashboard/memorials/delete-memorial-form";
import { MemorialForm, buildMemorialDefaults } from "@/app/dashboard/memorials/memorial-form";
import { updateMemorial } from "@/app/dashboard/memorials/actions";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit memorial · inLovingMemory",
};

export default async function EditMemorialPage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    notFound();
  }

  const defaults = buildMemorialDefaults(memorial);

  return (
    <main className="mx-auto max-w-content px-6 py-12 sm:px-8">
      <Link href="/dashboard" className="text-sm font-medium text-earth-700 underline-offset-4 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-earth-900">Edit memorial</h1>
      <p className="mt-3 max-w-2xl text-earth-700">
        Changes apply immediately on the public page (subject to privacy settings).
      </p>
      <p className="mt-4">
        <Link
          href={`/dashboard/memorials/${memorial.id}/community`}
          className="text-sm font-medium text-calm-600 underline-offset-4 hover:underline"
        >
          Moderate guest book & prayer wall →
        </Link>
      </p>
      <div className="mt-10">
        <MemorialForm action={updateMemorial.bind(null, memorial.id)} defaults={defaults} />
      </div>
      <div className="mt-16 border-t border-earth-200 pt-10">
        <h2 className="text-lg font-semibold text-earth-900">Danger zone</h2>
        <p className="mt-2 max-w-xl text-sm text-earth-600">Removing a memorial deletes its page and related content.</p>
        <div className="mt-4">
          <DeleteMemorialForm memorialId={memorial.id} />
        </div>
      </div>
    </main>
  );
}
