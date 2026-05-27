import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  Vote,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
  Clock,
  CheckSquare,
  AlertCircle,
  Info,
} from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata = {
  title: "Georgia 2026 Elections | MyVote",
  description:
    "Everything Georgia voters need for the 2026 elections — key races, important dates, voter registration, and candidate information.",
}

const KEY_DATES = [
  {
    date: "November 2025",
    label: "Candidate Filing Opens",
    description: "Candidates begin filing for 2026 Georgia races",
    status: "upcoming",
  },
  {
    date: "March 2026",
    label: "Voter Registration Deadline (Primary)",
    description: "Last day to register or update your registration for the Primary",
    status: "critical",
  },
  {
    date: "May 19, 2026",
    label: "Georgia Primary Election",
    description: "Voters choose party nominees for all federal and state races",
    status: "critical",
  },
  {
    date: "June 16, 2026",
    label: "Primary Runoff (if needed)",
    description: "Runoff if no candidate receives more than 50% of primary votes",
    status: "upcoming",
  },
  {
    date: "October 5, 2026",
    label: "Voter Registration Deadline (General)",
    description: "Last day to register to vote in the November General Election",
    status: "critical",
  },
  {
    date: "October 19 – October 30, 2026",
    label: "Early Voting Period",
    description: "Vote early in person at your county's early voting locations",
    status: "upcoming",
  },
  {
    date: "November 3, 2026",
    label: "General Election Day",
    description: "The main election — polls open 7 AM to 7 PM",
    status: "critical",
  },
]

const SENATE_RACE = {
  seat: "U.S. Senate — Georgia",
  cycle: "Class III",
  incumbent: {
    name: "Jon Ossoff",
    party: "Democrat",
    since: "January 2021",
    website: "https://www.ossoff.senate.gov/",
    bio: "Jon Ossoff has served as Georgia's U.S. Senator since January 2021. He narrowly won a runoff election in January 2021 alongside Raphael Warnock, flipping both Georgia Senate seats. His seat is up for election in 2026.",
  },
  why_it_matters:
    "This race will help determine control of the U.S. Senate. Georgia has become one of the most competitive states in the nation, making this a top-tier battleground race in 2026.",
}

const HOUSE_RACES = [
  {
    district: "Georgia's 5th Congressional District",
    incumbent: "Nikema Williams",
    party: "Democrat",
    area: "Atlanta (Fulton & DeKalb counties)",
    competitiveness: "Safe Democrat",
    website: "https://nikemawilliams.house.gov/",
  },
  {
    district: "Georgia's 6th Congressional District",
    incumbent: "Rich McCormick",
    party: "Republican",
    area: "Northern Atlanta suburbs (Cherokee, Forsyth, Gwinnett counties)",
    competitiveness: "Likely Republican",
    website: "https://mccormick.house.gov/",
  },
  {
    district: "Georgia's 7th Congressional District",
    incumbent: "Lucy McBath",
    party: "Democrat",
    area: "Gwinnett, Forsyth, Hall counties",
    competitiveness: "Competitive",
    website: "https://mcbath.house.gov/",
  },
  {
    district: "Georgia's 13th Congressional District",
    incumbent: "David Scott",
    party: "Democrat",
    area: "South Fulton, Douglas, Fayette, Henry counties",
    competitiveness: "Safe Democrat",
    website: "https://davidscott.house.gov/",
  },
]

const VOTER_RESOURCES = [
  {
    title: "Check Your Registration",
    description: "Verify your voter registration status with the Georgia Secretary of State",
    url: "https://mvp.sos.ga.gov/",
    icon: CheckSquare,
    cta: "Check Now",
  },
  {
    title: "Register to Vote",
    description: "New to Georgia or need to update your address? Register online in minutes",
    url: "https://registertovote.sos.ga.gov/",
    icon: Vote,
    cta: "Register",
  },
  {
    title: "Find Your Polling Place",
    description: "Look up your assigned polling location for Election Day",
    url: "https://mvp.sos.ga.gov/",
    icon: MapPin,
    cta: "Find Location",
  },
  {
    title: "Absentee / Mail Ballot",
    description: "Request an absentee ballot to vote by mail before Election Day",
    url: "https://registertovote.sos.ga.gov/",
    icon: CalendarDays,
    cta: "Request Ballot",
  },
]

const PARTY_BADGE_COLORS: Record<string, string> = {
  Democrat: "bg-blue-100 text-blue-800 border-blue-300",
  Republican: "bg-red-100 text-red-800 border-red-300",
  Independent: "bg-paper-200 text-ink-700 border-rule",
}

const COMPETITIVENESS_COLORS: Record<string, string> = {
  "Safe Democrat": "bg-blue-600 text-white",
  "Likely Democrat": "bg-blue-400 text-white",
  Competitive: "bg-yellow-500 text-white",
  "Likely Republican": "bg-red-400 text-white",
  "Safe Republican": "bg-red-600 text-white",
}

