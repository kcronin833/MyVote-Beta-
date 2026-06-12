import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { GlobalNav } from "@/components/global-nav";
import { SupportBanner } from "@/components/support-banner";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Source Serif 4 — editorial display type (story headlines, hero copy, big
// quotes). Weight 500 with tight tracking is the canonical display style;
// italics carry emphasis. Wired to --font-serif / Tailwind's `font-serif`.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MyVote — Georgia's 2026 Ballot Guide",
    template: "%s · MyVote",
  },
  description:
    "Georgia's free, non-partisan 2026 voter guide. Enter your ZIP to see your complete ballot — governor, U.S. Senate, and local races — with candidates from left, right, and center.",
  keywords: ["Georgia election 2026", "Georgia ballot", "Georgia voter guide", "Georgia governor 2026", "Jon Ossoff", "non-partisan news"],
  openGraph: {
    type: "website",
    siteName: "MyVote",
    title: "MyVote — Georgia's 2026 Ballot Guide",
    description:
      "Free, non-partisan voter guide for Georgia. See your complete 2026 ballot and read political news from every perspective.",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MyVote — Georgia's Free 2026 Ballot Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyVote — Georgia's 2026 Ballot Guide",
    description:
      "Free, non-partisan voter guide for Georgia. See your complete 2026 ballot and read political news from every perspective.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "FLUdzyP1ja8z-jrZ-G5U-PqzuSvTxh0_VKVm6R_j8TU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans flex flex-col min-h-screen bg-page text-ink-900">
        {/* Skip-nav — visible only on keyboard focus */}
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <PostHogProvider>
          <AuthProvider>
            {/* Persistent top nav — hidden on landing, auth, quiz (see GlobalNav) */}
            <GlobalNav />
            {/* pb-14 on mobile so content scrolls clear of the fixed bottom nav */}
            <div id="main-content" className="flex-1 pb-14 lg:pb-0">{children}</div>
            {/* Sponsor card — bottom of page, all viewports. Deliberately NOT
                at the top: a commercial banner in the trust position made the
                site look hijacked (see usability audit, June 2026). */}
            <SupportBanner />
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
