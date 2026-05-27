import Link from "next/link"
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
            Your gateway to politically balanced news, local updates, and civic engagement.
            Stay informed. Stay balanced. Make your vote count.
          </p>
          <div className="flex gap-4 justify-center mt-8">
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
              <CardDescription>Get news and representative info for your area. Currently featuring Atlanta, GA as our example city.</CardDescription>
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

      {/* Atlanta Section */}
      <div className="bg-teal-100/40 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-serif text-ink-700 mb-2">Currently Featuring: Atlanta, GA</h2>
          <p className="text-ink-700/70 mb-8 max-w-xl mx-auto">
            Explore how MyVote works with real Atlanta representatives, local news, and Georgia political data.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/news">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Browse National News</Button>
            </Link>
            <Link href="/news/local">
              <Button variant="outline" className="border-teal-600 text-teal-600">Atlanta Local News</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-civic-red text-civic-red">Political Profiles</Button>
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
