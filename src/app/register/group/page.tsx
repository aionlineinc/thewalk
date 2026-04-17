import { RegisterGroupClient } from "./RegisterGroupClient";

export const metadata = {
  title: "Register a group | theWalk",
  description: "Request onboarding for your ministry or organization.",
};

export default function RegisterGroupPage() {
  return (
    <main
      id="group-register-main"
      className="relative min-h-[calc(100dvh-35px)] pt-[35px]"
      aria-labelledby="group-register-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/15 backdrop-blur-[2px]" />

      <div className="mx-auto flex min-h-[calc(100dvh-35px)] w-full max-w-6xl items-center justify-center px-4 py-10">
        <RegisterGroupClient />
      </div>
    </main>
  );
}
