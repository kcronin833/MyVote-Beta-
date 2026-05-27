"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"

const TOPICS = ["Election", "Local Issue", "Candidate", "Question"] as const
type Topic = typeof TOPICS[number]

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

  if (!user || !profile) return null

  async function handlePost() {
    if (content.trim().length < 10 || posting) return
    setPosting(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("posts")
      .insert({ user_id: user!.id, content: content.trim(), topic })
      .select()
      .single()

    if (!error && data) {
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
    <div className="bg-paper-50 rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={profile.avatar_url} displayName={profile.display_name} size="md" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 500))}
          placeholder="Share a civic thought, ask a question, or start a discussion..."
          className="flex-1 resize-none text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none min-h-[72px] leading-relaxed"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              topic === t
                ? "bg-teal-600 text-white border-teal-600"
                : "border-border text-muted-foreground hover:border-teal-400 hover:text-teal-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className={`text-xs ${remaining < 50 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
          {remaining} remaining
        </span>
        <button
          onClick={handlePost}
          disabled={content.trim().length < 10 || posting}
          className="px-4 py-1.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  )
}
