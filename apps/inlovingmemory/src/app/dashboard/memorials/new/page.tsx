import Link from "next/link";
import { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";
import { createMemorial } from "@/app/dashboard/memorials/actions";
import { MemorialForm } from "@/app/dashboard/memorials/memorial-form";

export const metadata = {
  title: "New memorial · inLovingMemory",
};

const emptyDefaults = {
  displayName: "",
  kind: IlmMemorialKind.MEMORIAL,
  biography: "",
  birthDate: "",
  deathDate: "",
  privacyLevel: IlmPrivacyLevel.PUBLIC,
  slug: "(assigned when you save)",
  hideFromDirectory: false,
  hideFromSearchEngines: false,
  country: "",
  parish: "",
};

export default function NewMemorialPage() {
  return (
    <main className="ilm-container py-12">
      <Link href="/dashboard" className="text-sm font-medium text-earth-700 underline-offset-4 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-earth-900">New memorial</h1>
      <p className="mt-3 max-w-2xl text-earth-700">
        Create a page for someone who has passed or a living legacy profile. The public link is generated when you
        save.
      </p>
      <div className="mt-10">
        <MemorialForm action={createMemorial} defaults={emptyDefaults} />
      </div>
    </main>
  );
}
