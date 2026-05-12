"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"

// ── Design tokens ─────────────────────────────────────────────────────────────

function CheckIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function CircleIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}
function ChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ── Ballot data ───────────────────────────────────────────────────────────────

const BALLOT = [
  // Federal
  { id: "us-sen",  race: "U.S. Senate",          status: "decided",   match: "Sen. Ossoff",   group: "Federal" },
  { id: "us-h5",   race: "U.S. House — GA-5",    status: "decided",   match: "Rep. Williams", group: "Federal" },
  { id: "us-h6",   race: "U.S. House — GA-6",    status: "undecided", match: null,            group: "Federal" },
  // State Executive
  { id: "gov",     race: "Governor",              status: "decided",   match: "Burns · 78%",   group: "State" },
  { id: "lt-gov",  race: "Lieutenant Governor",   status: "leaning",   match: "Jones",         group: "State" },
  { id: "sos",     race: "Secretary of State",    status: "leaning",   match: "Lee",           group: "State" },
  { id: "ag",      race: "Attorney General",      status: "undecided", match: null,            group: "State" },
  { id: "ins",     race: "Insurance Commissioner",status: "undecided", match: null,            group: "State" },
  // Local
  { id: "labor",   race: "Commissioner of Labor", status: "undecided", match: null,            group: "Local" },
  { id: "psc",     race: "Public Service Commission D2", status: "undecided", match: null,     group: "Local" },
  { id: "ga-sen",  race: "GA Senate Dist. 39",    status: "undecided", match: null,            group: "Local" },
  { id: "soil",    race: "Soil & Water Conservation", status: "undecided", match: null,        group: "Local" },
]

const CANDIDATES = [
  {
    name: "Marcus Holloway", initials: "MH",
    role: "U.S. Senate · Democratic",
    match: 84,
    issues: [
      { name: "Healthcare",   agree: "agree" as const },
      { name: "Infrastructure", agree: "agree" as const },
      { name: "Climate",      agree: "agree" as const },
      { name: "Education",    agree: "agree" as const },
      { name: "Gun policy",   agree: "partial" as const },
      { name: "Taxes",        agree: "disagree" as const },
    ],
  },
  {
    name: "Diane Reeves", initials: "DR",
    role: "U.S. Senate · Republican",
    match: 41,
    issues: [
      { name: "Healthcare",   agree: "disagree" as const },
      { name: "Infrastructure", agree: "agree" as const },
      { name: "Climate",      agree: "disagree" as const },
      { name: "Education",    agree: "partial" as const },
      { name: "Gun policy",   agree: "disagree" as const },
      { name: "Taxes",        agree: "agree" as const },
    ],
  },
  {
    name: "Eli Park", initials: "EP",
    role: "U.S. Senate · Independent",
    match: 67,
    issues: [
      { name: "Healthcare",   agree: "agree" as const },
      { name: "Infrastructure", agree: "agree" as const },
      { name: "Climate",      agree: "partial" as const },
      { name: "Education",    agree: "agree" as const },
      { name: "Gun policy",   agree: "agree" as const },
      { name: "Taxes",        agree: "disagree" as const },
    ],
  },
]

const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00")
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00")

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ width: "100%", height: 5, background: "var(--paper-200)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--ink-900)", borderRadius: 99, transition: "width .4s" }} />
    </div>
  )
}

function SplitBar({ segs, height = 6 }: { segs: { label: string; value: number; color: string }[]; height?: number }) {
  const total = segs.reduce((s, x) => s + x.value, 0)
  return (
    <div style={{ display: "flex", width: "100%", height, borderRadius: 99, overflow: "hidden", background: "var(--paper-200)" }}>
      {segs.map((s, i) => (
        <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
      ))}
    </div>
  )
}

type RaceStatus = "decided" | "leaning" | "undecided"

function RaceRow({ race }: { race: typeof BALLOT[0] }) {
  const statusMap: Record<RaceStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    decided:   { icon: <CheckIcon />, color: "var(--ink-900)", bg: "var(--ink-100)", label: "Decided" },
    leaning:   { icon: "·",            color: "#8E5919",         bg: "#F6ECD8",         label: "Leaning" },
    undecided: { icon: <CircleIcon />, color: "var(--ink-500)", bg: "var(--paper-200)", label: "Open" },
  }
  const s = statusMap[race.status as RaceStatus]
  return (
    <div style={{
      padding: "13px 14px", background: "var(--paper-50)", borderRadius: 12,
      border: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 99,
        background: s.bg, color: s.color,
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{s.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>
          {race.race}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
          {race.match || s.label}
        </div>
      </div>
      <span style={{ color: "var(--ink-400)" }}><ChevronRight /></span>
    </div>
  )
}

function RaceGroup({ races, label, count }: { races: typeof BALLOT; label: string; count: number }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 10px", padding: "0 16px" }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)",
        }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-400)", fontWeight: 500 }}>
          {count} races
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 16px" }}>
        {races.map(r => <RaceRow key={r.id} race={r} />)}
      </div>
    </div>
  )
}

