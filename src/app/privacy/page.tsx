import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-section">
      <h1 className="text-3xl font-semibold tracking-tight text-earth-900">Privacy policy</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        We are committed to GDPR-aligned practices and minimizing personal data. This page will be expanded with
        full policy details. For questions, contact us via the{" "}
        <Link href="/contact" className="font-medium text-red-500 hover:text-red-900 underline-offset-4 hover:underline">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
