"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Calendar,
  CheckCircle,
  MessageCircle,
  Heart,
  ExternalLink,
  Newspaper,
  Users,
  User,
  TrendingUp,
  Globe,
} from "lucide-react"
import { currentUser, mockComments, mockUsers } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { UserNav } from "@/components/user-nav"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { PoliticalSpectrumBar } from "@/components/political-spectrum-bar"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("activity")

  const userComments = mockComments.filter((comment) => comment.userId === currentUser.id)
  const userReplies = mockComments.flatMap((comment) =>
    comment.replies.filter((reply) => reply.userId === currentUser.id),
  )
  const allUserActivity = [...userComments, ...userReplies].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  const getPoliticalColor = (lean: string) => {
    switch (lean) {
      case "left":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "right":
        return "bg-red-100 text-red-800 border-red-200"
      case "center":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderCommentContent = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1)
        const mentionedUser = mockUsers.find((u) => u.username === username)
        return (
          <Link key={index} href={`/profile/${username}`} className="text-blue-600 font-medium hover:underline">
            {part}
          </Link>
        )
      }
      return part
    })
  }

  // Mock trending topics and suggested users
  const trendingTopics = [
    { topic: "Tax Reform", posts: 234 },
    { topic: "Climate Policy", posts: 189 },
    { topic: "Healthcare", posts: 156 },
    { topic: "Infrastructure", posts: 98 },
  ]

  const suggestedUsers = mockUsers.filter((user) => user.id !== currentUser.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - User Profile Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {currentUser.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
                    {currentUser.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </div>
                  <p className="text-gray-600 mb-2">@{currentUser.username}</p>
                  <Badge variant="outline" className={getPoliticalColor(currentUser.politicalLean)}>
                    {currentUser.politicalLean === "center"
                      ? "Moderate"
                      : currentUser.politicalLean === "left"
                        ? "Liberal"
                        : "Conservative"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      {currentUser.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined{" "}
                      {new Date(currentUser.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{userComments.length}</div>
                      <div className="text-xs text-gray-600">Comments</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{userReplies.length}</div>
                      <div className="text-xs text-gray-600">Replies</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">
                        {userComments.reduce((sum, comment) => sum + comment.likes, 0) +
                          userReplies.reduce((sum, reply) => sum + reply.likes, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Likes</div>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" asChild>
                    <Link href={`/profile/${currentUser.username}`}>View Full Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Political Position Card */}
              <PoliticalSpectrumBar />
            </div>
          </div>

          {/* Main Content */}
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
                    {allUserActivity.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No recent activity</p>
                        <Link href="/news">
                          <Button>Start Discussing News</Button>
                        </Link>
                      </div>
                    ) : (
                      allUserActivity.slice(0, 5).map((activity, index) => (
                        <div key={`${activity.id}-${index}`} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">You commented on</span>
                                <a
                                  href={activity.articleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium text-sm"
                                >
                                  {activity.articleTitle}
                                  <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                {renderCommentContent(activity.content)}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {activity.likes} likes
                                </div>
                                {activity.mentions.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>Mentioned:</span>
                                    {activity.mentions.map((mention, i) => (
                                      <Link
                                        key={mention}
                                        href={`/profile/${mention}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        @{mention}
                                        {i < activity.mentions.length - 1 ? "," : ""}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {allUserActivity.length > 5 && (
                      <div className="text-center">
                        <Link href={`/profile/${currentUser.username}`}>
                          <Button variant="outline" size="sm">
                            View All Activity
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized News Feed</CardTitle>
                    <CardDescription>News articles tailored to your interests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Your personalized feed will appear here</p>
                      <div className="flex gap-2 justify-center">
                        <Link href="/news">
                          <Button>Browse National News</Button>
                        </Link>
                        <Link href="/news/local">
                          <Button variant="outline">Local News</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discover" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Discover</CardTitle>
                    <CardDescription>Find new topics and users to follow</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Trending Topics</h4>
                      <div className="space-y-2">
                        {trendingTopics.map((topic, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">#{topic.topic}</div>
                              <div className="text-xs text-gray-500">{topic.posts} posts</div>
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Suggested Users</h4>
                      <div className="space-y-3">
                        {suggestedUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {user.displayName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{user.displayName}</div>
                                <div className="text-xs text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                            <Link href={`/profile/${user.username}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Quick Actions & Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/news" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Newspaper className="w-4 h-4 mr-2" />
                      Browse News
                    </Button>
                  </Link>
                  <Link href="/profile" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Political Profile
                    </Button>
                  </Link>
                  <Link href="/welcome" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      About MyVote
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Mentions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Mentions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent mentions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
