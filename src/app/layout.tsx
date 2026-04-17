import type { Metadata } from "next";
import { Outfit, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "theWalk Ministries | A Journey of Transformation",
  description: "A Christ-centered journey of transformation, discipleship, and community.",
  icons: {
    icon: "/assets/logo/Email-Social-Logo.png",
    apple: "/assets/logo/Email-Social-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${robotoMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/assets/logo/Email-Social-Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo/Email-Social-Logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
          <Header />
          <main id="site-main" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
