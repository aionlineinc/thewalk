import { AuthPageBackground } from "@/components/cms/AuthPageBackground";
import { findSection, getPage } from "@/lib/cms";

import { RegisterGroupClient } from "./RegisterGroupClient";

export const metadata = {
  title: "Register a group | theWalk",
  description: "Request onboarding for your ministry or organization.",
};

export default async function RegisterGroupPage() {
  const page = await getPage("register-group");
  const heroSection = findSection(page?.sections, "section_hero");

  return (
    <main
      id="group-register-main"
      className="relative min-h-[calc(100dvh-35px)] pt-[35px]"
      aria-labelledby="group-register-heading"
    >
      <AuthPageBackground section={heroSection} />

      <div className="mx-auto flex min-h-[calc(100dvh-35px)] w-full max-w-6xl items-center justify-center px-4 py-10">
        <RegisterGroupClient />
      </div>
    </main>
  );
}
