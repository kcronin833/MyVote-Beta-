"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { HomeFeed } from "@/components/home-feed"
import { HomeSidebar } from "@/components/home-sidebar"
import { OnboardingQuiz } from "@/components/onboarding-quiz"
import { NotificationBell } from "@/components/notification-bell"
import { UserNav } from "@/components/user-nav"

const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00")
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00")
const TOTAL_RACES = 12

// ── Logged-out landing ────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper-100)" }}>
      <header className="flex items-center justify-between px-5 py-4" style={{ background: "var(--paper-50)" }}>
        <Logo size="md" />
        <Link href="/auth/signin">
          <button className="text-sm font-semibold" style={{ color: "var(--ink-700)", background: "transparent", border: "none", cursor: "pointer" }}>
            Sign in
          </button>
        </Link>
      </header>

      <main className="flex-1 px-5 pt-10 pb-8 max-w-lg mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6"
          style={{ background: "var(--paper-50)", border: "1px solid var(--rule)", color: "var(--ink-700)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--civic-red)" }} />
          Facts first · Georgia local politics
        </div>

        <h1 className="mb-4 leading-tight" style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 8vw, 2.75rem)",
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--ink-900)",
        }}>
          See what's<br />
          <em style={{ fontStyle: "italic", color: "var(--ink-700)" }}>actually</em><br />
          happening<br />
          where you live.
        </h1>

        <p className="mb-8 leading-relaxed" style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--ink-700)", maxWidth: 340 }}>
          MyVote starts with the shared facts, then shows how different sides are framing the same local issue. Less outrage. More clarity.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={() => { sessionStorage.setItem("myvote_guest", "true"); window.location.reload() }}
            className="w-full py-3.5 rounded-full text-sm font-semibold text-center transition-opacity hover:opacity-90"
            style={{ background: "var(--ink-900)", color: "var(--paper-50)", fontFamily: "var(--font-sans)", border: "none" }}>
            Browse local stories →
          </button>
          <Link href="/auth/signup" className="w-full">
            <button className="w-full py-3.5 rounded-full text-sm font-semibold text-center transition-colors hover:bg-black/5"
              style={{ background: "transparent", color: "var(--ink-900)", border: "1px solid var(--rule)", fontFamily: "var(--font-sans)" }}>
              Create a profile
            </button>
          </Link>
        </div>

        <div className="space-y-0">
          {[
            { k: "Start with the facts", v: "Every story is organized around what the sources agree actually happened." },
            { k: "Then compare the framing", v: "See how left, center, and right sources explain the same issue." },
            { k: "Keep it local", v: "Focus on Georgia issues, elections, and decisions that affect your community." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 py-4" style={{ borderTop: "1px solid var(--rule)" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 13, fontWeight: 600, color: "var(--ink-400)", paddingTop: 1, minWidth: 20 }}>0{i + 1}</span>
              <div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--ink-900)", fontFamily: "var(--font-sans)" }}>{item.k}</div>
                <div className="text-sm leading-snug" style={{ color: "var(--ink-500)", fontFamily: "var(--font-sans)" }}>{item.v}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-4 px-5 text-center text-xs" style={{ color: "var(--ink-400)", fontFamily: "var(--font-sans)" }}>
        MyVote is non-partisan and not affiliated with any party or campaign.
      </footer>
    </div>
  )
}

function CountdownStrip({ days, label, racesDecided, totalRaces }: {
  days: number; label: string; racesDecided: number; totalRaces: number
}) {
  const pct = (racesDecided / totalRaces) * 100
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--ink-900)", color: "var(--paper-50)" }}>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ opacity: 0.55 }}>{label}</div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{days}</span>
            <span className="text-sm" style={{ opacity: 0.7 }}>days away</span>
          </div>
        </div>
        <Link href="/profile">
          <button className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: "var(--paper-50)", color: "var(--ink-900)" }}>
            Save ballot →
          </button>
        </Link>
      </div>
      <div>
        <div className="flex justify-between text-[11px] mb-1.5" style={{ opacity: 0.6 }}>
          <span>Your ballot</span>
          <span>{racesDecided} / {totalRaces} decided</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--paper-50)" }} />
        </div>
      </div>
    </div>
  )
}

function HomeTopBar() {
  const { profile } = useAuth()
  return (
    <div className="flex items-center justify-between px-0 pb-4">
      <div>
        {profile?.location && (
          <div className="text-[11px] font-semibold tracking-wide mb-0.5" style={{ color: "var(--ink-500)" }}>
            {profile.location}, Georgia
          </div>
        )}
        <Logo size="sm" />
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <UserNav />
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [guestMode] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem("myvote_guest") === "true"
  )
  const [racesDecided, setRacesDecided] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [electionInfo, setElectionInfo] = useState<{ label: string; days: number } | null>(null)

  useEffect(() => {
    const now = new Date()
    const isPrimary = now < GEORGIA_PRIMARY
    const target = isPrimary ? GEORGIA_PRIMARY : GEORGIA_GENERAL
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))
    setElectionInfo({ label: isPrimary ? "Georgia Primary" : "General Election", days })
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem("mv_ballot_count")
    if (raw) setRacesDecided(parseInt(raw) || 0)
  }, [])

  useEffect(() => {
    if (!user) return
    const shown = localStorage.getItem("mv_quiz_shown")
    if (shown) return
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    if (likes.length === 0) setShowQuiz(true)
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-100)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--ink-900)" }} />
      </div>
    )
  }

  if (!user && !guestMode) return <LandingPage />

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}
      <div className="container mx-auto px-4 pt-4 pb-24 max-w-5xl">
        <HomeTopBar />
        <div className="flex gap-5 items-start">
          {user && (
            <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-4">
              <HomeSidebar racesDecided={racesDecided} totalRaces={TOTAL_RACES} />
            </aside>
          )}

          <main className="flex-1 min-w-0">
            {electionInfo && (
              <CountdownStrip
                days={electionInfo.days}
                label={electionInfo.label}
                racesDecided={racesDecided}
                totalRaces={TOTAL_RACES}
              />
            )}
            <HomeFeed />
          </main>
        </div>
      </div>
    </div>
  )
}
