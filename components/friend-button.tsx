"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/lib/supabase/client"
import {
  getFriendState,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  type FriendState,
} from "@/lib/friend-requests-service"

interface FriendButtonProps {
  targetUserId: string
  /** Provide if you already know the state (avoids a fetch). */
  initialState?: FriendState
  size?: "sm" | "default"
  /** Called after a successful state change (e.g. to refresh a list). */
  onChange?: (state: FriendState) => void
}

async function notify(targetUserId: string, fromUserId: string, type: string) {
  try {
    const supabase = createClient()
    await supabase.from("notifications").insert({ user_id: targetUserId, type, from_user_id: fromUserId })
  } catch {
    /* notifications are best-effort */
  }
}

export function FriendButton({ targetUserId, initialState, size = "sm", onChange }: FriendButtonProps) {
  const { user } = useAuth()
  const [state, setState] = useState<FriendState>(initialState ?? "none")
  const [ready, setReady] = useState(initialState !== undefined)
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    if (initialState !== undefined || !user || user.id === targetUserId) {
      setReady(true)
      return
    }
    getFriendState(user.id, targetUserId).then((s) => {
      if (alive) { setState(s); setReady(true) }
    })
    return () => { alive = false }
  }, [user, targetUserId, initialState])

  if (!user || user.id === targetUserId || state === "self") return null

  const h = size === "sm" ? 26 : 32
  const px = size === "sm" ? "0 12px" : "0 16px"
  const fs = size === "sm" ? 11.5 : 13.5
  const base: React.CSSProperties = {
    height: h, padding: px, borderRadius: 999, fontSize: fs, fontWeight: 700,
    cursor: loading ? "default" : "pointer", flexShrink: 0, transition: "all 0.15s",
    opacity: ready ? 1 : 0.5,
  }
  const filled: React.CSSProperties = {
    ...base, border: "none", background: "#3D8073", color: "#fff",
    boxShadow: "0 1px 6px rgba(61,128,115,0.25)",
  }
  const outlined = (danger: boolean): React.CSSProperties => ({
    ...base,
    border: `1.5px solid ${danger ? "#FCA5A5" : "#B2D8D0"}`,
    background: danger ? "#FFF1F2" : "#E6F0ED",
    color: danger ? "#B33A2C" : "#2F6358",
  })

  function apply(next: FriendState) {
    setState(next)
    onChange?.(next)
  }

  async function act(action: () => Promise<{ error: string | null }>, optimistic: FriendState, revert: FriendState) {
    if (loading || !ready) return
    setLoading(true)
    apply(optimistic)
    const { error } = await action()
    if (error) apply(revert)
    setLoading(false)
    return error
  }

  if (state === "friends") {
    return (
      <button
        onClick={() => act(() => removeFriend(user.id, targetUserId), "none", "friends")}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        disabled={loading || !ready} style={outlined(hovered)}
      >
        {hovered ? "Unfriend" : "Friends ✓"}
      </button>
    )
  }

  if (state === "outgoing") {
    return (
      <button
        onClick={() => act(() => removeFriend(user.id, targetUserId), "none", "outgoing")}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        disabled={loading || !ready} style={outlined(hovered)}
      >
        {hovered ? "Cancel" : "Requested"}
      </button>
    )
  }

  if (state === "incoming") {
    return (
      <button
        onClick={async () => {
          const err = await act(() => acceptFriendRequest(user.id, targetUserId), "friends", "incoming")
          if (!err) notify(targetUserId, user.id, "friend_accept")
        }}
        disabled={loading || !ready} style={filled}
      >
        Accept request
      </button>
    )
  }

  // state === "none"
  return (
    <button
      onClick={async () => {
        const err = await act(() => sendFriendRequest(user.id, targetUserId), "outgoing", "none")
        if (!err) notify(targetUserId, user.id, "friend_request")
      }}
      disabled={loading || !ready} style={filled}
    >
      + Add friend
    </button>
  )
}
