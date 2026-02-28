"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, MapPin } from "lucide-react";
import { NewsNavigation } from "@/components/news-nav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { formatNewsTime } from "@/lib/news-service";

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

const PRESET_LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "San Francisco, CA",
  "Austin, TX",
  "Miami, FL",
  "Seattle, WA",
  "Boston, MA",
  "Washington, DC",
];

export default function LocalNewsFeed() {
  const { profile } = useAuth();
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Pre-fill with user's profile location
  useEffect(() => {
    if (profile?.location) {
      setLocation(profile.location);
    }
  }, [profile]);

  // Auto-search when location is selected from dropdown
  useEffect(() => {
    if (location && location !== "custom") {
      loadLocalNews(location);
    }
  }, [location]);

  async function loadLocalNews(loc: string) {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/news?perspective=local&location=${encodeURIComponent(loc)}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      setArticles([]);
    }
    setLoading(false);
  }

  const activeLocation = location === "custom" ? customLocation : location;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 mb-8 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Your Location
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Enter custom location...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {location === "custom" && (
              <div className="flex-1">
                <Input
                  placeholder="e.g. Denver, CO"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadLocalNews(customLocation)}
                />
              </div>
            )}

            {location === "custom" && (
              <Button
                onClick={() => loadLocalNews(customLocation)}
                disabled={!customLocation.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            )}
          </div>

          {activeLocation && (
            <div className="mb-4">
              <Badge variant="outline" className="text-sm flex items-center gap-1 w-fit">
                <MapPin className="w-3 h-3" />
                {activeLocation}
              </Badge>
            </div>
          )}

          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {!loading && searched && articles.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">No local news found</p>
                <p className="text-sm">Try a different city or check your NewsAPI key supports local searches.</p>
              </CardContent>
            </Card>
          )}

          {!loading && !searched && (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>Select your city above to see local news</p>
              </CardContent>
            </Card>
          )}

          {!loading && articles.length > 0 && (
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
