function calcAge(birth: Date, end: Date | null | undefined): number {
  const d = end ?? new Date();
  let age = d.getFullYear() - birth.getFullYear();
  if (
    d.getMonth() < birth.getMonth() ||
    (d.getMonth() === birth.getMonth() && d.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

const fmt = (d: Date | null | undefined) =>
  d
    ? new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(d)
    : null;

export function MemorialHero({
  displayName,
  kindLabel,
  bannerUrl,
  profileUrl,
  primaryColor,
  birthDate,
  deathDate,
}: {
  displayName: string;
  kindLabel: string;
  bannerUrl: string | null;
  profileUrl: string | null;
  primaryColor?: string;
  birthDate?: Date | null;
  deathDate?: Date | null;
}) {
  const birth = fmt(birthDate);
  const death = fmt(deathDate);
  const age = birthDate ? calcAge(birthDate, deathDate) : null;

  return (
    <div className="mb-8">
      {bannerUrl ? (
        <div className="-mx-6 overflow-hidden rounded-2xl border border-earth-100 shadow-sm sm:-mx-8">
          <img
            src={bannerUrl}
            alt=""
            className="max-h-72 w-full object-cover sm:max-h-80"
            loading="eager"
            decoding="async"
          />
        </div>
      ) : null}

      <div
        className={
          bannerUrl
            ? "mt-0 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left sm:gap-8"
            : "flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left sm:gap-8"
        }
      >
        {profileUrl ? (
          <div className={bannerUrl ? "-mt-14 shrink-0 relative z-10 sm:-mt-16" : "shrink-0"}>
            <img
              src={profileUrl}
              alt=""
              width={160}
              height={160}
              className="h-28 w-28 rounded-xl border-4 border-white bg-earth-100 object-cover shadow-lg sm:h-36 sm:w-36"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <p
            className="font-script text-2xl"
            style={{ color: primaryColor || "#8c7b6d" }}
          >
            {kindLabel}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
            {displayName}
          </h1>
          {birth || death ? (
            <p className="mt-2 text-sm text-earth-600">
              {[birth, death].filter(Boolean).join(" – ")}
            </p>
          ) : null}
          {age !== null ? (
            <p className="mt-0.5 text-sm text-earth-600">Age: {age}</p>
          ) : null}
          <a
            href="#guestbook"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: primaryColor || "#8c7b6d" }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Share Memories
          </a>
        </div>
      </div>
    </div>
  );
}
