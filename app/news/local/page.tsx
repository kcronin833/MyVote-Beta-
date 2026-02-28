"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Calendar, CheckCircle, MessageCircle, Heart,
  ExternalLink, Newspaper, Users, User, TrendingUp, Globe,
} from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { UserNav } from "@/components/user-nav";
import { SearchInput } from "@/components/search-input";
import { Logo } from "@/components/logo";
import { AuthModal } from "@/components/auth-modal";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { getUserActivity } from "@/lib/comments-service";

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("activity");
  const [authOpen, setAuthOpen] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserActivity(user.id).then(setActivity);
    }
  }, [user]);

  const getPoliticalColor = (lean?: string) => {
    if (lean === "left") return "bg-blue-100 text-blue-800 border-blue-200";
    if (lean === "right") return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const trendingTopics = [
    { topic: "Tax Reform", posts: 234 },
    { topic: "Climate Policy", posts: 189 },
    { topic: "Healthcare", posts: 156 },
    { topic: "Infrastructure", posts: 98 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <nav className="hidden md:flex gap-4">
              <Link href="/news">
                <Button variant="ghost" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  National News
                </Button>
              </Link>
              <Link href="/news/local">
                <Button variant="ghost" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Local News
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Political Profile
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <SearchInput />
            <UserNav />
          </div>
        </div>

        {/* Not logged in — welcome banner */}
        {!user && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Stay Informed. Stay Balanced.
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Read news from all perspectives, discuss issues with fellow citizens, and build your political profile.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={() => setAuthOpen(true)}
              >
                Get Started
              </Button>
              <Link href="/news">
                <Button variant="outline" size="lg">
                  Browse News
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Logged in — dashboard */}
        {user && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {profile.display_name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{profile.display_name}</h2>
                    {profile.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </div>
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                  <Badge variant="outline" className={getPoliticalColor(profile.political_lean)}>
                    {profile.political_lean === "left"
                      ? "Liberal"
                      : profile.political_lean === "right"
                      ? "Conservative"
                      : "Moderate"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    {profile.location && (
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined{" "}
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{activity.length}</div>
                      <div className="text-xs text-gray-600">Comments</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">
                        {activity.reduce((sum, a) => sum + (a.likes_count || 0), 0)}
                      </div>
                      <div className="text-xs text-gray-600">Likes</div>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" asChild>
                    <Link href={`/profile/${profile.username}`}>View Full Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">My Activity</TabsTrigger>
                  <TabsTrigger value="feed">News Feed</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest comments and interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activity.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No recent activity</p>
                          <Link href="/news">
                            <Button>Start Discussing News</Button>
                          </Link>
                        </div>
                      ) : (
                        activity.slice(0, 5).map((a) => (
                          <div key={a.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="text-sm text-gray-600">You commented on</span>
                                  <a
                                    href={a.article_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-medium text-sm"
                                  >
                                    {a.article_title}
                                    <ExternalLink className="w-3 h-3 inline ml-1" />
                                  </a>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">{a.content}</div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {a.likes_count || 0} likes
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="feed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personalized News Feed</CardTitle>
                      <CardDescription>News tailored to your interests</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Browse national and local news</p>
                      <div className="flex gap-2 justify-center">
                        <Link href="/news"><Button>National News</Button></Link>
                        <Link href="/news/local"><Button variant="outline">Local News</Button></Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discover">
                  <Card>
                    <CardHeader>
                      <CardTitle>Discover</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium mb-3">Trending Topics</h4>
                      <div className="space-y-2">
                        {trendingTopics.map((t, i) => (
                          <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">#{t.topic}</div>
                              <div className="text-xs text-gray-500">{t.posts} posts</div>
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/news" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Newspaper className="w-4 h-4 mr-2" />Browse News
                      </Button>
                    </Link>
                    <Link href="/profile" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />Political Profile
                      </Button>
                    </Link>
                    <Link href="/welcome" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />About MyVote
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
