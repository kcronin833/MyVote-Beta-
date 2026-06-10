"use client"

/* CandidateNews — pulls the 3 most recent clustered_stories whose
   headline mentions this candidate's last name, then ALWAYS funnels the
   reader into the National + Local news sections.

   This block is a primary conversion path: most candidate-page visitors
   arrive from search and never discover the news product. So unlike the
   old version (which returned null when no candidate story matched), this
   always renders a news bridge — the candidate-specific stories are a
   bonus when present, but the National/Local CTAs show no matter what.   */

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Newspaper, ArrowRight, Globe, MapPin } from "lucide-react"
import { C } from "@/lib/design-tokens"

type Story = {
  id: string
  headline: string
  synopsis: string | null
  created_at: string
  lean_min: number | null
  lean_max: number | null
}

function leanLabel(lo: number | null, hi: number | null): { text: string; bg: string; color: string } {
  const l = lo ?? 0; const h = hi ?? 0
  if (l < -0.25 && h < -0.25) return { text: "Left-leaning",  bg: "#DBEAFE", color: "#1D4ED8" }
  if (l >  0.25 && h >  0.25) return { text: "Right-leaning", bg: "#F5E3DF", color: "#B33A2C" }
  return { text: "Multi-perspective", bg: "#E6F0ED", color: "#3D8073" }
}

/* Two big destination buttons — the actual funnel into the news product. */
function NewsDestinations({ lastName }: { lastName: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <Link
        href="/news"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "12px 14px",
          borderRadius: 9,
          background: C.teal,
          textDecoration: "none",
        }}
      >
        <Globe size={18} color="#fff" style={{ flexShrink: 0 }} />
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            National news
          </span>
          <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.82)", marginTop: 1 }}>
            Every perspective
          </span>
        </span>
      </Link>
      <Link
        href="/news/local"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "12px 14px",
          borderRadius: 9,
          background: C.tealSoft,
          border: `1px solid ${C.tealBorder}`,
          textDecoration: "none",
        }}
      >
        <MapPin size={18} color={C.tealDk} style={{ flexShrink: 0 }} />
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.tealDk, lineHeight: 1.2 }}>
            Local Georgia
          </span>
          <span style={{ display: "block", fontSize: 11, color: C.teal, marginTop: 1 }}>
            Atlanta &amp; statewide
          </span>
        </span>
      </Link>
    </div>
  )
}

export function CandidateNews({ candidateName }: { candidateName: string }) {
  const [stories, setStories] = useState<Story[]>([])
  const [ready,   setReady]   = useState(false)

  const lastName = candidateName.trim().split(/\s+/).pop() || candidateName

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("clustered_stories")
      .select("id, headline, synopsis, created_at, lean_min, lean_max")
      .ilike("headline", `%${lastName}%`)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setStories((data as Story[]) || [])
        setReady(true)
      })
  }, [lastName])

  const hasStories = stories.length > 0

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
      }}
    >
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: C.plumSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Newspaper size={15} color={C.plum} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink900, lineHeight: 1 }}>
            {hasStories ? "Recent Coverage" : "Follow the 2026 race"}
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            {hasStories
              ? `Latest news mentioning ${lastName}`
              : "Track this race across the political spectrum"}
          </div>
        </div>
      </div>

      {/* Candidate-specific stories (when present) */}
      {hasStories && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 16 }}>
          {stories.map((story, i) => {
            const lean = leanLabel(story.lean_min, story.lean_max)
            return (
              <Link
                key={story.id}
                href="/news"
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 4,
                      padding: "2px 7px",
                      background: lean.bg,
                      color: lean.color,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {lean.text}
                  </span>
                  <span style={{ fontSize: 10, color: C.ink400 }}>
                    {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: C.ink900,
                    margin: "0 0 4px",
                    lineHeight: 1.35,
                  }}
                >
                  {story.headline}
                </p>
                {story.synopsis && (
                  <p
                    style={{
                      fontSize: 12.5,
                      color: C.ink700,
                      margin: 0,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    } as React.CSSProperties}
                  >
                    {story.synopsis}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* No candidate-specific story yet — short bridge copy so the section
          still earns its place and the CTAs below have context. */}
      {ready && !hasStories && (
        <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.55, margin: "0 0 16px" }}>
          No recent headline mentions {lastName} yet — but Georgia&apos;s 2026 race
          is moving fast. See how every issue is being covered from the left,
          center, and right.
        </p>
      )}

      {/* The funnel — always shown, regardless of candidate coverage */}
      <NewsDestinations lastName={lastName} />

      <div style={{ marginTop: 12, textAlign: "center" }}>
        <Link
          href="/news"
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: C.plum,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Browse all Georgia news <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
