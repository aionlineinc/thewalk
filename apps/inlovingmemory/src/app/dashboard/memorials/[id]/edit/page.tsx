import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteMemorialForm } from "@/app/dashboard/memorials/delete-memorial-form";
import { MemorialForm } from "@/app/dashboard/memorials/memorial-form";
import { buildMemorialDefaults } from "@/app/dashboard/memorials/memorial-form-defaults";
import { updateMemorialFromForm } from "@/app/dashboard/memorials/actions";
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
    <section className="w-full">
      <Link href="/dashboard" className="dash-link text-sm">
        ← Dashboard
      </Link>
      <h1 className="dash-page-title mt-6">Edit memorial</h1>
      <p className="dash-page-lead">
        Changes apply immediately on the public page (subject to privacy settings).
      </p>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link
          href={`/dashboard/memorials/${memorial.id}/media`}
          className="dash-link"
        >
          Photos &amp; banner →
        </Link>
        <Link
          href={`/dashboard/memorials/${memorial.id}/community`}
          className="dash-link"
        >
          Moderate guest book &amp; prayer wall →
        </Link>
      </p>
      <div className="dash-card-pad mt-10">
        <MemorialForm action={updateMemorialFromForm} defaults={defaults} memorialIdForEdit={memorial.id} />
      </div>
      <div className="mt-16 border-t border-earth-200 pt-10">
        <h2 className="text-lg font-semibold text-earth-900">Danger zone</h2>
        <p className="mt-2 max-w-xl text-sm text-earth-500">
          Removing a memorial deletes its page and related content.
        </p>
        <div className="mt-4">
          <DeleteMemorialForm memorialId={memorial.id} />
        </div>
      </div>
    </section>
  );
}
