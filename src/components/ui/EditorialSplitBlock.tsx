type EditorialSplitBlockProps = {
  headline: string;
  body: string;
  reversed?: boolean;
};

const headlineClass =
  "text-3xl font-normal tracking-tight text-gray-900 md:text-4xl";
const bodyClass =
  "text-[15px] font-light leading-relaxed text-gray-500";

export function EditorialSplitBlock({
  headline,
  body,
  reversed = false,
}: EditorialSplitBlockProps) {
  if (reversed) {
    return (
      <section className="border-b border-gray-100 bg-white py-20 md:py-24">
        <div className="container mx-auto grid max-w-[850px] grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-12">
          <h2 className={`${headlineClass} md:order-2`}>{headline}</h2>
          <p className={`${bodyClass} md:order-1`}>{body}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-gray-100 bg-white py-20 md:py-24">
      <div className="container mx-auto max-w-[850px] px-4">
        <h2 className={headlineClass}>{headline}</h2>
        <p className={`mt-4 md:mt-6 ${bodyClass}`}>{body}</p>
      </div>
    </section>
  );
}
