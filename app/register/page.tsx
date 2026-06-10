"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Vote,
  Mail,
  Search,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { resolveCountySlug, countySlug, getAllCountyNames } from "@/lib/county-utils"

/* ── Key Georgia 2026 dates ─────────────────────────────────────────── */
const DATES = {
  runoff:               new Date("2026-06-16T07:00:00-04:00"),
  runoffEarlyEnd:       new Date("2026-06-13T00:00:00-04:00"),
  generalRegDeadline:   new Date("2026-10-05T23:59:59-04:00"),
  generalEarlyStart:    new Date("2026-10-12T00:00:00-04:00"),
  generalAbsenteeDeadline: new Date("2026-10-23T23:59:59-04:00"),
  general:              new Date("2026-11-03T07:00:00-05:00"),
}

function daysUntil(d: Date): number {
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86_400_000))
}
function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

/* ── Action card data ───────────────────────────────────────────────── */
const ACTIONS = [
  {
    icon: Search,
    label: "Check Registration",
    desc: "Confirm you're registered and find your polling place.",
    href: "https://mvp.sos.ga.gov",
    color: "#3D8073",
    bg: "#E6F0ED",
  },
  {
    icon: Vote,
    label: "Register to Vote",
    desc: "Register online in minutes. Deadline: Oct 5, 2026 for the General.",
    href: "https://registertovote.sos.ga.gov",
    color: "#1F3A5F",
    bg: "#E8EEF5",
  },
  {
    icon: Mail,
    label: "Request Absentee Ballot",
    desc: "Vote by mail — request opens 180 days before the election.",
    href: "https://ballotrequest.sos.ga.gov",
    color: "#B8862F",
    bg: "#F4ECD8",
  },
  {
    icon: MapPin,
    label: "Find Polling Place",
    desc: "Look up your assigned precinct and early voting locations.",
    href: "https://mvp.sos.ga.gov",
    color: "#6B3A6B",
    bg: "#F0E6F0",
  },
]

/* ── Voter ID list ──────────────────────────────────────────────────── */
const ACCEPTED_IDS = [
  "Georgia Driver's License (including expired after Jan 1, 2020)",
  "Georgia State-Issued Photo ID Card",
  "U.S. Passport or Passport Card",
  "Military ID / Dependent Military ID",
  "Tribal Photo ID",
  "U.S. Government or Georgia State Employee Photo ID",
  "Student Photo ID from a Georgia public college or university",
]

