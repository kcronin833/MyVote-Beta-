"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { formatNewsTime } from "@/lib/news-service"
import { CommentSystem } from "@/components/comment-system"

// ── Design Atoms ──────────────────────────────────────────────────────────────

function LeanDot({ lean }: { lean: "left" | "right" | "center" | string }) {
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
    }} title={`${lean} perspective`}>{s.label}</span>
  )
}

type PillTone = "ink" | "paper" | "ghost" | "teal" | "red"
function Pill({ children, tone = "ink", style }: { children: React.ReactNode; tone?: PillTone; style?: React.CSSProperties }) {
  const tones: Record<PillTone, { bg: string; fg: string; bd: string }> = {
    ink:   { bg: "var(--paper-200)", fg: "var(--ink-700)",  bd: "transparent" },
    red:   { bg: "#F7E6E1",          fg: "#8C2510",         bd: "transparent" },
    teal:  { bg: "#DDECE9",          fg: "#1F5B53",         bd: "transparent" },
    paper: { bg: "var(--paper-50)",  fg: "var(--ink-700)",  bd: "var(--rule)" },
    ghost: { bg: "transparent",      fg: "var(--ink-500)",  bd: "var(--rule)" },
  }
  const t = tones[tone]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontFamily: "var(--font-sans)", fontWeight: 600,
      fontSize: 10.5, letterSpacing: 0.4, textTransform: "uppercase",
      lineHeight: 1, ...style,
    }}>{children}</span>
  )
}

function ProgressBar({ value, max, tone = "ink" }: { value: number; max: number; tone?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  const fill = tone === "teal" ? "var(--common-teal)" : "var(--ink-900)"
  return (
    <div style={{ width: "100%", height: 5, background: "rgba(0,0,0,0.10)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: fill, borderRadius: 99, transition: "width .4s ease" }} />
    </div>
  )
}

function SplitBar({ segs, height = 8 }: { segs: { label: string; value: number; color: string }[]; height?: number }) {
  const total = segs.reduce((s, x) => s + x.value, 0)
  return (
    <div style={{ display: "flex", width: "100%", height, borderRadius: 99, overflow: "hidden", background: "var(--paper-200)" }}>
      {segs.map((s, i) => (
        <div key={i} title={`${s.label}: ${Math.round((s.value / total) * 100)}%`}
          style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
      ))}
    </div>
  )
}

// ── Daily Question ────────────────────────────────────────────────────────────

const DAILY_QUESTIONS = [
  {
    prompt: "Should Georgia raise the minimum age for assault weapon purchases to 21?",
    context: "Senate Bill 287 is in committee this week.",
    choices: [
      { id: "yes",    label: "Yes",           count: 4218 },
      { id: "no",     label: "No",            count: 2891 },
      { id: "unsure", label: "Need more info", count: 1104 },
    ],
    countyBreakdown: { yes: 58, no: 31, unsure: 11 },
    stateBreakdown:  { yes: 51, no: 38, unsure: 11 },
    neighborsAnswered: 14,
  },
  {
    prompt: "Do you support expanding Medicaid coverage to low-income Georgians?",
    context: "Georgia's Pathways to Coverage program covers only a fraction of the gap.",
    choices: [
      { id: "yes",    label: "Yes — expand fully", count: 5120 },
      { id: "no",     label: "No — keep current limits", count: 2340 },
      { id: "unsure", label: "Need more info", count: 890 },
    ],
    countyBreakdown: { yes: 63, no: 28, unsure: 9 },
    stateBreakdown:  { yes: 57, no: 32, unsure: 11 },
    neighborsAnswered: 22,
  },
  {
    prompt: "Should Georgia require photo ID to vote by mail?",
    context: "A new bill passed committee last week and heads to a full Senate vote.",
    choices: [
      { id: "yes",    label: "Yes", count: 3800 },
      { id: "no",     label: "No",  count: 3200 },
      { id: "unsure", label: "Not sure", count: 980 },
    ],
    countyBreakdown: { yes: 44, no: 47, unsure: 9 },
    stateBreakdown:  { yes: 49, no: 43, unsure: 8 },
    neighborsAnswered: 18,
  },
]

function BreakdownRow({ label, pct }: { label: string; pct: { yes: number; no: number; unsure: number } }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 11.5, marginBottom: 4, color: "var(--ink-700)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--ink-500)" }}>{pct.yes}% yes · {pct.no}% no · {pct.unsure}% unsure</span>
      </div>
      <SplitBar segs={[
        { label: "yes",    value: pct.yes,    color: "var(--ink-900)" },
        { label: "no",     value: pct.no,     color: "var(--ink-400)" },
        { label: "unsure", value: pct.unsure, color: "var(--paper-200)" },
      ]} />
    </div>
  )
}

