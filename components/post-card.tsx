"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { formatNewsTime } from "@/lib/news-service"
import { CommentSystem } from "@/components/comment-system"

const TOPIC_COLORS: Record<string, string> = {
  Election: "bg-teal-100 text-teal-800",
  "Local Issue": "bg-blue-100 text-blue-800",
  Candidate: "bg-purple-100 text-purple-800",
  Question: "bg-amber-100 text-amber-800",
  General: "bg-gray-100 text-gray-700",
}

export interface PostData {
  id: string
  user_id: string
  content: string
  topic: string
  likes_count: number
  comments_count: number
  created_at: string
  profile?: { display_name: string; username: string; avatar_url: string | null }
}

export function PostCard({ post }: { post: PostData }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const supabase = createClient()

  async function handleLike() {
    if (!user) return
    const next = !liked
    setLiked(next)
    setLikes((c) => (next ? c + 1 : c - 1))
    await supabase
      .from("posts")
      .update({ likes_count: next ? likes + 1 : likes - 1 })
      .eq("id", post.id)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "MyVote community post", text: post.content, url: window.location.href })
    } else {
      navigator.clipboard.writeText(post.content)
    }
  }

  const topicColor = TOPIC_COLORS[post.topic] || TOPIC_COLORS.General
  const name = post.profile?.display_name || "Community member"

  return (
    <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={post.profile?.avatar_url} displayName={name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            {post.profile?.username && (
              <span className="text-xs text-muted-foreground">@{post.profile.username}</span>
            )}
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${topicColor}`}>
              {post.topic}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">{formatNewsTime(post.created_at)}</span>
          </div>
          <p className="text-sm text-foreground mt-1.5 leading-relaxed">{post.content}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            liked
              ? "bg-rose-50 border-rose-300 text-rose-600"
              : "border-border text-muted-foreground hover:border-rose-300 hover:text-rose-500"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          {likes}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {post.comments_count}
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all ml-auto"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {showComments && (
        <div className="pt-2 border-t border-border">
          <CommentSystem articleUrl={`/posts/${post.id}`} articleTitle={post.content.slice(0, 80)} />
        </div>
      )}
    </div>
  )
}
