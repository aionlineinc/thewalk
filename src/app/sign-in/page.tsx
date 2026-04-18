import { Suspense } from "react";

import { AuthPageBackground } from "@/components/cms/AuthPageBackground";
import { findSection, getPage } from "@/lib/cms";

import { SignInClient } from "./SignInClient";

export default async function SignIn() {
  const page = await getPage("sign-in");
  const heroSection = findSection(page?.sections, "section_hero");

  return (
    <main
      id="sign-in-main"
      className="relative min-h-[calc(100dvh-35px)] pt-[35px]"
      aria-labelledby="sign-in-form-heading"
    >
      <AuthPageBackground section={heroSection} />

      <div className="mx-auto flex min-h-[calc(100dvh-35px)] w-full max-w-6xl items-center justify-center px-4 py-10">
        <Suspense
          fallback={
            <div className="w-full max-w-[520px] rounded-2xl bg-white px-10 py-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]">
              <p className="text-sm font-semibold tracking-tight text-earth-900">theWalk</p>
              <h1 id="sign-in-form-heading" className="mt-8 text-4xl font-semibold tracking-tight text-earth-900">
                Welcome back
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
            </div>
          }
        >
          <SignInClient />
        </Suspense>
      </div>
    </main>
  );
}
