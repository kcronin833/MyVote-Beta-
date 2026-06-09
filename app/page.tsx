"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Newspaper,
  ShieldCheck,
  Vote,
  Scale,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { OnboardingQuiz } from "@/components/onboarding-quiz"
import { DesktopHome } from "@/components/desktop/home"
import { EarlyVotingBanner } from "@/components/early-voting-banner"

/* ── Election countdown ─────────────────────────────────────────────── */
const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00")
const GEORGIA_RUNOFF  = new Date("2026-06-16T07:00:00-04:00")
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00")

function useElectionCountdown() {
  const [info, setInfo] = useState<{ label: string; days: number } | null>(null)
  useEffect(() => {
    const now = new Date()
    let target: Date
    let label: string
    if (now < GEORGIA_PRIMARY) {
      target = GEORGIA_PRIMARY; label = "Georgia Primary"
    } else if (now < GEORGIA_RUNOFF) {
      target = GEORGIA_RUNOFF; label = "June 16 Runoff"
    } else {
      target = GEORGIA_GENERAL; label = "General Election"
    }
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000))
    setInfo({ label, days })
  }, [])
  return info
}

/* ── Hero ZIP form ──────────────────────────────────────────────────── */
function HeroZipForm() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [zip, setZip] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-focus on mount so desktop users can type immediately
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const cleaned = zip.trim()
    if (!/^\d{5}$/.test(cleaned)) {
      setError("Please enter a 5-digit ZIP code.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/ballot-lookup?zip=${cleaned}`, { cache: "no-store" })
      const data = await res.json()
      if (data.found && data.href) {
        router.push(data.href)
        return // keep spinner up through navigation
      }
      setError(
        data.error ||
          "That ZIP wasn't found — try a Georgia ZIP like 30309 or 31401."
      )
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2 sm:gap-3">
        {/* ZIP input */}
        <div className="relative flex-1 min-w-0">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
            aria-hidden
          />
          <input
            ref={inputRef}
            inputMode="numeric"
            maxLength={5}
            placeholder="Your Georgia ZIP code"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, ""))
              setError(null)
            }}
            aria-label="Georgia ZIP code"
            className="w-full h-14 pl-11 pr-4 rounded-xl border-2 border-rule bg-background text-ink-900 text-lg
                       placeholder:text-ink-400/60 focus:outline-none focus:border-civic-red transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="h-14 px-5 sm:px-7 rounded-xl bg-civic-red text-white font-bold text-base
                     hover:bg-civic-red/90 active:scale-95 transition-all disabled:opacity-70
                     whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{loading ? "Finding…" : "See my ballot"}</span>
          <span className="sm:hidden">{loading ? "…" : "Go"}</span>
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-civic-red flex flex-wrap items-center gap-x-1.5">
          {error}{" "}
          <Link href="/g" className="underline text-teal-600 font-medium hover:text-teal-700">
            Browse by county →
          </Link>
        </p>
      )}
    </form>
  )
}

/* ── Feature cards ──────────────────────────────────────────────────── */
const FEATURES = [
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

/* ── Page ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [guestMode, setGuestMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("myvote_guest") === "true"
    }
    return false
  })
  const [showQuiz, setShowQuiz] = useState(false)
  const countdown = useElectionCountdown()

  useEffect(() => {
    if (!user) return
    const alreadyShown = localStorage.getItem("mv_quiz_shown")
    if (alreadyShown) return
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    if (likes.length === 0) setShowQuiz(true)
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper-100 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
        <p className="text-sm text-ink-400 font-medium">Loading MyVote…</p>
      </div>
    )
  }

  /* ── Logged-in / guest → full app ── */
  if (user || guestMode) {
    return (
      <>
        {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}
        <DesktopHome />
      </>
    )
  }

  /* ── Landing page (logged-out) ── */
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Minimal top nav ── */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-rule">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-ink-700 hover:text-ink-900 font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-civic-red hover:bg-civic-red/90 text-white font-semibold shadow-sm"
              >
                Sign up free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex items-center justify-center bg-background border-b border-rule">
        <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">

          {/* Countdown pill */}
          {countdown && (
            <div className="mb-8 inline-flex items-center gap-2 bg-ink-900/5 rounded-full px-4 py-1.5 text-sm font-medium text-ink-700">
              <span className="w-2 h-2 rounded-full bg-civic-red animate-pulse shrink-0" />
              <span>
                <strong className="text-civic-red">{countdown.days} days</strong>
                {" "}until the {countdown.label}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-ink-900 max-w-2xl mb-4 leading-tight">
            What&rsquo;s on your{" "}
            <span className="text-civic-red">2026 Georgia ballot?</span>
          </h1>
          <p className="text-ink-700/65 max-w-lg mb-10 text-lg sm:text-xl leading-relaxed">
            Enter your ZIP and see every race — governor, U.S. Senate, your House
            district, and local offices — with real candidates and key dates.
          </p>

          {/* Early voting urgency strip */}
          <div className="w-full max-w-md mb-2">
            <EarlyVotingBanner compact />
          </div>

          {/* The main CTA */}
          <HeroZipForm />

          {/* Trust row */}
          <div className="mt-8 flex gap-6 sm:gap-10 text-sm text-ink-700/50 flex-wrap justify-center">
            {["Free to use", "Non-partisan", "Georgia focused"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-civic-red" />
                {t}
              </span>
            ))}
          </div>

          {/* Escape hatch — news feed without auth */}
          <button
            onClick={() => {
              sessionStorage.setItem("myvote_guest", "true")
              setGuestMode(true)
            }}
            className="mt-7 text-sm text-ink-700/60 hover:text-ink-900 transition-colors flex items-center gap-1.5 underline underline-offset-2 decoration-ink-700/30 hover:decoration-ink-900/50"
          >
            Browse without signing up
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* ── Why create an account ── */}
      <section className="bg-paper-100 py-16 sm:py-20 border-t border-rule">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-center text-ink-900 mb-3">
            More than a ballot guide
          </h2>
          <p className="text-center text-ink-700/60 mb-12 max-w-md mx-auto">
            Create a free account to save your picks, follow balanced news, and
            stay informed through Election Day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
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

          <div className="text-center mt-10">
            <Link href="/auth/signup">
              <Button className="bg-civic-red hover:bg-civic-red/90 text-white font-semibold px-8 h-12 text-base shadow-sm">
                Create Free Account
              </Button>
            </Link>
            <p className="mt-3 text-sm text-ink-700/40">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-teal-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Urgency dark section ── */}
      <section className="bg-ink-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-wider mb-6">
            <Vote className="w-3.5 h-3.5" />
            Georgia 2026
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3 max-w-xl mx-auto leading-tight">
            Don&rsquo;t walk into the booth unprepared
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
            The U.S. Senate seat, all 14 House districts, the governorship, and dozens
            of local offices are on the 2026 Georgia ballot. Know your races now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/elections">
              <Button
                size="lg"
                className="bg-civic-red hover:bg-civic-red/90 text-white px-8 h-12 font-semibold shadow-sm"
              >
                <Vote className="w-4 h-4 mr-2" />
                2026 Races &amp; Key Dates
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
              { href: "/about",    label: "About" },
              { href: "/elections", label: "Elections 2026" },
              { href: "/privacy",  label: "Privacy Policy" },
              { href: "/terms",    label: "Terms of Service" },
              { href: "/contact",  label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-ink-900 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-700/35 max-w-md mx-auto leading-relaxed">
            MyVote is not affiliated with any political party, campaign, or government entity.
            Always verify voting information at{" "}
            <a
              href="https://sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink-900"
            >
              sos.ga.gov
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
