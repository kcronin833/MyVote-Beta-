import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe, ShieldCheck, MapPin, BarChart3, Users, Newspaper } from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "About MyVote",
  description:
    "Learn how MyVote helps Georgia citizens stay informed with balanced political news, non-partisan voter guides, and civic engagement tools for the 2026 election cycle.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyVote — Georgia's Non-Partisan Voter Guide",
    description:
      "Built for Georgia voters who want the facts without the spin. Read about our mission, team, and how we present news from every perspective.",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="bg-ink-900 text-white">
        <div className="container mx-auto px-4 py-10">
          <Link href="/">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">About MyVote</h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Helping Georgia citizens stay informed, engaged, and empowered — from all political perspectives.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-4">Our Mission</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-ink-700/80 text-lg leading-relaxed mb-4">
              MyVote was built on a simple belief: <strong>an informed voter is a better voter</strong>. In a
              time when political media is deeply fragmented and trust is low, we created a platform where
              Georgians can read news from across the political spectrum — left, right, and down-the-middle — all
              in one place.
            </p>
            <p className="text-ink-700/80 leading-relaxed mb-4">
              We are not here to tell you what to think. We are here to make sure you have access to what
              everyone is saying, so you can form your own opinions. Whether you lean left, lean right, or call
              yourself an independent, MyVote is for you.
            </p>
            <p className="text-ink-700/80 leading-relaxed">
              We launched our pilot in Georgia ahead of the 2026 election cycle because Georgia has become one of
              the most politically consequential states in the country. From Atlanta's city council to the U.S.
              Senate, the decisions made in Georgia affect the whole nation.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-6">What MyVote Does</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Newspaper,
                title: "Balanced News",
                color: "text-teal-600",
                body: "Read the same story from left-leaning, right-leaning, and centrist news sources side by side. No more living in a news bubble.",
              },
              {
                icon: ShieldCheck,
                title: "Just the Facts",
                color: "text-emerald-600",
                body: "Our \"Just the Facts\" section cuts through opinion and shows you verified factual reporting, complete with links to original sources.",
              },
              {
                icon: MapPin,
                title: "Local Georgia Focus",
                color: "text-civic-red",
                body: "Get news specific to your area of Georgia, plus profiles of your local and state representatives.",
              },
              {
                icon: Users,
                title: "Know Your Representatives",
                color: "text-left-lean",
                body: "Detailed profiles of Georgia's U.S. Senators, House members, and local officials — including contact info and key issues.",
              },
              {
                icon: BarChart3,
                title: "Your Political Spectrum",
                color: "text-amber-500",
                body: "Interact with stories to discover where your views actually land on the political spectrum — based on your choices, not a quiz.",
              },
              {
                icon: Globe,
                title: "Community Discussion",
                color: "text-teal-600",
                body: "Comment on articles and engage with other Georgia citizens in real, civil political discourse.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="border-rule">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <CardTitle className="text-base text-ink-700">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink-700/80">{item.body}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Georgia Pilot */}
        <section className="bg-teal-100/40 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-ink-700 mb-4">Georgia 2026 Pilot</h2>
          <p className="text-ink-700/80 leading-relaxed mb-4">
            MyVote is currently in a test pilot phase focused on Georgia voters ahead of the 2026 election
            cycle. We are starting here because Georgia has proven to be a true battleground state — home to
            some of the most competitive and consequential races in the country.
          </p>
          <p className="text-ink-700/80 leading-relaxed mb-4">
            During this pilot, we are gathering feedback from real Georgia voters to improve the platform. Your
            experience matters to us. If something isn't working or you have ideas to make MyVote more useful,
            please reach out through our Contact page.
          </p>
          <p className="text-ink-700/80 leading-relaxed">
            Our goal is to expand MyVote to other states following a successful Georgia pilot. But for now — we
            are all in on Georgia.
          </p>
        </section>

        {/* What We Are Not */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-4">What We Are Not</h2>
          <ul className="space-y-3 text-ink-700/80">
            {[
              "We are not affiliated with any political party, candidate, or campaign.",
              "We are not a news organization — we aggregate and organize news from existing sources.",
              "We do not editorialize or take positions on political issues.",
              "We do not sell your personal data to political campaigns or advertisers.",
              "We are not a replacement for your county's official election resources — always verify voting info at sos.ga.gov.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Who Built This */}
        <section className="border-t border-rule pt-10">
          <h2 className="text-2xl font-bold text-ink-700 mb-4">Who Built This</h2>
          <div className="flex items-start gap-5">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1F3A5F 0%, #3D8073 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              KC
            </div>
            <div>
              <div className="font-bold text-ink-700 text-lg">Kevin Cronin</div>
              <div className="text-sm text-teal-600 font-medium mb-2">Founder · Georgia resident</div>
              <p className="text-ink-700/80 leading-relaxed text-sm">
                MyVote grew out of frustration with how hard it is to get a straight answer about who's on your
                ballot and what they actually stand for. I built this for Georgia voters who are tired of partisan
                noise and just want the facts. If something isn't working or you have ideas, my inbox is always open.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center border-t border-rule pt-10">
          <h2 className="text-xl font-bold text-ink-700 mb-2">Questions or Feedback?</h2>
          <p className="text-ink-700/70 mb-6">
            I read every message. Reach out anytime.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Contact Us</Button>
            </Link>
            <Link href="/elections">
              <Button variant="outline" className="border-teal-600 text-teal-600">
                Georgia 2026 Elections
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <footer className="border-t border-rule py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-ink-700/60">
          <Logo size="sm" />
          <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/elections" className="hover:text-ink-900">Elections 2026</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/terms" className="hover:text-ink-900">Terms</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
