import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";
import { UnderConstructionBanner } from "@/components/under-construction-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MyVote — Understand More. Decide Better.",
  description:
    "See both sides. Stay informed. Live local. Start with the facts, then get the opinions.",
  generator: "v0.app",
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
            <UnderConstructionBanner />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </AuthProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
