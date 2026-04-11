import { AppLabel, AppInput, AppSubmitButton } from "@/components/ui/FormField";
import { Hero } from "@/components/ui/Hero";
import {
  AppBody,
  AppHeadingCard,
  AppHeadingEarthSection,
  AppHeadingSub,
} from "@/components/ui/Typography";

export default function Contact() {
  return (
    <>
      <Hero
        sectionId="contact-hero"
        titleId="contact-hero-title"
        subtextId="contact-hero-description"
        headline="Contact Us"
        subtext="We would love to hear from you and help you take the next step."
      />

      <section
        id="contact-main"
        className="bg-muted py-20 md:py-28"
        aria-labelledby="contact-get-in-touch-heading"
      >
        <div className="container mx-auto grid max-w-content-wide grid-cols-1 gap-12 px-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 lg:gap-16">
          <div id="contact-details" className="md:pt-1">
            <AppHeadingEarthSection id="contact-get-in-touch-heading" className="mb-8 md:mb-10">
              Get in Touch
            </AppHeadingEarthSection>
            <div id="contact-info" className="mb-12 space-y-3 md:mb-14">
              <AppBody>
                <strong className="font-medium text-earth-900">Phone:</strong> +1 246 285-5798
              </AppBody>
              <AppBody>
                <strong className="font-medium text-earth-900">Email:</strong> info@thewalk.org
              </AppBody>
              <AppBody>
                <strong className="font-medium text-earth-900">Website:</strong> https://thewalk.org
              </AppBody>
            </div>

            <AppHeadingSub id="contact-topics-heading" className="mb-5">
              How Can We Help?
            </AppHeadingSub>
            <div id="contact-topic-tags" className="flex flex-wrap gap-2.5 text-sm">
              {[
                "General Inquiry",
                "Prayer",
                "Ministry Connection",
                "Serve",
                "Volunteer",
                "Support",
                "Giving",
                "Partnership",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-earth-100 bg-white px-4 py-2 text-earth-500"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            id="contact-form-card"
            className="rounded-2xl border border-earth-100 bg-white p-8 shadow-sm md:p-10 md:pt-11"
          >
            <AppHeadingCard id="contact-form-heading" className="mb-3">
              Send a Message
            </AppHeadingCard>
            <p id="contact-form-description" className="app-body mb-8">
              Use the form below to reach out and someone from theWalk will respond.
            </p>

            <form id="contact-form" className="space-y-5">
              <div>
                <AppLabel htmlFor="contact-name">Name</AppLabel>
                <AppInput id="contact-name" type="text" name="name" placeholder="Your Name" />
              </div>
              <div>
                <AppLabel htmlFor="contact-email">Email</AppLabel>
                <AppInput
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <AppLabel htmlFor="contact-subject">Subject</AppLabel>
                <select id="contact-subject" name="subject" className="app-input">
                  <option>General Inquiry</option>
                  <option>Serve / Volunteer</option>
                  <option>Partnership</option>
                  <option>Prayer Request</option>
                </select>
              </div>
              <div>
                <AppLabel htmlFor="contact-message">Message</AppLabel>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  className="app-input min-h-[7.5rem] resize-y"
                  placeholder="How can we help?"
                />
              </div>
              <AppSubmitButton type="button" variant="brand">
                Send Message
              </AppSubmitButton>
            </form>
          </div>
        </div>
      </section>

      <section
        id="contact-closing"
        className="bg-background py-20 text-center md:py-28"
        aria-labelledby="contact-closing-heading"
      >
        <div className="container mx-auto max-w-2xl px-4">
          <AppHeadingEarthSection id="contact-closing-heading" className="mb-5 md:mb-6">
            Walk With Us
          </AppHeadingEarthSection>
          <AppBody id="contact-closing-body" className="text-base md:text-lg">
            Whether you are seeking guidance, connection, or a way to serve, there is a place for you
            here.
          </AppBody>
        </div>
      </section>
    </>
  );
}
