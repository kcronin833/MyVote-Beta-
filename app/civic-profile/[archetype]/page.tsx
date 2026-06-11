import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ARCHETYPES } from "@/lib/quiz-engine"
import { ARCHETYPE_PROFILE_DATA } from "@/lib/civic-profile-data"
import { ARCHETYPE_SLUGS, archetypeFromSlug } from "@/lib/civic-share"

/* Public share landing page for a quiz result. When someone posts
   "I'm a Civic Pragmatist", the link lands here: the visitor sees what
   that profile means, then gets funneled into taking the quiz themselves.
   Statically generated — one page per archetype. */

const C = {
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
  shade: "#F0EDE6",
}

export function generateStaticParams() {
  return Object.values(ARCHETYPE_SLUGS).map((slug) => ({ archetype: slug }))
}

/* Closed set of 8 archetypes — anything else is a hard 404 (proper status
   code, no streaming-shell 200s). */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ archetype: string }>
}): Promise<Metadata> {
  const { archetype: slug } = await params
  const key = archetypeFromSlug(slug)
  if (!key) return {}
  const a = ARCHETYPES[key]
  const title = `${a.label} — My Civic Profile · MyVote`
  const description = `${a.headline} Discover your own civic profile with MyVote's free 2-minute, non-partisan quiz.`
  const image = `/share/civic-${slug}.png`
  return {
    title,
    description,
    alternates: { canonical: `/civic-profile/${slug}` },
    openGraph: {
      title: `My civic profile is "${a.label}" — which one are you?`,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${a.label} — MyVote civic profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `My civic profile is "${a.label}" — which one are you?`,
      description,
      images: [image],
    },
  }
}

export default async function CivicProfileSharePage({
  params,
}: {
  params: Promise<{ archetype: string }>
}) {
  const { archetype: slug } = await params
  const key = archetypeFromSlug(slug)
  if (!key) notFound()

  const a = ARCHETYPES[key]
  const data = ARCHETYPE_PROFILE_DATA[key]
  const fig = data.primaryFigure

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 16px 56px" }}>
      {/* Hero — mirrors the quiz results screen */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A2138 0%, #3D8073 100%)",
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 10 }}>{a.emoji}</div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 4,
          }}
        >
          CIVIC PROFILE
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.2 }}>
          {a.label}
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", margin: 0 }}>
          {a.headline}
        </p>
      </div>

      {/* What it means */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.rule}`,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 16,
          boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
        }}
      >
        <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.65, margin: 0 }}>
          {a.description}
        </p>
      </div>

      {/* Primary historical figure */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.rule}`,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 20,
          boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
        }}
      >
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.ink500,
            letterSpacing: 0.5,
            margin: "0 0 10px",
          }}
        >
          A HISTORICAL FIGURE WHO SHARED THIS PROFILE
        </h2>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, margin: 0 }}>{fig.name}</p>
        <p style={{ fontSize: 12, color: C.ink500, margin: "2px 0 8px" }}>
          {fig.years} · {fig.role}
        </p>
        <p
          style={{
            fontSize: 13,
            fontStyle: "italic",
            color: C.ink700,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          &ldquo;{fig.quote}&rdquo;
        </p>
      </div>

      {/* The hook — take the quiz yourself */}
      <div
        style={{
          background: C.tealSoft,
          border: "1px solid #C0DAD4",
          borderRadius: 14,
          padding: "20px 18px",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>
          Which civic profile are you?
        </p>
        <p style={{ fontSize: 13, color: C.ink700, margin: "0 0 14px", lineHeight: 1.55 }}>
          12 quick questions. No partisan labels, no wrong answers — grounded in
          peer-reviewed political psychology.
        </p>
        <Link
          href="/quiz"
          style={{
            display: "inline-block",
            padding: "13px 32px",
            background: C.teal,
            color: "#fff",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(61,128,115,0.35)",
          }}
        >
          Take the free quiz →
        </Link>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          href="/profiles"
          style={{ fontSize: 13, fontWeight: 600, color: C.teal, textDecoration: "none" }}
        >
          Explore all 8 civic profiles →
        </Link>
      </div>
    </div>
  )
}