// ── Candidate match ───────────────────────────────────────────────────────────

function TopMatchCard({ c }: { c: typeof CANDIDATES[0] }) {
  const agree   = c.issues.filter(i => i.agree === "agree").length
  const partial = c.issues.filter(i => i.agree === "partial").length
  const disagree = c.issues.filter(i => i.agree === "disagree").length

  return (
    <div style={{
      margin: "10px 16px 16px", padding: 18,
      background: "var(--ink-900)", color: "var(--paper-50)",
      borderRadius: 16, overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 99,
          background: "var(--paper-100)", color: "var(--ink-900)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20,
        }}>{c.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.1 }}>
            {c.name}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, opacity: 0.65 }}>{c.role}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 600, letterSpacing: -2, lineHeight: 1 }}>
          {c.match}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, opacity: 0.7 }}>% alignment</span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SplitBar segs={[
          { label: "agree",    value: agree,    color: "#F2EBE3" },
          { label: "partial",  value: partial,  color: "rgba(242,235,227,0.45)" },
          { label: "disagree", value: disagree, color: "rgba(242,235,227,0.18)" },
        ]} />
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 11, opacity: 0.7 }}>
          <span>{agree} agree</span>
          <span>{partial} partial</span>
          <span>{disagree} disagree</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
        {c.issues.map(iss => (
          <div key={iss.name} style={{
            padding: "8px 10px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 99, flexShrink: 0,
              background: iss.agree === "agree" ? "#9FCFA8"
                        : iss.agree === "partial" ? "#E6CB73"
                        : "rgba(255,255,255,0.3)",
            }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500 }}>{iss.name}</span>
          </div>
        ))}
      </div>

      <Link href="/elections/candidate/marcus-holloway">
        <button style={{
          width: "100%", padding: 11, borderRadius: 99, border: "none",
          background: "var(--paper-50)", color: "var(--ink-900)",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
        }}>
          Read full profile <ChevronRight size={12} />
        </button>
      </Link>
    </div>
  )
}

