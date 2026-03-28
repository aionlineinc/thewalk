import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-section">
      <h1 className="text-3xl font-semibold tracking-tight text-earth-900">Terms of use</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Terms governing use of this site and our services will be published here. For questions, reach out through{" "}
        <Link href="/contact" className="font-medium text-red-500 hover:text-red-900 underline-offset-4 hover:underline">
          contact
        </Link>
        .
      </p>
    </div>
  );
}
