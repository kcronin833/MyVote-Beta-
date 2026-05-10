"use client";

import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";

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
