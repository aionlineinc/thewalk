import Link from "next/link";

export const metadata = {
  title: "Payment cancelled · inLovingMemory",
  description: "Your payment was cancelled.",
};

export default function PricingCancelPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-earth-100">
          <span className="text-3xl text-earth-400">—</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-earth-900">Payment cancelled</h1>
        <p className="mt-3 text-earth-600">
          No charges were made. You can come back anytime to upgrade your plan.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-calm-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-calm-600"
          >
            Back to pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-earth-200 bg-white px-6 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
