import Link from "next/link";

const pillars = [
  {
    title: "Serve",
    body: "Step into hands-on ministry where you’re needed.",
  },
  {
    title: "Support",
    body: "Pray, give, and encourage the work faithfully.",
  },
  {
    title: "Partner",
    body: "Collaborate for lasting kingdom impact.",
  },
] as const;

export function WalkWithUsSection() {
  return (
    <section
      id="home-walk-with-us"
      className="border-b border-gray-100 bg-white py-[115px]"
      aria-label="Walk With Us"
    >
      <div className="container mx-auto max-w-[850px] px-4">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10 md:gap-12">
          {pillars.map(({ title, body }) => (
            <div
              key={title}
              id={`home-walk-with-us-${title.toLowerCase()}`}
              className="flex flex-col items-center text-center"
            >
              <h3 className="mb-2 text-base font-medium tracking-tight text-gray-900 md:text-[17px]">{title}</h3>
              <p className="max-w-[220px] text-[14px] font-light leading-snug text-gray-500 md:max-w-none">{body}</p>
            </div>
          ))}
        </div>

        <p id="home-walk-with-us-cta" className="mt-14 text-center md:mt-16">
          <Link
            href="/get-involved"
            className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            How to get involved
            <span aria-hidden> →</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
