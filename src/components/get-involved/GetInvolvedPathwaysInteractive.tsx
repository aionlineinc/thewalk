"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppLabel, AppInput, AppSubmitButton } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";

type ModalKey = "serve" | "support" | "partner" | null;

const stripePreset = (amount: 25 | 50 | 100 | 250) => {
  const envMap: Record<number, string | undefined> = {
    25: process.env.NEXT_PUBLIC_STRIPE_LINK_25,
    50: process.env.NEXT_PUBLIC_STRIPE_LINK_50,
    100: process.env.NEXT_PUBLIC_STRIPE_LINK_100,
    250: process.env.NEXT_PUBLIC_STRIPE_LINK_250,
  };
  return envMap[amount];
};

function ServeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Step Into Service">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const body = [...fd.entries()]
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
          window.location.href = `mailto:info@thewalk.org?subject=${encodeURIComponent("Serve — Get Involved")}&body=${encodeURIComponent(body)}`;
          onClose();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <AppLabel htmlFor="serve-first">First name</AppLabel>
            <AppInput id="serve-first" name="firstName" required autoComplete="given-name" />
          </div>
          <div>
            <AppLabel htmlFor="serve-last">Last name</AppLabel>
            <AppInput id="serve-last" name="lastName" required autoComplete="family-name" />
          </div>
        </div>
        <div>
          <AppLabel htmlFor="serve-email">Email</AppLabel>
          <AppInput id="serve-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <AppLabel htmlFor="serve-phone">Phone</AppLabel>
          <AppInput id="serve-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-earth-900">Ways I&apos;d like to serve</legend>
          <div className="flex flex-wrap gap-3 text-sm text-earth-800">
            {["Mentoring", "Teaching", "Outreach", "Admin / operations", "Youth", "Worship", "Other"].map(
              (label) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="checkbox" name="interests" value={label} className="app-check" />
                  {label}
                </label>
              ),
            )}
          </div>
        </fieldset>
        <div>
          <AppLabel htmlFor="serve-message">Tell us more</AppLabel>
          <textarea
            id="serve-message"
            name="message"
            rows={4}
            className="app-input min-h-[6rem] resize-y"
            placeholder="Skills, availability, questions…"
          />
        </div>
        <AppSubmitButton type="submit" variant="brand">
          Submit
        </AppSubmitButton>
      </form>
    </Modal>
  );
}

