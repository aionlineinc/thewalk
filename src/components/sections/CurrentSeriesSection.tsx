import Image from "next/image";
import Link from "next/link";

export type SeriesArticle = {
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
};

const DEFAULT_ARTICLES: SeriesArticle[] = [
  {
    title: "Components of Walking",
    description: "What components influence your journey through life?",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=900&auto=format&fit=crop",
    alt: "Wide landscape — components of a journey",
  },
  {
    title: "A Desire to Move",
    description: "It begins with love",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=900&auto=format&fit=crop",
    alt: "Warm sunrise — desire and beginnings",
  },
  {
    title: "A Path Chosen",
    description: "Directed by glory",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop",
    alt: "Forest path — a chosen way",
  },
  {
    title: "Movement",
    description: "Powered by Faith",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900&auto=format&fit=crop",
    alt: "Mountain vista — forward movement",
  },
  {
    title: "Staying the Course",
    description: "Seasons and Cycles",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900&auto=format&fit=crop",
    alt: "Misty hills — seasons and endurance",
  },
  {
    title: "Destinations",
    description: "Where are we going, and how will we get there?",
    href: "/teachings",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=900&auto=format&fit=crop",
    alt: "Lake and mountains — destination ahead",
  },
];

type CurrentSeriesSectionProps = {
  articles?: SeriesArticle[];
};

export function CurrentSeriesSection({ articles = DEFAULT_ARTICLES }: CurrentSeriesSectionProps) {
  return (
    <section
      id="home-current-series"
      className="w-full border-b border-gray-100 bg-gray-50 pt-20 pb-24 md:pt-24 md:pb-32"
      aria-labelledby="current-series-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,34%)_minmax(0,1fr)] md:items-start md:gap-x-10 md:gap-y-0 lg:gap-x-14 xl:gap-x-16">
          {/* Sticky copy: pins while the card grid scrolls until the section ends. */}
          <div className="sticky top-28 z-10 w-full bg-gray-50 pb-2 md:pb-0">
            <h2
              id="current-series-heading"
              className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl lg:text-[35px]"
            >
              The Current series
            </h2>
            <p
              id="home-current-series-intro"
              className="mt-5 text-[15px] font-light leading-relaxed text-gray-500 md:text-lg md:leading-relaxed"
            >
              As believers, the concept of &ldquo;walking&rdquo; should have some significance to us in the
              context of our faith. These six parts outline what is necessary for purposeful walking /
              movement to take place.
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 p-0">
              {articles.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    data-button-link
                    className="group block outline-none transition-colors focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 400px, (min-width: 768px) 32vw, 100vw"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-medium tracking-tight text-gray-900 transition-colors group-hover:text-red-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-light leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
