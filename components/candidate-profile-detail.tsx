import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Crown, DollarSign, Award, Briefcase, FileText,
  Calendar, MapPin, Twitter, Facebook, Instagram,
  Youtube, Mail, Globe,
} from "lucide-react"

const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  ink400:  "#8B8FA3",
  teal:    "#3D8073",
  tealDk:  "#2F6358",
  tealSoft:"#E6F0ED",
  shade:   "#F0EDE6",
  page:    "#F5F3EE",
}

const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
  padding: "20px",
}

function getPartyStyle(party: string): { bg: string; color: string; border: string; header: string } {
  switch (party) {
    case "Democrat":    return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", header: "#1D4ED8" }
    case "Republican":  return { bg: "#FEF2F2", color: "#B33A2C", border: "#FECACA", header: "#B33A2C" }
    case "Independent": return { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", header: "#6D28D9" }
    case "Green":       return { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0", header: "#065F46" }
    case "Libertarian": return { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", header: "#92400E" }
    default:            return { bg: C.shade,   color: C.ink500,  border: C.rule,    header: C.ink700 }
  }
}

function PartyBadge({ party }: { party: string }) {
  const s = getPartyStyle(party)
  return (
    <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 999, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>
      {party}
    </span>
  )
}

function VoteBadge({ vote }: { vote: "Yes" | "No" | "Abstain" | "Not in office" }) {
  const styles: Record<string, React.CSSProperties> = {
    Yes:    { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
    No:     { background: "#FEF2F2", color: "#B33A2C", border: "1px solid #FECACA" },
    Abstain:{ background: C.shade,   color: C.ink500,  border: `1px solid ${C.rule}` },
    "Not in office": { background: C.shade, color: C.ink500, border: `1px solid ${C.rule}` },
  }
  const st = styles[vote] ?? styles["Abstain"]
  return (
    <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 999, fontSize: 12, fontWeight: 700, lineHeight: 1.4, ...st }}>
      {vote}
    </span>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ flex: 1, height: 7, background: "#E4E0D3", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: C.teal, borderRadius: 999 }} />
    </div>
  )
}

export interface CandidateDetailProps {
  candidate: {
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
  }
  office: string
  electionDate: string
}

