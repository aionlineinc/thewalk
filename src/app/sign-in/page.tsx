import Link from "next/link";
import { AppCheckbox, AppInput, AppLabel, AppSubmitButton } from "@/components/ui/FormField";
import { Hero } from "@/components/ui/Hero";

export default function SignIn() {
  return (
    <>
      <Hero
        sectionId="sign-in-hero"
        titleId="sign-in-hero-title"
        subtextId="sign-in-hero-description"
        headline="Welcome Back"
        subtext="Sign in to your account to manage your journey, access MyWalk, and track support."
      />

      <section
        id="sign-in-main"
        className="flex min-h-[50vh] items-center justify-center bg-muted py-section"
        aria-labelledby="sign-in-form-heading"
      >
        <div className="container mx-auto max-w-md px-4">
          <div
            id="sign-in-card"
            className="rounded-xl border border-earth-100 bg-white p-8 shadow-lg"
          >
            <h2
              id="sign-in-form-heading"
              className="app-heading-block mb-6 text-center font-bold"
            >
              Sign In
            </h2>

            <form id="sign-in-form" className="space-y-4">
              <div>
                <AppLabel htmlFor="sign-in-email">Email Address</AppLabel>
                <AppInput
                  id="sign-in-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <AppLabel htmlFor="sign-in-password">Password</AppLabel>
                <AppInput
                  id="sign-in-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center text-muted-foreground">
                  <AppCheckbox />
                  Remember me
                </label>
                <Link href="#" className="app-link">
                  Forgot password?
                </Link>
              </div>

              <AppSubmitButton type="button" className="mt-6">
                Sign In
              </AppSubmitButton>
            </form>

            <div
              id="sign-in-register-prompt"
              className="mt-8 border-t border-earth-100 pt-6 text-center text-sm text-muted-foreground"
            >
              Don&apos;t have an account?{" "}
              <Link href="/register" className="app-link font-medium">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
