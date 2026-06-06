"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Users, FileText, Trash2, RefreshCw, Rss, CheckCircle, XCircle, Mail, Briefcase, Lightbulb, MessageCircle, Vote, ExternalLink } from "lucide-react"
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

type Tab = "users" | "posts" | "pipeline" | "messages" | "claims"

interface CandidateClaim {
  slug: string
  candidate_name: string
  race_office: string
  claimed: boolean
  verified: boolean
  donorbox_campaign_url: string | null
  claimant_user_id: string | null
  claimant_name: string | null
  claimant_email: string | null
  claimant_role: string | null
  claimant_message: string | null
  created_at: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  category: "business" | "suggestion" | "general" | "claim"
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
  const [claims, setClaims] = useState<CandidateClaim[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([])
  const [claimAction, setClaimAction] = useState<Record<string, { donorboxDraft: string; saving: boolean; error: string | null }>>( {})

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

    if (tab === "claims") {
      const res = await fetch("/api/candidate/admin")
      if (res.ok) {
        const json = await res.json()
        setClaims(json.claims ?? [])
      }
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

  async function claimAdminAction(slug: string, action: string, extra?: Record<string, string>) {
    setClaimAction((prev) => ({ ...prev, [slug]: { ...prev[slug], saving: true, error: null, donorboxDraft: prev[slug]?.donorboxDraft ?? "" } }))
    try {
      const res = await fetch("/api/candidate/admin", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, action, ...extra }),
      })
      const json = await res.json()
      if (!res.ok) {
        setClaimAction((prev) => ({ ...prev, [slug]: { ...prev[slug], saving: false, error: json.error ?? "Failed" } }))
        return
      }
      // Refresh claims list
      setClaims((prev) =>
        prev.map((c) => {
          if (c.slug !== slug) return c
          if (action === "approve") return { ...c, verified: true }
          if (action === "set_donorbox") return { ...c, donorbox_campaign_url: extra?.donorbox_url ?? c.donorbox_campaign_url }
          if (action === "reject") return { ...c, verified: false, claimed: false }
          return c
        })
      )
    } catch (e) {
      setClaimAction((prev) => ({ ...prev, [slug]: { ...prev[slug], saving: false, error: String(e) } }))
    } finally {
      setClaimAction((prev) => ({ ...prev, [slug]: { ...prev[slug], saving: false } }))
    }
  }

  if (authLoading) return null
  if (!profile?.is_admin) return null

  const totalUsers = users.length
  const totalPosts = posts.length
  const adminCount = users.filter((u) => u.is_admin).length
  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="min-h-screen bg-paper-100">
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
              { label: "Total Users", value: totalUsers, icon: Users, color: "text-teal-600" },
              { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-teal-600" },
              { label: "Admins", value: adminCount, icon: ShieldCheck, color: "text-amber-600" },
              { label: "Unread Msgs", value: tab === "messages" ? unreadCount : "—", icon: Mail, color: "text-civic-red" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-4 bg-card border border-border rounded-xl p-1 w-fit flex-wrap">
            {(["users", "posts", "messages", "claims", "pipeline"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? "bg-teal-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {t === "messages" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-civic-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {loadingData ? (
                <div className="p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading users…
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-paper-100 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Joined</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-paper-50 transition-colors">
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
              <div className="bg-card rounded-2xl border border-border p-5">
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

              <div className="bg-card rounded-2xl border border-border p-4 text-xs text-muted-foreground space-y-1">
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
                <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading messages…
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-10 text-center">
                  <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No contact messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const catMeta = ({
                    business:   { icon: Briefcase,      label: "Business Inquiry", color: "bg-blue-100 text-ink-900" },
                    suggestion: { icon: Lightbulb,      label: "Suggestion",       color: "bg-amber-100 text-amber-700" },
                    general:    { icon: MessageCircle,  label: "General",          color: "bg-teal-100 text-teal-700" },
                    claim:      { icon: ShieldCheck,    label: "Profile Claim",    color: "bg-purple-100 text-purple-700" },
                  } as const)[msg.category] ?? { icon: MessageCircle, label: "Message", color: "bg-teal-100 text-teal-700" }
                  const Icon = catMeta.icon
                  return (
                    <div
                      key={msg.id}
                      className={`bg-card rounded-2xl border p-4 transition-colors ${msg.read ? "border-border opacity-70" : "border-civic-red/30 shadow-sm"}`}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${catMeta.color}`}>
                            <Icon className="w-3 h-3" />
                            {catMeta.label}
                          </span>
                          {!msg.read && (
                            <span className="inline-block w-2 h-2 rounded-full bg-civic-red" title="Unread" />
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
                        <a href={`mailto:${msg.email}`} className="text-xs text-teal-600 hover:underline">{msg.email}</a>
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
                <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading posts…
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-card rounded-2xl border border-border p-4">
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
          {/* Claims tab */}
          {tab === "claims" && (
            <div className="space-y-4">
              {loadingData ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm animate-pulse">
                  Loading claims…
                </div>
              ) : claims.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-10 text-center">
                  <Vote className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No candidate profile claims yet.</p>
                </div>
              ) : (
                claims.map((c) => {
                  const st = claimAction[c.slug] ?? { donorboxDraft: c.donorbox_campaign_url ?? "", saving: false, error: null }
                  return (
                    <div
                      key={c.slug}
                      className={`bg-card rounded-2xl border p-5 space-y-3 ${c.verified ? "border-teal-200" : "border-amber-200"}`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{c.candidate_name}</span>
                            {c.verified ? (
                              <span className="text-[11px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">✓ Verified</span>
                            ) : (
                              <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.race_office} · slug: <code className="font-mono text-[11px] bg-muted px-1 rounded">{c.slug}</code></p>
                        </div>
                        <a
                          href={`/elections/candidate/${c.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                        >
                          View profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Claimant info */}
                      {c.claimant_name && (
                        <div className="text-xs text-muted-foreground space-y-0.5 bg-paper-50 rounded-lg p-3">
                          <p><span className="font-semibold text-foreground">Claimant:</span> {c.claimant_name} · {c.claimant_email} · {c.claimant_role}</p>
                          {c.claimant_message && <p className="italic">"{c.claimant_message}"</p>}
                          <p>Submitted: {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      )}

                      {/* Donorbox URL */}
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1.5">Donorbox campaign URL</p>
                        <div className="flex gap-2 flex-wrap">
                          <input
                            type="url"
                            placeholder="https://donorbox.org/campaign-slug"
                            value={st.donorboxDraft}
                            onChange={(e) =>
                              setClaimAction((prev) => ({
                                ...prev,
                                [c.slug]: { ...st, donorboxDraft: e.target.value, error: null },
                              }))
                            }
                            className="flex-1 min-w-[200px] h-8 text-xs rounded-lg border border-border bg-paper-50 px-3 outline-none"
                          />
                          <button
                            disabled={st.saving}
                            onClick={() => claimAdminAction(c.slug, "set_donorbox", { donorbox_url: st.donorboxDraft })}
                            className="h-8 px-3 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                          >
                            {st.saving ? "Saving…" : "Save URL"}
                          </button>
                        </div>
                        {c.donorbox_campaign_url && (
                          <a href={c.donorbox_campaign_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-teal-600 hover:underline flex items-center gap-1 mt-1">
                            Current: {c.donorbox_campaign_url} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {st.error && <p className="text-[11px] text-red-500 mt-1">{st.error}</p>}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap pt-1 border-t border-border">
                        {!c.verified && (
                          <button
                            disabled={st.saving}
                            onClick={() => claimAdminAction(c.slug, "approve")}
                            className="h-7 px-3 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve claim
                          </button>
                        )}
                        <button
                          disabled={st.saving}
                          onClick={() => { if (confirm("Reject and reset this claim?")) claimAdminAction(c.slug, "reject") }}
                          className="h-7 px-3 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
