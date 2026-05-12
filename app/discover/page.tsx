"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { NotificationBell } from "@/components/notification-bell"
import { UserNav } from "@/components/user-nav"

// ── Icons ─────────────────────────────────────────────────────────────────────

function HeartIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
}
function ChatIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 01-12 7L4 21l1.7-4.6A8 8 0 1121 12z"/></svg>
}
function RepostIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
}
function ShareIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
}
function MapPinIcon({ size = 10 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
}
function PlusIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function PollIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="20" x2="6" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/></svg>
}
function EventIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>
}

// ── LeanDot ───────────────────────────────────────────────────────────────────

function LeanDot({ lean }: { lean: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    left:   { bg: "#7796C2", label: "L" },
    right:  { bg: "#C29377", label: "R" },
    center: { bg: "#9CA39C", label: "C" },
  }
  const s = map[lean] ?? map.center
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 14, height: 14, borderRadius: 999, background: s.bg,
      color: "#fff", fontSize: 8, fontWeight: 700, flexShrink: 0,
    }}>{s.label}</span>
  )
}

function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: "var(--paper-200)", color: "var(--ink-900)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: size * 0.36,
      letterSpacing: 0.2, flexShrink: 0,
    }}>{initials}</div>
  )
}

// ── Community data ─────────────────────────────────────────────────────────────

const TOPICS = [
  { tag: "MARTA expansion",  count: 184 },
  { tag: "Property tax",     count: 142 },
  { tag: "School bonds",     count: 89 },
  { tag: "Zoning",           count: 67 },
  { tag: "Public safety",    count: 54 },
]

interface PostOption { label: string; val: number }
interface PostAuthor { name: string; initials: string; lean: string; district: string; verified?: boolean }
interface TopReply { author: { name: string; initials: string; lean: string }; text: string; likes: number }

interface Post {
  id: string
  author: PostAuthor
  time: string
  scope: string
  kind: "question" | "poll" | "event" | "report"
  text: string
  tags?: string[]
  replies: number
  likes: number
  reposts?: number
  poll?: { question: string; options: PostOption[]; totalVotes: number }
  event?: { date: string; place: string }
  attachment?: { kind: string; caption?: string }
  topReply?: TopReply
}

const POSTS: Post[] = [
  {
    id: "c1",
    author: { name: "Devon W.", initials: "DW", lean: "left", district: "GA-5" },
    time: "12m", scope: "GA-5 · Fulton", kind: "question",
    text: "Anyone else get a property tax reassessment notice this week? Mine jumped 18%. What is the cap proposal actually doing — is it a freeze or a slowdown?",
    tags: ["Property tax"], replies: 14, likes: 23, reposts: 3,
    topReply: {
      author: { name: "Marcus T.", initials: "MT", lean: "center" },
      text: "It's a 3% annual increase cap on assessed value for primary residences. Doesn't roll back the current bump — caps the next one.",
      likes: 18,
    },
  },
  {
    id: "c2",
    author: { name: "Sarah K.", initials: "SK", lean: "right", district: "GA-6" },
    time: "34m", scope: "GA-6 · Sandy Springs", kind: "event",
    text: "Heading to the Sandy Springs town hall on the bond referendum tonight, 7pm at City Hall. Looking for a ride from Buckhead — DM me. Reporting back here after.",
    event: { date: "Tonight · 7:00 PM", place: "Sandy Springs City Hall" },
    replies: 8, likes: 31, reposts: 4,
  },
  {
    id: "c3",
    author: { name: "Lena P.", initials: "LP", lean: "left", district: "GA-5" },
    time: "1h", scope: "GA-5 · Atlanta", kind: "poll",
    text: "Quick neighbor poll — Beltline rail Phase 2 funding. Yes, no, or wait for cost overrun review?",
    poll: {
      question: "Beltline Phase 2 funding — your call?",
      options: [
        { label: "Yes, fund now",      val: 52 },
        { label: "No, redirect to bus", val: 23 },
        { label: "Wait for review",     val: 25 },
      ],
      totalVotes: 287,
    },
    replies: 41, likes: 96, reposts: 12,
  },
  {
    id: "c4",
    author: { name: "Marcus T.", initials: "MT", lean: "center", district: "GA-5" },
    time: "3h", scope: "GA-5 · DeKalb", kind: "report",
    text: "Just left the school board meeting. Two takeaways: (1) the literacy curriculum vote got pushed to June, (2) public comment was overwhelmingly against the proposed bus route changes. Minutes posted tomorrow.",
    tags: ["School bonds"],
    replies: 22, likes: 142, reposts: 18,
    attachment: { kind: "image", caption: "DeKalb school board · public comment" },
  },
  {
    id: "c5",
    author: { name: "Ravi S.", initials: "RS", lean: "center", district: "GA-5", verified: true },
    time: "5h", scope: "GA-5 · Atlanta", kind: "question",
    text: "Has anyone actually used the new constituent services line at Rep. Williams' office? Trying to get a passport question resolved before a trip. Worth calling or just paperwork?",
    replies: 6, likes: 11,
  },
]

