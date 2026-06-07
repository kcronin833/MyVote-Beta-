import type { Metadata } from "next";
import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";

export const metadata: Metadata = {
  title: "Georgia Political News — Left, Right & Center · MyVote",
  description:
    "Read Georgia political news from left, right, and center sources side by side. AI-generated factual summaries strip away spin so you can form your own opinion.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Georgia Political News — Every Perspective · MyVote",
    description:
      "Read the same Georgia story from left, right, and center. Facts first, then opinions.",
    type: "website",
  },
};

export default function NewsFeed() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />
        <div className="max-w-4xl mx-auto">
          <AIFactualNews />
        </div>
      </div>
    </div>
  );
}
