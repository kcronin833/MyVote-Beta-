"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
}
function ChatIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 01-12 7L4 21l1.7-4.6A8 8 0 1121 12z"/></svg>
}
function HeartIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
}
function SparkIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>
}
function UsersIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9.5" cy="7" r="3.5" /><path d="M21 21v-2a4 4 0 00-3-3.87M17 3.13a4 4 0 010 7.75" /></svg>
}
function ChevronRight({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
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

// ── Mock voter profile data (will be replaced with real data) ─────────────────

const VOTER_PROFILE = {
  name: "My Profile",
  handle: "",
  initials: "ME",
  city: "Atlanta",
  county: "Fulton County",
  district: "GA-5",
  bio: "Georgia voter. Interested in education, transit, and local government.",
  joined: "2026",
  streak: 7,
  stats: { followers: 0, following: 0, questions: 0, ballotsCast: 0 },
  issueProfile: [
    { name: "Healthcare",    lean: "left",   strength: 0.7 },
    { name: "Education",     lean: "left",   strength: 0.85 },
    { name: "Transit",       lean: "left",   strength: 0.6 },
    { name: "Taxes",         lean: "center", strength: 0.1 },
    { name: "Public safety", lean: "center", strength: 0.2 },
    { name: "Guns",          lean: "left",   strength: 0.5 },
  ],
  activity: [
    { kind: "answered", time: "2h",  text: "Answered today's Daily Question.", detail: "Yes" },
    { kind: "decided",  time: "3d",  text: "Decided on Governor", detail: "78% match" },
    { kind: "posted",   time: "5d",  text: "Asked a question in GA-5", likes: 12, replies: 4 },
  ],
  friends: [
    { name: "Devon W.", initials: "DW", lean: "left"   },
    { name: "Sarah K.", initials: "SK", lean: "right"  },
    { name: "Marcus T.", initials: "MT", lean: "center" },
    { name: "Lena P.",  initials: "LP", lean: "left"   },
    { name: "Ravi S.",  initials: "RS", lean: "center" },
  ],
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: "var(--ink-900)", color: "var(--paper-50)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: size * 0.36,
      letterSpacing: 0.2, flexShrink: 0,
    }}>{initials}</div>
  )
}

function AvatarPaper({ initials, size = 36 }: { initials: string; size?: number }) {
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

function StatBlock({ value, label }: { value: number | string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--ink-900)", letterSpacing: -0.4, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)" }}>
        {label}
      </span>
    </div>
  )
}

function SectionLabel({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "22px 16px 10px" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>
        {children}
      </span>
      {action && (
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 2, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--ink-700)" }}>
          {action} <ChevronRight />
        </span>
      )}
    </div>
  )
}

