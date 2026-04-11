import { AppHeadingHero, AppLead } from "@/components/ui/Typography";

type HeroProps = {
  headline: string;
  subtext?: string;
  sectionId?: string;
  titleId?: string;
  subtextId?: string;
};

export function Hero({
  headline,
  subtext,
  sectionId,
  titleId,
  subtextId,
}: HeroProps) {
  return (
    <section
      id={sectionId}
      className="border-b border-gray-100 bg-white pb-20 pt-32 md:pb-24 md:pt-40"
      aria-labelledby={titleId}
    >
      <div className="container mx-auto max-w-content px-4 text-center">
        <AppHeadingHero id={titleId} className="mb-4">
          {headline}
        </AppHeadingHero>
        {subtext ? <AppLead id={subtextId}>{subtext}</AppLead> : null}
      </div>
    </section>
  );
}
