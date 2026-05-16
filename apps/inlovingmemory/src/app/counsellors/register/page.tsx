import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Register as a counsellor · inLovingMemory" };

const SPECIALISATIONS = [
  "BEREAVEMENT",
  "TRAUMA",
  "CHILD_BEREAVEMENT",
  "SUDDEN_LOSS",
  "PREGNANCY_LOSS",
  "ELDERLY_LOSS",
  "SPIRITUAL",
  "FAMILY_SYSTEMS",
  "GROUP_FACILITATION",
  "PASTORAL_CARE",
] as const;

const SPECIALISATION_LABELS: Record<string, string> = {
  BEREAVEMENT: "Bereavement & grief counselling",
  TRAUMA: "Trauma and loss",
  CHILD_BEREAVEMENT: "Child bereavement",
  SUDDEN_LOSS: "Sudden or violent loss",
  PREGNANCY_LOSS: "Pregnancy loss / infant bereavement",
  ELDERLY_LOSS: "Elderly loss (supporting elderly bereaved)",
  SPIRITUAL: "Spiritual / faith-based grief support",
  FAMILY_SYSTEMS: "Family systems and communication in grief",
  GROUP_FACILITATION: "Group grief facilitation",
  PASTORAL_CARE: "General pastoral care",
};

async function registerCounsellor(formData: FormData) {
  "use server";
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const bio = (formData.get("bio") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const timezone = (formData.get("timezone") as string)?.trim() || null;
  const languages = (formData.get("languages") as string)?.trim() || null;
  const availability = (formData.get("availability") as string)?.trim() || null;

  // Collect specialisations from multi-select
  const selected: string[] = [];
  for (const spec of SPECIALISATIONS) {
    if (formData.get(`spec_${spec}`) === "on") {
      selected.push(spec);
    }
  }

  if (selected.length === 0) {
    redirect("/counsellors/register?error=spec");
  }

  const avData = availability
    ? ({ schedule: availability, location, timezone } as Prisma.InputJsonValue)
    : Prisma.JsonNull;

  await prisma.ilmCounsellor.upsert({
    where: { userId },
    update: {
      bio,
      specialisations: selected,
      availabilityJson: avData,
    },
    create: {
      userId,
      bio,
      specialisations: selected,
      availabilityJson: avData,
    },
  });

  revalidatePath("/counsellors/register");
  redirect("/counsellors/register?done=1");
}

export default async function CounsellorRegisterPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  if (!userId) {
    return (
      <main className="ilm-container py-20 text-center">
        <h1 className="text-2xl font-semibold text-earth-900">Sign in to register</h1>
        <p className="mt-3 text-earth-600">
          You need a theWalk account to register as a grief counsellor or minister.
        </p>
        <Link
          href="/sign-in?redirect=/counsellors/register"
          className="dash-btn-primary mt-6 inline-block"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const existing = await prisma.ilmCounsellor.findUnique({ where: { userId } });
  const done = searchParams.done === "1";
  const error = searchParams.error === "spec";

  const existingLocation =
    existing?.availabilityJson && typeof existing.availabilityJson === "object" && !Array.isArray(existing.availabilityJson)
      ? (existing.availabilityJson as Record<string, unknown>).location as string ?? ""
      : "";

  return (
    <main className="pb-24">
      <section className="relative flex h-[36vh] min-h-[280px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">For counsellors &amp; ministers</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            {existing ? "Update your profile" : "Register as a counsellor"}
          </h1>
        </div>
      </section>

      <div className="ilm-container py-12">
        {done ? (
          <div className="dash-card-pad mx-auto max-w-xl text-center">
            <h2 className="text-xl font-semibold text-earth-900">Thank you{existing ? " — profile updated" : ""}!</h2>
            <p className="mt-3 text-earth-600">
              Your counsellor profile has been submitted for review.
              {!existing?.verifiedAt ? " An administrator will verify your profile shortly." : ""}
            </p>
            <Link href="/dashboard" className="dash-link mt-4 inline-block">
              ← Go to dashboard
            </Link>
          </div>
        ) : (
          <div className="dash-card-pad mx-auto max-w-xl">
            <h2 className="text-lg font-semibold text-earth-900">Your profile</h2>
            <p className="mt-2 text-sm text-earth-600">
              Register as a grief counsellor or minister to be matched with families on inLovingMemory.
            </p>

            {error ? (
              <p className="mt-4 text-sm text-red-800">Please select at least one specialisation.</p>
            ) : null}

            {existing && !existing.verifiedAt ? (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                Your profile is pending verification. An administrator will review it shortly.
              </p>
            ) : null}

            {existing?.verifiedAt ? (
              <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-950">
                Verified on {new Date(existing.verifiedAt).toLocaleDateString()}. You can update your profile below.
              </p>
            ) : null}

            <form action={registerCounsellor} className="mt-6 space-y-5">
              {/* Specialisations */}
              <fieldset>
                <legend className="text-sm font-medium text-earth-800">Specialisations</legend>
                <p className="mt-1 text-xs text-earth-500">Select all that apply.</p>
                <div className="mt-3 space-y-2">
                  {SPECIALISATIONS.map((spec) => {
                    const checked =
                      Array.isArray(existing?.specialisations) &&
                      (existing!.specialisations as string[]).includes(spec);
                    return (
                      <label key={spec} className="flex items-start gap-3 cursor-pointer text-sm text-earth-700">
                        <input
                          type="checkbox"
                          name={`spec_${spec}`}
                          defaultChecked={checked}
                          className="mt-0.5 rounded border-earth-300 text-calm-500 focus:ring-calm-500"
                        />
                        {SPECIALISATION_LABELS[spec]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label className="block text-sm font-medium text-earth-800">Bio / approach statement</label>
                <textarea
                  name="bio"
                  rows={4}
                  maxLength={2000}
                  defaultValue={existing?.bio ?? ""}
                  placeholder="Describe your counselling approach, experience, and any relevant background…"
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800">Ministry affiliation</label>
                <input
                  name="location"
                  type="text"
                  maxLength={200}
                  defaultValue={existingLocation}
                  placeholder="e.g. City Church, Nairobi"
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-earth-800">Timezone</label>
                  <input
                    name="timezone"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. America/New_York"
                    className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">Languages spoken</label>
                  <input
                    name="languages"
                    type="text"
                    maxLength={200}
                    placeholder="e.g. English, Spanish"
                    className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800">
                  Availability <span className="font-normal text-earth-400">(days, hours, virtual/in-person)</span>
                </label>
                <textarea
                  name="availability"
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. Mon–Fri 9am–5pm EST, virtual sessions preferred"
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-calm-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
              >
                {existing ? "Update profile" : "Submit registration"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
