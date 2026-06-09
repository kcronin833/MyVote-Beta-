import type { Metadata } from "next";
import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";

export const metadata: Metadata = {
  title: "National News · MyVote",
  description:
    "AI-curated national political news — factual, sourced, and free of spin. See what's happening across America.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "National News · MyVote",
    description:
      "AI-curated national political news — factual, sourced, and free of spin.",
    type: "website",
  },
};

export default function NewsFeed() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />
        <AIFactualNews />
      </div>
    </div>
  );
}
