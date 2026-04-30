import { Hero } from "@/components/ui/Hero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { Button } from "@/components/ui/Button";
import { AppBodyMuted, AppHeadingSection } from "@/components/ui/Typography";
import Image from "next/image";

import { cmsAssetPresets } from "@/lib/cms/assets";
import { listShopProducts } from "@/lib/shop";
import { CheckoutButton } from "@/components/shop/CheckoutButton";

export default async function Shop() {
  const products = await listShopProducts();

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

          <ul
            id="shop-books-grid"
            className="m-0 mt-14 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.length === 0 ? (
              <li className="rounded-2xl border border-gray-100 bg-gray-50/80 p-8 text-left">
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">Shop is being prepared</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Products will appear here once they’re published in Directus.
                </p>
              </li>
            ) : null}

            {products.map((p) => {
              const imageUrl = cmsAssetPresets.card(p.image ?? null);
              const category = p.category?.trim() || "Product";
              const priceLabel = p.price_label?.trim();

              return (
                <li key={String(p.id)} id={`shop-product-${String(p.id)}`}>
                  <div className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/[0.06] shadow-sm md:p-5">
                    <div className="relative aspect-[4/3] w-full isolate overflow-hidden rounded-2xl bg-neutral-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          className="rounded-2xl object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm text-gray-500/80">Image coming soon</span>
                        </div>
                      )}
                    </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-700">
                        {category}
                      </span>
                      {priceLabel ? (
                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-700">
                          {priceLabel}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-xl font-medium tracking-tight text-gray-900">{p.title}</h3>
                    {p.summary ? (
                      <p className="mt-2 flex-1 text-[15px] font-light leading-relaxed text-gray-500">{p.summary}</p>
                    ) : null}
                    <div className="mt-8">
                      <CheckoutButton priceId={p.stripe_price_id} label="Buy" />
                    </div>
                  </div>
                </div>
              </li>
              );
            })}
          </ul>
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
