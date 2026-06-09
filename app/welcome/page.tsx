import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Welcome to MyVote — Georgia's 2026 Voter Guide",
  description:
    "Georgia's free, non-partisan 2026 voter guide. See your complete ballot for every one of the 159 Georgia counties, read news from left, right, and center, and find your polling place.",
  robots: { index: false, follow: true },
}
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, MapPin, Users, BarChart3, Newspaper, ShieldCheck } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-paper-100">
      {/* Hero Section */}
      <div className="bg-ink-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Logo size="xl" />
          <p className="mt-4 text-lg max-w-2xl mx-auto text-teal-100 leading-relaxed">
            Georgia&rsquo;s non-partisan voter guide for 2026. See your complete ballot, read every candidate&rsquo;s
            positions, and follow the news from left, right, and center — all in one place.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-civic-red hover:bg-civic-red/90 text-white font-semibold">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="border-teal-300 text-teal-100 hover:bg-teal-800/30">
                Take the civic quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold font-serif text-center text-ink-700 mb-2">Why MyVote?</h2>
        <p className="text-center text-ink-700/70 mb-10 max-w-xl mx-auto">
          We believe informed citizens make better decisions. Here is how we help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-rule">
            <CardHeader>
              <Newspaper className="w-8 h-8 text-teal-600 mb-2" />
              <CardTitle className="text-ink-700">Balanced News</CardTitle>
              <CardDescription>Read left, right, and fact-based perspectives on every story so you see the full picture.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-rule">
            <CardHeader>
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-ink-700">Just the Facts</CardTitle>
              <CardDescription>AI-generated factual summaries strip away bias and show you verified information from official sources.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-rule">
            <CardHeader>
              <MapPin className="w-8 h-8 text-civic-red mb-2" />
              <CardTitle className="text-ink-700">Local Focus</CardTitle>
              <CardDescription>Get news and ballot info for your exact area. Enter your ZIP to see races for all 159 Georgia counties.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-rule">
            <CardHeader>
              <Users className="w-8 h-8 text-left-lean mb-2" />
              <CardTitle className="text-ink-700">Know Your Representatives</CardTitle>
              <CardDescription>Detailed profiles, voting records, and compatibility scores for your elected officials.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-rule">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-amber-500 mb-2" />
              <CardTitle className="text-ink-700">Political Spectrum</CardTitle>
              <CardDescription>Like viewpoints to discover where you fall on the political spectrum based on your actual preferences.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-rule">
            <CardHeader>
              <Globe className="w-8 h-8 text-teal-600 mb-2" />
              <CardTitle className="text-ink-700">Community Discussion</CardTitle>
              <CardDescription>Comment on articles, tag other users, and engage in meaningful political discourse.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Georgia Coverage Section */}
      <div className="bg-teal-100/40 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-serif text-ink-700 mb-2">All 159 Georgia Counties Covered</h2>
          <p className="text-ink-700/70 mb-8 max-w-xl mx-auto">
            Enter your ZIP code and see every race on your 2026 ballot — from Governor down to local school board — with candidates, key issues, and voting deadlines.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/elections">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">View 2026 Georgia Ballot</Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" className="border-teal-600 text-teal-600">News Across the Spectrum</Button>
            </Link>
            <Link href="/g">
              <Button variant="outline" className="border-civic-red text-civic-red">Browse by County</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rule py-8">
        <div className="container mx-auto px-4 text-center text-sm text-ink-700/60">
          <Logo size="sm" />
          <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
        </div>
      </footer>
    </div>
  )
}
