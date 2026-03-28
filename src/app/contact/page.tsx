import { Hero } from "@/components/ui/Hero";

export default function Contact() {
  return (
    <>
      <Hero 
        headline="Contact Us" 
        subtext="We would love to hear from you and help you take the next step."
      />

      <section className="py-section bg-muted">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-earth-900 mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-12">
              <p className="text-lg text-muted-foreground"><strong className="text-earth-900">Phone:</strong> +1 246 850 8475</p>
              <p className="text-lg text-muted-foreground"><strong className="text-earth-900">Email:</strong> info@thewalk.org</p>
              <p className="text-lg text-muted-foreground"><strong className="text-earth-900">Website:</strong> https://thewalk.org</p>
            </div>
            
            <h3 className="text-xl font-bold text-earth-900 mb-4">How Can We Help?</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {['General Inquiry', 'Prayer', 'Ministry Connection', 'Serve', 'Volunteer', 'Support', 'Giving', 'Partnership'].map(t => (
                <span key={t} className="px-4 py-2 bg-white border border-earth-100 rounded-full text-earth-500">{t}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 border border-earth-100 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-earth-900 mb-2">Send a Message</h3>
            <p className="text-muted-foreground mb-6">Use the form below to reach out and someone from theWalk will respond.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Subject</label>
                <select className="w-full px-4 py-2 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none">
                  <option>General Inquiry</option>
                  <option>Serve / Volunteer</option>
                  <option>Partnership</option>
                  <option>Prayer Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-earth-900 text-white font-medium py-3 rounded hover:bg-earth-500 transition-colors cursor-pointer">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24 text-center bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-earth-900 mb-4">Walk With Us</h2>
          <p className="text-lg text-muted-foreground">Whether you are seeking guidance, connection, or a way to serve, there is a place for you here.</p>
        </div>
      </section>
    </>
  );
}
