type EditorialSplitBlockProps = {
  headline: string;
  body: string;
  reversed?: boolean;
};

export function EditorialSplitBlock({
  headline,
  body,
  reversed = false,
}: EditorialSplitBlockProps) {
  return (
    <section className="border-b border-gray-100 bg-white py-20 md:py-24">
      <div
        className={`container mx-auto grid max-w-[850px] grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-12 ${
          reversed ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
        }`}
      >
        <h2 className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
          {headline}
        </h2>
        <p className="text-base font-light leading-relaxed text-gray-500 md:text-lg">
          {body}
        </p>
      </div>
    </section>
  );
}
