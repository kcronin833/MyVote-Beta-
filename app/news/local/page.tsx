"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Clock,
  MapPin,
  MessageCircle,
  RefreshCw,
  Newspaper,
} from "lucide-react";
import { NewsNavigation } from "@/components/news-nav";
import { CommentSystem } from "@/components/comment-system";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatNewsTime } from "@/lib/news-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-context";

const GEORGIA_CITIES = [
  "Atlanta",
  "Savannah",
  "Augusta",
  "Columbus",
  "Macon",
  "Athens",
  "Sandy Springs",
  "Roswell",
  "Albany",
  "Johns Creek",
  "Warner Robins",
  "Alpharetta",
  "Marietta",
  "Valdosta",
  "Smyrna",
  "Brookhaven",
  "Dunwoody",
  "Peachtree City",
  "Gainesville",
  "Newnan",
  "Milton",
  "Decatur",
  "East Point",
  "Kennesaw",
  "Statesboro",
  "Dalton",
  "Lawrenceville",
  "Woodstock",
  "Canton",
  "Carrollton",
  "Rome",
  "Tucker",
  "Stone Mountain",
  "College Park",
  "Hinesville",
  "Douglasville",
  "Griffin",
  "Pooler",
  "Duluth",
  "LaGrange",
];

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

const LOCAL_SOURCES = [
  { name: "AJC (Atlanta Journal-Constitution)", bias: "center" },
  { name: "Atlanta News First", bias: "center" },
  { name: "Axios Atlanta", bias: "center" },
  { name: "11Alive (WXIA)", bias: "center" },
  { name: "WSB-TV", bias: "center" },
  { name: "The Atlanta Voice", bias: "center-left" },
  { name: "Decaturish", bias: "center" },
  { name: "Saporta Report", bias: "center" },
];

export default function LocalNewsPage() {
  const { profile } = useAuth()
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Atlanta");

  // Seed location from the user's saved civic address once profile loads
  useEffect(() => {
    if (profile?.location) {
      setLocation(profile.location)
    }
  }, [profile?.location])

  useEffect(() => {
    loadLocalNews(location);
  }, [location]);

  async function loadLocalNews(loc: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?perspective=local&location=${encodeURIComponent(loc)}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Failed to load local news:", err);
      setArticles([]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />

        {/* Location header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">
              Local News: {location}, Georgia
            </h1>
          </div>

          {/* Location select */}
          <Card className="mb-6 border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Select
                  value={location}
                  onValueChange={(val) => {
                    setLocation(val);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a Georgia city" />
                  </SelectTrigger>
                  <SelectContent>
                    {GEORGIA_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}, Georgia
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => loadLocalNews(location)}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Known local sources info */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-muted-foreground py-1">
              Local sources:
            </span>
            {LOCAL_SOURCES.map((s) => (
              <Badge key={s.name} variant="outline" className="text-xs">
                {s.name}
              </Badge>
            ))}
          </div>

          {/* Articles */}
          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex gap-4">
                      <div className="w-24 h-16 bg-muted rounded flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No local articles found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {"Try a different city or check back later. Make sure your NEWS_API_KEY is set."}
                </p>
                <Button onClick={() => loadLocalNews(location)}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {articles.map((article, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition-shadow border-border"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt=""
                          crossOrigin="anonymous"
                          className="w-24 h-16 object-cover rounded flex-shrink-0"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatNewsTime(article.publishedAt)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {article.source}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Local
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary hover:underline text-foreground"
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
                            <DialogTitle className="text-left">
                              {article.title}
                            </DialogTitle>
                          </DialogHeader>
                          <CommentSystem
                            articleUrl={article.url}
                            articleTitle={article.title}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
