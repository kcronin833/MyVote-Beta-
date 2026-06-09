"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  // Extended properties for detailed view
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


// Race level labels for grouping
const LEVEL_COLORS: Record<string, { label: string; color: string }> = {
  "Federal":      { label: "Federal",      color: "bg-ink-900 text-white" },
  "State":        { label: "State",        color: "bg-[#27AE60] text-white" },
  "County":       { label: "County",       color: "bg-[#F39C12] text-white" },
  "School Board": { label: "School Board", color: "bg-[#8E44AD] text-white" },
  "Local":        { label: "Local",        color: "bg-civic-red text-white" },
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
  // The signed-in user's own lean (-100 = left … +100 = right), derived from
  // the left/right viewpoints they've liked in the news feed. Real signal —
  // no mock baseline.
  const [userPoliticalScore, setUserPoliticalScore] = useState(0)

  useEffect(() => {
    const likes: Array<{ viewpoint?: "left" | "right" }> = JSON.parse(
      localStorage.getItem("viewpointLikes") || "[]"
    )
    setViewpointCount(likes.length)
    const right = likes.filter((l) => l.viewpoint === "right").length
    const total = likes.filter((l) => l.viewpoint === "left" || l.viewpoint === "right").length
    if (total > 0) {
      // rightFraction 0..1 → score -100..+100
      setUserPoliticalScore(Math.round((right / total) * 200 - 100))
    }
  }, [])

  const ballotData = getBallotForZip(zipCode)

  const handleAddressUpdate = () => {
    const z = tempAddress.zip.trim()
    // Accept any valid Georgia ZIP (300xx–319xx, 398xx–399xx). Even when we
    // don't have county-specific races for it yet, getBallotForZip() still
    // returns the statewide ballot — so every Georgian sees a real ballot
    // instead of a dead end.
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

  const getPartyColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-ink-900 text-white border-[#1A2138]"
      case "Republican":
        return "bg-civic-red text-white border-[#B33A2C]"
      case "Independent":
        return "bg-[#F39C12] text-white border-[#F39C12]"
      case "Green":
        return "bg-[#27AE60] text-white border-[#27AE60]"
      case "Libertarian":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-paper-100 text-foreground border-rule"
    }
  }

  const openCandidateProfile = (candidate: Candidate, office: string, electionDate: string) => {
    setSelectedCandidate({ candidate, office, electionDate })
  }

  const renderCandidate = (candidate: Candidate, office: string, electionDate: string) => {
    // TBD placeholder — primary not yet decided
    if (candidate.name.toLowerCase().includes("tbd")) {
      return (
        <Card key={candidate.name} className="border-dashed border-rule bg-paper-50">
          <CardContent className="py-8 text-center space-y-2">
            <Lock className="w-7 h-7 text-ink-400 mx-auto" />
            <p className="font-semibold text-muted-foreground">Primary pending</p>
            <p className="text-sm text-ink-400">Check back after the May 19 primary.</p>
          </CardContent>
        </Card>
      )
    }

    // Match = how close the candidate's lean is to the user's own lean, both on
    // a -100..+100 scale. Max gap is 200, so halving keeps the result in 0..100.
    const matchScore = Math.round(
      100 - Math.abs(userPoliticalScore - (candidate.politicalScore || 0)) / 2
    )

    const hasFundraising =
      candidate.fundraising.totalRaised !== "TBD" &&
      candidate.fundraising.lastQuarter !== "TBD" &&
      candidate.fundraising.totalRaised !== "" &&
      candidate.fundraising.lastQuarter !== ""
    const hasEndorsements = candidate.endorsements.length > 0

    return (
      <Card
        key={candidate.name}
        className={`${candidate.isIncumbent ? "border-2 border-[#1A2138] bg-blue-50" : ""} hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={() => openCandidateProfile(candidate, office, electionDate)}
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            <img
              src={candidate.photo || "/placeholder.svg"}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-semibold text-lg">{candidate.name}</h4>
                {candidate.isIncumbent && (
                  <Badge variant="default" className="bg-ink-900 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Incumbent
                  </Badge>
                )}
                <Badge variant="outline" className={getPartyColor(candidate.party)}>
                  {candidate.party}
                </Badge>
                {viewpointCount === 0 ? (
                  <span
                    title="Like viewpoints in the news feed to see your match score"
                    className="text-xs px-2 py-0.5 rounded-full border border-rule text-ink-400 cursor-help"
                  >
                    Match unknown
                  </span>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    matchScore >= 70 ? "border-green-300 text-green-700 bg-green-50" :
                    matchScore >= 50 ? "border-yellow-300 text-yellow-700 bg-yellow-50" :
                    "border-red-300 text-red-700 bg-red-50"
                  }`}>
                    {matchScore}% Match
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-[#3D435A] mb-1">Experience</h5>
                  <ul className="text-[#3D435A] space-y-1">
                    {candidate.experience.slice(0, 3).map((exp, i) => (
                      <li key={i}>• {exp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-[#3D435A] mb-1">Key Issues</h5>
                  <div className="flex flex-wrap gap-1">
                    {candidate.keyIssues.slice(0, 4).map((issue, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {hasFundraising && (
              <div>
                <h5 className="font-medium text-[#3D435A] mb-1">Fundraising</h5>
                <p className="text-[#3D435A]">Total: {candidate.fundraising.totalRaised}</p>
                <p className="text-[#3D435A]">Last Quarter: {candidate.fundraising.lastQuarter}</p>
              </div>
            )}
            {hasEndorsements && (
              <div>
                <h5 className="font-medium text-[#3D435A] mb-1">Endorsements</h5>
                <div className="space-y-1">
                  {candidate.endorsements.slice(0, 2).map((endorsement, i) => (
                    <p key={i} className="text-[#3D435A] text-xs">• {endorsement}</p>
                  ))}
                  {candidate.endorsements.length > 2 && (
                    <p className="text-muted-foreground text-xs">+{candidate.endorsements.length - 2} more</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-end justify-between gap-2 flex-wrap">
              {candidate.website && (
                <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={candidate.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Website
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Details
              </Button>
              {(() => {
                const isSelected = mySelections[office] === candidate.name
                return (
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={isSelected ? "bg-[#27AE60] text-white hover:bg-[#27AE60]/90" : "border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60]/10"}
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
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {isSelected ? "My Pick" : "Select"}
                  </Button>
                )
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* When we don't yet have county-specific races for this ZIP, we still
          show the full statewide ballot — never a dead end. */}
      {!ballotData.found && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-[#3D435A]">
              <p className="font-medium">Showing your statewide Georgia ballot.</p>
              <p className="text-[#3D435A]/70">
                We don&apos;t have county-specific local races mapped for ZIP{" "}
                <strong>{zipCode}</strong> yet, but every statewide race below is on your ballot.{" "}
                <a
                  href={ballotData.sosLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-900 underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Confirm your full local ballot at the GA Secretary of State
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust guardrail — candidate data is provisional */}
      <BallotDataDisclaimer />

      {/* Address / Location Header */}
      <Card className="border-[#E5E5E5]">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-ink-900" />
              <div>
                <CardTitle className="text-xl">Your Ballot</CardTitle>
                <CardDescription>
                  {address.street
                    ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
                    : ballotData.location}
                </CardDescription>
              </div>
            </div>
            {!editingAddress && (
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/elections"
                  className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  <Vote className="w-4 h-4" />
                  All 2026 races
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Button size="sm" variant="outline" onClick={() => setEditingAddress(true)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  {address.street ? "Edit Address" : "Add Address"}
                </Button>
              </div>
            )}
          </div>

          {editingAddress && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-[#3D435A] mb-1 block">Street Address</label>
                <Input
                  value={tempAddress.street}
                  onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                  placeholder="123 Peachtree St NW"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#3D435A] mb-1 block">City</label>
                  <Input
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                    placeholder="Atlanta"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#3D435A] mb-1 block">State</label>
                  <Input
                    value={tempAddress.state}
                    onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                    placeholder="GA"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#3D435A] mb-1 block">ZIP Code</label>
                  <Input
                    value={tempAddress.zip}
                    onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
                    placeholder="30309"
                    maxLength={5}
                  />
                </div>
              </div>
              <p className="text-xs text-[#3D435A]/60">
                Your zip code is used to show your specific ballot races across all 159 Georgia counties.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddressUpdate} className="bg-ink-900 text-white hover:bg-ink-900/90">
                  <Check className="w-4 h-4 mr-1" />
                  Save Address
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!editingAddress && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-ink-900/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#3D435A]/60 font-medium uppercase tracking-wide">Congressional</p>
                <p className="font-medium text-[#3D435A]">
                  {ballotData.congressionalDistrict === "Unknown"
                    ? "Enter ZIP for district"
                    : ballotData.congressionalDistrict}
                </p>
              </div>
              <div className="bg-[#27AE60]/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#3D435A]/60 font-medium uppercase tracking-wide">County</p>
                <p className="font-medium text-[#3D435A]">
                  {ballotData.county === "Unknown" ? "Statewide" : `${ballotData.county} County`}
                </p>
              </div>
              <div className="bg-civic-red/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#3D435A]/60 font-medium uppercase tracking-wide">State</p>
                <p className="font-medium text-[#3D435A]">Georgia</p>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* ── Sticky jump-nav ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-paper-100 py-2 -mx-4 px-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap shrink-0">Jump to:</span>
          {Object.entries(LEVEL_COLORS).map(([level, { color }]) => {
            const hasRaces = ballotData.races.some((r) => r.level === level)
            if (!hasRaces) return null
            return (
              <button
                key={level}
                onClick={() => {
                  setActiveFilter(null)
                  document.getElementById(`level-${level}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${color} hover:opacity-80 transition-opacity`}
              >
                {level}
              </button>
            )
          })}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="shrink-0 text-xs text-muted-foreground underline hover:text-foreground"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* ── Races grouped by level ────────────────────────────────────────── */}
      {(() => {
        const LEVEL_ORDER = ["Federal", "State", "County", "School Board", "Local"]
        const filteredRaces = activeFilter
          ? ballotData.races.filter((r) => r.level === activeFilter)
          : ballotData.races

        if (filteredRaces.length === 0) {
          return (
            <p className="text-sm text-muted-foreground text-center py-8">
              No races found for level &ldquo;{activeFilter}&rdquo;.
            </p>
          )
        }

        // Group races by level
        const grouped: Record<string, typeof filteredRaces> = {}
        for (const race of filteredRaces) {
          if (!grouped[race.level]) grouped[race.level] = []
          grouped[race.level].push(race)
        }

        return LEVEL_ORDER.filter((lvl) => grouped[lvl]?.length).map((level) => {
          const levelInfo = LEVEL_COLORS[level] ?? { label: level, color: "bg-paper-500 text-white" }
          // Extract the hex/color class for the left border accent
          const borderColor =
            level === "Federal"      ? "border-[#1A2138]" :
            level === "State"        ? "border-[#27AE60]" :
            level === "County"       ? "border-[#F39C12]" :
            level === "School Board" ? "border-[#8E44AD]" :
                                       "border-[#B33A2C]"
          const bgStripe =
            level === "Federal"      ? "bg-ink-900/5" :
            level === "State"        ? "bg-[#27AE60]/5" :
            level === "County"       ? "bg-[#F39C12]/5" :
            level === "School Board" ? "bg-[#8E44AD]/5" :
                                       "bg-civic-red/5"

          return (
            <div key={level} id={`level-${level}`} className="scroll-mt-24 space-y-3">
              {/* Level group header */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bgStripe}`}>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${levelInfo.color}`}>
                  {level}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {grouped[level].length} race{grouped[level].length !== 1 ? "s" : ""} on your ballot
                </span>
              </div>

              {/* Individual race cards */}
              {grouped[level].map((election, idx) => (
                <div
                  key={idx}
                  className={`bg-card rounded-2xl border border-border border-l-4 ${borderColor} overflow-hidden`}
                >
                  {/* Race header */}
                  <div className="px-5 py-4 border-b border-border">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-base text-foreground">{election.office}</h3>
                          <Badge variant="outline" className="text-xs">{election.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{election.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {election.date}
                      </span>
                      <span>Reg. deadline: {election.registrationDeadline}</span>
                      {election.earlyVotingStart && (
                        <span>Early voting: {election.earlyVotingStart} – {election.earlyVotingEnd}</span>
                      )}
                    </div>
                  </div>

                  {/* Candidates */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {election.candidates.length === 1 ? "Candidate" : `${election.candidates.length} Candidates`}
                    </p>
                    <div className="space-y-3">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Your Polling Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-blue-50 rounded-lg space-y-1">
            {ballotData.pollingInfo && (
              <p className="font-medium text-[#3D435A]">{ballotData.pollingInfo}</p>
            )}
            <p className="text-sm text-[#3D435A]/70">Confirm your exact polling location before election day.</p>
            <a
              href={ballotData.sosLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink-900 underline text-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Look up your polling place on mvp.sos.ga.gov
            </a>
          </div>
        </CardContent>
      </Card>

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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-ink-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-ink-900/90 transition-colors"
        >
          <Vote className="w-4 h-4" />
          <span className="text-sm font-semibold">My Ballot</span>
          <span
            title={`${Object.keys(mySelections).length} race${Object.keys(mySelections).length === 1 ? "" : "s"} picked`}
            className="bg-card text-ink-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {Object.keys(mySelections).length}
          </span>
        </button>
      )}

      {/* My Ballot slide-in panel */}
      {showMyBallot && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowMyBallot(false)}
          />
          {/* Panel */}
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-ink-900" />
                <h2 className="text-lg font-bold text-foreground">My Ballot</h2>
              </div>
              <button
                onClick={() => setShowMyBallot(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Your planned votes for the 2026 election. These are saved locally and not submitted anywhere.
              </p>
              {ballotData.races
                .filter((r) => mySelections[r.office])
                .map((race) => {
                  const picked = mySelections[race.office]
                  const candidate = race.candidates.find((c) => c.name === picked)
                  const levelInfo = LEVEL_COLORS[race.level] ?? { label: race.level, color: "bg-paper-500 text-white" }
                  return (
                    <div key={race.office} className="rounded-lg border border-border p-3 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelInfo.color}`}>
                          {levelInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{race.office}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{picked}</p>
                          {candidate && (
                            <p className="text-xs text-muted-foreground">{candidate.party}</p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setMySelections((prev) => {
                              const next = { ...prev }
                              delete next[race.office]
                              return next
                            })
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {Object.keys(mySelections).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No selections yet. Go back and tap &ldquo;Select&rdquo; on a candidate.
                </p>
              )}
            </div>
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {Object.keys(mySelections).length} of {ballotData.races.length} races selected
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
