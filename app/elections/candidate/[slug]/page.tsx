"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"

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
function MapIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
}
function UsersIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M21 21v-2a4 4 0 00-3-3.87M17 3.13a4 4 0 010 7.75"/></svg>
}
function CheckIcon({ size = 9 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function ChevronIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
}
function VerifiedIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.39 2.05L17.55 4l.05 3.16L19.6 9.6l-1.6 2.4 1.6 2.4-2 2.44-.05 3.16-3.16-.05L12 22l-2.39-2.05L6.45 20l-.05-3.16L4.4 14.4 6 12 4.4 9.6l2-2.44L6.45 4l3.16.05L12 2z" fill="var(--ink-900)"/>
      <polyline points="8.5 12 11 14.5 15.5 9.5" fill="none" stroke="var(--paper-50)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Mock politician data ───────────────────────────────────────────────────────

const POLITICIAN = {
  name: "Marcus Holloway",
  initials: "MH",
  handle: "marcusholloway",
  verified: true,
  title: "U.S. Senate Candidate",
  party: "Democratic",
  district: "Georgia",
  election: "Nov 3, 2026",
  location: "Lives in Decatur, GA",
  bio: "Civil rights attorney and two-term DeKalb County Commissioner. Running to bring honest representation back to Georgia families.",
  stats: { followers: 28400, following: 312, yourMatch: 84, events: 4 },
  keyIssues: [
    { name: "Healthcare",   stance: "Defend the Affordable Care Act and expand Medicaid in Georgia.", agrees: true },
    { name: "Voting rights", stance: "Federal protection for early voting, drop boxes, mail ballots.", agrees: true },
    { name: "Education",    stance: "Raise teacher pay statewide; debt-free public college.", agrees: true },
    { name: "Climate",      stance: "Clean energy jobs in Georgia; protect Okefenokee from mining.", agrees: true },
  ],
  record: [
    { date: "Mar 2026", text: "Sponsored DeKalb broadband ordinance (passed 6–1)." },
    { date: "Jan 2026", text: "Voted yes on county affordable-housing trust fund." },
    { date: "Nov 2025", text: "Held 9 in-person town halls across DeKalb." },
  ],
  endorsements: [
    "Georgia AFL-CIO",
    "Sierra Club Georgia",
    "Atlanta Journal-Constitution Editorial Board",
    "Rep. Nikema Williams",
  ],
  events: [
    { date: "May 18", title: "Town Hall: Healthcare in Georgia", place: "Decatur Recreation Center · 7:00 PM" },
    { date: "May 22", title: "Meet & Greet — Sandy Springs",    place: "City Hall Plaza · 12:30 PM" },
    { date: "May 29", title: "Rally for Voting Rights",          place: "State Capitol · 11:00 AM" },
  ],
  posts: [
    {
      id: "p1", time: "3h",
      text: "Met with teachers in Clayton County this morning. Class sizes are up, pay still trails Alabama. We can fix this in 2026 — fully fund the QBE formula and stop dipping into the reserve.",
      likes: 1240, comments: 86, reposts: 184,
      attachment: { kind: "issue", label: "Education" },
    },
    {
      id: "p2", time: "1d",
      text: "Senate Bill 287 is in committee this week. I support raising the minimum age for assault weapon purchases to 21. Georgia gun owners I've spoken with overwhelmingly agree.",
      likes: 3210, comments: 412, reposts: 540,
      attachment: { kind: "poll", question: "Should the age be raised to 21?", yes: 62, no: 28, unsure: 10 },
    },
    {
      id: "p3", time: "3d",
      text: "Thanks to the 400+ neighbors who came out in Decatur last night. Healthcare costs came up at every single table. I'm taking your stories with me to D.C.",
      likes: 894, comments: 47, reposts: 73,
      attachment: { kind: "image", caption: "Town hall · Decatur Rec Center" },
    },
  ],
}

type Tab = "Overview" | "Updates" | "Positions" | "Events" | "Record"

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 76, border = false }: { initials: string; size?: number; border?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: "var(--paper-200)", color: "var(--ink-900)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: size * 0.36,
      letterSpacing: 0.2, flexShrink: 0,
      ...(border ? { border: "4px solid var(--paper-50)" } : {}),
    }}>{initials}</div>
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
          {action} <ChevronIcon size={11} />
        </span>
      )}
    </div>
  )
}

