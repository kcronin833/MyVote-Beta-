"use client"

/**
 * CivicProfileWidget — OkCupid-style civic profile card.
 *
 * Shows the user's evolving civic profile right in the home feed.
 * Profile strength grows every time they answer the daily question,
 * and gets a big jump when they complete the orientation quiz.
 *
 * States:
 *   - No data     → "Start your civic profile" teaser
 *   - Daily only  → Dimension bars + strength meter + quiz CTA
 *   - Quiz done   → Full archetype card + bars + strength meter
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { loadCivicProfile, type CivicProfile } from "@/lib/civic-profile-store"
import { ARCHETYPES, DIM_LABELS, type DimKey } from "@/lib/quiz-engine"
import { C } from "@/lib/design-tokens"

// ─── 4 most intuitive dimensions to display ───────────────────────────────
const DISPLAY_DIMS: { key: DimKey; label: string; low: string; high: string }[] = [
  { key: "economicFreedom",      label: "Economic approach",   low: "Gov. managed", high: "Free market"  },
  { key: "governmentActivism",   label: "Government role",     low: "Limited gov",  high: "Active gov"   },
  { key: "publicSafetyPriority", label: "Safety vs liberty",   low: "Liberty first",high: "Safety first" },
  { key: "communityOrientation", label: "Responsibility",      low: "Individual",   high: "Shared"       },
]

interface Props {
  /** If true, shows a subtle "Answer today's question to update ↑" nudge */
  dailyAnswered?: boolean
  className?: string
}

export function CivicProfileWidget({ dailyAnswered, className }: Props) {
  const [profile, setProfile] = useState<CivicProfile | null>(null)
  const [flash, setFlash] = useState(false)

  // Initial load
  useEffect(() => {
    setProfile(loadCivicProfile())
  }, [])

  // Re-read whenever a daily answer or quiz updates the profile
  useEffect(() => {
    function handleUpdate() {
      setProfile(loadCivicProfile())
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 3000)
      return () => clearTimeout(t)
    }
    window.addEventListener("civic-profile-updated", handleUpdate)
    return () => window.removeEventListener("civic-profile-updated", handleUpdate)
  }, [])

  // Don't render during SSR or before hydration
  if (!profile) return null

  const hasData = profile.strength > 0
  const quizDone = !!profile.quizResult
  const archetype = quizDone ? ARCHETYPES[profile.quizResult!.archetype] : null

  // ── Pre-data teaser ────────────────────────────────────────────────────
  if (!hasData) {
    return (
      <div
        className={className}
        style={{
          background: `linear-gradient(135deg, #1A2138 0%, #3D8073 100%)`,
          border: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: 10,
          padding: 16,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🗳️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.8, textTransform: "uppercase" }}>
              Civic Profile
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>
              Build your profile as you engage
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, margin: "0 0 12px" }}>
          Every daily question you answer adds to your civic profile — like OkCupid, but for civic life.
          Answer below to start, or take the quiz for an instant head start.
        </p>
        <Link href="/quiz" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13, fontWeight: 700, color: "#fff",
            textAlign: "center", cursor: "pointer",
          }}>
            Take the quiz (~3 min) →
          </div>
        </Link>
      </div>
    )
  }

  // ── Profile card ────────────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 10,
        boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
        overflow: "hidden",
      }}
    >
      {/* Header strip */}
      <div style={{
        background: `linear-gradient(135deg, #1A2138 0%, #3D8073 100%)`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>
            {archetype ? archetype.emoji : "⚡"}
          </span>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.8, textTransform: "uppercase" }}>
              Civic Profile
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              {archetype ? archetype.label : "Building your profile…"}
            </div>
          </div>
        </div>

        {/* Flash badge */}
        {flash && (
          <div style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 20,
            padding: "3px 9px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            whiteSpace: "nowrap",
          }}>
            ✦ Updated
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px 14px" }}>

        {/* Profile strength meter */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink700 }}>Profile strength</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.teal }}>{profile.strength}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: C.ruleSoft, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${profile.strength}%`,
              background: `linear-gradient(90deg, ${C.teal} 0%, #5aab9e 100%)`,
              borderRadius: 4,
              transition: "width 0.7s ease",
            }} />
          </div>
          <div style={{ fontSize: 10.5, color: C.ink300, marginTop: 4 }}>
            {quizDone
              ? `Quiz completed · ${profile.dailyAnswerCount} daily answer${profile.dailyAnswerCount !== 1 ? "s" : ""}`
              : profile.dailyAnswerCount > 0
                ? `${profile.dailyAnswerCount} daily answer${profile.dailyAnswerCount !== 1 ? "s" : ""} · Take the quiz to unlock your archetype`
                : "Answer the daily question below to start building"}
          </div>
        </div>

        {/* Dimension mini-bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {DISPLAY_DIMS.map(({ key, label, low, high }) => {
            const score = profile.scores[key]
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: C.ink700 }}>{label}</span>
                  <span style={{ fontSize: 11, color: C.ink500 }}>{score}/100</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: C.ruleSoft, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${score}%`,
                    background: `linear-gradient(90deg, ${C.teal} 0%, #5aab9e 100%)`,
                    borderRadius: 3,
                    transition: "width 0.7s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: C.ink300 }}>{low}</span>
                  <span style={{ fontSize: 10, color: C.ink300 }}>{high}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer row */}
        <div style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: `1px solid ${C.ruleSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}>
          {!quizDone ? (
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                background: C.teal,
                borderRadius: 7,
                padding: "6px 12px",
                fontSize: 12, fontWeight: 700, color: "#fff",
                cursor: "pointer",
              }}>
                Take the quiz →
              </div>
            </Link>
          ) : (
            <Link
              href="/profile"
              style={{ fontSize: 12, fontWeight: 600, color: C.teal, textDecoration: "none" }}
            >
              View full profile →
            </Link>
          )}

          {!dailyAnswered && (
            <span style={{ fontSize: 11, color: C.ink300 }}>
              ↓ Answer today's question to update
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
