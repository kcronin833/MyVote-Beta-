"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Users, FileText, MessageCircle, Trash2, RefreshCw } from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { UserAvatar } from "@/components/user-avatar"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatNewsTime } from "@/lib/news-service"

interface AdminUser {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  location: string | null
  is_admin: boolean
  created_at: string
}

interface AdminPost {
  id: string
  content: string
  topic: string | null
  created_at: string
  likes_count: number
  user_id: string
  author: { username: string; display_name: string; avatar_url: string | null } | null
}

type Tab = "users" | "posts"

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>("users")
  const [users, setUsers] = useState<AdminUser[]>([])
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || !profile?.is_admin)) {
      router.replace("/")
    }
  }, [authLoading, user, profile])

  useEffect(() => {
    if (!profile?.is_admin) return
    loadData()
  }, [profile, tab])

  async function loadData() {
    setLoadingData(true)
    const supabase = createClient()

    if (tab === "users") {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, location, is_admin, created_at")
        .order("created_at", { ascending: false })
        .limit(100)
      setUsers((data as AdminUser[]) || [])
    }

    if (tab === "posts") {
      const { data } = await supabase
        .from("posts")
        .select("id, content, topic, created_at, likes_count, user_id, author:profiles(username, display_name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(50)
      setPosts((data as unknown as AdminPost[]) || [])
    }

    setLoadingData(false)
  }

  async function deletePost(postId: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return
    setDeletingId(postId)
    const supabase = createClient()
    await supabase.from("posts").delete().eq("id", postId)
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    setDeletingId(null)
  }

  async function toggleAdmin(targetUser: AdminUser) {
    const newValue = !targetUser.is_admin
    const supabase = createClient()
    await supabase.from("profiles").update({ is_admin: newValue }).eq("id", targetUser.id)
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, is_admin: newValue } : u))
    )
  }

  if (authLoading) return null
  if (!profile?.is_admin) return null

  const totalUsers = users.length
  const totalPosts = posts.length
  const adminCount = users.filter((u) => u.is_admin).length

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">MyVote platform management</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Users", value: totalUsers, icon: Users, color: "text-[#1F3A93]" },
              { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-teal-600" },
              { label: "Admins", value: adminCount, icon: ShieldCheck, color: "text-amber-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-4 text-center">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-4 bg-white border border-border rounded-xl p-1 w-fit">
            {(["users", "posts"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? "bg-[#1F3A93] text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={loadData}
              className="ml-1 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Users tab */}
          {tab === "users" && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              {loadingData ? (
                <div className="p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading users…
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F6FA] border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Joined</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <UserAvatar avatarUrl={u.avatar_url} displayName={u.display_name} size="xs" />
                            <div className="min-w-0">
                              <Link
                                href={`/profile/${u.username}`}
                                className="font-semibold text-foreground hover:underline truncate block"
                              >
                                {u.display_name}
                              </Link>
                              <p className="text-xs text-muted-foreground">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                          {u.location ? `${u.location}, GA` : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                          {formatNewsTime(u.created_at)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.id === user?.id ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                              <ShieldCheck className="w-2.5 h-2.5" /> You
                            </span>
                          ) : (
                            <button
                              onClick={() => toggleAdmin(u)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                u.is_admin
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                  : "bg-muted text-muted-foreground hover:bg-amber-100 hover:text-amber-700"
                              }`}
                            >
                              {u.is_admin ? "Admin ✓" : "Grant"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Posts tab */}
          {tab === "posts" && (
            <div className="space-y-3">
              {loadingData ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading posts…
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <UserAvatar
                          avatarUrl={post.author?.avatar_url ?? null}
                          displayName={post.author?.display_name ?? ""}
                          size="xs"
                        />
                        <div>
                          <Link
                            href={`/profile/${post.author?.username}`}
                            className="text-xs font-semibold text-foreground hover:underline"
                          >
                            {post.author?.display_name || "Unknown"}
                          </Link>
                          <p className="text-[10px] text-muted-foreground">
                            {formatNewsTime(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deletingId === post.id}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === post.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                    {post.topic && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">
                        {post.topic}
                      </span>
                    )}
                    <p className="text-sm text-foreground mt-2 leading-relaxed">{post.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{post.likes_count} likes</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
