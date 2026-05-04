import type { Metadata } from "next";
import "./globals.css";

const ilmBase =
  process.env.NEXT_PUBLIC_ILM_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: ilmBase ? new URL(ilmBase) : undefined,
  title: "inLovingMemory",
  description: "More than a memorial — a living legacy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
