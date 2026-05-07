"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Globe,
  Users,
  BarChart3,
  Newspaper,
  ShieldCheck,
  Vote,
  Clock,
} from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { HomeFeed } from "@/components/home-feed"

function ElectionCountdown() {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    // Georgia Primary: May 19, 2026
    const primary = new Date("2026-05-19T07:00:00-04:00")
    // Georgia General: November 3, 2026
    const general = new Date("2026-11-03T07:00:00-05:00")
    const now = new Date()
    const target = now < primary ? primary : general
    const label = now < primary ? "Georgia Primary" : "General Election"
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    setDays(diff)
  }, [])

  if (days === null) return null

  const isPrimary = new Date() < new Date("2026-05-19T07:00:00-04:00")

  return (
    <Link href="/elections">
      <div className="flex items-center gap-3 bg-[#F39C12]/10 border border-[#F39C12]/30 rounded-lg px-4 py-2.5 hover:bg-[#F39C12]/20 transition-colors cursor-pointer">
        <Clock className="w-4 h-4 text-[#F39C12] flex-shrink-0" />
        <div>
          <p className="text-xs text-[#4A4A4A]/70 font-medium uppercase tracking-wide">
            {isPrimary ? "Georgia Primary" : "General Election"}
          </p>
          <p className="text-sm font-bold text-[#4A4A4A]">
            {days} days away · {isPrimary ? "May 19, 2026" : "November 3, 2026"}
          </p>
        </div>
        <Badge className="bg-[#F39C12] text-white text-xs ml-auto">2026</Badge>
      </div>
    </Link>
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

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3A93]" />
      </div>
    )
  }

  // Show welcome/sign-up page for unauthenticated users (unless guest mode)
  if (!user && !guestMode) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Hero */}
        <div className="bg-[#1F3A93] text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <Logo size="xl" />
            <p className="mt-4 text-lg max-w-2xl mx-auto text-blue-100 leading-relaxed">
              Your gateway to politically balanced news, local updates, and civic
              engagement. Stay informed. Stay balanced. Make your vote count.
            </p>
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-[#F39C12] hover:bg-[#E67E22] text-white font-semibold"
                >
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/elections">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#F39C12] text-[#F39C12] hover:bg-[#F39C12]/10"
                >
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
              className="mt-4 text-sm text-blue-200 hover:text-white underline underline-offset-4 transition-colors"
            >
              Browse as Guest
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-[#4A4A4A] mb-2 text-balance">
            Why MyVote?
          </h2>
          <p className="text-center text-[#4A4A4A]/70 mb-10 max-w-xl mx-auto text-pretty">
            We believe informed citizens make better decisions. Here is how we
            help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Newspaper className="w-8 h-8 text-[#1F3A93] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Balanced News</CardTitle>
                <CardDescription>
                  Read left, right, and fact-based perspectives on every story so
                  you see the full picture.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <ShieldCheck className="w-8 h-8 text-[#27AE60] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Just the Facts</CardTitle>
                <CardDescription>
                  Factual summaries strip away bias and show you verified
                  information from official sources.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <MapPin className="w-8 h-8 text-[#D64541] mb-2" />
                <CardTitle className="text-[#4A4A4A]">Local Focus</CardTitle>
                <CardDescription>
                  Get news and representative info for your area based on your
                  location, automatically.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Users className="w-8 h-8 text-[#3498DB] mb-2" />
                <CardTitle className="text-[#4A4A4A]">
                  Know Your Representatives
                </CardTitle>
                <CardDescription>
                  Detailed profiles, voting records, and compatibility scores for
                  your elected officials.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-[#F39C12] mb-2" />
                <CardTitle className="text-[#4A4A4A]">
                  Political Spectrum
                </CardTitle>
                <CardDescription>
                  Like viewpoints to discover where you fall on the political
                  spectrum based on your actual preferences.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <Globe className="w-8 h-8 text-[#1F3A93] mb-2" />
                <CardTitle className="text-[#4A4A4A]">
                  Community Discussion
                </CardTitle>
                <CardDescription>
                  Comment on articles, tag other users, and engage in meaningful
                  political discourse.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Georgia 2026 CTA */}
        <div className="bg-[#1F3A93]/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge className="bg-[#F39C12] text-white mb-4">Georgia 2026 Pilot</Badge>
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-2 text-balance">
              Georgia 2026 Elections Are Coming
            </h2>
            <p className="text-[#4A4A4A]/70 mb-4 max-w-xl mx-auto text-pretty">
              The U.S. Senate seat, all 14 House seats, and dozens of state races are on the ballot.
              MyVote helps you stay informed and ready to vote.
            </p>
            <div className="max-w-sm mx-auto mb-6">
              <ElectionCountdown />
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/elections">
                <Button
                  size="lg"
                  className="bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Georgia 2026 Races & Dates
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1F3A93] text-[#1F3A93]"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E5E5E5] py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[#4A4A4A]/60">
            <Logo size="sm" />
            <p className="mt-2">
              Inform. Clarify. Empower all political perspectives.
            </p>
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
              <Link href="/about" className="hover:text-[#1F3A93]">About</Link>
              <Link href="/elections" className="hover:text-[#1F3A93]">Elections 2026</Link>
              <Link href="/privacy" className="hover:text-[#1F3A93]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#1F3A93]">Terms of Service</Link>
              <Link href="/contact" className="hover:text-[#1F3A93]">Contact</Link>
            </div>
            <p className="mt-4 text-xs text-[#4A4A4A]/40">
              MyVote is not affiliated with any political party, campaign, or government entity.
              Always verify voting information at <a href="https://sos.ga.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1F3A93]">sos.ga.gov</a>.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Authenticated user or guest mode: show the news feed
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />
        <div className="max-w-4xl mx-auto space-y-6">
          <ElectionCountdown />
          <HomeFeed />
        </div>
      </div>
    </div>
  )
}
