"use client"

import { useState, useEffect } from "react"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

interface ViewpointLike {
  viewpoint: "left" | "right"
  title: string
  content: string
}

const C = {
  card:     "#FDFCF9",
  rule:     "#E4E0D3",
  ruleSoft: "#EDEAE0",
  shade:    "#F5F3EE",
  ink900:   "#1A2138",
  ink700:   "#2E3148",
  ink500:   "#5A5D72",
  ink400:   "#6B7088",
  teal:     "#3D8073",
  tealDk:   "#2F6358",
  tealSoft: "#E6F0ED",
  tealBorder:"#C9DDD7",
  red:      "#B33A2C",
}

export function PoliticalSpectrumBar() {
  const [viewpointLikes, setViewpointLikes] = useState<ViewpointLike[]>([])
  const [pct, setPct] = useState<number>(50) // 0=all-left … 100=all-right

  useEffect(() => {
    const likes: ViewpointLike[] = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    setViewpointLikes(likes)
    if (likes.length > 0) {
      const right = likes.filter(l => l.viewpoint === "right").length
      setPct(Math.round((right / likes.length) * 100))
    }
  }, [])

  const label =
    pct < 20 ? "Very Liberal" :
    pct < 40 ? "Liberal" :
    pct < 60 ? "Moderate" :
    pct < 80 ? "Conservative" :
               "Very Conservative"

  const dotColor = pct < 40 ? "#2563EB" : pct > 60 ? C.red : "#6B7280"

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
      <div style={{ padding: "14px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.tealSoft, border: `1px solid ${C.tealBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BarChart3 style={{ width: 14, height: 14, color: C.teal }} />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0 }}>Political Position</p>
            <p style={{ fontSize: 11.5, color: C.ink400, margin: 0 }}>Based on your liked viewpoints</p>
          </div>
        </div>

        {viewpointLikes.length === 0 ? (
          <div style={{ padding: "16px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: C.ink400, marginBottom: 10, lineHeight: 1.55 }}>Like viewpoints in the news feed to see where you stand</p>
            <Link href="/news" style={{ fontSize: 13, fontWeight: 700, color: C.teal, textDecoration: "none" }}>
              Go to news feed →
            </Link>
          </div>
        ) : (
          <>
            {/* Big stat */}
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: dotColor, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                {label}
              </div>
              <div style={{ fontSize: 12, color: C.ink400, marginTop: 3 }}>
                Based on {viewpointLikes.length} liked viewpoint{viewpointLikes.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Spectrum bar */}
            <div style={{ position: "relative", height: 8, borderRadius: 999, background: "linear-gradient(to right, #3B82F6, #9CA3AF, #EF4444)", marginBottom: 6 }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${pct}%`,
                  transform: "translate(-50%, -50%)",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: dotColor,
                  border: "2.5px solid #fff",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.28)",
                  transition: "left 0.4s ease",
                }}
              />
            </div>

            {/* Scale labels */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.ink400, marginBottom: 14 }}>
              <span>Liberal</span>
              <span>Moderate</span>
              <span>Conservative</span>
            </div>

            {/* Recent likes */}
            <div style={{ borderTop: `1px solid ${C.ruleSoft}`, paddingTop: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.ink500, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px" }}>Recent viewpoints</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 192, overflowY: "auto" }}>
                {viewpointLikes.slice(-5).reverse().map((like, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 10px", borderRadius: 8, background: C.shade, border: `1px solid ${C.ruleSoft}` }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, flexShrink: 0, marginTop: 1,
                      background: like.viewpoint === "left" ? "#EFF6FF" : "#FFF5F5",
                      color: like.viewpoint === "left" ? "#2563EB" : C.red,
                    }}>
                      {like.viewpoint === "left" ? "Left" : "Right"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: C.ink900, margin: 0, lineHeight: 1.3 }}>{like.title}</p>
                      <p className="line-clamp-2" style={{ fontSize: 11.5, color: C.ink400, margin: "2px 0 0", lineHeight: 1.45 }}>{like.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
