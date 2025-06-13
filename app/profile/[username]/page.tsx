import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Calendar, CheckCircle, MessageCircle, Heart, ExternalLink } from "lucide-react"
import { mockUsers, mockComments } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = mockUsers.find((u) => u.username === params.username)

  if (!user) {
    notFound()
  }

  const userComments = mockComments.filter((comment) => comment.userId === user.id)
  const userReplies = mockComments.flatMap((comment) => comment.replies.filter((reply) => reply.userId === user.id))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{user.displayName}</h1>
                    {user.verified && <CheckCircle className="w-6 h-6 text-blue-500" />}
                  </div>
                  <p className="text-gray-600 mb-2">@{user.username}</p>
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined{" "}
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <Badge variant="outline" className={getPoliticalColor(user.politicalLean)}>
                      {user.politicalLean === "center"
                        ? "Moderate"
                        : user.politicalLean === "left"
                          ? "Liberal"
                          : "Conservative"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{userComments.length}</div>
                <div className="text-sm text-gray-600">Comments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{userReplies.length}</div>
                <div className="text-sm text-gray-600">Replies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {userComments.reduce((sum, comment) => sum + comment.likes, 0) +
                    userReplies.reduce((sum, reply) => sum + reply.likes, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allUserActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                allUserActivity.map((activity, index) => (
                  <div key={`${activity.id}-${index}`} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Commented on</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
