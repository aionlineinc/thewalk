"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Hero } from "@/components/ui/Hero";
import { AppInput, AppLabel, AppSubmitButton } from "@/components/ui/FormField";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <>
      <Hero
        sectionId="register-hero"
        titleId="register-hero-title"
        subtextId="register-hero-description"
        headline="Join theWalk online"
        subtext="Create an account to access member-only community and track your journey."
      />
      <section
        id="register-content"
        className="border-b border-gray-100 bg-muted py-16 md:py-24"
        aria-label="Account access"
      >
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-xl border border-earth-100 bg-white p-8 shadow-lg">
            <h2 className="app-heading-block mb-6 text-center font-bold">Create account</h2>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setPending(true);

                const formData = new FormData(e.currentTarget);
                const name = String(formData.get("name") ?? "");
                const email = String(formData.get("email") ?? "");
                const password = String(formData.get("password") ?? "");

                const res = await fetch("/api/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, password }),
                });

                if (!res.ok) {
                  setPending(false);
                  const data = (await res.json().catch(() => null)) as any;
                  setError(data?.error ?? "Signup failed.");
                  return;
                }

                const signInRes = await signIn("credentials", {
                  email,
                  password,
                  callbackUrl: "/admin",
                  redirect: false,
                });

                setPending(false);
                if (!signInRes || signInRes.error) {
                  setError("Account created, but sign-in failed. Please try signing in.");
                  return;
                }
                window.location.href = signInRes.url ?? "/admin";
              }}
            >
              <div>
                <AppLabel htmlFor="register-name">Name (optional)</AppLabel>
                <AppInput id="register-name" name="name" placeholder="Your name" autoComplete="name" />
              </div>
              <div>
                <AppLabel htmlFor="register-email">Email Address</AppLabel>
                <AppInput
                  id="register-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <AppLabel htmlFor="register-password">Password</AppLabel>
                <AppInput
                  id="register-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-900">
                  {error}
                </p>
              ) : null}

              <AppSubmitButton type="submit" className="mt-2" disabled={pending}>
                {pending ? "Creating…" : "Create account"}
              </AppSubmitButton>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="app-link font-medium">
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="app-link">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
