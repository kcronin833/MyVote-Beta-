"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatNewsTime } from "@/lib/news-service"
import { UserAvatar } from "@/components/user-avatar"

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

  // Close on outside click
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          const opening = !open
          setOpen(opening)
          if (opening && unreadCount > 0) markAllRead()
        }}
        className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={loadNotifications}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Refresh
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 ${n.read ? "" : "bg-teal-50"}`}
                >
                  <UserAvatar
                    avatarUrl={n.from_user?.avatar_url ?? null}
                    displayName={n.from_user?.display_name ?? ""}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{notificationText(n)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatNewsTime(n.created_at)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
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
