import type { Metadata } from "next";
import { IlmHeader } from "@/components/ilm-header";
import { IlmFooter } from "@/components/ilm-footer";
import { SessionProvider } from "@/components/session-provider";
import { getIlmSession } from "@/lib/auth";
import "./globals.css";

const ilmBase =
  process.env.NEXT_PUBLIC_ILM_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: ilmBase ? new URL(ilmBase) : undefined,
  title: {
    default: "inLovingMemory",
    template: "%s · inLovingMemory",
  },
  description: "More than a memorial — a living legacy",
  openGraph: {
    title: "inLovingMemory",
    description: "More than a memorial — a living legacy",
    type: "website",
    url: ilmBase,
    siteName: "inLovingMemory",
  },
  twitter: {
    card: "summary_large_image",
    title: "inLovingMemory",
    description: "More than a memorial — a living legacy",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getIlmSession();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SessionProvider session={session}>
          <IlmHeader session={session} />
          <div className="min-h-[calc(100vh-64px)]">{children}</div>
          <IlmFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
