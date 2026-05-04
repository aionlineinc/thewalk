import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { IlmHeader } from "@/components/ilm-header";
import { SessionProvider } from "@/components/session-provider";
import { authOptions } from "@/lib/auth";
import "./globals.css";

const ilmBase =
  process.env.NEXT_PUBLIC_ILM_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: ilmBase ? new URL(ilmBase) : undefined,
  title: "inLovingMemory",
  description: "More than a memorial — a living legacy",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SessionProvider session={session}>
          <IlmHeader session={session} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