export default function ElectionsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      {/* Header */}
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
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Georgia 2026 Elections</h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Your complete guide to the 2026 Georgia election cycle — key races, important dates, voter resources,
            and how to make your voice count.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* Important Disclaimer */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Specific dates such as candidate filing deadlines and exact early voting
            windows are set by the Georgia Secretary of State and may be adjusted. Always verify critical
            dates at{" "}
            <a href="https://sos.ga.gov/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              sos.ga.gov
            </a>{" "}
            before making voting plans.
          </p>
        </div>

        {/* Key Dates Timeline */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-6 h-6 text-ink-900" />
            <h2 className="text-2xl font-bold text-ink-700">Key Dates</h2>
          </div>
          <div className="grid gap-3">
            {KEY_DATES.map((item) => (
              <div
                key={item.date}
                className="flex items-start gap-4 bg-paper-50 border border-rule rounded-lg p-4 hover:border-ink-900/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {item.status === "critical" ? (
                    <div className="w-3 h-3 rounded-full bg-civic-red mt-1" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-ink-900/40 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-ink-900 text-sm">{item.date}</span>
                    {item.status === "critical" && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        Important
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium text-ink-700">{item.label}</p>
                  <p className="text-sm text-ink-700/70 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* U.S. Senate Race */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-ink-900" />
            <h2 className="text-2xl font-bold text-ink-700">U.S. Senate Race</h2>
            <Badge className="bg-amber-500 text-white">Top Race</Badge>
          </div>

          <Card className="border-rule overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-ink-900 to-red-600" />
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-ink-700">{SENATE_RACE.seat}</CardTitle>
                  <CardDescription className="mt-1">
                    Full 6-year term · {SENATE_RACE.cycle} seat · Up for election November 3, 2026
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
                  Battleground Race
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-paper-100 rounded-lg p-4 border border-rule">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={PARTY_BADGE_COLORS["Democrat"]}>
                    Democrat
                  </Badge>
                  <span className="text-sm text-ink-700/60">Incumbent · Senator since {SENATE_RACE.incumbent.since}</span>
                </div>
                <h3 className="text-lg font-bold text-ink-700">{SENATE_RACE.incumbent.name}</h3>
                <p className="text-sm text-ink-700/80 mt-2">{SENATE_RACE.incumbent.bio}</p>
                <a
                  href={SENATE_RACE.incumbent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-teal-600 hover:underline"
                >
                  Official Senate Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-start gap-3 bg-teal-100 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-teal-700 mb-1">Why This Race Matters</p>
                  <p className="text-sm text-ink-700/80">{SENATE_RACE.why_it_matters}</p>
                </div>
              </div>

              <p className="text-sm text-ink-700/60 italic">
                Republican and Independent challengers will be listed here as candidates announce. Check back for updates.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* U.S. House Races */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-ink-900" />
            <h2 className="text-2xl font-bold text-ink-700">U.S. House Races</h2>
          </div>
          <p className="text-ink-700/70 mb-6">
            All 14 of Georgia's congressional seats are up for election every two years. Below are key races in
            the Atlanta metro area.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {HOUSE_RACES.map((race) => (
              <Card key={race.district} className="border-rule hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={COMPETITIVENESS_COLORS[race.competitiveness] + " text-xs"}
                    >
                      {race.competitiveness}
                    </Badge>
                    <Badge variant="outline" className={PARTY_BADGE_COLORS[race.party] + " text-xs"}>
                      {race.party}
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-ink-700 mt-2">{race.district}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {race.area}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-ink-700">
                    <span className="font-medium">Incumbent:</span> {race.incumbent}
                  </p>
                  <a
                    href={race.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-teal-600 hover:underline"
                  >
                    Official Website <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-ink-700/60 mt-4 italic">
            All 14 Georgia House seats are contested. Additional districts will be added as race information becomes available.
          </p>
        </section>

        <Separator />

        {/* Voter Resources */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Vote className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-ink-700">Voter Resources</h2>
          </div>
          <p className="text-ink-700/70 mb-6">
            Everything you need to participate in Georgia elections — all official links direct to Georgia
            Secretary of State resources.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {VOTER_RESOURCES.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title} className="border-rule hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-ink-700">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                        {resource.cta} <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* Georgia Voting Rules */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-ink-900" />
            <h2 className="text-2xl font-bold text-ink-700">Georgia Voting Rules</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "ID Required",
                body: "Georgia requires a photo ID to vote in person. Acceptable IDs include a driver's license, passport, or Georgia voter ID card (free from your county).",
              },
              {
                title: "Absentee Voting",
                body: "Any registered Georgia voter may request an absentee ballot. You must include a copy of your photo ID when submitting your absentee ballot.",
              },
              {
                title: "Registration Deadline",
                body: "You must register at least 28 days before an election. You can register online, by mail, or in person at your county elections office.",
              },
              {
                title: "Early Voting",
                body: "Georgia offers in-person early voting starting 4 weeks before an election. Check your county's elections website for specific locations and hours.",
              },
              {
                title: "Runoff Elections",
                body: "If no candidate receives more than 50% of the vote in the Primary, a runoff between the top two candidates is held approximately 4 weeks later.",
              },
              {
                title: "Same-Day Registration",
                body: "Georgia does NOT have same-day voter registration. You must be registered before the deadline to vote in any election.",
              },
            ].map((rule) => (
              <Card key={rule.title} className="border-rule">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-ink-700">{rule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink-700/80">{rule.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-ink-900 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold font-serif mb-2">Stay Informed on Georgia Politics</h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            Read balanced news from left, right, and fact-based sources. Create a free account to comment,
            track your ballot, and follow local discussions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button className="bg-civic-red hover:bg-civic-red/90 text-white font-semibold">
                Create Free Account
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Read the News
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rule py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-ink-700/60">
          <Logo size="sm" />
          <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/about" className="hover:text-ink-900">About</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/terms" className="hover:text-ink-900">Terms</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
