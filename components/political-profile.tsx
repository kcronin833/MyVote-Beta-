"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Vote, Edit3, Check, X, Crown, Users, ExternalLink, Info, Lock, ChevronRight } from "lucide-react"
import { CandidateProfileDialog } from "./candidate-profile-detail"
import { getBallotForZip } from "@/lib/georgia-ballot-data"
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer"

interface Candidate {
  name: string
  party: "Democrat" | "Republican" | "Independent" | "Green" | "Libertarian"
  isIncumbent: boolean
  photo: string
  website?: string
  experience: string[]
  keyIssues: string[]
  endorsements: string[]
  fundraising: {
    totalRaised: string
    lastQuarter: string
  }
  bio?: string
  age?: number
  education?: string[]
  hometown?: string
  family?: string
  previousElections?: Array<{
    year: string
    office: string
    result: string
    votePercentage: number
  }>
  positions?: Array<{
    issue: string
    stance: string
    description: string
  }>
  votingRecord?: Array<{
    bill: string
    vote: "Yes" | "No" | "Abstain" | "Not in office"
    date: string
    description: string
  }>
  endorsementDetails?: Array<{
    organization: string
    type: string
    quote?: string
  }>
  campaignFinance?: {
    totalRaised: string
    totalSpent: string
    cashOnHand: string
    averageDonation: string
    smallDonorPercentage: string
    topIndustries: Array<{
      name: string
      amount: string
    }>
  }
  socialMedia?: {
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    campaignOffice?: string
  }
  events?: Array<{
    name: string
    date: string
    location: string
    description: string
  }>
  politicalScore?: number
}

// Design tokens
const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  ink400:  "#8B8FA3",
  ink300:  "#AEB2C3",
  teal:    "#3D8073",
  tealDk:  "#2F6358",
  tealSoft:"#E6F0ED",
  red:     "#B33A2C",
  page:    "#F5F3EE",
  shade:   "#F0EDE6",
}

const cardStyle = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
}

// Level styling — hex-based, no Tailwind color classes
const LEVEL_STYLES: Record<string, { label: string; pill: { bg: string; color: string }; border: string; stripe: string }> = {
  "Federal":      { label: "Federal",      pill: { bg: "#1A2138", color: "#fff" }, border: "#1A2138", stripe: "rgba(26,33,56,0.05)"  },
  "State":        { label: "State",        pill: { bg: "#27AE60", color: "#fff" }, border: "#27AE60", stripe: "rgba(39,174,96,0.06)"  },
  "County":       { label: "County",       pill: { bg: "#D4871A", color: "#fff" }, border: "#D4871A", stripe: "rgba(212,135,26,0.06)" },
  "School Board": { label: "School Board", pill: { bg: "#8E44AD", color: "#fff" }, border: "#8E44AD", stripe: "rgba(142,68,173,0.06)" },
  "Local":        { label: "Local",        pill: { bg: "#B33A2C", color: "#fff" }, border: "#B33A2C", stripe: "rgba(179,58,44,0.06)"  },
}

const LEVEL_ORDER = ["Federal", "State", "County", "School Board", "Local"]

