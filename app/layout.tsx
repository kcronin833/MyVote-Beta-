import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyVote — Understand More. Decide Better.",
  description: "See both sides. Stay informed. Live local. Start with the facts, then get the opinions.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
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
