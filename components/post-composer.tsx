"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"

const TOPICS = ["Election", "Local Issue", "Candidate", "Question"] as const
type Topic = typeof TOPICS[number]

const C = {
  card:   "#FDFCF9",
  rule:   "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal:   "#3D8073",
  tealDk: "#2F6358",
  shade:  "#F0EDE6",
}

interface Post {
  id: string
  user_id: string
  content: string
  topic: string
  likes_count: number
  comments_count: number
  created_at: string
  profile?: { display_name: string; username: string; avatar_url: string | null }
}

interface PostComposerProps {
  onPost: (post: Post) => void
}

export function PostComposer({ onPost }: PostComposerProps) {
  const { user, profile } = useAuth()
  const [content, setContent] = useState("")
  const [topic, setTopic] = useState<Topic>("Election")
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user || !profile) return null

  async function handlePost() {
    if (posting) return
    if (content.trim().length < 10) {
      setError("Please write at least 10 characters before posting.")
      return
    }
    setPosting(true)
    setError(null)
    const supabase = createClient()

    const { data, error: postErr } = await supabase
      .from("posts")
      .insert({ user_id: user!.id, content: content.trim(), topic })
      .select()
      .single()

    if (postErr) {
      // Surface the failure instead of swallowing it silently.
      setError(
        /jwt|expired|auth|permission|row-level|policy/i.test(postErr.message)
          ? "Your session may have expired. Please refresh the page or sign in again, then try posting."
          : `Couldn't post — ${postErr.message}. Please try again.`
      )
      setPosting(false)
      return
    }

    if (data) {
      onPost({
        ...data,
        profile: {
          display_name: profile!.display_name,
          username: profile!.username,
          avatar_url: profile!.avatar_url,
        },
      })
      setContent("")
    }
    setPosting(false)
  }

  const remaining = 500 - content.length

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Text area row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <UserAvatar avatarUrl={profile.avatar_url} displayName={profile.display_name} size="md" />
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value.slice(0, 500)); if (error) setError(null) }}
          placeholder="Share a civic thought, ask a question, or start a discussion..."
          rows={3}
          style={{ flex: 1, resize: "none", fontSize: 13.5, color: C.ink900, background: "transparent", outline: "none", border: "none", lineHeight: 1.55, minHeight: 72, fontFamily: "inherit" }}
        />
      </div>

      {/* Topic pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {TOPICS.map((t) => {
          const active = topic === t
          return (
            <button
              key={t}
              onClick={() => setTopic(t)}
              style={{ height: 28, padding: "0 12px", borderRadius: 999, border: `1.5px solid ${active ? C.teal : C.rule}`, background: active ? C.teal : "transparent", color: active ? "#fff" : C.ink500, fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.12s" }}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* Error / feedback */}
      {error && (
        <div style={{ fontSize: 12.5, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", lineHeight: 1.45 }}>
          {error}
        </div>
      )}

      {/* Footer row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.rule}`, paddingTop: 10 }}>
        <span style={{ fontSize: 12, color: remaining < 50 ? "#D97706" : C.ink400, fontWeight: remaining < 50 ? 600 : 400 }}>
          {remaining} remaining
        </span>
        <button
          onClick={handlePost}
          disabled={posting}
          aria-disabled={posting}
          style={{ height: 34, padding: "0 18px", borderRadius: 999, border: "none", background: posting ? "#E4E0D3" : C.teal, color: posting ? C.ink400 : "#fff", fontSize: 13.5, fontWeight: 700, cursor: posting ? "default" : "pointer", transition: "background 0.15s", boxShadow: !posting ? "0 2px 8px rgba(61,128,115,0.28)" : "none" }}
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  )
}
