export function MemorialHero({
  displayName,
  kindLabel,
  bannerUrl,
  profileUrl,
  primaryColor,
}: {
  displayName: string;
  kindLabel: string;
  bannerUrl: string | null;
  profileUrl: string | null;
  primaryColor?: string;
}) {
  return (
    <div className="mb-12">
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
            ? "mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8"
            : "flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8"
        }
      >
        {profileUrl ? (
          <div className={bannerUrl ? "-mt-16 shrink-0 sm:-mt-20" : "shrink-0"}>
            <img
              src={profileUrl}
              alt=""
              width={144}
              height={144}
              className="h-28 w-28 rounded-full border-4 border-earth-50 bg-earth-100 object-cover shadow-md sm:h-36 sm:w-36"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: primaryColor || "#8c7b6d" }}
          >
            {kindLabel}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-earth-900 sm:text-5xl">{displayName}</h1>
        </div>
      </div>
    </div>
  );
}
