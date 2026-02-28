"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, TrendingUp, MessageCircle } from "lucide-react";
import { NewsNavigation } from "@/components/news-nav";
import { CommentSystem } from "@/components/comment-system";
import { AIFactualNews } from "@/components/ai-factual-news";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatNewsTime } from "@/lib/news-service";

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

const perspectives = [
  { key: "left", label: "Left", color: "bg-blue-600 hover:bg-blue-700" },
  { key: "facts", label: "Just the Facts", color: "bg-gray-600 hover:bg-gray-700" },
  { key: "right", label: "Right", color: "bg-red-600 hover:bg-red-700" },
];

export default function NewsFeed() {
  const [selectedTab, setSelectedTab] = useState("facts");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTab !== "facts") {
      loadNews(selectedTab);
    }
  }, [selectedTab]);

  async function loadNews(perspective: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?perspective=${perspective}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Failed to load news:", err);
      setArticles([]);
    }
    setLoading(false);
  }

  const currentPerspective = perspectives.find((p) => p.key === selectedTab);

  const renderArticles = () => {
    if (loading) {
      return (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No articles found. Check your NewsAPI key.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {articles.map((article, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt=""
                    className="w-20 h-14 object-cover rounded flex-shrink-0"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formatNewsTime(article.publishedAt)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {article.source}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline"
                    >
                      {article.title}
                    </a>
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {article.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Read Full Article
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Discuss
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-left">{article.title}</DialogTitle>
                    </DialogHeader>
                    <CommentSystem articleUrl={article.url} articleTitle={article.title} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {perspectives.map((p) => (
            <Button
              key={p.key}
              onClick={() => setSelectedTab(p.key)}
              className={
                selectedTab === p.key
                  ? `${p.color} text-white`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Badge variant="outline" className="text-sm">
              {currentPerspective?.label} Perspective
            </Badge>
          </div>
          {selectedTab === "facts" ? <AIFactualNews /> : renderArticles()}
        </div>
      </div>
    </div>
  );
}