function DailyQuestion({ streak = 1 }: { streak?: number }) {
  const today = new Date()
  const q = DAILY_QUESTIONS[today.getDate() % DAILY_QUESTIONS.length]
  const [picked, setPicked] = useState<string | null>(null)
  const answered = picked !== null
  const totalVotes = q.choices.reduce((s, c) => s + c.count, 0)

  return (
    <div style={{
      padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Pill tone="ink">
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          </svg>
          Daily Question · Day {streak}
        </Pill>
      </div>

      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 19,
        lineHeight: 1.25, letterSpacing: -0.2, color: "var(--ink-900)",
        margin: "0 0 6px",
      }}>{q.prompt}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)", margin: "0 0 14px" }}>
        {q.context}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {q.choices.map((c) => {
          const pct = Math.round((c.count / totalVotes) * 100)
          const isPicked = picked === c.id
          return (
            <button
              key={c.id}
              onClick={() => !answered && setPicked(c.id)}
              style={{
                position: "relative", overflow: "hidden",
                border: `1px solid ${isPicked ? "var(--ink-900)" : "var(--rule)"}`,
                background: answered ? "var(--paper-100)" : "var(--paper-50)",
                borderRadius: 10, padding: "11px 13px",
                cursor: answered ? "default" : "pointer",
                fontFamily: "var(--font-sans)", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
              }}
            >
              {answered && (
                <div style={{
                  position: "absolute", inset: 0, width: `${pct}%`,
                  background: isPicked ? "var(--ink-100)" : "var(--paper-200)",
                  transition: "width .5s ease",
                }} />
              )}
              <span style={{
                position: "relative", display: "inline-flex",
                alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500,
                color: "var(--ink-900)",
              }}>
                {isPicked && (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {c.label}
              </span>
              {answered && (
                <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--ink-700)" }}>
                  {pct}%
                </span>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 8,
          }}>How Georgia answered</div>
          <BreakdownRow label="Fulton County" pct={q.countyBreakdown} />
          <BreakdownRow label="Georgia statewide" pct={q.stateBreakdown} />
          <div style={{ marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
            {q.neighborsAnswered} people in your district answered today.
          </div>
        </div>
      )}

      {!answered && (
        <div style={{ marginTop: 12, fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
          {totalVotes.toLocaleString()} Georgians answered so far. Tap to see the breakdown.
        </div>
      )}
    </div>
  )
}

// ── Story Card ────────────────────────────────────────────────────────────────

interface PerspectiveArticle {
  source_name: string
  lean: number
  lean_label: string
  url: string
  title: string
}

interface NewsStory {
  id: string
  headline: string
  synopsis: string
  lean_min: number
  lean_max: number
  created_at: string
  article_data: PerspectiveArticle[]
}

function getLean(lean: number): "left" | "center" | "right" {
  if (lean < -1) return "left"
  if (lean > 1) return "right"
  return "center"
}

function getLeanLabel(lean: "left" | "center" | "right") {
  if (lean === "left") return "Left lens"
  if (lean === "right") return "Right lens"
  return "Shared lens"
}

function PerspectiveRow({ article }: { article: PerspectiveArticle }) {
  const side = getLean(article.lean)
  const label = getLeanLabel(side)
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", gap: 10, padding: "10px 12px",
        background: "var(--paper-100)", borderRadius: 10,
        textDecoration: "none",
      }}
    >
      <LeanDot lean={side} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 0.8, textTransform: "uppercase", color: "var(--ink-500)",
        }}>
          <span>{label}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>{article.source_name}</span>
        </div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.4,
          color: "var(--ink-900)", fontWeight: 500,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        } as React.CSSProperties}>{article.title}</div>
      </div>
    </a>
  )
}

