type HeroProps = {
  headline: string;
  subtext?: string;
};

export function Hero({ headline, subtext }: HeroProps) {
  return (
    <section className="border-b border-gray-100 bg-white py-20 md:py-24">
      <div className="container mx-auto max-w-[850px] px-4 text-center">
        <h1 className="mb-4 text-4xl font-medium tracking-tight text-gray-900 md:text-5xl">
          {headline}
        </h1>
        {subtext ? (
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-gray-500 md:text-lg">
            {subtext}
          </p>
        ) : null}
      </div>
    </section>
  );
}
