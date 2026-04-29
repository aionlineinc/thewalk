import { Hero } from "@/components/ui/Hero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { Button } from "@/components/ui/Button";
import { AppBodyMuted, AppHeadingSection } from "@/components/ui/Typography";

export default function Shop() {
  return (
    <>
      <Hero
        sectionId="shop-hero"
        titleId="shop-hero-title"
        subtextId="shop-hero-description"
        headline="Shop theWalk"
        subtext="Books, resources, and ministry-inspired products designed to support faith, growth, and impact."
      />

      <section
        id="shop-books"
        className="border-b border-gray-100 bg-white py-20 md:py-24"
        aria-labelledby="shop-books-heading"
      >
        <div className="container mx-auto max-w-content px-4">
          <div id="shop-books-intro" className="mx-auto max-w-2xl text-center">
            <AppHeadingSection id="shop-books-heading">Featured books</AppHeadingSection>
            <AppBodyMuted id="shop-books-description" className="mt-4 md:mt-6">
              Books and written resources designed to support discipleship, reflection, spiritual growth, and
              Kingdom-centered living.
            </AppBodyMuted>
          </div>

          <div id="shop-books-grid" className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                id={`shop-book-card-${i}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50/80 p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="w-full aspect-[2/3] overflow-hidden rounded-xl border border-gray-100 bg-white/60 mb-6 flex items-center justify-center transition-colors group-hover:border-gray-200">
                  <span className="text-gray-500/70">Book cover</span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-red-900">
                  Book Title {i}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  A short description that supports reflection and practice.
                </p>
                <div className="mt-4 text-base font-semibold text-gray-900">$19.99</div>
                <button className="mt-5 w-full rounded-full border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900">
                  View details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialSplitBlock
        sectionId="shop-merchandise-message"
        headingId="shop-merchandise-message-heading"
        bodyId="shop-merchandise-message-body"
        headline="More Than Merchandise"
        body="Every product is intended to support spiritual growth, communicate truth, and extend the ministry’s reach through resources people can read, wear, and share."
      />

      <section
        id="shop-apparel"
        className="border-b border-gray-100 bg-white py-20 md:py-24"
        aria-labelledby="shop-apparel-heading"
      >
        <div className="container mx-auto max-w-content px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <AppHeadingSection id="shop-apparel-heading">Wear the message</AppHeadingSection>
            <AppBodyMuted id="shop-apparel-description" className="mt-4 md:mt-6">
              Clothing designed to express faith, identity, and purpose — created to carry meaning, not just style.
            </AppBodyMuted>
          </div>

          <div
            id="shop-apparel-grid"
            className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
          >
            {/* Scaffolding ahead for appreal phase 2 */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                id={`shop-apparel-card-${i}`}
                className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6 text-left shadow-sm"
              >
                <div className="w-full aspect-square overflow-hidden rounded-xl border border-gray-100 bg-white/60 mb-5 flex items-center justify-center">
                  <span className="text-sm text-gray-500/80">Apparel coming soon</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Apparel Item {i}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Preview items will appear here as the collection is released.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section
        id="shop-collection-cta"
        className="border-b border-gray-100 bg-white py-20 text-center md:py-24"
        aria-labelledby="shop-collection-cta-heading"
      >
        <div className="container mx-auto max-w-2xl px-4">
          <AppHeadingSection id="shop-collection-cta-heading">Explore the collection</AppHeadingSection>
          <div id="shop-collection-cta-actions" className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/shop#books" variant="secondary" className="rounded-full">
              Browse books
            </Button>
            <Button href="/shop#apparel" variant="outline" className="rounded-full">
              Browse apparel
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
