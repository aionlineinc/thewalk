"use client";

import Link from "next/link";
import { useState } from "react";

export function RegisterGroupClient() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  if (done) {
    return (
      <section
        id="group-register-card"
        className="w-full max-w-[520px] rounded-2xl bg-white px-10 py-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]"
      >
        <p className="text-sm font-semibold tracking-tight text-earth-900">theWalk</p>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-earth-900">Request received</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thank you. Our team will review your ministry or group details and follow up by email. You can also{" "}
          <Link href="/sign-in" className="font-medium text-earth-900 underline underline-offset-4">
            sign in
          </Link>{" "}
          if you already have an account.
        </p>
        <p className="mt-8 text-sm text-earth-700">
          <Link href="/" className="font-medium text-earth-900 underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section
      id="group-register-card"
      className="w-full max-w-[520px] rounded-2xl bg-white px-10 py-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold tracking-tight text-earth-900">theWalk</p>
        <span className="rounded-full bg-admin-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-admin-accent">
          Ministry
        </span>
      </div>

      <h1 id="group-register-heading" className="mt-8 text-4xl font-semibold tracking-tight text-earth-900">
        Register your group
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For ministries and partner organizations. Individual accounts can{" "}
        <Link href="/register" className="font-medium text-earth-900 underline underline-offset-4">
          create an account here
        </Link>
        .
      </p>

      <form
        id="group-register-form"
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setPending(true);
          const form = e.currentTarget;
          const formData = new FormData(form);
          const body = {
            organizationName: String(formData.get("organizationName") ?? ""),
            desiredSlug: String(formData.get("desiredSlug") ?? ""),
            contactName: String(formData.get("contactName") ?? ""),
            contactEmail: String(formData.get("contactEmail") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            notes: String(formData.get("notes") ?? ""),
          };

          const res = await fetch("/api/groups/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          setPending(false);
          if (!res.ok) {
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? "Something went wrong.");
            return;
          }
          setDone(true);
          form.reset();
        }}
      >
        <div>
          <label htmlFor="grp-name" className="block text-xs font-medium text-earth-700">
            Group or ministry name
          </label>
          <input
            id="grp-name"
            name="organizationName"
            required
            minLength={2}
            placeholder="Example Community Church"
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="grp-slug" className="block text-xs font-medium text-earth-700">
            Preferred URL slug <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="grp-slug"
            name="desiredSlug"
            pattern="[a-z0-9-]*"
            title="Lowercase letters, numbers, and dashes only"
            placeholder="example-ministry"
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="grp-contact" className="block text-xs font-medium text-earth-700">
            Primary contact name
          </label>
          <input
            id="grp-contact"
            name="contactName"
            required
            minLength={2}
            placeholder="Full name"
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="grp-email" className="block text-xs font-medium text-earth-700">
            Contact email
          </label>
          <input
            id="grp-email"
            type="email"
            name="contactEmail"
            required
            autoComplete="email"
            placeholder="leader@example.org"
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="grp-phone" className="block text-xs font-medium text-earth-700">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="grp-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="grp-notes" className="block text-xs font-medium text-earth-700">
            Notes for our team
          </label>
          <textarea
            id="grp-notes"
            name="notes"
            rows={4}
            maxLength={4000}
            placeholder="City, approximate size, how you hope to use theWalk…"
            className="mt-2 w-full resize-y rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-900">{error}</p>
        ) : null}

        <button type="submit" disabled={pending} className="admin-btn-primary mt-2 w-full py-3.5">
          {pending ? "Submitting…" : "Submit request"}
        </button>
      </form>

      <div className="mt-10 text-xs text-muted-foreground">
        <Link href="/privacy" className="underline underline-offset-4 hover:text-earth-900">
          Privacy Policy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="underline underline-offset-4 hover:text-earth-900">
          Terms of Service
        </Link>
      </div>
    </section>
  );
}
