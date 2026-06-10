"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { FollowButton } from "@/components/follow-button"
import { createClient } from "@/lib/supabase/client"
import { isFollowing } from "@/lib/friends-service"
import { useAuth } from "@/components/auth-context"
import { formatNewsTime } from "@/lib/news-service"

interface PublicProfile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  location: string | null
  bio: string | null
  created_at: string
}

interface PublicPost {
  id: string
  content: string
  topic: string | null
  created_at: string
  likes_count: number
}

const TOPIC_COLORS: Record<string, string> = {
  "Election":      "bg-blue-100 text-blue-700",
  "Local Issue":   "bg-green-100 text-green-700",
  "Candidate":     "bg-amber-100 text-amber-700",
  "Question":      "bg-purple-100 text-purple-700",
}

export default function ProfilePage() {
  const params = useParams()
  const username = params?.username as string
  const { user } = useAuth()

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [followingUser, setFollowingUser] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!username) return
    load()
  }, [username, user])

  async function load() {
    setLoading(true)
    const supabase = createClient()

    const { data: prof } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, location, bio, created_at")
      .eq("username", username)
      .single()

    if (!prof) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setProfile(prof)

    const [postsRes, followersRes, followingRes, isFollowingRes] = await Promise.all([
      supabase
        .from("posts")
        .select("id, content, topic, created_at, likes_count")
        .eq("user_id", prof.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("user_follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", prof.id),
      supabase
        .from("user_follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", prof.id),
      user ? isFollowing(user.id, prof.id) : Promise.resolve(false),
    ])

    setPosts(postsRes.data || [])
    setFollowerCount(followersRes.count || 0)
    setFollowingCount(followingRes.count || 0)
    setFollowingUser(isFollowingRes)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-100">
        <div className="container mx-auto px-4 pt-4 pb-8">
          <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="bg-paper-50 rounded-2xl border border-border p-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-muted rounded w-40" />
                  <div className="h-3 bg-muted rounded w-28" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-paper-100">
        <div className="container mx-auto px-4 pt-4 pb-8">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-2">User not found</h1>
            <p className="text-muted-foreground mb-6">
              This profile doesn&apos;t exist or has been removed.
            </p>
            <Link href="/">
              <button className="bg-teal-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-teal-700 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>

          {/* Profile header */}
          <div className="bg-paper-50 rounded-2xl border border-border p-6" style={{ boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
            <div className="flex items-start gap-4">
              <UserAvatar
                avatarUrl={profile.avatar_url}
                displayName={profile.display_name}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-foreground truncate">
                      {profile.display_name}
                    </h1>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                  <FollowButton targetUserId={profile.id} initialFollowing={followingUser} />
                </div>

                {profile.bio && (
                  <p className="text-sm text-foreground mt-2 leading-relaxed">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {profile.location}, GA
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                  <span>
                    <strong className="text-foreground">{followingCount}</strong>{" "}
                    <span className="text-muted-foreground">Following</span>
                  </span>
                  <span>
                    <strong className="text-foreground">{followerCount}</strong>{" "}
                    <span className="text-muted-foreground">Followers</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground px-1">Posts</h2>

            {posts.length === 0 ? (
              <div className="bg-paper-50 rounded-xl border border-border p-6 text-center" style={{ boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
                <p className="text-sm text-muted-foreground">No posts yet.</p>
              </div>
            ) : (
              posts.map((post) => {
                const topicColor = post.topic ? (TOPIC_COLORS[post.topic] || "bg-paper-200 text-ink-700") : ""
                return (
                  <div key={post.id} className="bg-paper-50 rounded-xl border border-border p-4 mv-lift" style={{ boxShadow: "0 1px 4px rgba(20,24,40,0.05)" }}>
                    {post.topic && (
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full mb-2 ${topicColor}`}>
                        {post.topic}
                      </span>
                    )}
                    <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{formatNewsTime(post.created_at)}</span>
                      {post.likes_count > 0 && (
                        <span>{post.likes_count} {post.likes_count === 1 ? "like" : "likes"}</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
