import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyVote - Balanced Political News",
  description: "Read political news from all perspectives and engage with your community",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          <AuthProvider>{children}</AuthProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
