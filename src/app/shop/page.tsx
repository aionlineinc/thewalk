import { Hero } from "@/components/ui/Hero";
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { Button } from "@/components/ui/Button";

export default function Shop() {
  return (
    <>
      <Hero 
        headline="Shop theWalk" 
        subtext="Books, resources, and ministry-inspired products designed to support faith, growth, and impact."
      />

      <section className="py-section bg-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-earth-900 mb-4">Featured Books</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore books and written resources that support discipleship, reflection, spiritual growth, and Kingdom-centered living.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 border border-earth-100 rounded shadow-sm text-center group flex flex-col h-full">
                <div className="w-full aspect-[2/3] bg-muted mb-6 flex items-center justify-center border border-earth-100 group-hover:border-earth-500 transition-colors cursor-pointer">
                  <span className="text-muted-foreground opacity-50">Book Cover</span>
                </div>
                <h3 className="font-bold text-earth-900 mb-2 cursor-pointer group-hover:text-blue-500 transition-colors">Book Title {i}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-4">Short reflection description that fits here.</p>
                <div className="font-bold text-lg text-earth-900 mb-4">$19.99</div>
                <button className="w-full border border-earth-900 text-earth-900 py-2 rounded hover:bg-earth-100 transition-colors cursor-pointer">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialSplitBlock 
        headline="More Than Merchandise" 
        body="Every product is intended to support spiritual growth, communicate truth, and extend the ministry’s reach through resources people can read, wear, and share." 
      />

      <section className="py-section bg-muted">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-earth-900 mb-4">Wear the Message</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">Explore clothing designed to express faith, identity, and purpose. Each piece is created to carry meaning — not just style.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all">
            {/* Scaffolding ahead for appreal phase 2 */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 border border-earth-100 rounded shadow-sm">
                <div className="w-full aspect-square bg-muted mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Apparel Coming Soon</span>
                </div>
                <h3 className="font-semibold text-earth-900">Apparel Item {i}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 text-center bg-background border-t border-earth-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-earth-900 mb-8">Explore the Collection</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/shop#books" variant="primary">Browse Books</Button>
            <Button href="/shop#apparel" variant="outline">Browse Apparel</Button>
          </div>
        </div>
      </section>
    </>
  );
}
