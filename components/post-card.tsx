"use client"

import React, { useState } from "react"
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { formatNewsTime } from "@/lib/news-service"
import { CommentSystem } from "@/components/comment-system"

const C = {
  card:   "#FDFCF9",
  rule:   "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  shade:  "#F0EDE6",
}

type TopicStyle = { bg: string; color: string }
const TOPIC_STYLES: Record<string, TopicStyle> = {
  Election:      { bg: "#E6F0ED", color: "#2F6358" },
  "Local Issue": { bg: "#DBEAFE", color: "#1D4ED8" },
  Candidate:     { bg: "#EDE9FE", color: "#6D28D9" },
  Question:      { bg: "#FEF3C7", color: "#92400E" },
  General:       { bg: C.shade,   color: C.ink500  },
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

  const topicStyle = TOPIC_STYLES[post.topic] || TOPIC_STYLES.General
  const name = post.profile?.display_name || "Community member"

  const actionBtn = (active?: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    height: 30,
    padding: "0 10px",
    borderRadius: 999,
    border: `1px solid ${active ? "#FCA5A5" : C.rule}`,
    background: active ? "#FFF1F2" : "transparent",
    color: active ? "#E11D48" : C.ink500,
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.15s",
  })

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", padding: "14px 16px" }}>
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <UserAvatar avatarUrl={post.profile?.avatar_url} displayName={name} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900 }}>{name}</span>
            {post.profile?.username && (
              <span style={{ fontSize: 12, color: C.ink400 }}>@{post.profile.username}</span>
            )}
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: topicStyle.bg, color: topicStyle.color }}>
              {post.topic}
            </span>
            <span style={{ fontSize: 11.5, color: C.ink400, marginLeft: "auto" }}>{formatNewsTime(post.created_at)}</span>
          </div>
          <p style={{ fontSize: 13.5, color: C.ink700, marginTop: 4, lineHeight: 1.55 }}>{post.content}</p>
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 10, borderTop: `1px solid ${C.rule}` }}>
        <button onClick={handleLike} style={actionBtn(liked)}>
          <Heart style={{ width: 13, height: 13, fill: liked ? "currentColor" : "none" }} />
          {likes}
        </button>

        <button onClick={() => setShowComments(!showComments)} style={actionBtn()}>
          <MessageCircle style={{ width: 13, height: 13 }} />
          {post.comments_count}
          {showComments ? <ChevronUp style={{ width: 11, height: 11 }} /> : <ChevronDown style={{ width: 11, height: 11 }} />}
        </button>

        <button onClick={handleShare} style={{ ...actionBtn(), marginLeft: "auto" }}>
          <Share2 style={{ width: 13, height: 13 }} />
          Share
        </button>
      </div>

      {showComments && (
        <div style={{ paddingTop: 12, marginTop: 2, borderTop: `1px solid ${C.rule}` }}>
          <CommentSystem articleUrl={`/posts/${post.id}`} articleTitle={post.content.slice(0, 80)} />
        </div>
      )}
    </div>
  )
}