function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const amounts = [25, 50, 100, 250] as const;
  return (
    <Modal open={open} onClose={onClose} title="Support the Mission" size="lg">
      <p className="mb-6 text-sm font-light text-muted-foreground">
        Give online securely via Stripe when links are configured, or tell us how you&apos;d like to
        help with supplies and goods.
      </p>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-earth-900">Give online</h3>
        <div className="flex flex-wrap gap-3">
          {amounts.map((amt) => {
            const href = stripePreset(amt);
            const fallback = `/donations?amount=${amt}`;
            return (
              <Link
                key={amt}
                href={href || fallback}
                data-button-link
                className="inline-flex min-w-[5.5rem] justify-center rounded-full border border-earth-200 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition-colors hover:border-red-500/40 hover:bg-red-500/5"
              >
                ${amt}
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Set{" "}
          <code className="rounded bg-earth-100 px-1 py-0.5 text-[0.7rem]">
            NEXT_PUBLIC_STRIPE_LINK_25
          </code>{" "}
          (and 50, 100, 250) to your Stripe Payment Links for one-tap giving. Until then, amounts open
          the donations page.
        </p>
      </div>

      <div className="mb-6 border-t border-earth-100 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-earth-900">Custom amount</h3>
        <Link
          href="/donations"
          data-button-link
          className="inline-flex rounded-full bg-red-soft px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-soft-hover"
        >
          Open giving page
        </Link>
      </div>

      <div className="border-t border-earth-100 pt-6">
        <h3 className="mb-2 text-sm font-semibold text-earth-900">Other ways to give</h3>
        <p className="mb-4 text-sm font-light text-muted-foreground">
          Food, clothing, supplies, or in-kind gifts — tell us what you have in mind.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const body = [...fd.entries()]
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n");
            window.location.href = `mailto:info@thewalk.org?subject=${encodeURIComponent("In-kind / supplies — Support")}&body=${encodeURIComponent(body)}`;
            onClose();
          }}
        >
          <div>
            <AppLabel htmlFor="inkind-name">Your name</AppLabel>
            <AppInput id="inkind-name" name="name" required />
          </div>
          <div>
            <AppLabel htmlFor="inkind-email">Email</AppLabel>
            <AppInput id="inkind-email" name="email" type="email" required />
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-earth-900">I can contribute</legend>
            <div className="flex flex-wrap gap-3 text-sm">
              {["Food", "Clothing", "Supplies", "Other"].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="checkbox" name="inkind" value={label} className="app-check" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <AppLabel htmlFor="inkind-details">Details</AppLabel>
            <textarea
              id="inkind-details"
              name="details"
              rows={3}
              className="app-input min-h-[5rem] resize-y"
              placeholder="Sizes, quantities, pickup, timing…"
            />
          </div>
          <AppSubmitButton type="submit" variant="brand">
            Send details
          </AppSubmitButton>
        </form>
      </div>
    </Modal>
  );
}

function PartnerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Become a Partner" size="lg">
      <p className="mb-4 text-sm font-light text-muted-foreground">
        Ministries and organizations aligned with theWalk can explore collaboration, events, and
        shared impact.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const body = [...fd.entries()]
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
          window.location.href = `mailto:info@thewalk.org?subject=${encodeURIComponent("Partnership inquiry — theWalk")}&body=${encodeURIComponent(body)}`;
          onClose();
        }}
      >
        <div>
          <AppLabel htmlFor="partner-org">Organization / ministry name</AppLabel>
          <AppInput id="partner-org" name="organization" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <AppLabel htmlFor="partner-contact">Primary contact name</AppLabel>
            <AppInput id="partner-contact" name="contactName" required />
          </div>
          <div>
            <AppLabel htmlFor="partner-role">Role / title</AppLabel>
            <AppInput id="partner-role" name="role" />
          </div>
        </div>
        <div>
          <AppLabel htmlFor="partner-email">Email</AppLabel>
          <AppInput id="partner-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <AppLabel htmlFor="partner-phone">Phone</AppLabel>
          <AppInput id="partner-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <AppLabel htmlFor="partner-site">Website</AppLabel>
          <AppInput id="partner-site" name="website" type="url" placeholder="https://" />
        </div>
        <div>
          <AppLabel htmlFor="partner-type">Organization type</AppLabel>
          <select id="partner-type" name="orgType" className="app-input">
            <option value="">Select…</option>
            <option value="church">Local church</option>
            <option value="ministry">Ministry / nonprofit</option>
            <option value="network">Network / denomination</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <AppLabel htmlFor="partner-vision">How would you like to partner?</AppLabel>
          <textarea
            id="partner-vision"
            name="vision"
            rows={4}
            className="app-input min-h-[7rem] resize-y"
            placeholder="Outcomes you’re hoping for, timing, ideas…"
            required
          />
        </div>
        <AppSubmitButton type="submit" variant="brand">
          Submit inquiry
        </AppSubmitButton>
      </form>
    </Modal>
  );
}

export function GetInvolvedPathwaysInteractive() {
  const [open, setOpen] = useState<ModalKey>(null);

  return (
    <>
      <section
        id="get-involved-pathways"
        className="border-t border-earth-100 bg-white px-4 py-20 md:py-28"
        aria-labelledby="get-involved-pathways-heading"
      >
        <div className="mx-auto grid max-w-content-wide grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              id="get-involved-pathways-heading"
              className="font-sans text-3xl font-semibold tracking-tight text-earth-900 md:text-4xl lg:text-5xl"
            >
              Find Your Place in the Walk
            </h2>
            <div className="mt-12 space-y-12">
              <div>
                <h3 className="text-xl font-semibold text-earth-900 md:text-2xl">Serve</h3>
                <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Step into active service—mentor, lead, support outreach, and help build what God is
                  doing.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setOpen("serve")}
                    className="app-pill-outline-earth"
                  >
                    Step Into Service
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-earth-900 md:text-2xl">Support</h3>
                <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Fuel the mission—your giving builds, equips, and expands the reach of the work.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setOpen("support")}
                    className="app-pill-outline-earth"
                  >
                    Support the Mission
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-earth-900 md:text-2xl">Partner</h3>
                <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Collaborate with ministries and organizations to strengthen and multiply impact.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setOpen("partner")}
                    className="app-pill-outline-earth"
                  >
                    Become a Partner
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-earth-100 shadow-lg lg:aspect-[5/4]">
            <Image
              src="/assets/hero/hero-bokeh-forest.png"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1a0f12]/40 to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </section>

      <ServeModal open={open === "serve"} onClose={() => setOpen(null)} />
      <SupportModal open={open === "support"} onClose={() => setOpen(null)} />
      <PartnerModal open={open === "partner"} onClose={() => setOpen(null)} />
    </>
  );
}
