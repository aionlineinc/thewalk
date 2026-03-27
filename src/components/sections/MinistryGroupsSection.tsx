import Image from "next/image";
import Link from "next/link";

/** Atmospheric background — swap for /public asset when available */
const SECTION_BG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop";

const pathwayGroups = [
  {
    slug: "cross-over",
    label: "Cross Over",
    items: ["Rugged", "Covered", "Exodus"] as const,
  },
  {
    slug: "cross-roads",
    label: "Cross Roads",
    items: ["Bible Study", "Series", "MyWalk"] as const,
  },
  {
    slug: "cross-connect",
    label: "Cross Connect",
    items: ["Small Groups", "Prayer", "Ministry Development"] as const,
  },
] as const;

function PathwayIcon({ slug }: { slug: (typeof pathwayGroups)[number]["slug"] }) {
  const common = "w-8 h-8 shrink-0 text-white";
  if (slug === "cross-over") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h7.5v13.5h-7.5V5.25zM12.75 5.25h7.5v13.5h-7.5V5.25zM11.25 5.25v13.5" />
      </svg>
    );
  }
  if (slug === "cross-roads") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v19.5M7.5 7.5L12 3.75l4.5 3.75M7.5 16.5L12 20.25l4.5-3.75" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <circle cx="12" cy="6" r="2.25" />
      <circle cx="6" cy="14" r="2.25" />
      <circle cx="18" cy="14" r="2.25" />
      <circle cx="12" cy="18" r="2.25" />
      <path strokeLinecap="round" d="M12 8.25v2.5M8.5 10.5l-1.5 2M15.5 10.5l1.5 2M10.25 15.5l1.5 1.75M13.75 15.5l-1.5 1.75" />
    </svg>
  );
}

export function MinistryGroupsSection() {
  return (
    <section
      className="relative isolate w-full py-20 md:py-24 border-b border-white/10 overflow-hidden"
      aria-labelledby="ministries-heading"
    >
      <Image
        src={SECTION_BG}
        alt=""
        fill
        className="object-cover object-center scale-105"
        sizes="100vw"
        priority={false}
      />
      {/* Light scrim so copy and glass read clearly without killing the photo */}
      <div className="absolute inset-0 bg-neutral-950/45" aria-hidden />

      <div className="relative z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center mb-12 md:mb-14">
          <h2
            id="ministries-heading"
            className="text-base font-bold tracking-[0.2em] uppercase text-white/75 mb-2 [text-shadow:0_1px_24px_rgba(0,0,0,0.35)]"
          >
            Ministries That Meet People Where They Are
          </h2>
        </div>

        <div className="container mx-auto px-4 max-w-[850px] space-y-8 md:space-y-10">
          <ul className="space-y-8 md:space-y-10 list-none p-0 m-0">
            {pathwayGroups.map((group) => (
              <li key={group.slug}>
                <div
                  className="flex flex-col overflow-hidden rounded-[50px] border border-white/[0.22] bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-md backdrop-saturate-150 md:min-h-[5.5rem] md:flex-row md:items-stretch transition-[box-shadow,background-color] duration-300 hover:border-white/30 hover:bg-white/[0.09]"
                >
                  <Link
                    href={`/journey/${group.slug}`}
                    className="flex flex-row items-center justify-center gap-3 px-5 py-4 text-center text-white md:w-[11.5rem] md:shrink-0 md:flex-col md:gap-2 md:py-5 bg-black/50 backdrop-blur-sm border-b border-white/[0.12] md:border-b-0 md:border-r md:border-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <PathwayIcon slug={group.slug} />
                    <span className="text-sm font-semibold uppercase leading-tight tracking-wide">{group.label}</span>
                  </Link>

                  <div className="grid flex-1 grid-cols-1 divide-y divide-white/[0.12] bg-white/[0.03] backdrop-blur-[2px] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {group.items.map((name) => (
                      <Link
                        key={name}
                        href={`/journey/${group.slug}`}
                        className="flex items-center justify-center px-4 py-5 text-center text-sm font-medium tracking-wide text-white/95 backdrop-blur-[1px] transition-colors hover:bg-white/[0.07] sm:py-4 sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/80"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-12 max-w-2xl px-4 text-center text-base font-light leading-relaxed text-white/80 [text-shadow:0_1px_20px_rgba(0,0,0,0.4)] md:mt-14 md:text-lg">
          From restoration and discipleship to fellowship and ministry support, each expression of theWalk exists to
          strengthen believers and equip the Body of Christ.
        </p>
      </div>
    </section>
  );
}
