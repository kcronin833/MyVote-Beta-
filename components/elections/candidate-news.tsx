"use client"

/* CandidateNews — pulls the 3 most recent clustered_stories whose
   headline mentions this candidate's last name.
   Renders nothing if there are no matching stories.                    */

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Newspaper, ArrowRight } from "lucide-react"

const C = {
  card:     "#FFFFFF",
  rule:     "#E4E0D3",
  ruleSoft: "#EFEBE0",
  shade:    "#F7F5EF",
  ink900:   "#1A2138",
  ink700:   "#3D435A",
  ink500:   "#6B7088",
  ink400:   "#8B8FA3",
  plum:     "#6B3A6B",
  plumSoft: "#F2E8F2",
}

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

export function CandidateNews({ candidateName }: { candidateName: string }) {
  const [stories, setStories] = useState<Story[]>([])
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    const lastName = candidateName.trim().split(/\s+/).pop() || candidateName
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
  }, [candidateName])

  if (!ready || stories.length === 0) return null

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
            Recent Coverage
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            Latest news mentioning {candidateName.split(" ").pop()}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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

      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
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
          More Georgia news <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
