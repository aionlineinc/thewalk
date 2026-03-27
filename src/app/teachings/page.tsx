import { Hero } from "@/components/ui/Hero";

export default function Teachings() {
  return (
    <>
      <Hero 
        headline="Teachings" 
        subtext="Resources to strengthen your walk, deepen understanding, and support transformation."
      />

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-earth-900 text-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-lg">
            <div className="w-full md:w-1/2 aspect-video bg-earth-500 relative flex items-center justify-center">
              <span className="text-earth-100 opacity-50">Video Placeholder</span>
            </div>
            <div className="p-10 md:w-1/2 flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-100 mb-2">Featured Series</span>
              <h2 className="text-3xl font-bold mb-4">The Book of Exodus</h2>
              <p className="text-earth-100 opacity-80 mb-8">Highlight a message, study, or series that reflects theWalk’s core themes of discipleship, truth, and spiritual growth.</p>
              <div>
                <button className="bg-white text-earth-900 px-6 py-3 font-semibold rounded hover:bg-earth-100 transition-colors cursor-pointer">Watch Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-earth-100 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-earth-900 mb-2">Explore More</h2>
              <p className="text-muted-foreground">Browse messages, studies, and resources designed to guide, strengthen, and equip believers.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {['Discipleship', 'Identity', 'Prayer', 'Deliverance', 'Community', 'Purpose'].map(topic => (
                <span key={topic} className="px-4 py-1.5 bg-muted border border-earth-100 rounded-full text-sm text-earth-500 cursor-pointer hover:bg-earth-100 transition-colors">{topic}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-muted border border-earth-100 rounded-lg mb-4 flex items-center justify-center group-hover:border-earth-500 transition-colors">
                  <span className="text-muted-foreground opacity-50">Thumbnail {i}</span>
                </div>
                <h3 className="font-bold text-earth-900 mb-1 group-hover:text-blue-500 transition-colors">Teaching Title {i}</h3>
                <p className="text-sm text-muted-foreground">Speaker Name &middot; Date</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button className="px-6 py-3 border border-earth-900 text-earth-900 font-semibold rounded hover:bg-earth-100 transition-colors cursor-pointer">Load More</button>
          </div>
        </div>
      </section>
    </>
  );
}