function StoryCard({ story }: { story: NewsStory }) {
  const [showDiscuss, setShowDiscuss] = useState(false)

  // Separate articles by lean
  const leftArts  = story.article_data.filter(a => a.lean < -1)
  const centerArts = story.article_data.filter(a => a.lean >= -1 && a.lean <= 1)
  const rightArts = story.article_data.filter(a => a.lean > 1)

  // Pick one representative per side
  const perspectives: PerspectiveArticle[] = []
  if (leftArts[0])   perspectives.push(leftArts[0])
  if (centerArts[0]) perspectives.push(centerArts[0])
  if (rightArts[0])  perspectives.push(rightArts[0])
  // If we don't have 3, fill with remaining articles
  const remaining = story.article_data.filter(a => !perspectives.includes(a))
  while (perspectives.length < Math.min(3, story.article_data.length)) {
    perspectives.push(remaining.shift()!)
  }

  // Derive shared facts from synopsis (split at periods for bullets)
  const sharedFacts = story.synopsis
    .split(/\.\s+/)
    .filter(s => s.trim().length > 20)
    .map(s => s.trim().replace(/\.$/, "") + ".")
    .slice(0, 3)

  const spread = story.lean_max - story.lean_min
  const isCrossSpectrum = spread >= 3

  return (
    <article style={{
      padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
        fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
        flexWrap: "wrap",
      }}>
        <Pill tone="paper">
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" />
          </svg>
          Statewide
        </Pill>
        {isCrossSpectrum && <Pill tone="teal">Cross-spectrum</Pill>}
        <span style={{ marginLeft: "auto" }}>{story.article_data.length} sources · {formatNewsTime(story.created_at)}</span>
      </div>

      {/* Headline */}
      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 20,
        lineHeight: 1.2, letterSpacing: -0.3, color: "var(--ink-900)",
        margin: "0 0 14px",
      }}>{story.headline}</h3>

      {/* Shared facts box */}
      {sharedFacts.length > 0 && (
        <div style={{
          background: "var(--paper-100)", borderRadius: 12,
          padding: "12px 14px", marginBottom: 14,
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
            marginBottom: 8,
          }}>What every source agrees on</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {sharedFacts.map((f, i) => (
              <li key={i} style={{
                display: "flex", gap: 8, padding: "5px 0",
                fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.4,
                color: "var(--ink-900)",
              }}>
                <span style={{
                  flexShrink: 0, marginTop: 7, width: 4, height: 4,
                  borderRadius: 99, background: "var(--ink-900)",
                }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Perspective rows */}
      {perspectives.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {perspectives.map((p, i) => (
            <PerspectiveRow key={i} article={p} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: "1px solid var(--rule)",
        fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
        flexWrap: "wrap", gap: 8,
      }}>
        <button
          onClick={() => setShowDiscuss(!showDiscuss)}
          style={{
            background: "transparent", border: "none", padding: 0,
            fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
            cursor: "pointer",
          }}
        >
          {showDiscuss ? "Hide" : "Discuss with neighbors"}
        </button>
        <a
          href={story.article_data[0]?.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "transparent", border: "1px solid var(--rule)",
            padding: "6px 12px", borderRadius: 99,
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            color: "var(--ink-900)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}
        >
          Read all sides
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      {showDiscuss && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
          <CommentSystem articleUrl={`/story/${story.id}`} articleTitle={story.headline} />
        </div>
      )}
    </article>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div style={{
      padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ width: "30%", height: 18, background: "var(--paper-200)", borderRadius: 99, marginBottom: 12 }} />
      <div style={{ width: "90%", height: 24, background: "var(--paper-200)", borderRadius: 6, marginBottom: 8 }} />
      <div style={{ width: "70%", height: 24, background: "var(--paper-200)", borderRadius: 6, marginBottom: 16 }} />
      <div style={{ height: 80, background: "var(--paper-100)", borderRadius: 12, marginBottom: 12 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 48, background: "var(--paper-100)", borderRadius: 10 }} />
        ))}
      </div>
    </div>
  )
}

// ── Common Ground ─────────────────────────────────────────────────────────────

const COMMON_GROUND_ITEMS = [
  {
    issue: "Rural broadband",
    summary: "74% of Georgia voters across both parties say expanding rural broadband should be a top legislative priority this session.",
    left: 71, right: 78,
    source: "UGA School of Public & International Affairs · April 2026",
  },
  {
    issue: "Infrastructure spending",
    summary: "Across party lines, Georgia voters rank roads, bridges, and broadband as a top priority — 74% support increased infrastructure spending regardless of affiliation.",
    left: 73, right: 76,
    source: "Georgia Policy Institute · March 2026",
  },
  {
    issue: "Rural healthcare access",
    summary: "Rural Georgians from both parties express concern about hospital closures. Bipartisan bills have been co-sponsored to keep rural emergency services funded.",
    left: 82, right: 79,
    source: "Georgia Public Broadcasting / Kaiser Family Foundation · 2026",
  },
]

function SupportColumn({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--ink-700)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600, color: "var(--ink-900)", letterSpacing: -0.5 }}>
          {pct}%
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>support</span>
      </div>
      <div style={{ marginTop: 4 }}>
        <ProgressBar value={pct} max={100} tone="teal" />
      </div>
    </div>
  )
}

