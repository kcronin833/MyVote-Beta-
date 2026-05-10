"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Users, FileText, Trash2, RefreshCw, Rss, CheckCircle, XCircle, Mail, Briefcase, Lightbulb, MessageCircle } from "lucide-react"
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

type Tab = "users" | "posts" | "pipeline" | "messages"

interface ContactMessage {
  id: string
  name: string
  email: string
  category: "business" | "suggestion" | "general"
  message: string
  read: boolean
  created_at: string
}

interface PipelineLog {
  ts: string
  type: "info" | "ok" | "error"
  message: string
}

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>("users")
  const [users, setUsers] = useState<AdminUser[]>([])
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([])

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

    if (tab === "messages") {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)
      setMessages((data as ContactMessage[]) || [])
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

  async function runPipeline() {
    setPipelineRunning(true)
    setPipelineLogs([{ ts: new Date().toLocaleTimeString(), type: "info", message: "Starting pipeline…" }])
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No active session")

      const res = await fetch("/api/pipeline/trigger", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-supabase-token": session.access_token,
        },
      })
      const data = await res.json()

      if (!res.ok) {
        setPipelineLogs((prev) => [
          ...prev,
          { ts: new Date().toLocaleTimeString(), type: "error", message: data.error || "Pipeline failed" },
        ])
        return
      }

      const ingest = data.ingest || {}
      const cluster = data.cluster || {}
      setPipelineLogs((prev) => [
        ...prev,
        { ts: new Date().toLocaleTimeString(), type: "ok", message: `Ingest: fetched ${ingest.fetched ?? "?"}, inserted ${ingest.articles_inserted ?? "?"} articles` },
        { ts: new Date().toLocaleTimeString(), type: "ok", message: `Cluster: created ${cluster.clusters_created ?? "?"} stories from ${cluster.articles_processed ?? "?"} articles` },
        { ts: new Date().toLocaleTimeString(), type: "ok", message: "Pipeline complete ✓" },
      ])
    } catch (err) {
      setPipelineLogs((prev) => [
        ...prev,
        { ts: new Date().toLocaleTimeString(), type: "error", message: String(err) },
      ])
    } finally {
      setPipelineRunning(false)
    }
  }

  async function toggleAdmin(targetUser: AdminUser) {
    const newValue = !targetUser.is_admin
    const supabase = createClient()
    await supabase.from("profiles").update({ is_admin: newValue }).eq("id", targetUser.id)
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, is_admin: newValue } : u))
    )
  }

  async function toggleRead(msg: ContactMessage) {
    const supabase = createClient()
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id)
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: !m.read } : m))
  }

  if (authLoading) return null
  if (!profile?.is_admin) return null

  const totalUsers = users.length
  const totalPosts = posts.length
  const adminCount = users.filter((u) => u.is_admin).length
  const unreadCount = messages.filter((m) => !m.read).length

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
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Users", value: totalUsers, icon: Users, color: "text-[#1F3A93]" },
              { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-teal-600" },
              { label: "Admins", value: adminCount, icon: ShieldCheck, color: "text-amber-600" },
              { label: "Unread Msgs", value: tab === "messages" ? unreadCount : "—", icon: Mail, color: "text-[#CC2020]" },
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
            {(["users", "posts", "messages", "pipeline"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? "bg-[#1F3A93] text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {t === "messages" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC2020] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
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

          {/* Pipeline tab */}
          {tab === "pipeline" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-foreground flex items-center gap-2">
                      <Rss className="w-4 h-4 text-teal-600" />
                      News Pipeline
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fetches articles from GNews, clusters them with Claude, and updates the Spectrum page.
                      Requires <code className="bg-muted px-1 rounded text-[10px]">GNEWS_API_KEY</code> and{" "}
                      <code className="bg-muted px-1 rounded text-[10px]">ANTHROPIC_API_KEY</code> in Vercel.
                    </p>
                  </div>
                  <button
                    onClick={runPipeline}
                    disabled={pipelineRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${pipelineRunning ? "animate-spin" : ""}`} />
                    {pipelineRunning ? "Running…" : "Run Pipeline"}
                  </button>
                </div>

                {pipelineLogs.length > 0 && (
                  <div className="mt-4 bg-[#0D1117] rounded-xl p-4 font-mono text-xs space-y-1.5">
                    {pipelineLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 flex-shrink-0">{log.ts}</span>
                        {log.type === "ok" && <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />}
                        {log.type === "error" && <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                        {log.type === "info" && <span className="w-3.5 flex-shrink-0 text-slate-500">›</span>}
                        <span className={
                          log.type === "ok" ? "text-green-400" :
                          log.type === "error" ? "text-red-400" :
                          "text-slate-300"
                        }>{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-border p-4 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground text-sm mb-2">Required environment variables</p>
                {[
                  { name: "GNEWS_API_KEY", desc: "gnews.io — free tier sufficient for dev (100 req/day)" },
                  { name: "ANTHROPIC_API_KEY", desc: "console.anthropic.com — used by Claude Haiku for clustering" },
                  { name: "SUPABASE_SERVICE_ROLE_KEY", desc: "Supabase project settings → API → service_role key" },
                  { name: "CRON_SECRET", desc: "Any random string — only needed for automated cron jobs" },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex items-start gap-2">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono flex-shrink-0">{name}</code>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages tab */}
          {tab === "messages" && (
            <div className="space-y-3">
              {loadingData ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading messages…
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-10 text-center">
                  <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No contact messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const catMeta = {
                    business:   { icon: Briefcase,      label: "Business Inquiry", color: "bg-blue-100 text-[#1B2B5E]" },
                    suggestion: { icon: Lightbulb,      label: "Suggestion",       color: "bg-amber-100 text-amber-700" },
                    general:    { icon: MessageCircle,  label: "General",          color: "bg-teal-100 text-teal-700" },
                  }[msg.category]
                  const Icon = catMeta.icon
                  return (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-2xl border p-4 transition-colors ${msg.read ? "border-border opacity-70" : "border-[#CC2020]/30 shadow-sm"}`}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${catMeta.color}`}>
                            <Icon className="w-3 h-3" />
                            {catMeta.label}
                          </span>
                          {!msg.read && (
                            <span className="inline-block w-2 h-2 rounded-full bg-[#CC2020]" title="Unread" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleRead(msg)}
                          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 flex-shrink-0"
                        >
                          {msg.read ? "Mark unread" : "Mark read"}
                        </button>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-semibold text-foreground">{msg.name}</p>
                        <a href={`mailto:${msg.email}`} className="text-xs text-[#1B2B5E] hover:underline">{msg.email}</a>
                      </div>

                      <p className="text-sm text-foreground mt-3 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  )
                })
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
