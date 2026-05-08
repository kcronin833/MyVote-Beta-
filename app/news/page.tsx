"use client";

import { Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";

export default function NewsFeed() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">National Political News</h1>
                <p className="text-sm text-muted-foreground">
                  Each story shows left-leaning and right-leaning coverage side by side
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/news/local" className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Local Georgia News
              </Link>
            </Button>
          </div>
        </div>

        {/* Topic-grouped news with perspectives */}
        <div className="max-w-4xl mx-auto">
          <AIFactualNews />
        </div>
      </div>
    </div>
  );
}
