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

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--paper-100)" }}>
      <header className="flex items-center justify-between px-5 py-5 max-w-6xl mx-auto w-full">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button className="local-pill px-4 py-2 rounded-full text-sm font-semibold">
            Atlanta
          </button>

          <Link href="/auth/signin">
            <button className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{ color: "var(--ink-700)" }}>
              Sign in
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 pb-16 pt-8 max-w-6xl mx-auto w-full relative">
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7 local-pill text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--local-green)" }} />
              Live local conversation across Georgia
            </div>

            <h1 className="editorial-headline mb-6"
              style={{
                fontSize: "clamp(3rem, 9vw, 5.6rem)",
                fontWeight: 600,
                color: "var(--ink-900)",
              }}>
              Your local
              <br />
              political
              <br />
              town square.
            </h1>

            <p className="max-w-xl mb-9"
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "var(--ink-700)",
              }}>
              Follow local issues, discover candidates, join conversations in your district, and stay connected to the communities shaping Georgia politics.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => {
                  sessionStorage.setItem("myvote_guest", "true")
                  window.location.reload()
                }}
                className="primary-action px-7 py-4 rounded-full font-semibold text-sm transition-all hover:scale-[1.02]"
              >
                Explore Georgia →
              </button>

              <Link href="/auth/signup">
                <button className="community-card px-7 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-[1px]"
                  style={{ color: "var(--ink-900)" }}>
                  Create a profile
                </button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                ["Local Issues", "School boards, zoning, elections, transportation, and policy updates near you."],
                ["Community Discussion", "See what your neighbors, leaders, and candidates are talking about."],
                ["Candidate Discovery", "Learn about representatives, campaigns, and upcoming local elections."],
              ].map(([title, desc], i) => (
                <div key={i} className="community-card rounded-3xl p-5">
                  <div className="text-sm font-semibold mb-2" style={{ color: "var(--ink-900)" }}>
                    {title}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--ink-500)" }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="community-card rounded-[2rem] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] mb-1"
                    style={{ color: "var(--ink-500)" }}>
                    Trending locally
                  </div>
                  <div className="font-semibold text-lg" style={{ color: "var(--ink-900)" }}>
                    Sandy Springs conversation
                  </div>
                </div>

                <div className="local-pill px-3 py-2 rounded-full text-xs font-semibold">
                  Live
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["Rezoning discussion growing near City Springs", "128 comments"],
                  ["School board budget proposal drawing attention", "84 comments"],
                  ["Transportation expansion town hall tonight", "6:30 PM"],
                ].map(([title, meta], i) => (
                  <div key={i}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(22,33,58,0.08)",
                    }}>
                    <div className="font-semibold mb-1" style={{ color: "var(--ink-900)" }}>
                      {title}
                    </div>
                    <div className="text-sm" style={{ color: "var(--ink-500)" }}>
                      {meta}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between pt-5 subtle-divider border-t">
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] font-bold mb-1"
                    style={{ color: "var(--ink-500)" }}>
                    Most active district
                  </div>
                  <div className="font-semibold" style={{ color: "var(--ink-900)" }}>
                    Fulton County
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold" style={{ color: "var(--ink-900)" }}>
                    2,418
                  </div>
                  <div className="text-sm" style={{ color: "var(--ink-500)" }}>
                    weekly conversations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function CountdownStrip({ days, label, racesDecided, totalRaces }: {
  days: number; label: string; racesDecided: number; totalRaces: number
}) {
  const pct = (racesDecided / totalRaces) * 100

  return (
    <div className="community-card rounded-[2rem] p-5 mb-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.16em] uppercase mb-2"
            style={{ color: "var(--ink-500)" }}>
            {label}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="editorial-headline"
              style={{ fontSize: 42, fontWeight: 600, color: "var(--ink-900)" }}>
              {days}
            </span>
            <span className="text-sm" style={{ color: "var(--ink-500)" }}>
              days away
            </span>
          </div>
        </div>

        <Link href="/profile">
          <button className="primary-action px-4 py-3 rounded-full text-xs font-semibold">
            View ballot
          </button>
        </Link>
      </div>

      <div>
        <div className="flex justify-between text-[11px] mb-2" style={{ color: "var(--ink-500)" }}>
          <span>Your progress</span>
          <span>{racesDecided} / {totalRaces} races explored</span>
        </div>

        <div className="h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(22,33,58,0.10)" }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, var(--civic-gold), var(--civic-blue))",
            }} />
        </div>
      </div>
    </div>
  )
}

function HomeTopBar() {
  const { profile } = useAuth()

  return (
    <div className="flex items-center justify-between px-0 pb-5">
      <div>
        {profile?.location && (
          <div className="text-[11px] font-semibold tracking-wide mb-1"
            style={{ color: "var(--ink-500)" }}>
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
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--paper-100)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent"
          style={{ borderTopColor: "var(--civic-blue)" }} />
      </div>
    )
  }

  if (!user && !guestMode) return <LandingPage />

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}

      <div className="container mx-auto px-4 pt-5 pb-24 max-w-6xl">
        <HomeTopBar />

        <div className="flex gap-6 items-start">
          {user && (
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-5">
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
