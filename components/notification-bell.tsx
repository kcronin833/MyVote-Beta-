"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatNewsTime } from "@/lib/news-service"
import { UserAvatar } from "@/components/user-avatar"

const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  ink400:  "#8B8FA3",
  teal:    "#3D8073",
  tealSoft:"#E6F0ED",
  shade:   "#F0EDE6",
}

interface NotificationRow {
  id: string
  type: "follow" | "like" | "comment"
  read: boolean
  created_at: string
  from_user: {
    username: string
    display_name: string
    avatar_url: string | null
  } | null
}

function notificationText(n: NotificationRow): string {
  const name = n.from_user?.display_name || "Someone"
  switch (n.type) {
    case "follow":  return `${name} started following you`
    case "like":    return `${name} liked your post`
    case "comment": return `${name} commented on your post`
    default:        return `${name} interacted with you`
  }
}

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    loadNotifications()
  }, [user])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  async function loadNotifications() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from("notifications")
      .select("id, type, read, created_at, from_user:from_user_id(username, display_name, avatar_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
    setNotifications((data as unknown as NotificationRow[]) || [])
  }

  async function markAllRead() {
    if (!user) return
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!user) return null

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => {
          const opening = !open
          setOpen(opening)
          if (opening && unreadCount > 0) markAllRead()
        }}
        aria-label="Notifications"
        style={{ position: "relative", width: 32, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Bell size={16} color={C.ink500} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, minWidth: 16, height: 16, background: "#E11D48", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: C.card, border: `1px solid ${C.rule}`, borderRadius: 16, boxShadow: "0 12px 40px rgba(20,24,40,0.18)", zIndex: 50, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0 }}>Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={loadNotifications}
                style={{ fontSize: 12, color: C.ink400, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
              >
                Refresh
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <Bell size={28} color="#D1CFC6" style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ fontSize: 13, color: C.ink400, margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", background: n.read ? "transparent" : C.tealSoft, borderBottom: i < notifications.length - 1 ? `1px solid ${C.rule}` : "none" }}
                >
                  <UserAvatar avatarUrl={n.from_user?.avatar_url ?? null} displayName={n.from_user?.display_name ?? ""} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, color: C.ink700, margin: 0, lineHeight: 1.4 }}>{notificationText(n)}</p>
                    <p style={{ fontSize: 10.5, color: C.ink400, margin: "3px 0 0" }}>
                      {formatNewsTime(n.created_at)}
                    </p>
                  </div>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
