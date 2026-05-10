"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Newspaper,
  ShieldCheck,
  Vote,
  Scale,
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
        <button className="bg-white text-teal-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors">
          Finish your ballot →
        </button>
      </Link>
    </div>
  )
}

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

  // Show quiz only to logged-in users who haven't seen it and have no liked viewpoints
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3A93]" />
      </div>
    )
  }

  // Landing page for unauthenticated users
  if (!user && !guestMode) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="bg-[#1B2B5E] text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <Logo size="xl" className="justify-center" />
            <p className="mt-5 text-base font-semibold tracking-widest uppercase text-white/70">
              Understand More.{" "}
              <span className="text-[#CC2020]">Decide Better.</span>
            </p>
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#CC2020] hover:bg-[#aa1818] text-white font-semibold">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/elections">
                <Button size="lg" variant="outline" className="border-white/40 text-white/80 hover:bg-white/10">
                  <Vote className="w-4 h-4 mr-2" />
                  Georgia 2026 Elections
                </Button>
              </Link>
            </div>
            <button
              onClick={() => {
                sessionStorage.setItem("myvote_guest", "true")
                setGuestMode(true)
              }}
              className="mt-4 text-sm text-white/50 hover:text-white underline underline-offset-4 transition-colors"
            >
              Browse as Guest
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-[#1B2B5E] mb-2">Built for Georgia voters</h2>
          <p className="text-center text-[#4A4A4A]/70 mb-10 max-w-xl mx-auto">
            Understand more. Decide better. Make your vote count.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Scale,      color: "text-[#CC2020]", title: "See Both Sides",    desc: "Read every story from left, center, and right — so you can form your own view." },
              { icon: Newspaper,  color: "text-[#1B2B5E]", title: "Stay Informed",     desc: "Curated national and local Georgia news, updated daily across the spectrum." },
              { icon: MapPin,     color: "text-green-600",  title: "Live Local",       desc: "Hyper-local news and representative info for your city and district." },
              { icon: ShieldCheck,color: "text-purple-600", title: "Facts First",      desc: "Start with verified facts, then explore the opinions. Not the other way around." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <Card key={title} className="border-[#E5E5E5] text-center">
                <CardHeader>
                  <Icon className={`w-10 h-10 ${color} mx-auto mb-2`} />
                  <CardTitle className="text-[#1B2B5E] text-base">{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-teal-600/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge className="bg-teal-600 text-white mb-4">Georgia 2026 Pilot</Badge>
            <h2 className="text-2xl font-bold text-[#1B2B5E] mb-2">Georgia 2026 Elections Are Coming</h2>
            <p className="text-[#4A4A4A]/70 mb-6 max-w-xl mx-auto">
              The U.S. Senate seat, all 14 House seats, and dozens of state races are on the ballot.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/elections">
                <Button size="lg" className="bg-[#1B2B5E] hover:bg-[#1B2B5E]/90 text-white">
                  <Vote className="w-4 h-4 mr-2" />Georgia 2026 Races & Dates
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-[#1B2B5E] text-[#1B2B5E]">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="border-t border-[#E5E5E5] py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[#4A4A4A]/60">
            <Logo size="sm" />
            <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
              <Link href="/about" className="hover:text-[#1F3A93]">About</Link>
              <Link href="/elections" className="hover:text-[#1F3A93]">Elections 2026</Link>
              <Link href="/privacy" className="hover:text-[#1F3A93]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#1F3A93]">Terms of Service</Link>
              <Link href="/contact" className="hover:text-[#1F3A93]">Contact</Link>
            </div>
            <p className="mt-4 text-xs text-[#4A4A4A]/40">
              MyVote is not affiliated with any political party, campaign, or government entity.
              Always verify voting information at{" "}
              <a href="https://sos.ga.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1F3A93]">sos.ga.gov</a>.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Authenticated / guest: two-column layout
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
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