function CommonGround() {
  const today = new Date()
  const cg = COMMON_GROUND_ITEMS[today.getDate() % COMMON_GROUND_ITEMS.length]

  return (
    <div style={{
      padding: 18, borderRadius: 16,
      background: "linear-gradient(180deg, #E8F0EE 0%, #F2F6F4 100%)",
      border: "1px solid #C9DDD7",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Pill tone="teal">Common ground</Pill>
      </div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
        letterSpacing: 1.2, textTransform: "uppercase", color: "#1F5B53",
        marginBottom: 4,
      }}>{cg.issue}</div>
      <p style={{
        fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500,
        lineHeight: 1.3, letterSpacing: -0.2, color: "var(--ink-900)",
        margin: "0 0 16px",
      }}>{cg.summary}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        <SupportColumn label="Left voters" pct={cg.left} />
        <SupportColumn label="Right voters" pct={cg.right} />
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)", fontStyle: "italic" }}>
        {cg.source}
      </div>
    </div>
  )
}

// ── Local Pulse ───────────────────────────────────────────────────────────────

const LOCAL_PULSE = {
  city: "Atlanta",
  activeNow: 312,
  topics: [
    { tag: "MARTA expansion",  mentions: 184, trend: "up" as const },
    { tag: "Property tax cap", mentions: 142, trend: "up" as const },
    { tag: "Bond referendum",  mentions: 89,  trend: "steady" as const },
    { tag: "School board",     mentions: 67,  trend: "down" as const },
  ],
  neighborPosts: [
    {
      name: "Devon W.", district: "GA-5", lean: "left", time: "12m",
      text: "Anyone else getting a property tax reassessment notice? Mine went up 18%. What's the cap proposal actually doing?",
      likes: 23, replies: 7,
    },
    {
      name: "Sarah K.", district: "GA-6", lean: "right", time: "34m",
      text: "Heading to the Sandy Springs town hall tonight on the bond. Anyone going? Looking for a ride from Buckhead.",
      likes: 11, replies: 4,
    },
    {
      name: "Marcus T.", district: "GA-5", lean: "center", time: "1h",
      text: "Beltline rail vote was closer than expected. Two commissioners flipped — worth reading the committee minutes.",
      likes: 41, replies: 12,
    },
  ],
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

function NeighborPost({ p }: { p: typeof LOCAL_PULSE.neighborPosts[0] }) {
  const initials = p.name.split(" ").map(n => n[0]).join("")
  return (
    <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
      <Avatar initials={initials} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
          marginBottom: 4, flexWrap: "wrap",
        }}>
          <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>{p.name}</span>
          <LeanDot lean={p.lean} />
          <span>· {p.district}</span>
          <span>· {p.time}</span>
        </div>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.4,
          color: "var(--ink-900)", margin: "0 0 6px",
        }}>{p.text}</p>
        <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
          <span>♡ {p.likes}</span>
          <span>↩ {p.replies}</span>
          <button style={{
            marginLeft: "auto", fontWeight: 600, color: "var(--ink-700)",
            background: "transparent", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: 11.5,
          }}>Reply</button>
        </div>
      </div>
    </div>
  )
}

