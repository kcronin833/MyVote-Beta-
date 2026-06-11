"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { getSuggestedUsers, type SuggestedUser } from "@/lib/suggestions-service"
import { UserAvatar } from "@/components/user-avatar"
import { FollowButton } from "@/components/follow-button"

const C = {
  rule:   "#E4E0D3",
  ink900: "#1A2138",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal:   "#3D8073",
  shade:  "#F0EDE6",
}

interface SuggestedNeighborsProps {
  limit?: number
  showHeader?: boolean
  showSeeAll?: boolean
  headline?: string
}

export function SuggestedNeighbors({
  limit = 3,
  showHeader = true,
  showSeeAll = true,
  headline,
}: SuggestedNeighborsProps) {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getSuggestedUsers(user.id, limit)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [user, limit])

  if (!user) return null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={13} color={C.teal} />
          <p style={{ fontSize: 12, fontWeight: 700, color: C.ink900, margin: 0 }}>
            {headline || "Suggested Neighbors"}
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, animation: "mv-pulse 1.6s ease-in-out infinite" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.shade, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 10, background: C.shade, borderRadius: 4, width: "60%" }} />
                <div style={{ height: 8, background: C.shade, borderRadius: 4, width: "80%" }} />
              </div>
              <div style={{ width: 56, height: 24, background: C.shade, borderRadius: 999, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p style={{ fontSize: 12, color: C.ink400, margin: 0 }}>
          No suggestions yet — more neighbors will appear as MyVote grows.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggestions.map((suggested) => (
            <div key={suggested.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link href={`/profile/${suggested.username}`} style={{ flexShrink: 0, textDecoration: "none" }}>
                <UserAvatar avatarUrl={suggested.avatar_url} displayName={suggested.display_name} size="sm" />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/profile/${suggested.username}`} style={{ textDecoration: "none" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.ink900, margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {suggested.display_name}
                  </p>
                </Link>
                <p style={{ fontSize: 10.5, color: C.ink400, margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {suggested.reason}
                </p>
              </div>
              <FollowButton targetUserId={suggested.id} size="sm" />
            </div>
          ))}
        </div>
      )}

      {showSeeAll && (
        <Link href="/discover" style={{ fontSize: 12, fontWeight: 600, color: C.teal, textDecoration: "none", marginTop: 2 }}>
          See all suggestions →
        </Link>
      )}
    </div>
  )
}
