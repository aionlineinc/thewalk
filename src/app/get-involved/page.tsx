import { Hero } from "@/components/ui/Hero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { Button } from "@/components/ui/Button";

export default function GetInvolved() {
  return (
    <>
      <Hero 
        headline="Get Involved" 
        subtext="There is a place for you to serve, support, and walk with us."
      />

      <section className="py-section bg-muted">
        <div className="container mx-auto px-4 max-w-[850px] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 border border-earth-100 rounded-lg shadow-sm flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-earth-900 mb-4">Serve</h3>
            <p className="text-muted-foreground leading-relaxed flex-1 mb-8">Grow spiritually through active service. Mentor others, teach, lead, support outreach initiatives, and help strengthen the Body of Christ.</p>
            <Button href="/contact?type=serve" variant="outline" className="w-full">I Want to Serve</Button>
          </div>
          <div className="bg-white p-10 border border-earth-100 rounded-lg shadow-sm flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-earth-900 mb-4">Support</h3>
            <p className="text-muted-foreground leading-relaxed flex-1 mb-8">Empower the mission through partnership, sponsorship, and giving. Help fund projects that rebuild lives, equip leaders, and strengthen faith journeys.</p>
            <Button href="/donations" variant="outline" className="w-full">I Want to Support</Button>
          </div>
          <div className="bg-white p-10 border border-earth-100 rounded-lg shadow-sm flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-earth-900 mb-4">Partner</h3>
            <p className="text-muted-foreground leading-relaxed flex-1 mb-8">Collaborate across churches, ministries, and organizations to expand reach, strengthen impact, and build the Body of Christ together.</p>
            <Button href="/contact?type=partner" variant="outline" className="w-full">I Want to Partner</Button>
          </div>
        </div>
      </section>

      <EditorialSplitBlock 
        headline="How We Sustain the Work" 
        reversed
        body="theWalk supports its mission through sustainable ventures, project-based donations, and transparent giving that clearly connects support to ministry impact." 
      />

      <section className="py-24 text-center bg-background border-t border-earth-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-earth-900 mb-8">Take Your Next Step</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?type=serve" variant="primary">I Want to Serve</Button>
            <Button href="/donations" variant="secondary">I Want to Support</Button>
          </div>
        </div>
      </section>
    </>
  );
}
