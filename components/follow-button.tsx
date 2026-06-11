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

  const h = size === "sm" ? 26 : 32
  const px = size === "sm" ? "0 10px" : "0 14px"
  const fs = size === "sm" ? 11.5 : 13.5

  if (following) {
    return (
      <button
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={loading}
        style={{
          height: h, padding: px, borderRadius: 999,
          border: `1.5px solid ${hovered ? "#FCA5A5" : "#B2D8D0"}`,
          background: hovered ? "#FFF1F2" : "#E6F0ED",
          color: hovered ? "#B33A2C" : "#2F6358",
          fontSize: fs, fontWeight: 700, cursor: "pointer",
          flexShrink: 0, transition: "all 0.15s",
        }}
      >
        {hovered ? "Unfollow" : "Following"}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        height: h, padding: px, borderRadius: 999,
        border: "none",
        background: "#3D8073",
        color: "#fff",
        fontSize: fs, fontWeight: 700, cursor: "pointer",
        flexShrink: 0, transition: "background 0.15s",
        boxShadow: "0 1px 6px rgba(61,128,115,0.25)",
      }}
    >
      Follow
    </button>
  )
}
