"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { getSuggestedUsers, type SuggestedUser } from "@/lib/suggestions-service"
import { UserAvatar } from "@/components/user-avatar"
import { FollowButton } from "@/components/follow-button"

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
    <div className="space-y-2">
      {showHeader && (
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-teal-600" />
          <p className="text-xs font-semibold text-foreground">
            {headline || "Suggested Neighbors"}
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-muted rounded w-24" />
                <div className="h-2 bg-muted rounded w-32" />
              </div>
              <div className="w-14 h-6 bg-muted rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-xs text-muted-foreground py-1">
          No suggestions yet — more neighbors will appear as MyVote grows.
        </p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggested) => (
            <div key={suggested.id} className="flex items-center gap-2">
              <Link href={`/profile/${suggested.username}`} className="flex-shrink-0">
                <UserAvatar
                  avatarUrl={suggested.avatar_url}
                  displayName={suggested.display_name}
                  size="sm"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${suggested.username}`}>
                  <p className="text-xs font-semibold text-foreground truncate hover:underline leading-tight">
                    {suggested.display_name}
                  </p>
                </Link>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">
                  {suggested.reason}
                </p>
              </div>
              <FollowButton targetUserId={suggested.id} size="sm" />
            </div>
          ))}
        </div>
      )}

      {showSeeAll && (
        <Link href="/discover">
          <p className="text-xs text-teal-600 hover:text-teal-700 font-medium pt-0.5 block">
            See all suggestions →
          </p>
        </Link>
      )}
    </div>
  )
}
