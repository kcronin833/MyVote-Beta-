"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  MessageCircle,
  Users,
  Vote,
  ArrowRight,
  CalendarDays,
  Newspaper,
  CheckCircle2,
} from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { HomeFeed } from "@/components/home-feed"
import { HomeSidebar } from "@/components/home-sidebar"
import { OnboardingQuiz } from "@/components/onboarding-quiz"

const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00")
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00")
const TOTAL_RACES = 12

function CivicPulseBanner() {
  const [info, setInfo] = useState<{ label: string; days: number; date: string } | null>(null)

  useEffect(() => {
    const now = new Date()
    const isPrimary = now < GEORGIA_PRIMARY
    const target = isPrimary ? GEORGIA_PRIMARY : GEORGIA_GENERAL
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))
    setInfo({
      label: isPrimary ? "Georgia Primary" : "General Election",
      days,
      date: isPrimary ? "May 19, 2026" : "November 3, 2026",
    })
  }, [])

  if (!info) return null

  return (
    <div className="community-card rounded-[1.6rem] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "rgba(34,60,117,0.10)", color: "var(--civic-blue)" }}
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-500)" }}>
              {info.label} · {info.date}
            </div>
            <div className="mt-1 text-lg font-semibold" style={{ color: "var(--ink-900)" }}>
              {info.days} days away — see what your community is discussing before you vote.
            </div>
          </div>
        </div>

        <Link href="/elections" className="primary-action inline-flex rounded-full px-5 py-3 text-sm font-semibold">
          Election center →
        </Link>
      </div>
    </div>
  )
}

const platformLoop = [
  {
    icon: MessageCircle,
    title: "Start with conversation",
    desc: "See what people near you are asking, debating, and organizing around.",
  },
  {
    icon: MapPin,
    title: "Make it local",
    desc: "Follow issues tied to your city, school board, district, and county.",
  },
  {
    icon: Vote,
    title: "Connect it to elections",
    desc: "Move from local issues to candidates, races, ballot decisions, and civic action.",
  },
]

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [guestMode, setGuestMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("myvote_guest") === "true"
    }
    return false
  })
  const [racesDecided, setRacesDecided] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("mv_ballot_count")
    if (raw) setRacesDecided(parseInt(raw) || 0)
  }, [])

  useEffect(() => {
    if (!user) return
    const alreadyShown = localStorage.getItem("mv_quiz_shown")
    if (alreadyShown) return
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    if (likes.length === 0) setShowQuiz(true)
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-100)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--civic-blue)" }} />
      </div>
    )
  }

  if (!user && !guestMode) {
    return (
      <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Link href="/auth/signin" className="local-pill rounded-full px-4 py-2 text-sm font-semibold">
              Sign in
            </Link>
            <Link href="/auth/signup" className="primary-action rounded-full px-4 py-2 text-sm font-semibold">
              Join
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
          <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="local-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--local-green)" }} />
                Live local politics
              </div>

              <h1 className="editorial-headline mb-6 max-w-3xl text-5xl font-semibold sm:text-6xl lg:text-7xl" style={{ color: "var(--ink-900)" }}>
                The local political town square for Georgia.
              </h1>

              <p className="mb-8 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--ink-700)" }}>
                Follow the issues near you, join civic conversations, discover candidates, and connect local news to real political action.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    sessionStorage.setItem("myvote_guest", "true")
                    setGuestMode(true)
                  }}
                  className="primary-action inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold"
                >
                  Explore the community <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link href="/elections" className="local-pill inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold">
                  <Vote className="mr-2 h-4 w-4" />
                  View election center
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm" style={{ color: "var(--ink-500)" }}>
                {[
                  "Built for local conversation",
                  "Candidate discovery roadmap",
                  "Non-partisan civic hub",
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "var(--local-green)" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="community-card rounded-[2rem] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-500)" }}>
                    Today nearby
                  </div>
                  <div className="mt-1 text-lg font-semibold" style={{ color: "var(--ink-900)" }}>
                    Local pulse
                  </div>
                </div>
                <span className="local-pill rounded-full px-3 py-2 text-xs font-semibold">Atlanta</span>
              </div>

              <div className="space-y-3">
                {[
                  ["School board budget conversation", "84 neighbors discussing"],
                  ["City council meeting tonight", "6:30 PM · public comment"],
                  ["Candidate Q&A interest growing", "12 new follows"],
                ].map(([title, meta]) => (
                  <div key={title} className="rounded-2xl p-4" style={{ background: "rgba(255,253,248,0.68)", border: "1px solid var(--rule)" }}>
                    <div className="font-semibold" style={{ color: "var(--ink-900)" }}>{title}</div>
                    <div className="mt-1 text-sm" style={{ color: "var(--ink-500)" }}>{meta}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-4 md:grid-cols-3">
            {platformLoop.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="community-card rounded-[1.5rem] p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "rgba(34,60,117,0.10)", color: "var(--civic-blue)" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: "var(--ink-900)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-500)" }}>{desc}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}
      <div className="container mx-auto px-4 pb-8">
        <NewsNavigation />
        <div className="flex gap-5 items-start max-w-6xl mx-auto">
          {user && (
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28">
              <HomeSidebar racesDecided={racesDecided} totalRaces={TOTAL_RACES} />
            </aside>
          )}
          <main className="flex-1 min-w-0 space-y-5">
            <CivicPulseBanner />
            <HomeFeed />
          </main>
        </div>
      </div>
    </div>
  )
}