function CandidateRow({ c }: { c: typeof CANDIDATES[0] }) {
  return (
    <Link href={`/elections/candidate/${c.name.toLowerCase().replace(/\s+/g, "-")}`} style={{ textDecoration: "none" }}>
      <div style={{
        padding: 14, background: "var(--paper-50)", borderRadius: 12,
        border: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 99,
          background: "var(--paper-200)", color: "var(--ink-900)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 15, flexShrink: 0,
        }}>{c.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>
            {c.name}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>{c.role}</div>
          <div style={{ marginTop: 6 }}>
            <ProgressBar value={c.match} max={100} />
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
          color: "var(--ink-900)", letterSpacing: -0.4, minWidth: 44, textAlign: "right",
        }}>{c.match}%</div>
      </div>
    </Link>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = "ballot" | "match"

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ElectionsPage() {
  const [tab, setTab] = useState<Tab>("ballot")
  const [electionInfo, setElectionInfo] = useState<{ label: string; days: number; date: string } | null>(null)

  useEffect(() => {
    const now = new Date()
    const isPrimary = now < GEORGIA_PRIMARY
    const target = isPrimary ? GEORGIA_PRIMARY : GEORGIA_GENERAL
    const days = Math.ceil((target.getTime() - now.getTime()) / 86400000)
    setElectionInfo({
      label: isPrimary ? "Georgia Primary" : "General Election",
      days,
      date: isPrimary ? "May 19, 2026" : "November 3, 2026",
    })
  }, [])

  const decided   = BALLOT.filter(b => b.status === "decided").length
  const leaning   = BALLOT.filter(b => b.status === "leaning").length
  const undecided = BALLOT.filter(b => b.status === "undecided").length
  const pct = Math.round((decided / BALLOT.length) * 100)

  const federal = BALLOT.filter(b => b.group === "Federal")
  const state   = BALLOT.filter(b => b.group === "State")
  const local   = BALLOT.filter(b => b.group === "Local")

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 10px", background: "var(--paper-50)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <Logo size="sm" />
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", textDecoration: "none" }}>
          ← Home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* Header */}
        <div style={{ padding: "18px 16px 6px" }}>
          {electionInfo && (
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--ink-500)", letterSpacing: 0.4, marginBottom: 2 }}>
              {electionInfo.label} · {electionInfo.days} days
            </div>
          )}
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 600,
            letterSpacing: -0.6, color: "var(--ink-900)", margin: "0 0 4px", lineHeight: 1.1,
          }}>Your ballot</h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-500)", margin: 0 }}>
            {BALLOT.length} races · {decided} decided · {leaning} leaning
          </p>
        </div>

        {/* Progress card */}
        <div style={{ margin: "14px 16px 0", padding: 16, background: "var(--paper-50)", borderRadius: 14, border: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)" }}>
              Progress
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--ink-900)", letterSpacing: -0.4 }}>
              {pct}%
            </div>
          </div>
          <ProgressBar value={decided} max={BALLOT.length} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>
            <span>Decided {decided}</span>
            <span>Leaning {leaning}</span>
            <span>Undecided {undecided}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ margin: "16px 16px 0", display: "flex", gap: 4, padding: 4, background: "var(--paper-200)", borderRadius: 12 }}>
          {([["ballot", "My Ballot"], ["match", "Candidate Match"]] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "9px 6px", border: "none",
              background: tab === id ? "var(--paper-50)" : "transparent",
              color: tab === id ? "var(--ink-900)" : "var(--ink-500)",
              borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {tab === "ballot" && (
          <>
            <RaceGroup races={federal} label="Federal" count={federal.length} />
            <RaceGroup races={state}   label="State executive" count={state.length} />
            <RaceGroup races={local}   label="Local" count={local.length} />
          </>
        )}

        {tab === "match" && (
          <div style={{ marginTop: 4 }}>
            <div style={{ padding: "14px 16px 4px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: "var(--ink-900)", margin: "0 0 4px", lineHeight: 1.15 }}>
                How your views align
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)", margin: 0, maxWidth: 280 }}>
                Based on 18 issue stances. Tap any candidate to compare in detail.
              </p>
            </div>

            <TopMatchCard c={CANDIDATES[0]} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 16px 10px", padding: "0" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>
                Other candidates
              </span>
              <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
            </div>
            <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {CANDIDATES.slice(1).map(c => <CandidateRow key={c.name} c={c} />)}
            </div>

            <div style={{
              margin: "20px 16px 0", padding: 14, background: "var(--paper-50)",
              borderRadius: 12, border: "1px dashed var(--rule)",
              fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-500)", lineHeight: 1.4,
            }}>
              Compatibility reflects your answers to MyVote's policy questions, not endorsements.
              Update yours anytime in Profile.
            </div>
          </div>
        )}

        {/* Key dates */}
        <div style={{ margin: "28px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>Key dates</span>
            <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
          </div>
          <div style={{ background: "var(--paper-50)", borderRadius: 14, border: "1px solid var(--rule)", overflow: "hidden" }}>
            {[
              { date: "Apr 22, 2026", label: "Voter Reg Deadline (Primary)", note: "Last day to register" },
              { date: "May 4–16, 2026", label: "Early Voting (Primary)", note: "Vote early in person" },
              { date: "May 19, 2026", label: "Georgia Primary", note: "Election day", hot: true },
              { date: "Oct 5, 2026", label: "Voter Reg Deadline (General)", note: "Last day to register" },
              { date: "Oct 19–30, 2026", label: "Early Voting (General)", note: "Vote early in person" },
              { date: "Nov 3, 2026", label: "General Election", note: "Election day", hot: true },
            ].map((d, i) => (
              <div key={i} style={{
                padding: "14px 16px", borderTop: i ? "1px solid var(--rule)" : "none",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  minWidth: 64, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                  color: d.hot ? "var(--civic-red)" : "var(--ink-500)",
                }}>{d.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{d.label}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{d.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration CTA */}
        <div style={{ margin: "20px 16px 0", padding: "16px 18px", background: "var(--ink-900)", borderRadius: 14, color: "var(--paper-50)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>
            Not registered?
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 500, margin: "0 0 14px", lineHeight: 1.3 }}>
            Check or update your registration at the Georgia Secretary of State's website.
          </p>
          <a href="https://sos.ga.gov" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block", padding: "10px 18px", borderRadius: 99,
            background: "var(--paper-50)", color: "var(--ink-900)",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>Visit sos.ga.gov →</a>
        </div>
      </div>
    </div>
  )
}
