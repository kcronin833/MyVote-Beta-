import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "MyVote — Understand More. Decide Better.",
  description:
    "See both sides. Stay informed. Live local. Start with the facts, then get the opinions.",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans flex flex-col min-h-screen bg-page text-ink-900">
        <PostHogProvider>
          <AuthProvider>
            {/* pb-14 on mobile so content scrolls clear of the fixed bottom nav */}
            <div className="flex-1 pb-14 lg:pb-0">{children}</div>
            {/* Footer is redundant on mobile — MobileNav covers those links */}
            <div className="hidden lg:block">
              <SiteFooter />
            </div>
            <MobileNav />
          </AuthProvider>
        </PostHogProvider>
        <Analytics />
        {/* Google AdSense — only injected when publisher ID is configured */}
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