// ── Post components ───────────────────────────────────────────────────────────

type KindType = "question" | "poll" | "event" | "report"

const KIND_MAP: Record<KindType, { label: string; bg: string }> = {
  question: { label: "QUESTION", bg: "#F1ECDF" },
  poll:     { label: "POLL",     bg: "#E4ECF1" },
  event:    { label: "EVENT",    bg: "#F1E4DF" },
  report:   { label: "REPORT",   bg: "#E5ECE3" },
}

function PostActionBar({ likes, comments, reposts }: { likes: number; comments: number; reposts?: number }) {
  const Item = ({ Icon, n }: { Icon: React.FC<{ size?: number }>; n: number }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-500)", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500 }}>
      <Icon /> <span>{n >= 1000 ? (n / 1000).toFixed(1) + "k" : n}</span>
    </span>
  )
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 12 }}>
      <Item Icon={HeartIcon} n={likes} />
      <Item Icon={ChatIcon} n={comments} />
      {reposts !== undefined && <Item Icon={RepostIcon} n={reposts} />}
      <span style={{ marginLeft: "auto", color: "var(--ink-500)" }}><ShareIcon /></span>
    </div>
  )
}

function CommunityPost({ post, embedded = false }: { post: Post; embedded?: boolean }) {
  const [voted, setVoted] = useState<number | null>(null)
  const kind = KIND_MAP[post.kind] ?? KIND_MAP.question

  return (
    <article style={{ background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, padding: "14px 16px" }}>
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ position: "relative" }}>
          <Avatar initials={post.author.initials} size={36} />
          <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--paper-50)", borderRadius: 99, padding: 1 }}>
            <LeanDot lean={post.author.lean} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
              {post.author.name}
            </span>
            {post.author.verified && (
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.39 2.05L17.55 4l.05 3.16L19.6 9.6l-1.6 2.4 1.6 2.4-2 2.44-.05 3.16-3.16-.05L12 22l-2.39-2.05L6.45 20l-.05-3.16L4.4 14.4 6 12 4.4 9.6l2-2.44L6.45 4l3.16.05L12 2z" fill="var(--ink-900)"/>
                <polyline points="8.5 12 11 14.5 15.5 9.5" fill="none" stroke="var(--paper-50)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>· {post.time}</span>
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 4 }}>
            <MapPinIcon /> {post.scope}
          </div>
        </div>
        <span style={{ padding: "2px 7px", borderRadius: 4, background: kind.bg, fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: "var(--ink-700)" }}>
          {kind.label}
        </span>
      </div>

      {/* Text */}
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.45, color: "var(--ink-900)" }}>
        {post.text}
      </div>

      {/* Poll */}
      {post.poll && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)", borderRadius: 10, background: "var(--paper-100)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--ink-900)", marginBottom: 10 }}>
            {post.poll.question}
          </div>
          {post.poll.options.map((opt, i) => (
            <div
              key={opt.label}
              onClick={() => setVoted(i)}
              style={{
                position: "relative", marginBottom: 5, padding: "8px 11px",
                borderRadius: 6, background: "var(--paper-50)", border: `1px solid ${voted === i ? "var(--ink-900)" : "var(--rule)"}`,
                overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", inset: 0, width: `${opt.val}%`, background: "var(--ink-100)", opacity: voted !== null ? 1 : 0, transition: "opacity .3s" }} />
              <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--ink-900)" }}>{opt.label}</span>
              {voted !== null && <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--ink-700)" }}>{opt.val}%</span>}
            </div>
          ))}
          <div style={{ marginTop: 6, fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)" }}>
            {post.poll.totalVotes} neighbor votes
          </div>
        </div>
      )}

      {/* Event */}
      {post.event && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)", borderRadius: 10, background: "var(--paper-100)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--ink-900)", color: "var(--paper-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EventIcon size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>{post.event.date}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{post.event.place}</div>
          </div>
          <button style={{ background: "var(--ink-900)", color: "var(--paper-50)", border: "none", padding: "7px 12px", borderRadius: 999, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            RSVP
          </button>
        </div>
      )}

      {/* Image attachment */}
      {post.attachment?.kind === "image" && (
        <div style={{
          marginTop: 12, height: 140, borderRadius: 10,
          background: "linear-gradient(135deg, #5C6C8A 0%, #2B3550 100%)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "flex-end", padding: 10,
        }}>
          <div style={{ padding: "4px 9px", background: "rgba(26,33,56,0.78)", color: "var(--paper-50)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 500 }}>
            {post.attachment.caption}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && (
        <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {post.tags.map(t => (
            <span key={t} style={{ padding: "3px 8px", borderRadius: 4, background: "var(--paper-100)", fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 500, color: "var(--ink-700)" }}>#{t}</span>
          ))}
        </div>
      )}

      <PostActionBar likes={post.likes} comments={post.replies} reposts={post.reposts} />

      {/* Top reply */}
      {post.topReply && !embedded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)", display: "flex", gap: 10 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: "var(--paper-200)", borderRadius: 4, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Avatar initials={post.topReply.author.initials} size={20} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--ink-900)" }}>
                {post.topReply.author.name}
              </span>
              <LeanDot lean={post.topReply.author.lean} />
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-400)" }}>↑ {post.topReply.likes}</span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.4, color: "var(--ink-700)" }}>
              {post.topReply.text}
            </div>
          </div>
        </div>
      )}

      {post.replies > 1 && !embedded && (
        <div style={{ marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--ink-700)" }}>
          View {post.replies - 1} more {post.replies - 1 === 1 ? "reply" : "replies"} ›
        </div>
      )}
    </article>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type Scope = 0 | 1 | 2
const SCOPE_LABELS = [
  { l: "My district", s: "GA-5" },
  { l: "My county",   s: "Fulton" },
  { l: "Georgia",     s: "Statewide" },
]

export default function DiscoverPage() {
  const { user, profile } = useAuth()
  const [scope, setScope] = useState<Scope>(0)
  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ME"

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 10px", background: "var(--paper-50)", borderBottom: "1px solid var(--rule)",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--ink-500)", letterSpacing: 0.4 }}>
            {profile?.location || "Atlanta"}, Georgia
          </div>
          <Logo size="sm" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--ink-700)" }}>
          <NotificationBell />
          {user && <UserNav />}
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-28">
        {/* Scope switcher */}
        <div style={{ margin: "14px 16px 12px", display: "flex", gap: 4, padding: 4, background: "var(--paper-200)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600 }}>
          {SCOPE_LABELS.map((t, i) => (
            <button key={t.l} onClick={() => setScope(i as Scope)} style={{
              flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              background: scope === i ? "var(--paper-50)" : "transparent",
              color: scope === i ? "var(--ink-900)" : "var(--ink-500)",
            }}>
              <div>{t.l}</div>
              <div style={{ fontSize: 9.5, fontWeight: 500, color: scope === i ? "var(--ink-500)" : "var(--ink-400)", marginTop: 1 }}>{t.s}</div>
            </button>
          ))}
        </div>

        {/* Composer */}
        {user ? (
          <div style={{ margin: "0 16px 12px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, padding: "14px 14px 12px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar initials={initials} size={36} />
              <div style={{
                flex: 1, padding: "10px 12px", border: "1px solid var(--rule)", borderRadius: 999,
                background: "var(--paper-100)", fontFamily: "var(--font-serif)", fontSize: 13.5, color: "var(--ink-500)",
              }}>
                What's happening in {SCOPE_LABELS[scope].s}?
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)", overflowX: "auto" }}>
              {[
                { icon: <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>?</span>, label: "Question" },
                { icon: <PollIcon />, label: "Poll" },
                { icon: <EventIcon />, label: "Event" },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><polyline points="21 16 16 11 5 20"/></svg>, label: "Photo" },
              ].map(b => (
                <button key={b.label} style={{
                  padding: "6px 11px", borderRadius: 999,
                  background: "var(--paper-100)", border: "1px solid var(--rule)",
                  fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600,
                  color: "var(--ink-700)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer",
                }}>
                  {b.icon} {b.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ margin: "0 16px 12px", padding: "16px 18px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--ink-700)", margin: "0 0 12px" }}>
              Sign in to post and participate in your district
            </p>
            <Link href="/auth/signin">
              <button style={{ background: "var(--ink-900)", color: "var(--paper-50)", border: "none", padding: "10px 20px", borderRadius: 99, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Sign in
              </button>
            </Link>
          </div>
        )}

        {/* Trending topics */}
        <div style={{ margin: "0 16px 4px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>
            Trending here · 312 active
          </span>
        </div>
        <div style={{ margin: "8px 16px 14px", display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {TOPICS.map(t => (
            <button key={t.tag} style={{
              padding: "6px 11px", borderRadius: 999,
              background: "var(--paper-50)", border: "1px solid var(--rule)",
              fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500,
              color: "var(--ink-700)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
            }}>
              #{t.tag} <span style={{ color: "var(--ink-400)", fontSize: 10.5 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {POSTS.map(p => <CommunityPost key={p.id} post={p} />)}
        </div>
      </div>

      {/* FAB */}
      {user && (
        <button style={{
          position: "fixed", right: 20, bottom: 88, width: 54, height: 54, borderRadius: 999,
          background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
          boxShadow: "0 12px 28px rgba(26,33,56,0.32), 0 2px 6px rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, cursor: "pointer",
        }}>
          <PlusIcon />
        </button>
      )}
    </div>
  )
}
