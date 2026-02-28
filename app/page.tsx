"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, MapPin, Globe, Users, BarChart3, Newspaper, ShieldCheck } from "lucide-react";
import { NewsNavigation } from "@/components/news-nav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-context";
import { formatNewsTime } from "@/lib/news-service";
import { Logo } from "@/components/logo";

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
  const { user, profile, loading: authLoading } = useAuth();
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

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3A93]" />
      </div>
    );
  }

  // Show welcome/sign-up page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Hero */}
        <div className="bg-[#1F3A93] text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <Logo size="xl" />
            <p className="mt-4 text-lg max-w-2xl mx-auto text-blue-100 leading-relaxed">
              Your gateway to politically balanced news, local updates, and civic engagement.
              Stay informed. Stay balanced. Make your vote count.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#F39C12] hover:bg-[#E67E22] text-white font-semibold">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-[#4A4A4A] mb-2 text-balance">Why MyVote?</h2>
          <p className="text-center text-[#4A4A4A]/70 mb-10 max-w-xl mx-auto text-pretty">
            We believe informed citizens make better decisions. Here is how we help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Newspaper className="w-8 h-8 text-[#1F3A93] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Balanced News</CardTitle>
                <CardDescription>Read left, right, and fact-based perspectives on every story so you see the full picture.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <ShieldCheck className="w-8 h-8 text-[#27AE60] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Just the Facts</CardTitle>
                <CardDescription>AI-generated factual summaries strip away bias and show you verified information from official sources.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <MapPin className="w-8 h-8 text-[#D64541] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Local Focus</CardTitle>
                <CardDescription>Get news and representative info for your area. Currently launching in Georgia with Atlanta as our featured city.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Users className="w-8 h-8 text-[#3498DB] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Know Your Representatives</CardTitle>
                <CardDescription>Detailed profiles, voting records, and compatibility scores for your elected officials.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-[#F39C12] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Political Spectrum</CardTitle>
                <CardDescription>Like viewpoints to discover where you fall on the political spectrum based on your actual preferences.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Globe className="w-8 h-8 text-[#1F3A93] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Community Discussion</CardTitle>
                <CardDescription>Comment on articles, tag other users, and engage in meaningful political discourse.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Georgia CTA */}
        <div className="bg-[#1F3A93]/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-2 text-balance">Now Launching in Georgia</h2>
            <p className="text-[#4A4A4A]/70 mb-8 max-w-xl mx-auto text-pretty">
              Explore real Atlanta representatives, local Georgia news, and up-to-date 2026 election data. Sign up to get started.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E5E5E5] py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[#4A4A4A]/60">
            <Logo size="sm" />
            <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
          </div>
        </footer>
      </div>
    );
  }

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
