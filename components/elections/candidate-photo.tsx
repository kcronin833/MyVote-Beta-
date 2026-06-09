"use client"

/* CandidatePhoto — fetches a Wikipedia portrait for any GA candidate.
   Falls back gracefully to a coloured initials avatar if:
   • no wikipediaTitle is provided
   • Wikipedia has no thumbnail for the page
   • the img src fails to load                                           */

import { useState, useEffect } from "react"

interface Props {
  name: string
  /** Exact Wikipedia page title, e.g. "Jon_Ossoff". Spaces → underscores.
   *  Include disambiguation suffix if needed, e.g. "Burt_Jones_(politician)". */
  wikipediaTitle?: string
  size?: number
  /** Background colour for the initials fallback (party-matched). */
  partyColor?: string
  /** "circle" (default, for profile pages) or "square" (rounded square, for race cards) */
  shape?: "circle" | "square"
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function CandidatePhoto({
  name,
  wikipediaTitle,
  size = 130,
  partyColor = "#1A2138",
  shape = "circle",
}: Props) {
  const [src, setSrc]       = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(!!wikipediaTitle)

  useEffect(() => {
    if (!wikipediaTitle) { setLoading(false); return }

    const title = wikipediaTitle.replace(/\s/g, "_")
    // Use ?width=400 to get a higher-res thumbnail
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { cache: "force-cache" }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.thumbnail?.source) setSrc(data.thumbnail.source)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [wikipediaTitle])

  const ring: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: shape === "square" ? 8 : "50%",
    boxShadow: shape === "circle" ? "0 0 0 4px #FFFFFF, 0 0 0 6px #E4E0D3" : undefined,
    flexShrink: 0,
    overflow: "hidden",
  }

  /* Skeleton while loading */
  if (loading) {
    return (
      <div
        style={{
          ...ring,
          background: "linear-gradient(90deg, #E4E0D3 25%, #F3F1EB 50%, #E4E0D3 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s ease-in-out infinite",
        }}
      />
    )
  }

  /* Real photo */
  if (src && !failed) {
    return (
      <div style={ring}>
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
      </div>
    )
  }

  /* Initials fallback */
  return (
    <div
      style={{
        ...ring,
        background: partyColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        letterSpacing: -0.5,
      }}
    >
      {getInitials(name)}
    </div>
  )
}