/* ── FAQ ────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Am I already registered?",
    a: "Check your status at the Georgia My Voter Page (mvp.sos.ga.gov). You'll need your name, date of birth, and county.",
  },
  {
    q: "What if I don't have a photo ID?",
    a: "Georgia offers a free State ID Card through the Department of Driver Services (dds.georgia.gov) to any eligible voter at no cost.",
  },
  {
    q: "Can I vote early in person?",
    a: "Yes — Georgia has in-person early voting for every election. For the November 3 General, early voting runs October 12–30, 2026 at your county's designated sites.",
  },
  {
    q: "I moved within Georgia. Do I need to update my registration?",
    a: "Yes. If you moved to a different county, you must re-register. If you moved within the same county, update your address before the deadline.",
  },
  {
    q: "What's the deadline to request an absentee ballot?",
    a: "For the November 3, 2026 General Election, absentee ballot requests must be received by October 23, 2026 (11 days before Election Day).",
  },
  {
    q: "Is the June 16 runoff still open for registration?",
    a: "No — the registration deadline for the June 16 Primary Runoff was May 19, 2026. You can still vote in the June 16 runoff if you were registered by that date.",
  },
]

/* ── Component ──────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const { user, profile } = useAuth()
  const [now, setNow] = useState(new Date())
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [countySearch, setCountySearch] = useState("")

  // Tick every minute so countdowns stay fresh
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const daysToRegDeadline = daysUntil(DATES.generalRegDeadline)
  const daysToGeneral = daysUntil(DATES.general)
  const runoffPast = now > DATES.runoff
  const earlyVotingOpen = now >= DATES.generalEarlyStart && now <= DATES.general

  // County from the logged-in user's profile
  const countySlugFromProfile = useMemo(
    () => resolveCountySlug(profile?.location),
    [profile?.location]
  )
  const countyName = useMemo(() => {
    if (!countySlugFromProfile) return null
    const names = getAllCountyNames()
    return names.find((n) => countySlug(n) === countySlugFromProfile) ?? null
  }, [countySlugFromProfile])

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-10">

        {/* ── Hero ── */}
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Georgia 2026 Elections
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Register &amp; Vote in Georgia
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
              Everything you need — deadlines, ID requirements, absentee ballots, and your county
              election office — in one place.
            </p>
          </div>

          {/* ── Deadline banner ── */}
          <div
            className="rounded-2xl border p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{
              background: daysToRegDeadline <= 14 ? "#FFF3CD" : "#E6F0ED",
              borderColor: daysToRegDeadline <= 14 ? "#F0C040" : "#B0D5CB",
            }}
          >
            <CalendarDays
              className="w-8 h-8 flex-shrink-0 mt-0.5 sm:mt-0"
              style={{ color: daysToRegDeadline <= 14 ? "#B8862F" : "#3D8073" }}
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">
                General Election registration deadline —{" "}
                <span style={{ color: "#1A2138" }}>{fmt(DATES.generalRegDeadline)}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {daysToRegDeadline > 0
                  ? `${daysToRegDeadline} days away · November 3 General Election is in ${daysToGeneral} days`
                  : "Registration deadline has passed for the November General Election."}
              </p>
            </div>
            <a
              href="https://registertovote.sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#3D8073", borderRadius: 999, padding: "8px 16px" }}
            >
              Register Now
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* ── 4 Action cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {ACTIONS.map(({ icon: Icon, label, desc, href, color, bg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mv-lift"
                style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, padding: 18, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", textDecoration: "none", display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div
                  style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}
                >
                  <Icon style={{ color, width: 20, height: 20 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2138", display: "flex", alignItems: "center", gap: 4, margin: "0 0 3px" }}>
                    {label}
                    <ExternalLink style={{ width: 12, height: 12, color: "#6B7088", opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p style={{ fontSize: 12.5, color: "#6B7088", lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* ── 2026 Election Timeline ── */}
          <section className="mb-6" style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, padding: 20, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
            <h2 className="font-bold text-foreground text-base mb-5 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-teal-600" />
              2026 Georgia Election Timeline
            </h2>

            <ol className="relative border-l border-border ml-3 space-y-5">
              {/* Primary — past */}
              <TimelineItem
                label="Primary Election"
                date="May 19, 2026"
                status="past"
                note="Statewide primary completed. Runoff required for Governor (R) and U.S. Senate (R)."
              />

              {/* Runoff */}
              <TimelineItem
                label="Primary Runoff"
                date="June 16, 2026"
                status={runoffPast ? "past" : "upcoming"}
                note={
                  runoffPast
                    ? "Runoff completed."
                    : `In ${daysUntil(DATES.runoff)} days — Governor GOP runoff (Jones vs Jackson) · Senate GOP runoff (Collins vs Dooley). Registration deadline was May 19.`
                }
              />

              {/* General reg deadline */}
              <TimelineItem
                label="General Election — Registration Deadline"
                date={fmt(DATES.generalRegDeadline)}
                status={now > DATES.generalRegDeadline ? "past" : "next"}
                note={
                  now > DATES.generalRegDeadline
                    ? "Deadline passed."
                    : `${daysToRegDeadline} days away — last day to register or update your address for the November 3 General Election.`
                }
                cta={{ label: "Register", href: "https://registertovote.sos.ga.gov" }}
              />

              {/* Early voting */}
              <TimelineItem
                label="Early Voting Period"
                date="Oct 12 – Oct 30, 2026"
                status={earlyVotingOpen ? "current" : now > DATES.general ? "past" : "future"}
                note="In-person early voting at county sites. Bring a valid photo ID."
                cta={{ label: "Find locations", href: "https://mvp.sos.ga.gov" }}
              />

              {/* Absentee deadline */}
              <TimelineItem
                label="Absentee Request Deadline"
                date={fmt(DATES.generalAbsenteeDeadline)}
                status={now > DATES.generalAbsenteeDeadline ? "past" : "future"}
                note="Last day to request a mail-in ballot. Requests can open 180 days before Election Day."
                cta={{ label: "Request ballot", href: "https://ballotrequest.sos.ga.gov" }}
              />

              {/* General Election */}
              <TimelineItem
                label="General Election Day"
                date="November 3, 2026"
                status={now > DATES.general ? "past" : "future"}
                note={
                  now > DATES.general
                    ? "General Election completed."
                    : `${daysToGeneral} days away — polls open 7 AM – 7 PM. Bring photo ID.`
                }
                isLast
              />
            </ol>
          </section>

          {/* ── Voter ID ── */}
          <section className="mb-6" style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, padding: 20, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
            <h2 className="font-bold text-foreground text-base mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Georgia Voter ID Requirements
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Georgia requires a{" "}
              <strong className="font-semibold text-foreground">photo ID</strong> to vote in
              person or by absentee ballot (a copy must accompany mail ballots).
            </p>

            <ul className="space-y-2 mb-4">
              {ACCEPTED_IDS.map((id) => (
                <li key={id} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  {id}
                </li>
              ))}
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800">
                <strong>No ID?</strong> Georgia offers a free State Photo ID Card through the
                Department of Driver Services.{" "}
                <a
                  href="https://dds.georgia.gov/free-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Apply at dds.georgia.gov
                </a>
              </p>
            </div>
          </section>

          {/* ── Your County ── */}
          <section className="mb-6" style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, padding: 20, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}>
            <h2 className="font-bold text-foreground text-base mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Your County Election Office
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Each of Georgia's 159 counties runs its own elections. Your county office handles
              registration, early voting sites, and absentee ballot processing.
            </p>

            {countyName ? (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{countyName} County</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    From your profile · update in{" "}
                    <Link href="/profile" className="underline text-teal-600">
                      Settings
                    </Link>
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/g/${countySlugFromProfile}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-4 py-2 transition-opacity hover:opacity-90"
                    style={{ background: "#E6F0ED", color: "#3D8073" }}
                  >
                    View {countyName} ballot →
                  </Link>
                  <a
                    href={`https://mvp.sos.ga.gov`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-4 py-2 border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    County voting sites
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {!user ? (
                  <p className="text-sm text-muted-foreground">
                    <Link href="/auth/signin" className="font-semibold text-teal-600 hover:underline">
                      Sign in
                    </Link>{" "}
                    to see your county election office, or browse all 159 counties below.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Set your county in your{" "}
                    <Link href="/profile" className="font-semibold text-teal-600 hover:underline">
                      profile settings
                    </Link>{" "}
                    to see local voting info here.
                  </p>
                )}
                {/* County search */}
                <div className="mt-3">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search your county…"
                      value={countySearch}
                      onChange={(e) => setCountySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
                    />
                  </div>
                  {countySearch.trim() ? (
                    <div className="flex flex-wrap gap-2">
                      {getAllCountyNames()
                        .filter((c) => c.toLowerCase().includes(countySearch.trim().toLowerCase()))
                        .slice(0, 10)
                        .map((c) => (
                          <Link
                            key={c}
                            href={`/g/${countySlug(c)}`}
                            className="text-xs font-medium px-3 py-1.5 rounded-full border border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                          >
                            {c} County
                          </Link>
                        ))}
                      {getAllCountyNames().filter((c) =>
                        c.toLowerCase().includes(countySearch.trim().toLowerCase())
                      ).length === 0 && (
                        <p className="text-xs text-muted-foreground">No counties found. <Link href="/g" className="underline text-teal-600">Browse all 159 →</Link></p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {["Fulton", "DeKalb", "Gwinnett", "Cobb", "Clayton", "Chatham"].map((c) => (
                        <Link
                          key={c}
                          href={`/g/${countySlug(c)}`}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-teal-300 transition-colors"
                        >
                          {c} County
                        </Link>
                      ))}
                      <Link
                        href="/g"
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-teal-300 transition-colors"
                      >
                        All 159 counties →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ── FAQ ── */}
          <section className="mb-6" style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", overflow: "hidden" }}>
            <div className="p-6 pb-4">
              <h2 className="font-bold text-foreground text-base">
                Frequently Asked Questions
              </h2>
            </div>
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-paper-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* ── Official source callout ── */}
          <div className="text-center text-xs text-muted-foreground">
            All deadlines sourced from the{" "}
            <a
              href="https://sos.ga.gov/page/elections"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Georgia Secretary of State
            </a>
            . Always verify at{" "}
            <a
              href="https://sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              sos.ga.gov
            </a>{" "}
            before Election Day.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Timeline item sub-component ───────────────────────────────────── */
type TimelineStatus = "past" | "upcoming" | "next" | "current" | "future"

function TimelineItem({
  label,
  date,
  status,
  note,
  cta,
  isLast = false,
}: {
  label: string
  date: string
  status: TimelineStatus
  note: string
  cta?: { label: string; href: string }
  isLast?: boolean
}) {
  const dotColor =
    status === "past"    ? "#9CA3AF" :
    status === "current" ? "#3D8073" :
    status === "next"    ? "#B8862F" :
    status === "upcoming"? "#1F3A5F" :
                           "#D1D5DB"

  const textColor = status === "past" ? "text-muted-foreground" : "text-foreground"
  const isPast = status === "past"

  return (
    <li className={`ml-6 ${isLast ? "" : "pb-1"}`}>
      {/* dot */}
      <span
        className="absolute -left-[13px] flex items-center justify-center rounded-full border-2 border-white"
        style={{ width: 20, height: 20, background: dotColor, top: 2 }}
      >
        {status === "past" && <CheckCircle2 className="w-3 h-3 text-white" />}
        {status === "current" && <Clock className="w-3 h-3 text-white" />}
        {status === "next" && <AlertTriangle className="w-3 h-3 text-white" />}
      </span>

      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isPast ? "text-muted-foreground/60" : "text-teal-700"}`}>
        {date}
      </p>
      <p className={`text-sm font-semibold ${textColor} ${isPast ? "line-through decoration-muted-foreground/40" : ""}`}>
        {label}
      </p>
      <p className={`text-xs mt-0.5 leading-relaxed ${isPast ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
        {note}
      </p>
      {cta && !isPast && (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline mt-1"
        >
          {cta.label} <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </li>
  )
}
