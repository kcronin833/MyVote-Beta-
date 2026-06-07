import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "National News Across the Political Spectrum · MyVote",
  description:
    "Read the same national political story from left-leaning, centrist, and right-leaning news sources side by side. See every perspective without the bubble.",
  alternates: { canonical: "/news/spectrum" },
  openGraph: {
    title: "National News — Every Perspective · MyVote",
    description:
      "The same story, every perspective. Left, center, and right news sources side by side.",
    type: "website",
  },
};

export default function SpectrumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