function ActivityIcon({ kind }: { kind: string }) {
  const icons: Record<string, React.ReactNode> = {
    answered: <CheckIcon />,
    followed: <UsersIcon />,
    posted:   <ChatIcon />,
    decided:  <CheckIcon />,
    commented:<ChatIcon />,
  }
  return (
    <span style={{ width: 18, height: 18, borderRadius: 99, background: "var(--paper-200)", color: "var(--ink-700)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {icons[kind] ?? <SparkIcon />}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  // Merge real profile data with defaults
  const p = {
    ...VOTER_PROFILE,
    name: profile?.display_name || VOTER_PROFILE.name,
    handle: profile?.username || "",
    initials: profile?.display_name
      ? profile.display_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : "ME",
    city: profile?.location || VOTER_PROFILE.city,
    bio: profile?.bio || VOTER_PROFILE.bio,
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--paper-100)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink-700)" }}>Sign in to see your profile</p>
        <Link href="/auth/signin">
          <button style={{
            background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
            padding: "12px 24px", borderRadius: 99, fontFamily: "var(--font-sans)",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Sign in</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 10px", background: "var(--paper-50)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <Logo size="sm" />
        <button
          onClick={() => signOut()}
          style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-500)", background: "transparent", border: "none", cursor: "pointer" }}
        >Sign out</button>
      </div>

      <div className="max-w-2xl mx-auto pb-28">

        {/* Hero card */}
        <div style={{ margin: "16px 16px 0", padding: "20px 18px 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <Avatar initials={p.initials} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--ink-900)", letterSpacing: -0.4, lineHeight: 1.1 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>
                {p.handle ? `@${p.handle} · ` : ""}{p.city}, GA{p.district ? ` · ${p.district}` : ""}
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.45, color: "var(--ink-700)", margin: "0 0 16px" }}>
            {p.bio}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--rule)" }}>
            <StatBlock value={p.stats.followers}    label="Followers" />
            <StatBlock value={p.stats.following}    label="Following" />
            <StatBlock value={p.stats.questions}    label="Answered" />
            <StatBlock value={p.stats.ballotsCast}  label="Ballots" />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Link href="/profile/edit" style={{ flex: 1 }}>
              <button style={{
                width: "100%", background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
                padding: "11px 12px", borderRadius: 10, fontFamily: "var(--font-sans)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>Edit profile</button>
            </Link>
            <button style={{
              flex: 1, background: "transparent", color: "var(--ink-900)",
              border: "1px solid var(--ink-400)", padding: "11px 12px", borderRadius: 10,
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>Share profile</button>
          </div>
        </div>

        {/* Streak card */}
        <div style={{
          margin: "14px 16px 0", padding: "14px 16px",
          background: "var(--ink-900)", color: "var(--paper-50)",
          borderRadius: 14, display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 600, letterSpacing: -1, lineHeight: 1 }}>
            {p.streak}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600 }}>Day streak</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(250,247,242,0.65)", marginTop: 2 }}>
              Answer today's question to keep it going.
            </div>
          </div>
          <Link href="/">
            <button style={{
              background: "var(--paper-50)", color: "var(--ink-900)", border: "none",
              padding: "8px 12px", borderRadius: 8, fontFamily: "var(--font-sans)",
              fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, cursor: "pointer",
            }}>OPEN</button>
          </Link>
        </div>

        {/* Issue profile */}
        <SectionLabel action="View details">Your issue profile</SectionLabel>
        <div style={{ margin: "0 16px", padding: "14px 16px 4px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14 }}>
          {p.issueProfile.map(iss => {
            const leanColor = iss.lean === "left" ? "#7796C2" : iss.lean === "right" ? "#C29377" : "#9CA39C"
            const dotPct = iss.lean === "left" ? 50 - iss.strength * 45 : iss.lean === "right" ? 50 + iss.strength * 45 : 50
            return (
              <div key={iss.name} style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 5,
                  fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)",
                }}>
                  <span>{iss.name}</span>
                  <span style={{ color: "var(--ink-500)", textTransform: "capitalize", fontSize: 11 }}>{iss.lean}</span>
                </div>
                <div style={{ position: "relative", height: 4, background: "var(--paper-200)", borderRadius: 99 }}>
                  <div style={{ position: "absolute", left: "50%", top: -3, width: 1, height: 10, background: "var(--ink-400)" }} />
                  <div style={{
                    position: "absolute", top: -3, left: `calc(${dotPct}% - 5px)`,
                    width: 10, height: 10, borderRadius: 99,
                    background: leanColor, border: "2px solid var(--paper-50)",
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Activity */}
        <SectionLabel action="See all">Recent activity</SectionLabel>
        <div style={{ margin: "0 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
          {p.activity.length === 0 ? (
            <div style={{ padding: "20px 16px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-500)", textAlign: "center" }}>
              Answer today's Daily Question to start your activity feed.
            </div>
          ) : p.activity.map((a, i) => (
            <div key={i} style={{ padding: "14px 16px", borderTop: i ? "1px solid var(--rule)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <ActivityIcon kind={a.kind} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--ink-500)" }}>
                  {a.kind}
                </span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-400)" }}>{a.time}</span>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.35, color: "var(--ink-900)" }}>
                {a.text}
              </div>
              {"detail" in a && a.detail && (
                <div style={{
                  marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 8px", borderRadius: 6, background: "var(--ink-100)", color: "var(--ink-900)",
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                }}>
                  <CheckIcon size={10} /> {a.detail}
                </div>
              )}
              {"likes" in a && a.likes !== undefined && (
                <div style={{ display: "flex", gap: 18, marginTop: 8, color: "var(--ink-500)", fontFamily: "var(--font-sans)", fontSize: 11 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><HeartIcon /> {a.likes}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><ChatIcon /> {"replies" in a ? a.replies : 0}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Friends across the spectrum */}
        <SectionLabel action="See all">Friends · across the spectrum</SectionLabel>
        <div style={{
          margin: "0 16px 20px", padding: "16px 16px",
          background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14,
          display: "flex", gap: 14, overflowX: "auto",
        }}>
          {p.friends.map(f => (
            <div key={f.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 56, flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <AvatarPaper initials={f.initials} size={44} />
                <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--paper-50)", borderRadius: 99, padding: 1 }}>
                  <LeanDot lean={f.lean} />
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-700)", fontWeight: 500, textAlign: "center" }}>
                {f.name}
              </span>
            </div>
          ))}
        </div>

        {/* Settings links */}
        <div style={{ margin: "0 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
          {[
            { label: "Notification settings", href: "/profile/notifications" },
            { label: "Political profile quiz", href: "/onboarding" },
            { label: "Privacy & data", href: "/privacy" },
            { label: "About MyVote", href: "/about" },
          ].map((item, i) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "15px 16px", borderTop: i ? "1px solid var(--rule)" : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)" }}>
                  {item.label}
                </span>
                <span style={{ color: "var(--ink-400)" }}><ChevronRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ margin: "20px 16px", textAlign: "center" }}>
          <button
            onClick={() => signOut()}
            style={{
              background: "transparent", border: "none", fontFamily: "var(--font-sans)",
              fontSize: 13, fontWeight: 600, color: "var(--ink-500)", cursor: "pointer",
            }}
          >Sign out</button>
        </div>
      </div>
    </div>
  )
}
