"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Globe,
  Users,
  BarChart3,
  Newspaper,
  ShieldCheck,
} from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { HomeFeed } from "@/components/home-feed"

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
            <div className="flex gap-4 justify-center mt-8">
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

        {/* Georgia CTA */}
        <div className="bg-[#1F3A93]/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-2 text-balance">
              Now Launching in Georgia
            </h2>
            <p className="text-[#4A4A4A]/70 mb-8 max-w-xl mx-auto text-pretty">
              Explore real Atlanta representatives, local Georgia news, and
              up-to-date 2026 election data. Sign up to get started.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E5E5E5] py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[#4A4A4A]/60">
            <Logo size="sm" />
            <p className="mt-2">
              Inform. Clarify. Empower all political perspectives.
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
        <div className="max-w-4xl mx-auto">
          <HomeFeed />
        </div>
      </div>
    </div>
  )
}