function PostActionBar({ likes, comments, reposts }: { likes: number; comments: number; reposts: number }) {
  const Item = ({ Icon, n }: { Icon: React.FC<{ size?: number }>; n: number }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-500)", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500 }}>
      <Icon /> <span>{n >= 1000 ? (n / 1000).toFixed(1) + "k" : n}</span>
    </span>
  )
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 12 }}>
      <Item Icon={HeartIcon} n={likes} />
      <Item Icon={ChatIcon} n={comments} />
      <Item Icon={RepostIcon} n={reposts} />
      <span style={{ marginLeft: "auto", color: "var(--ink-500)" }}><ShareIcon /></span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

import { useState } from "react"

export default function CandidatePage() {
  const [tab, setTab] = useState<Tab>("Overview")
  const p = POLITICIAN

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {/* Mini top bar */}
      <div style={{
        display: "flex", alignItems: "center", padding: "10px 16px",
        background: "var(--paper-50)", borderBottom: "1px solid var(--rule)",
        gap: 12,
      }}>
        <Link href="/elections" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", fontWeight: 600, textDecoration: "none" }}>
          ← Back
        </Link>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--ink-700)" }}><ShareIcon size={16} /></span>
      </div>

      <div className="max-w-2xl mx-auto pb-28">
        {/* Hero card with navy banner */}
        <div style={{ margin: "16px 16px 0", borderRadius: 16, overflow: "hidden", background: "var(--paper-50)", border: "1px solid var(--rule)" }}>
          {/* Banner */}
          <div style={{ height: 86, background: "linear-gradient(135deg, #18244B 0%, #2A3865 100%)", position: "relative" }}>
            <svg viewBox="0 0 400 86" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
              <path d="M0 80 Q100 20 200 50 T400 30 L400 86 L0 86 Z" fill="white" />
            </svg>
          </div>

          <div style={{ padding: "0 18px 16px", marginTop: -38 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Avatar initials={p.initials} size={76} border />
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <button style={{
                  background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
                  padding: "9px 16px", borderRadius: 999, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12.5, cursor: "pointer",
                }}>+ Follow</button>
                <button style={{
                  background: "var(--civic-red)", color: "#fff", border: "none",
                  padding: "9px 16px", borderRadius: 999, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12.5,
                  display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
                }}>
                  <HeartIcon size={12} /> Donate
                </button>
              </div>
            </div>

            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: "var(--ink-900)", lineHeight: 1 }}>
                {p.name}
              </span>
              {p.verified && <VerifiedIcon />}
            </div>
            <div style={{ marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)" }}>
              @{p.handle} · {p.title} · {p.district}
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.45, color: "var(--ink-700)", margin: "12px 0 14px" }}>
              {p.bio}
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)", paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapIcon /> {p.location}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><UsersIcon /> {(p.stats.followers / 1000).toFixed(1)}k followers</span>
            </div>
          </div>
        </div>

        {/* Your match strip */}
        <div style={{
          margin: "14px 16px 0", padding: "16px 18px",
          background: "var(--ink-900)", color: "var(--paper-50)", borderRadius: 14,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1 }}>
            {p.stats.yourMatch}%
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(250,247,242,0.6)" }}>
              Your match
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, marginTop: 2 }}>
              You agree on healthcare, education, and climate.
            </div>
          </div>
          <span style={{ color: "var(--paper-50)" }}><ChevronIcon size={14} /></span>
        </div>

        {/* Tabs */}
        <div style={{ margin: "16px 16px 0", display: "flex", gap: 4, padding: 4, background: "var(--paper-200)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600 }}>
          {(["Overview", "Updates", "Positions", "Events", "Record"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t ? "var(--paper-50)" : "transparent",
              color: tab === t ? "var(--ink-900)" : "var(--ink-500)",
            }}>{t}</button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === "Overview" && (
          <>
            <SectionLabel action={`${p.keyIssues.length} positions`}>Where I stand</SectionLabel>
            <div style={{ margin: "0 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
              {p.keyIssues.map((iss, i) => (
                <div key={iss.name} style={{ padding: "14px 16px", borderTop: i ? "1px solid var(--rule)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-700)" }}>
                      {iss.name}
                    </span>
                    {iss.agrees && (
                      <span style={{
                        marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 8px", borderRadius: 999, background: "#DDECE9", color: "#1F5B53",
                        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
                      }}>
                        <CheckIcon /> Agrees w/ you
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.4, color: "var(--ink-900)" }}>
                    {iss.stance}
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel action="All events">Upcoming events</SectionLabel>
            <div style={{ margin: "0 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
              {p.events.map((e, i) => {
                const [mon, day] = e.date.split(" ")
                return (
                  <div key={e.title} style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center", borderTop: i ? "1px solid var(--rule)" : "none" }}>
                    <div style={{ width: 44, textAlign: "center", padding: "6px 0", background: "var(--paper-100)", borderRadius: 8 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-500)" }}>{mon}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1, marginTop: 2 }}>{day}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.25 }}>{e.title}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)", marginTop: 3 }}>{e.place}</div>
                    </div>
                    <span style={{ color: "var(--ink-400)" }}><ChevronIcon /></span>
                  </div>
                )
              })}
            </div>

            <SectionLabel>Endorsed by</SectionLabel>
            <div style={{ margin: "0 16px", padding: "14px 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.endorsements.map(e => (
                <span key={e} style={{ padding: "6px 10px", background: "var(--paper-100)", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500, color: "var(--ink-700)" }}>
                  {e}
                </span>
              ))}
            </div>

            <div style={{ margin: "16px 16px", padding: "10px 14px", fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)", lineHeight: 1.5, textAlign: "center" }}>
              Donations routed via verified fundraising partner. Federal contribution limits apply.
            </div>
          </>
        )}

        {/* ── Updates tab ── */}
        {tab === "Updates" && (
          <div style={{ margin: "14px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
            {p.posts.map(post => (
              <article key={post.id} style={{ background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar initials={p.initials} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{p.name}</span>
                      <VerifiedIcon size={11} />
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>· {post.time}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>@{p.handle}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.45, color: "var(--ink-900)" }}>
                  {post.text}
                </div>
                {post.attachment?.kind === "poll" && "question" in post.attachment && (
                  <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)", borderRadius: 10, background: "var(--paper-100)" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--ink-900)", marginBottom: 10 }}>
                      {post.attachment.question as string}
                    </div>
                    {[
                      { label: "Yes", val: post.attachment.yes as number },
                      { label: "No", val: post.attachment.no as number },
                      { label: "Need more info", val: post.attachment.unsure as number },
                    ].map(opt => (
                      <div key={opt.label} style={{ position: "relative", marginBottom: 5, padding: "8px 11px", borderRadius: 6, background: "var(--paper-50)", border: "1px solid var(--rule)", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ position: "absolute", inset: 0, width: `${opt.val}%`, background: "var(--ink-100)" }} />
                        <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--ink-900)" }}>{opt.label}</span>
                        <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--ink-700)" }}>{opt.val}%</span>
                      </div>
                    ))}
                  </div>
                )}
                {post.attachment?.kind === "image" && (
                  <div style={{ marginTop: 12, height: 130, borderRadius: 10, background: "linear-gradient(135deg, #DDD6C7 0%, #B5AC97 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 10 }}>
                    <div style={{ padding: "4px 9px", background: "rgba(26,33,56,0.78)", color: "var(--paper-50)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 500 }}>
                      {"caption" in post.attachment ? post.attachment.caption : ""}
                    </div>
                  </div>
                )}
                {post.attachment?.kind === "issue" && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{ padding: "3px 8px", borderRadius: 999, background: "var(--paper-100)", border: "1px solid var(--rule)", fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600, color: "var(--ink-700)" }}>
                      Tagged · {"label" in post.attachment ? post.attachment.label : ""}
                    </span>
                  </div>
                )}
                <PostActionBar likes={post.likes} comments={post.comments} reposts={post.reposts} />
              </article>
            ))}
          </div>
        )}

        {/* ── Record tab ── */}
        {tab === "Record" && (
          <>
            <SectionLabel>Voting & action record</SectionLabel>
            <div style={{ margin: "0 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
              {p.record.map((r, i) => (
                <div key={i} style={{ padding: "14px 16px", borderTop: i ? "1px solid var(--rule)" : "none", display: "flex", gap: 12 }}>
                  <div style={{ minWidth: 64, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--ink-500)" }}>{r.date}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.4, color: "var(--ink-900)" }}>{r.text}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state for other tabs */}
        {(tab === "Positions" || tab === "Events") && (
          <div style={{ margin: "20px 16px", padding: "24px 16px", background: "var(--paper-50)", border: "1px solid var(--rule)", borderRadius: 14, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--ink-500)", margin: 0 }}>
              {tab === "Positions" ? "Full position details coming soon." : "Event details coming soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
