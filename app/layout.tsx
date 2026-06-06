import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";
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
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </AuthProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
