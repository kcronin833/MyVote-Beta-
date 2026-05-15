import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Vote,
  MapPin,
  Users,
  ExternalLink,
  Clock,
  CheckSquare,
  AlertCircle,
  Home,
  Newspaper,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { NotificationBell } from "@/components/notification-bell"
import { UserNav } from "@/components/user-nav"

export const metadata = {
  title: "Georgia 2026 Elections | MyVote",
  description:
    "Everything Georgia voters need for the 2026 elections — key races, important dates, voter registration, and candidate information.",
}

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news/spectrum", label: "News", icon: Newspaper },
  { href: "/elections", label: "Elections", icon: Vote },
  { href: "/profile", label: "Profile", icon: Users },
]

const KEY_DATES = [
  {
    date: "May 19, 2026",
    label: "Georgia Primary Election",
    description: "Party nominees selected for statewide and federal races.",
    status: "critical",
  },
  {
    date: "June 16, 2026",
    label: "Primary Runoff",
    description: "Runoff elections if no candidate clears 50%.",
    status: "upcoming",
  },
  {
    date: "November 3, 2026",
    label: "General Election Day",
    description: "Georgia voters head to the polls statewide.",
    status: "critical",
  },
]

const HOUSE_RACES = [
  {
    district: "Georgia 6th District",
    incumbent: "Rich McCormick",
    area: "North Atlanta suburbs",
    competitiveness: "Likely Republican",
  },
  {
    district: "Georgia 7th District",
    incumbent: "Lucy McBath",
    area: "Gwinnett / Forsyth",
    competitiveness: "Competitive",
  },
  {
    district: "Georgia 13th District",
    incumbent: "David Scott",
    area: "South Metro Atlanta",
    competitiveness: "Safe Democrat",
  },
]

const VOTER_RESOURCES = [
  {
    title: "Check Registration",
    description: "Verify your Georgia voter registration status.",
    url: "https://mvp.sos.ga.gov/",
    icon: CheckSquare,
  },
  {
    title: "Find Polling Place",
    description: "Locate your polling place and sample ballot.",
    url: "https://mvp.sos.ga.gov/",
    icon: MapPin,
  },
  {
    title: "Register to Vote",
    description: "Register or update your Georgia voter information.",
    url: "https://registertovote.sos.ga.gov/",
    icon: Vote,
  },
]

export default function ElectionsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      <div className="container mx-auto px-4 pt-5 pb-24 max-w-6xl">
        <div className="flex items-center justify-between pb-5">
          <Logo size="sm" />

          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserNav />
          </div>
        </div>

        <div className="community-card rounded-[1.35rem] p-3 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = href === "/elections"

              return (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: active ? "var(--civic-blue)" : "rgba(255,253,248,0.72)",
                    color: active ? "white" : "var(--ink-700)",
                    border: active ? "1px solid transparent" : "1px solid var(--rule)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start mb-8">
          <div className="community-card rounded-[2rem] p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--ink-500)" }}>
              Georgia election center
            </div>

            <h1 className="editorial-headline text-5xl mb-4"
              style={{ color: "var(--ink-900)" }}>
              Elections & civic action
            </h1>

            <p className="text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--ink-700)" }}>
              Follow races, discover candidates, prepare your ballot, and stay connected to the elections shaping Georgia communities.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/profile"
                className="primary-action px-5 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                <Vote className="w-4 h-4" />
                View your ballot
              </Link>

              <Link href="/"
                className="local-pill px-5 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                Join conversations
              </Link>
            </div>
          </div>

          <div className="community-card rounded-[2rem] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(34,60,117,0.10)", color: "var(--civic-blue)" }}>
                <Clock className="w-5 h-5" />
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--ink-500)" }}>
                  Next major election
                </div>

                <div className="font-semibold text-lg" style={{ color: "var(--ink-900)" }}>
                  Georgia Primary
                </div>
              </div>
            </div>

            <div className="editorial-headline text-5xl mb-2"
              style={{ color: "var(--ink-900)" }}>
              5
            </div>

            <div className="text-sm" style={{ color: "var(--ink-500)" }}>
              days until polls open statewide.
            </div>
          </div>
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--ink-500)" }}>
                Your election timeline
              </div>

              <h2 className="text-2xl font-semibold" style={{ color: "var(--ink-900)" }}>
                Important dates
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {KEY_DATES.map((item) => (
              <Card key={item.label} className="community-card border-0 rounded-[1.5rem] overflow-hidden">
                <CardContent className="p-5">
                  <Badge className="mb-3 bg-blue-100 text-blue-800 border-blue-200">
                    {item.date}
                  </Badge>

                  <div className="font-semibold mb-2" style={{ color: "var(--ink-900)" }}>
                    {item.label}
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-500)" }}>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--ink-500)" }}>
              Major Georgia races
            </div>

            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink-900)" }}>
              Competitive districts
            </h2>
          </div>

          <div className="grid gap-4">
            {HOUSE_RACES.map((race) => (
              <Card key={race.district} className="community-card border-0 rounded-[1.5rem] overflow-hidden">
                <CardContent className="p-5 flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-semibold text-lg mb-1" style={{ color: "var(--ink-900)" }}>
                      {race.district}
                    </div>

                    <div className="text-sm mb-1" style={{ color: "var(--ink-700)" }}>
                      Incumbent: {race.incumbent}
                    </div>

                    <div className="text-sm" style={{ color: "var(--ink-500)" }}>
                      {race.area}
                    </div>
                  </div>

                  <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                    {race.competitiveness}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--ink-500)" }}>
              Voter tools
            </div>

            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink-900)" }}>
              Official Georgia resources
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {VOTER_RESOURCES.map((resource) => {
              const Icon = resource.icon

              return (
                <a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="community-card rounded-[1.5rem] p-5 transition-all hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(34,60,117,0.10)", color: "var(--civic-blue)" }}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="font-semibold mb-2" style={{ color: "var(--ink-900)" }}>
                    {resource.title}
                  </div>

                  <p className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--ink-500)" }}>
                    {resource.description}
                  </p>

                  <div className="text-sm font-semibold inline-flex items-center gap-2"
                    style={{ color: "var(--civic-blue)" }}>
                    Open resource
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
