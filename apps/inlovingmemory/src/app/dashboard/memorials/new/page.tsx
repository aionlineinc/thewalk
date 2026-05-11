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
  themePreset: "",
  primaryColor: "",
  accentColor: "",
  bannerPreset: "",
  tier: "BASIC",
};

export default function NewMemorialPage() {
  return (
    <section className="w-full">
      <Link href="/dashboard" className="dash-link text-sm">
        ← Dashboard
      </Link>
      <h1 className="dash-page-title mt-6">New memorial</h1>
      <p className="dash-page-lead">
        Create a page for someone who has passed or a living legacy profile. The public link is generated
        when you save.
      </p>
      <div className="dash-card-pad mt-10">
        <MemorialForm action={createMemorial} defaults={emptyDefaults} />
      </div>
    </section>
  );
}
