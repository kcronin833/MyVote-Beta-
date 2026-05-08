"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { followUser, unfollowUser } from "@/lib/friends-service"
import { createClient } from "@/lib/supabase/client"

interface FollowButtonProps {
  targetUserId: string
  initialFollowing?: boolean
  size?: "sm" | "default"
}

export function FollowButton({ targetUserId, initialFollowing = false, size = "sm" }: FollowButtonProps) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(initialFollowing)
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!user || user.id === targetUserId) return null

  async function handleToggle() {
    if (loading) return
    setLoading(true)
    const wasFollowing = following
    setFollowing(!wasFollowing) // optimistic

    if (wasFollowing) {
      const { error } = await unfollowUser(user!.id, targetUserId)
      if (error) setFollowing(wasFollowing)
    } else {
      const { error } = await followUser(user!.id, targetUserId)
      if (error) {
        setFollowing(wasFollowing)
      } else {
        // Notify the followed user
        const supabase = createClient()
        await supabase.from("notifications").insert({
          user_id: targetUserId,
          type: "follow",
          from_user_id: user!.id,
        })
      }
    }
    setLoading(false)
  }

  const pad = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"

  if (following) {
    return (
      <button
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={loading}
        className={`${pad} rounded-full font-semibold border transition-colors flex-shrink-0 ${
          hovered
            ? "border-red-300 text-red-600 bg-red-50"
            : "border-teal-300 text-teal-700 bg-teal-50"
        }`}
      >
        {hovered ? "Unfollow" : "Following"}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${pad} rounded-full font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors flex-shrink-0`}
    >
      Follow
    </button>
  )
}
