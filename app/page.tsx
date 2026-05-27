"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Newspaper,
  ShieldCheck,
  Vote,
  Scale,
  CheckCircle2,
  ArrowRight,
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

function ElectionBanner() {
  const [info, setInfo] = useState<{ label: string; days: number; date: string } | null>(null)

  useEffect(() => {
    const now = new Date()
    const isPrimary = now < GEORGIA_PRIMARY
    const target = isPrimary ? GEORGIA_PRIMARY : GEORGIA_GENERAL
    const days = Math.ceil((target.getTime() - now.getTime()) / 86400000)
    setInfo({
      label: isPrimary ? "Georgia Primary" : "General Election",
      days,
      date: isPrimary ? "May 19, 2026" : "November 3, 2026",
    })
  }, [])

  if (!info) return null

  return (
    <div className="rounded-2xl bg-teal-600 text-white p-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">{info.label}</p>
        <p className="text-2xl font-bold">{info.days} days away</p>
        <p className="text-sm text-teal-100">{info.date}</p>
      </div>
      <Link href="/profile">
        <button className="bg-card text-teal-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors">
          Finish your ballot →
        </button>
      </Link>
    </div>
  )
}

const features = [
  {
    icon: Scale,
    color: "text-civic-red",
    bg: "bg-red-50",
    title: "See Both Sides",
    desc: "Every story from left, center, and right — so you form your own view.",
  },
  {
    icon: Newspaper,
    color: "text-ink-900",
    bg: "bg-blue-50",
    title: "Stay Informed",
    desc: "Curated national and local Georgia news, updated daily across the spectrum.",
  },
  {
    icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Live Local",
    desc: "Hyper-local news and representative info for your city and district.",
  },
  {
    icon: ShieldCheck,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Facts First",
    desc: "Start with verified facts, then explore opinions — not the other way around.",
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
    if (likes.length === 0) {
      setShowQuiz(true)
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (!user && !guestMode) {
    return (
      <div className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="bg-background border-b border-rule">
          <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
            <div className="mb-10">
              <Logo size="xl" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-ink-900 max-w-xl mb-4 leading-tight">
              Your guide to the{" "}
              <span className="text-civic-red">2026 Georgia elections</span>
            </h1>
            <p className="text-ink-700/65 max-w-md mb-10 text-lg leading-relaxed">
              Read every side. Build your ballot. Make your vote count.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-civic-red hover:bg-civic-red/90 text-white font-semibold px-8 h-12 text-base shadow-sm"
                >
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-ink-900 text-ink-900 hover:bg-ink-900/5 px-8 h-12 text-base"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/elections" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-ink-500 hover:text-ink-900 hover:bg-paper-50 px-6 h-12 text-base"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  View Races
                </Button>
              </Link>
            </div>

            <button
              onClick={() => {
                sessionStorage.setItem("myvote_guest", "true")
                setGuestMode(true)
              }}
              className="mt-5 text-sm text-ink-700/40 hover:text-ink-700/70 transition-colors flex items-center gap-1"
            >
              Browse as guest <ArrowRight className="w-3 h-3" />
            </button>

            <div className="mt-12 flex gap-6 sm:gap-10 text-sm text-ink-700/50 flex-wrap justify-center">
              {["Free to use", "No ads", "Non-partisan"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-civic-red" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-paper-100 py-16 sm:py-20 border-t border-rule">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-center text-ink-900 mb-3">
              Built for Georgia voters
            </h2>
            <p className="text-center text-ink-700/60 mb-12 max-w-md mx-auto">
              Everything you need to walk into the booth with confidence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {features.map(({ icon: Icon, color, bg, title, desc }) => (
                <div
                  key={title}
                  className="bg-paper-50 rounded-2xl p-6 border border-rule shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-ink-900 text-base mb-2">{title}</h3>
                  <p className="text-ink-700/65 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Elections CTA ── */}
        <section className="bg-ink-900 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="bg-civic-red hover:bg-civic-red text-white mb-5 px-4 py-1 text-xs tracking-wider uppercase">
              Georgia 2026 Pilot
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3 max-w-xl mx-auto leading-tight">
              The 2026 Georgia elections are coming
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
              The U.S. Senate seat, all 14 House seats, and dozens of state races are on the ballot.
              Get ready now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/elections">
                <Button size="lg" className="bg-civic-red hover:bg-civic-red/90 text-white px-8 h-12 font-semibold shadow-sm">
                  <Vote className="w-4 h-4 mr-2" />
                  Georgia 2026 Races &amp; Dates
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-8 h-12"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-background border-t border-rule py-10">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-ink-700/50 mb-4">
              Inform. Clarify. Empower all political perspectives.
            </p>
            <div className="flex justify-center gap-5 flex-wrap text-sm text-ink-700/50">
              {[
                { href: "/about", label: "About" },
                { href: "/elections", label: "Elections 2026" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="hover:text-ink-900 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-700/35 max-w-md mx-auto leading-relaxed">
              MyVote is not affiliated with any political party, campaign, or government entity.
              Always verify voting information at{" "}
              <a href="https://sos.ga.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-900">
                sos.ga.gov
              </a>.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-100">
      {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />
        <div className="flex gap-5 items-start max-w-6xl mx-auto">
          {user && (
            <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-4">
              <HomeSidebar racesDecided={racesDecided} totalRaces={TOTAL_RACES} />
            </aside>
          )}
          <main className="flex-1 min-w-0 space-y-4">
            <ElectionBanner />
            <HomeFeed />
          </main>
        </div>
      </div>
    </div>
  )
}