function getPartyStyle(party: string): { bg: string; color: string; border: string } {
  switch (party) {
    case "Democrat":    return { bg: "#EEF2FF", color: "#3730A3", border: "#C7D2FE" }
    case "Republican":  return { bg: "#FEF2F2", color: "#B33A2C", border: "#FECACA" }
    case "Independent": return { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" }
    case "Green":       return { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" }
    case "Libertarian": return { bg: "#FEF9C3", color: "#854D0E", border: "#FEF08A" }
    default:            return { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" }
  }
}

interface Address {
  street: string
  city: string
  state: string
  zip: string
}

interface PoliticalProfileProps {
  initialZipCode?: string
}

export function PoliticalProfile({ initialZipCode = "30309" }: PoliticalProfileProps) {
  const [zipCode, setZipCode] = useState(initialZipCode)
  const [editingAddress, setEditingAddress] = useState(false)
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "Atlanta",
    state: "GA",
    zip: initialZipCode,
  })
  const [tempAddress, setTempAddress] = useState<Address>(address)
  const [selectedCandidate, setSelectedCandidate] = useState<{
    candidate: Candidate
    office: string
    electionDate: string
  } | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [mySelections, setMySelections] = useState<Record<string, string>>({})
  const [showMyBallot, setShowMyBallot] = useState(false)
  const [viewpointCount, setViewpointCount] = useState(0)
  const [userPoliticalScore, setUserPoliticalScore] = useState(0)

  useEffect(() => {
    const likes: Array<{ viewpoint?: "left" | "right" }> = JSON.parse(
      localStorage.getItem("viewpointLikes") || "[]"
    )
    setViewpointCount(likes.length)
    const right = likes.filter((l) => l.viewpoint === "right").length
    const total = likes.filter((l) => l.viewpoint === "left" || l.viewpoint === "right").length
    if (total > 0) {
      setUserPoliticalScore(Math.round((right / total) * 200 - 100))
    }
  }, [])

  const ballotData = getBallotForZip(zipCode)

  const handleAddressUpdate = () => {
    const z = tempAddress.zip.trim()
    const isGeorgiaZip = /^3(0|1)\d{3}$/.test(z) || /^39[89]\d{2}$/.test(z)
    if (!isGeorgiaZip) {
      alert(
        `"${z}" doesn't look like a Georgia ZIP code. MyVote currently covers Georgia's 2026 ballot — enter a Georgia ZIP (e.g. 30309).`
      )
      return
    }
    setZipCode(z)
    setAddress(tempAddress)
    setEditingAddress(false)
  }

  const cancelEdit = () => {
    setTempAddress(address)
    setEditingAddress(false)
  }

  const openCandidateProfile = (candidate: Candidate, office: string, electionDate: string) => {
    setSelectedCandidate({ candidate, office, electionDate })
  }

  const renderCandidate = (candidate: Candidate, office: string, electionDate: string) => {
    // TBD placeholder
    if (candidate.name.toLowerCase().includes("tbd")) {
      return (
        <div
          key={candidate.name}
          style={{
            border: `1.5px dashed ${C.rule}`,
            borderRadius: 10,
            background: "#FAFAF7",
            padding: "28px 16px",
            textAlign: "center",
          }}
        >
          <Lock size={24} color={C.ink400} style={{ margin: "0 auto 8px" }} />
          <p style={{ fontWeight: 600, color: C.ink500, fontSize: 13.5, margin: "0 0 4px" }}>Primary pending</p>
          <p style={{ fontSize: 12.5, color: C.ink400, margin: 0 }}>Check back after the May 19 primary.</p>
        </div>
      )
    }

    const matchScore = Math.round(
      100 - Math.abs(userPoliticalScore - (candidate.politicalScore || 0)) / 2
    )
    const partyStyle = getPartyStyle(candidate.party)
    const hasFundraising =
      candidate.fundraising.totalRaised !== "TBD" &&
      candidate.fundraising.lastQuarter !== "TBD" &&
      candidate.fundraising.totalRaised !== "" &&
      candidate.fundraising.lastQuarter !== ""
    const hasEndorsements = candidate.endorsements.length > 0
    const isSelected = mySelections[office] === candidate.name

    return (
      <div
        key={candidate.name}
        className="mv-lift"
        onClick={() => openCandidateProfile(candidate, office, electionDate)}
        style={{
          ...cardStyle,
          borderRadius: 10,
          borderLeft: candidate.isIncumbent ? `3px solid ${C.ink900}` : `1px solid ${C.rule}`,
          padding: 14,
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {/* Candidate header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <img
            src={candidate.photo || "/placeholder.svg"}
            alt={candidate.name}
            style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${C.rule}` }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.ink900 }}>{candidate.name}</span>
              {candidate.isIncumbent && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, background: C.ink900, color: "#fff", borderRadius: 999, padding: "2px 8px" }}>
                  <Crown size={10} />Incumbent
                </span>
              )}
              <span style={{ fontSize: 11, fontWeight: 600, background: partyStyle.bg, color: partyStyle.color, border: `1px solid ${partyStyle.border}`, borderRadius: 999, padding: "2px 8px" }}>
                {candidate.party}
              </span>
              {viewpointCount === 0 ? (
                <span
                  title="Like viewpoints in the news feed to see your match score"
                  style={{ fontSize: 11, color: C.ink400, border: `1px solid ${C.rule}`, borderRadius: 999, padding: "2px 8px", cursor: "help" }}
                >
                  Match unknown
                </span>
              ) : (
                <span style={{
                  fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "2px 8px",
                  ...(matchScore >= 70
                    ? { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" }
                    : matchScore >= 50
                    ? { background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }
                    : { background: "#FEF2F2", color: "#B33A2C", border: "1px solid #FECACA" })
                }}>
                  {matchScore}% Match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Experience + Key Issues */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12, fontSize: 12.5 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.ink500, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Experience</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", color: C.ink700, lineHeight: 1.5 }}>
              {candidate.experience.slice(0, 3).map((exp, i) => (
                <li key={i} style={{ paddingLeft: 10, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0 }}>·</span>{exp}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.ink500, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Key Issues</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {candidate.keyIssues.slice(0, 4).map((issue, i) => (
                <span key={i} style={{ fontSize: 11, background: C.tealSoft, color: C.tealDk, borderRadius: 999, padding: "2px 7px", fontWeight: 600 }}>
                  {issue}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fundraising + Endorsements + Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 8, borderTop: `1px solid ${C.rule}`, paddingTop: 10, fontSize: 12 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {hasFundraising && (
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: C.ink400, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 2 }}>Raised</p>
                <p style={{ fontWeight: 700, color: C.ink700 }}>{candidate.fundraising.totalRaised}</p>
              </div>
            )}
            {hasEndorsements && (
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: C.ink400, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 2 }}>Endorsements</p>
                <p style={{ fontWeight: 600, color: C.ink700 }}>{candidate.endorsements.slice(0, 1).join("") }{candidate.endorsements.length > 1 ? ` +${candidate.endorsements.length - 1}` : ""}</p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {candidate.website && (
              <a
                href={candidate.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 30, padding: "0 10px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", fontSize: 12, fontWeight: 600, color: C.ink700, textDecoration: "none", cursor: "pointer" }}
              >
                <ExternalLink size={11} />Website
              </a>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); openCandidateProfile(candidate, office, electionDate) }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 30, padding: "0 10px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", fontSize: 12, fontWeight: 600, color: C.ink700, cursor: "pointer" }}
            >
              <Info size={11} />Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMySelections((prev) => {
                  if (prev[office] === candidate.name) {
                    const next = { ...prev }
                    delete next[office]
                    return next
                  }
                  return { ...prev, [office]: candidate.name }
                })
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                height: 30, padding: "0 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s",
                ...(isSelected
                  ? { background: "#27AE60", color: "#fff", border: "1.5px solid #27AE60" }
                  : { background: "transparent", color: "#27AE60", border: "1.5px solid #27AE60" })
              }}
            >
              <Check size={11} />
              {isSelected ? "My Pick" : "Select"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Not-found banner */}
      {!ballotData.found && (
        <div style={{ ...cardStyle, border: `1px solid #FDE68A`, background: "#FFFBEB", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <MapPin size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: C.ink700 }}>
            <p style={{ fontWeight: 600, marginBottom: 2 }}>Showing your statewide Georgia ballot.</p>
            <p style={{ color: C.ink500, lineHeight: 1.5, margin: 0 }}>
              We don&apos;t have county-specific local races mapped for ZIP{" "}
              <strong>{zipCode}</strong> yet, but every statewide race below is on your ballot.{" "}
              <a
                href={ballotData.sosLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.ink900, textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 3 }}
              >
                <ExternalLink size={11} />
                Confirm your full local ballot at GA SOS
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Trust guardrail */}
      <BallotDataDisclaimer />

      {/* Address / Location Header */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        {/* Top gradient bar */}
        <div style={{ height: 6, background: `linear-gradient(90deg, ${C.tealDk}, ${C.teal})` }} />
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={17} color={C.teal} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Your Ballot</p>
                <p style={{ fontSize: 12.5, color: C.ink500, margin: 0 }}>
                  {address.street
                    ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
                    : ballotData.location}
                </p>
              </div>
            </div>
            {!editingAddress && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Link
                  href="/elections"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600, color: C.teal, textDecoration: "none" }}
                >
                  <Vote size={14} />All 2026 races<ChevronRight size={13} />
                </Link>
                <button
                  onClick={() => setEditingAddress(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 30, padding: "0 12px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", fontSize: 12, fontWeight: 600, color: C.ink700, cursor: "pointer" }}
                >
                  <Edit3 size={12} />
                  {address.street ? "Edit Address" : "Add Address"}
                </button>
              </div>
            )}
          </div>

          {/* Edit address form */}
          {editingAddress && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: C.ink500, display: "block", marginBottom: 4 }}>Street Address</label>
                <Input
                  value={tempAddress.street}
                  onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                  placeholder="123 Peachtree St NW"
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: C.ink500, display: "block", marginBottom: 4 }}>City</label>
                  <Input value={tempAddress.city} onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })} placeholder="Atlanta" />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: C.ink500, display: "block", marginBottom: 4 }}>State</label>
                  <Input value={tempAddress.state} onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })} placeholder="GA" maxLength={2} />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: C.ink500, display: "block", marginBottom: 4 }}>ZIP Code</label>
                  <Input value={tempAddress.zip} onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })} placeholder="30309" maxLength={5} />
                </div>
              </div>
              <p style={{ fontSize: 11.5, color: C.ink400, margin: 0, lineHeight: 1.5 }}>
                Your zip code is used to show your specific ballot races across all 159 Georgia counties.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleAddressUpdate}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 34, padding: "0 16px", borderRadius: 999, background: C.teal, color: "#fff", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  <Check size={13} />Save Address
                </button>
                <button
                  onClick={cancelEdit}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 34, padding: "0 14px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.ink700, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <X size={13} />Cancel
                </button>
              </div>
            </div>
          )}

          {/* District info pills */}
          {!editingAddress && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
              {[
                { label: "Congressional", value: ballotData.congressionalDistrict === "Unknown" ? "Enter ZIP" : ballotData.congressionalDistrict },
                { label: "County", value: ballotData.county === "Unknown" ? "Statewide" : `${ballotData.county} County` },
                { label: "State", value: "Georgia" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: C.shade, borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.ink400, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: C.ink700, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky jump-nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: C.page, padding: "8px 0", borderBottom: `1px solid ${C.rule}`, margin: "0 -4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 2, padding: "0 4px" }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.ink500, whiteSpace: "nowrap", flexShrink: 0 }}>Jump to:</span>
          {LEVEL_ORDER.map((level) => {
            const hasRaces = ballotData.races.some((r) => r.level === level)
            if (!hasRaces) return null
            const ls = LEVEL_STYLES[level] ?? LEVEL_STYLES["Local"]
            return (
              <button
                key={level}
                onClick={() => {
                  setActiveFilter(null)
                  document.getElementById(`level-${level}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                style={{
                  flexShrink: 0,
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: ls.pill.bg,
                  color: ls.pill.color,
                  cursor: "pointer",
                  opacity: 1,
                  transition: "opacity 0.15s",
                }}
              >
                {level}
              </button>
            )
          })}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              style={{ flexShrink: 0, fontSize: 11.5, color: C.ink500, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Races grouped by level */}
      {(() => {
        const filteredRaces = activeFilter
          ? ballotData.races.filter((r) => r.level === activeFilter)
          : ballotData.races

        if (filteredRaces.length === 0) {
          return (
            <p style={{ fontSize: 13.5, color: C.ink500, textAlign: "center", padding: "32px 0" }}>
              No races found for level &ldquo;{activeFilter}&rdquo;.
            </p>
          )
        }

        const grouped: Record<string, typeof filteredRaces> = {}
        for (const race of filteredRaces) {
          if (!grouped[race.level]) grouped[race.level] = []
          grouped[race.level].push(race)
        }

        return LEVEL_ORDER.filter((lvl) => grouped[lvl]?.length).map((level) => {
          const ls = LEVEL_STYLES[level] ?? LEVEL_STYLES["Local"]

          return (
            <div key={level} id={`level-${level}`} style={{ scrollMarginTop: 80, display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Level group header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: ls.stripe }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: ls.pill.bg, color: ls.pill.color, flexShrink: 0 }}>
                  {level}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink900 }}>
                  {grouped[level].length} race{grouped[level].length !== 1 ? "s" : ""} on your ballot
                </span>
              </div>

              {/* Individual race cards */}
              {grouped[level].map((election, idx) => (
                <div
                  key={idx}
                  style={{
                    ...cardStyle,
                    borderLeft: `4px solid ${ls.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Race header */}
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.rule}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>{election.office}</h3>
                          <span style={{ fontSize: 11, fontWeight: 600, color: C.ink500, background: C.shade, borderRadius: 999, padding: "2px 8px", border: `1px solid ${C.rule}` }}>
                            {election.type}
                          </span>
                        </div>
                        <p style={{ fontSize: 12.5, color: C.ink500, margin: 0, lineHeight: 1.5 }}>{election.description}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 14px", marginTop: 8, fontSize: 11.5, color: C.ink400 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={11} />{election.date}
                      </span>
                      <span>Reg. deadline: {election.registrationDeadline}</span>
                      {election.earlyVotingStart && (
                        <span>Early voting: {election.earlyVotingStart} – {election.earlyVotingEnd}</span>
                      )}
                    </div>
                  </div>

                  {/* Candidates */}
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: C.ink400, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                      <Users size={12} />
                      {election.candidates.length === 1 ? "Candidate" : `${election.candidates.length} Candidates`}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {election.candidates.map((candidate) =>
                        renderCandidate(candidate as unknown as Candidate, election.office, election.date)
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })
      })()}

      {/* Polling Location */}
      <div style={{ ...cardStyle, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Vote size={17} color={C.teal} />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, margin: 0 }}>Your Polling Location</h3>
        </div>
        <div style={{ background: "#EEF7FF", borderRadius: 8, padding: "10px 12px", border: "1px solid #BFDBFE" }}>
          {ballotData.pollingInfo && (
            <p style={{ fontWeight: 600, color: C.ink900, fontSize: 13, marginBottom: 4 }}>{ballotData.pollingInfo}</p>
          )}
          <p style={{ fontSize: 12.5, color: C.ink700, marginBottom: 6 }}>Confirm your exact polling location before election day.</p>
          <a
            href={ballotData.sosLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600, color: "#1D4ED8", textDecoration: "none" }}
          >
            <ExternalLink size={12} />
            Look up your polling place on mvp.sos.ga.gov
          </a>
        </div>
      </div>

      {/* Candidate Profile Dialog */}
      {selectedCandidate && (
        <CandidateProfileDialog
          candidate={selectedCandidate.candidate}
          office={selectedCandidate.office}
          electionDate={selectedCandidate.electionDate}
          open={!!selectedCandidate}
          onOpenChange={(open) => {
            if (!open) setSelectedCandidate(null)
          }}
        />
      )}

      {/* My Ballot floating button */}
      {Object.keys(mySelections).length > 0 && (
        <button
          onClick={() => setShowMyBallot(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.tealDk,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            border: "none",
            boxShadow: "0 4px 20px rgba(47,99,88,0.35)",
            fontSize: 13.5,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          <Vote size={15} />
          <span>My Ballot</span>
          <span
            title={`${Object.keys(mySelections).length} race${Object.keys(mySelections).length === 1 ? "" : "s"} picked`}
            style={{ background: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 800, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {Object.keys(mySelections).length}
          </span>
        </button>
      )}

      {/* My Ballot slide-in panel */}
      {showMyBallot && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)" }}
            onClick={() => setShowMyBallot(false)}
          />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50, width: "100%", maxWidth: 360, background: "#fff", boxShadow: "-4px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.rule}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Vote size={18} color={C.teal} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: 0 }}>My Ballot</h2>
              </div>
              <button onClick={() => setShowMyBallot(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink400, padding: 2 }}>
                <X size={18} />
              </button>
            </div>
            {/* Panel body */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12.5, color: C.ink500, marginBottom: 8, lineHeight: 1.5 }}>
                Your planned votes for the 2026 election. Saved locally — not submitted anywhere.
              </p>
              {ballotData.races
                .filter((r) => mySelections[r.office])
                .map((race) => {
                  const picked = mySelections[race.office]
                  const candidate = race.candidates.find((c) => c.name === picked)
                  const ls = LEVEL_STYLES[race.level] ?? LEVEL_STYLES["Local"]
                  return (
                    <div key={race.office} style={{ border: `1px solid ${C.rule}`, borderRadius: 10, padding: "10px 12px", background: C.card }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: ls.pill.bg, color: ls.pill.color }}>{ls.label}</span>
                        <span style={{ fontSize: 11.5, color: C.ink500 }}>{race.office}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 13, color: C.ink900, margin: "0 0 1px" }}>{picked}</p>
                          {candidate && <p style={{ fontSize: 11.5, color: C.ink500, margin: 0 }}>{candidate.party}</p>}
                        </div>
                        <button
                          onClick={() =>
                            setMySelections((prev) => {
                              const next = { ...prev }
                              delete next[race.office]
                              return next
                            })
                          }
                          style={{ background: "none", border: "none", cursor: "pointer", color: C.ink400, padding: 2 }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {Object.keys(mySelections).length === 0 && (
                <p style={{ fontSize: 13.5, color: C.ink400, textAlign: "center", padding: "32px 0" }}>
                  No selections yet. Go back and tap &ldquo;Select&rdquo; on a candidate.
                </p>
              )}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.rule}`, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: C.ink400, margin: 0 }}>
                {Object.keys(mySelections).length} of {ballotData.races.length} races selected
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