export function CandidateProfileDetail({ candidate, office, electionDate }: CandidateDetailProps) {
  const party = getPartyStyle(candidate.party)
  const initials = candidate.name.split(" ").map((n) => n[0]).join("")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ── */}
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.rule}`, background: C.card, boxShadow: "0 2px 10px rgba(20,24,40,0.07)" }}>
        {/* Color stripe */}
        <div style={{ height: 80, background: `linear-gradient(135deg, ${party.header}cc 0%, ${party.header}66 100%)` }} />
        {/* Content row */}
        <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -40 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <Avatar style={{ width: 80, height: 80, border: "4px solid #fff", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", flexShrink: 0 }}>
              <AvatarImage src={candidate.photo || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback style={{ fontSize: 24, background: party.bg, color: party.color }}>{initials}</AvatarFallback>
            </Avatar>
            <div style={{ paddingBottom: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink900, margin: 0 }}>{candidate.name}</h2>
                {candidate.isIncumbent && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#1D4ED8", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                    <Crown size={10} /> Incumbent
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PartyBadge party={candidate.party} />
                <span style={{ fontSize: 13, color: C.ink500 }}>Candidate for {office}</span>
              </div>
            </div>
          </div>
          {candidate.website && (
            <a
              href={candidate.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: C.card, color: C.ink700, fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}
            >
              <Globe size={14} /> Campaign Website
            </a>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview">
          <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0,200px)", gap: 16 }}>
            {/* Main col */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={cardStyle}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, marginBottom: 10 }}>About {candidate.name}</h3>
                <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.65, marginBottom: 16 }}>{candidate.bio || "No detailed biography available."}</p>

                {/* Quick facts */}
                {(candidate.age || candidate.hometown || candidate.family) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {candidate.age && (
                      <div style={{ background: C.shade, borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Age</div>
                        <div style={{ fontSize: 14, color: C.ink900 }}>{candidate.age}</div>
                      </div>
                    )}
                    {candidate.hometown && (
                      <div style={{ background: C.shade, borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hometown</div>
                        <div style={{ fontSize: 14, color: C.ink900 }}>{candidate.hometown}</div>
                      </div>
                    )}
                    {candidate.family && (
                      <div style={{ background: C.shade, borderRadius: 8, padding: "10px 12px", gridColumn: "span 2" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Family</div>
                        <div style={{ fontSize: 14, color: C.ink900 }}>{candidate.family}</div>
                      </div>
                    )}
                  </div>
                )}

                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>Key Issues</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: candidate.education?.length ? 16 : 0 }}>
                  {candidate.keyIssues.map((issue, i) => (
                    <span key={i} style={{ padding: "4px 10px", borderRadius: 999, background: C.tealSoft, color: C.tealDk, border: `1px solid #B2D8D0`, fontSize: 12.5, fontWeight: 600 }}>
                      {issue}
                    </span>
                  ))}
                </div>

                {candidate.education && candidate.education.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginTop: 16, marginBottom: 8 }}>Education</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                      {candidate.education.map((edu, i) => (
                        <li key={i} style={{ fontSize: 14, color: C.ink700 }}>{edu}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Events */}
              {candidate.events && candidate.events.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={15} color={C.teal} /> Upcoming Events
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {candidate.events.map((event, i) => (
                      <div key={i} style={{ background: C.shade, borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{event.name}</div>
                            <div style={{ fontSize: 13, color: C.ink500, marginTop: 2 }}>{event.description}</div>
                          </div>
                          <span style={{ padding: "2px 8px", borderRadius: 999, background: C.card, border: `1px solid ${C.rule}`, fontSize: 12, fontWeight: 600, color: C.ink700, whiteSpace: "nowrap" }}>{event.date}</span>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12.5, color: C.ink400, display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={12} /> {event.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side col */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Election info */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} color={C.teal} /> Election Info
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Election Date</div>
                    <div style={{ fontSize: 13.5, color: C.ink900 }}>{electionDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Office</div>
                    <div style={{ fontSize: 13.5, color: C.ink900 }}>{office}</div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              {candidate.contactInfo && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Mail size={14} color={C.teal} /> Contact
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {candidate.contactInfo.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Mail size={13} color={C.ink400} />
                        <a href={`mailto:${candidate.contactInfo.email}`} style={{ fontSize: 13, color: C.teal, textDecoration: "none" }}>{candidate.contactInfo.email}</a>
                      </div>
                    )}
                    {candidate.contactInfo.phone && (
                      <div style={{ fontSize: 13, color: C.ink700 }}>{candidate.contactInfo.phone}</div>
                    )}
                    {candidate.contactInfo.campaignOffice && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <MapPin size={13} color={C.ink400} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.ink700 }}>{candidate.contactInfo.campaignOffice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social */}
              {candidate.socialMedia && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Globe size={14} color={C.teal} /> Social Media
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {candidate.socialMedia.twitter && (
                      <a href={candidate.socialMedia.twitter} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.rule}`, background: C.shade, color: C.ink700, textDecoration: "none" }}>
                        <Twitter size={15} />
                      </a>
                    )}
                    {candidate.socialMedia.facebook && (
                      <a href={candidate.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.rule}`, background: C.shade, color: C.ink700, textDecoration: "none" }}>
                        <Facebook size={15} />
                      </a>
                    )}
                    {candidate.socialMedia.instagram && (
                      <a href={candidate.socialMedia.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.rule}`, background: C.shade, color: C.ink700, textDecoration: "none" }}>
                        <Instagram size={15} />
                      </a>
                    )}
                    {candidate.socialMedia.youtube && (
                      <a href={candidate.socialMedia.youtube} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.rule}`, background: C.shade, color: C.ink700, textDecoration: "none" }}>
                        <Youtube size={15} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Positions ── */}
        <TabsContent value="positions">
          {candidate.positions && candidate.positions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {candidate.positions.map((position, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>{position.issue}</h3>
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: C.tealSoft, color: C.tealDk, border: `1px solid #B2D8D0`, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{position.stance}</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.6, margin: 0 }}>{position.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
              <FileText size={40} color="#D1CFC6" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>No detailed positions available</h3>
              <p style={{ fontSize: 14, color: C.ink500, lineHeight: 1.6, marginBottom: 16 }}>
                We don&apos;t have detailed position information for this candidate yet. Check their campaign website for more information.
              </p>
              {candidate.website && (
                <a
                  href={candidate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 18px", borderRadius: 999, background: C.teal, color: "#fff", fontSize: 13.5, fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 8px rgba(61,128,115,0.28)" }}
                >
                  <Globe size={14} /> Visit Campaign Website
                </a>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── Experience ── */}
        <TabsContent value="experience">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={15} color={C.teal} /> Professional Experience
              </h3>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {candidate.experience.map((exp, i) => (
                  <li key={i} style={{ fontSize: 14, color: C.ink700 }}>{exp}</li>
                ))}
              </ul>
            </div>

            {candidate.previousElections && candidate.previousElections.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={15} color={C.teal} /> Previous Elections
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {candidate.previousElections.map((election, i) => (
                    <div key={i} style={{ background: C.shade, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{election.year} – {election.office}</div>
                        <div style={{ fontSize: 13, color: C.ink500, marginTop: 2 }}>{election.result}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, background: election.result.includes("Won") ? "#ECFDF5" : C.card, color: election.result.includes("Won") ? "#065F46" : C.ink500, border: `1px solid ${election.result.includes("Won") ? "#A7F3D0" : C.rule}`, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {election.votePercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {candidate.votingRecord && candidate.votingRecord.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={15} color={C.teal} /> Voting Record
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {candidate.votingRecord.map((record, i) => (
                    <div key={i} style={{ background: C.shade, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{record.bill}</div>
                        <div style={{ fontSize: 13, color: C.ink500, marginTop: 2 }}>{record.description}</div>
                        <div style={{ fontSize: 12, color: C.ink400, marginTop: 4 }}>{record.date}</div>
                      </div>
                      <VoteBadge vote={record.vote} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Endorsements ── */}
        <TabsContent value="endorsements">
          {candidate.endorsementDetails && candidate.endorsementDetails.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {candidate.endorsementDetails.map((endorsement, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Award size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{endorsement.organization}</div>
                      <div style={{ fontSize: 12, color: C.ink500, marginTop: 2 }}>{endorsement.type}</div>
                      {endorsement.quote && (
                        <p style={{ fontSize: 13, color: C.ink700, fontStyle: "italic", marginTop: 8, lineHeight: 1.5 }}>&ldquo;{endorsement.quote}&rdquo;</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>Endorsements</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {candidate.endorsements.map((endorsement, i) => (
                  <span key={i} style={{ padding: "4px 10px", borderRadius: 999, background: C.shade, color: C.ink700, border: `1px solid ${C.rule}`, fontSize: 13, fontWeight: 500 }}>
                    {endorsement}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Finances ── */}
        <TabsContent value="finances">
          {candidate.campaignFinance ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={cardStyle}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <DollarSign size={15} color={C.teal} /> Campaign Finances
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Raised</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>{candidate.campaignFinance.totalRaised}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Spent</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#B33A2C" }}>{candidate.campaignFinance.totalSpent}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cash on Hand</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.ink900 }}>{candidate.campaignFinance.cashOnHand}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Donation</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.ink900 }}>{candidate.campaignFinance.averageDonation}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.ink500, marginBottom: 6 }}>Small Donor Percentage</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ProgressBar value={parseInt(candidate.campaignFinance.smallDonorPercentage)} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.ink900, flexShrink: 0 }}>{candidate.campaignFinance.smallDonorPercentage}</span>
                  </div>
                </div>
              </div>
              <div style={cardStyle}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 14 }}>Top Industries</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {candidate.campaignFinance.topIndustries.map((industry, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: C.ink700 }}>{industry.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{industry.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink900, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={15} color={C.teal} /> Campaign Finances
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Raised</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>{candidate.fundraising.totalRaised}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.ink400, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Quarter</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.ink900 }}>{candidate.fundraising.lastQuarter}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.ink500, textAlign: "center" }}>
                Detailed campaign finance information is not available.{" "}
                <a href="https://www.fec.gov/data/candidates/" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
                  Visit the FEC website
                </a>{" "}
                for more information.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function CandidateProfileDialog({
  candidate, office, electionDate, open, onOpenChange,
}: CandidateDetailProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Candidate Profile: {candidate.name}</DialogTitle>
        </DialogHeader>
        <CandidateProfileDetail candidate={candidate} office={office} electionDate={electionDate} />
      </DialogContent>
    </Dialog>
  )
}