function LocalPulse() {
  const pulse = LOCAL_PULSE
  return (
    <div style={{
      padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Pill tone="ink">
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" />
          </svg>
          Local pulse · {pulse.city}
        </Pill>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "#2D8C5F", display: "inline-block" }} />
          {pulse.activeNow} active
        </div>
      </div>

      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18,
        margin: "8px 0 12px", color: "var(--ink-900)", lineHeight: 1.25, letterSpacing: -0.2,
      }}>What your neighbors are talking about</h3>

      {/* Trending topics */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {pulse.topics.map((t) => (
          <span key={t.tag} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 99,
            background: "var(--paper-100)", border: "1px solid var(--rule)",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
            color: "var(--ink-900)",
          }}>
            #{t.tag}
            {t.trend === "up" && (
              <span style={{ color: "#2D8C5F", display: "inline-flex" }}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </span>
            )}
            <span style={{ color: "var(--ink-500)", fontSize: 11 }}>{t.mentions}</span>
          </span>
        ))}
      </div>

      {/* Neighbor posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {pulse.neighborPosts.map((p, i) => (
          <NeighborPost key={i} p={p} />
        ))}
      </div>
    </div>
  )
}

// ── Bottom Nav (mobile) ───────────────────────────────────────────────────────

function BottomNav() {
  const items = [
    {
      id: "home", label: "Home", href: "/",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
        </svg>
      ),
    },
    {
      id: "news", label: "Stories", href: "/news",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polygon points="15 9 13 13 9 15 11 11 15 9" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      id: "elections", label: "Ballot", href: "/elections",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l4-4h10l4 4" /><path d="M3 17v3h18v-3" /><path d="M9 8l2 2 4-5" />
        </svg>
      ),
    },
    {
      id: "local", label: "Local", href: "/local",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9.5" cy="7" r="3.5" />
          <path d="M21 21v-2a4 4 0 00-3-3.87" /><path d="M17 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      id: "profile", label: "You", href: "/profile",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
      padding: "8px 0 env(safe-area-inset-bottom, 16px)",
      background: "var(--paper-50)",
      borderTop: "1px solid var(--rule)",
      display: "flex", justifyContent: "space-around",
    }} className="lg:hidden">
      {items.map(({ id, href, label, icon }) => {
        const isActive = typeof window !== "undefined" && window.location.pathname === href
        return (
          <Link key={id} href={href} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: isActive ? "var(--ink-900)" : "var(--ink-400)",
            padding: "4px 12px", textDecoration: "none",
          }}>
            {icon}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

// ── News Pipeline Section ─────────────────────────────────────────────────────

function NewsStoriesSection() {
  const [stories, setStories] = useState<NewsStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pipeline/stories?hours=48&limit=6")
      .then(r => r.json())
      .then(d => setStories(d.stories || []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    )
  }

  if (stories.length === 0) {
    return (
      <div style={{
        padding: 18, background: "var(--paper-50)",
        borderRadius: 16, border: "1px solid var(--rule)",
        fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-500)",
        textAlign: "center",
      }}>
        Stories are loading — check back in a few minutes as we pull the latest from across the spectrum.
      </div>
    )
  }

  return (
    <>
      {stories.map(s => <StoryCard key={s.id} story={s} />)}
    </>
  )
}

// ── Main HomeFeed ─────────────────────────────────────────────────────────────

export function HomeFeed({ streak = 7 }: { streak?: number }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DailyQuestion streak={streak} />
        <NewsStoriesSection />
        <CommonGround />
        <LocalPulse />
      </div>

      {/* Mobile bottom nav spacer */}
      <div className="lg:hidden" style={{ height: 72 }} />
      <BottomNav />
    </>
  )
}
