import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
