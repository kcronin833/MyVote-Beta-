"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Vote, Edit3, Check, X, Crown, Users, ExternalLink, Info } from "lucide-react"
import { RepresentativeProfile } from "./representative-profile"
import { CandidateProfileDialog } from "./candidate-profile-detail"
import { CompatibilityScore } from "./compatibility-score"
import { calculateCompatibility } from "@/lib/compatibility-service"
import { currentUser } from "@/lib/mock-data"

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

interface Election {
  date: string
  type: "General Election" | "Primary Election" | "Special Election" | "Runoff Election"
  office: string
  description: string
  candidates: Candidate[]
  registrationDeadline: string
  earlyVotingStart?: string
  earlyVotingEnd?: string
}

// Enhanced political data with Atlanta focus and detailed election information
const politicalData = {
  "30309": {
    location: "Atlanta, GA",
    district: {
      congressional: "GA-5",
      state: "House District 57, Senate District 38",
      local: "Atlanta City Council District 6",
    },
    representatives: {
      congress: {
        name: "Nikema Williams",
        party: "Democrat" as const,
        office: "U.S. House of Representatives",
        district: "Georgia's 5th Congressional District",
        photo: "/placeholder.svg?height=128&width=128",
        coverPhoto: "/placeholder.svg?height=128&width=400",
        politicalScore: -72,
        yearsInOffice: 4,
        contact: {
          phone: "(202) 225-3801",
          email: "nikema.williams@mail.house.gov",
          website: "https://williams.house.gov",
          twitter: "https://twitter.com/RepNikema",
          facebook: "https://facebook.com/RepNikema",
        },
        biography: {
          age: 46,
          hometown: "Atlanta, GA",
          education: ["Talladega College - B.A. English", "Georgia State University - M.P.A. Public Administration"],
          previousJobs: [
            "Georgia State Senator",
            "Political Director, Planned Parenthood Southeast",
            "Executive Director, Georgia Democratic Party",
          ],
          committees: ["House Committee on Transportation and Infrastructure", "House Committee on Financial Services"],
          keyIssues: [
            "Voting Rights",
            "Healthcare Access",
            "Economic Justice",
            "Transportation Infrastructure",
            "Women's Rights",
          ],
        },
        votingRecord: {
          totalVotes: 892,
          partyLineVoting: 94,
          keyVotes: [
            {
              bill: "Infrastructure Investment Act",
              vote: "Yes" as const,
              description: "Bipartisan infrastructure bill including MARTA funding",
              date: "November 5, 2021",
            },
            {
              bill: "John Lewis Voting Rights Act",
              vote: "Yes" as const,
              description: "Voting rights restoration named after Georgia civil rights leader",
              date: "August 24, 2021",
            },
            {
              bill: "American Rescue Plan Act",
              vote: "Yes" as const,
              description: "COVID-19 relief including Atlanta small business support",
              date: "March 10, 2021",
            },
          ],
        },
      },
      senate: [
        {
          name: "Raphael Warnock",
          party: "Democrat" as const,
          office: "U.S. Senate",
          district: "Georgia",
          photo: "/placeholder.svg?height=128&width=128",
          coverPhoto: "/placeholder.svg?height=128&width=400",
          politicalScore: -68,
          yearsInOffice: 4,
          contact: {
            phone: "(202) 224-3643",
            email: "senator_warnock@warnock.senate.gov",
            website: "https://warnock.senate.gov",
            twitter: "https://twitter.com/SenatorWarnock",
          },
          biography: {
            age: 55,
            hometown: "Savannah, GA",
            education: ["Morehouse College - B.A.", "Union Theological Seminary - M.Div., Ph.D."],
            previousJobs: ["Senior Pastor, Ebenezer Baptist Church", "Civil Rights Advocate", "Community Organizer"],
            committees: [
              "Committee on Agriculture, Nutrition, and Forestry",
              "Committee on Banking, Housing, and Urban Affairs",
              "Committee on Commerce, Science, and Transportation",
            ],
            keyIssues: ["Healthcare Access", "Voting Rights", "Economic Justice", "Rural Development", "Education"],
          },
          votingRecord: {
            totalVotes: 456,
            partyLineVoting: 91,
            keyVotes: [
              {
                bill: "Inflation Reduction Act",
                vote: "Yes" as const,
                description: "Climate and healthcare legislation benefiting Georgia",
                date: "August 7, 2022",
              },
              {
                bill: "Infrastructure Investment Act",
                vote: "Yes" as const,
                description: "Infrastructure funding for Georgia including Atlanta",
                date: "August 10, 2021",
              },
            ],
          },
        },
        {
          name: "Jon Ossoff",
          party: "Democrat" as const,
          office: "U.S. Senate",
          district: "Georgia",
          photo: "/placeholder.svg?height=128&width=128",
          coverPhoto: "/placeholder.svg?height=128&width=400",
          politicalScore: -65,
          yearsInOffice: 4,
          contact: {
            phone: "(202) 224-3521",
            email: "senator_ossoff@ossoff.senate.gov",
            website: "https://ossoff.senate.gov",
            twitter: "https://twitter.com/SenOssoff",
          },
          biography: {
            age: 37,
            hometown: "Atlanta, GA",
            education: ["Georgetown University - B.S. Foreign Service", "London School of Economics - M.Sc."],
            previousJobs: ["Investigative Journalist", "Documentary Filmmaker", "CEO, Insight TWI"],
            committees: [
              "Committee on Homeland Security and Governmental Affairs",
              "Committee on the Judiciary",
              "Committee on Rules and Administration",
            ],
            keyIssues: [
              "Government Accountability",
              "Criminal Justice Reform",
              "Healthcare",
              "Climate Action",
              "Technology Policy",
            ],
          },
          votingRecord: {
            totalVotes: 456,
            partyLineVoting: 89,
            keyVotes: [
              {
                bill: "American Rescue Plan Act",
                vote: "Yes" as const,
                description: "COVID-19 relief supporting Georgia families and businesses",
                date: "March 6, 2021",
              },
              {
                bill: "CHIPS and Science Act",
                vote: "Yes" as const,
                description: "Technology and manufacturing investment",
                date: "July 27, 2022",
              },
            ],
          },
        },
      ],
    },
    upcomingElections: [
      {
        date: "November 5, 2024",
        type: "General Election" as const,
        office: "U.S. House of Representatives - GA-5",
        description: "Congressional election for Georgia's 5th District (Atlanta)",
        registrationDeadline: "October 7, 2024",
        earlyVotingStart: "October 15, 2024",
        earlyVotingEnd: "November 1, 2024",
        candidates: [
          {
            name: "Nikema Williams",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://williams.house.gov",
            experience: [
              "Current U.S. Representative (2021-present)",
              "Former Georgia State Senator",
              "Former Georgia Democratic Party Chair",
            ],
            keyIssues: ["Voting Rights", "MARTA Expansion", "Atlanta Housing", "Healthcare Access"],
            endorsements: ["Georgia Democratic Party", "AFL-CIO", "Sierra Club", "Planned Parenthood"],
            fundraising: {
              totalRaised: "$1.8M",
              lastQuarter: "$425K",
            },
            bio: "Nikema Williams represents Georgia's 5th Congressional District, which includes most of Atlanta. She previously served in the Georgia State Senate and as Chair of the Georgia Democratic Party. She's a strong advocate for voting rights, transportation infrastructure, and economic justice.",
            age: 46,
            education: ["Talladega College - B.A. English", "Georgia State University - M.P.A."],
            hometown: "Atlanta, Georgia",
            family: "Married with one son",
            politicalScore: -72,
            positions: [
              {
                issue: "MARTA Expansion",
                stance: "Supportive",
                description:
                  "Strong advocate for federal funding for MARTA expansion and Atlanta public transit. Supports connecting underserved communities to job centers.",
              },
              {
                issue: "Voting Rights",
                stance: "Supportive",
                description:
                  "Champion of the John Lewis Voting Rights Advancement Act. Advocates for automatic voter registration and expanded early voting access in Georgia.",
              },
              {
                issue: "Atlanta Housing",
                stance: "Progressive",
                description:
                  "Supports federal investment in affordable housing, tenant protections, and addressing Atlanta's housing affordability crisis.",
              },
            ],
            votingRecord: [
              {
                bill: "Infrastructure Investment Act",
                vote: "Yes",
                date: "November 5, 2021",
                description: "Bipartisan infrastructure bill including MARTA funding",
              },
              {
                bill: "John Lewis Voting Rights Act",
                vote: "Yes",
                date: "August 24, 2021",
                description: "Voting rights restoration",
              },
              {
                bill: "American Rescue Plan Act",
                vote: "Yes",
                date: "March 10, 2021",
                description: "COVID-19 relief including Atlanta support",
              },
            ],
            endorsementDetails: [
              {
                organization: "Georgia Democratic Party",
                type: "Party",
                quote: "Representative Williams continues to be a strong voice for Atlanta and Georgia values.",
              },
              {
                organization: "Sierra Club",
                type: "Environmental",
                quote: "A champion for clean transportation and environmental justice in Atlanta.",
              },
            ],
            campaignFinance: {
              totalRaised: "$1,800,000",
              totalSpent: "$1,200,000",
              cashOnHand: "$600,000",
              averageDonation: "$125",
              smallDonorPercentage: "68%",
              topIndustries: [
                { name: "Education", amount: "$285,000" },
                { name: "Healthcare", amount: "$210,000" },
                { name: "Labor Unions", amount: "$195,000" },
                { name: "Transportation", amount: "$175,000" },
              ],
            },
            socialMedia: {
              twitter: "https://twitter.com/RepNikema",
              facebook: "https://facebook.com/RepNikema",
              instagram: "https://instagram.com/repnikema",
            },
            contactInfo: {
              email: "info@nikemaforatlanta.com",
              phone: "(404) 555-0123",
              campaignOffice: "1234 Peachtree St, Atlanta, GA 30309",
            },
            events: [
              {
                name: "MARTA Expansion Town Hall",
                date: "August 15, 2024",
                location: "Atlanta City Hall",
                description: "Discussion on federal funding for MARTA expansion and Atlanta transit",
              },
              {
                name: "Voting Rights Rally",
                date: "September 3, 2024",
                location: "Ebenezer Baptist Church",
                description: "Rally for voting rights protection in Georgia",
              },
            ],
          },
          {
            name: "Angela Stanton-King",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Author", "Criminal Justice Advocate", "Community Organizer"],
            keyIssues: ["Criminal Justice Reform", "Economic Opportunity", "Education Choice", "Community Safety"],
            endorsements: ["Georgia Republican Party"],
            fundraising: {
              totalRaised: "$285K",
              lastQuarter: "$67K",
            },
            bio: "Angela Stanton-King is an author, advocate, and community organizer focused on criminal justice reform and economic opportunity in Atlanta's communities. She's running to bring fresh perspectives and bipartisan solutions to Congress.",
            age: 44,
            education: ["Self-educated advocate and author"],
            hometown: "Atlanta, Georgia",
            family: "Mother of six children",
            politicalScore: 45,
            positions: [
              {
                issue: "Criminal Justice Reform",
                stance: "Reformist",
                description:
                  "Advocates for second chances, prison reform, and reentry programs. Supports reducing recidivism through education and job training.",
              },
              {
                issue: "Economic Opportunity",
                stance: "Pro-Business",
                description:
                  "Supports small business development, entrepreneurship programs, and economic empowerment in Atlanta's underserved communities.",
              },
              {
                issue: "Education Choice",
                stance: "Supportive",
                description:
                  "Advocates for school choice, charter schools, and educational opportunities for all Atlanta children regardless of zip code.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/AngelaStanton",
              facebook: "https://facebook.com/AngelaStantonKing",
            },
            contactInfo: {
              email: "info@angelaforatlanta.com",
              phone: "(404) 555-0456",
            },
          },
        ],
      },
      {
        date: "November 5, 2024",
        type: "General Election" as const,
        office: "U.S. Senate - Georgia",
        description: "U.S. Senate election for Georgia (Special Election)",
        registrationDeadline: "October 7, 2024",
        earlyVotingStart: "October 15, 2024",
        earlyVotingEnd: "November 1, 2024",
        candidates: [
          {
            name: "Raphael Warnock",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://warnock.senate.gov",
            experience: ["Current U.S. Senator", "Senior Pastor, Ebenezer Baptist Church", "Civil Rights Advocate"],
            keyIssues: ["Healthcare Access", "Voting Rights", "Economic Justice", "Rural Development"],
            endorsements: ["Georgia Democratic Party", "SEIU", "Georgia Teachers Association"],
            fundraising: {
              totalRaised: "$6.8M",
              lastQuarter: "$1.9M",
            },
            bio: "Raphael Warnock serves as Georgia's first Black U.S. Senator and is the Senior Pastor of Ebenezer Baptist Church in Atlanta, where Dr. Martin Luther King Jr. once preached. He's focused on healthcare access, voting rights, and economic opportunity for all Georgians.",
            age: 55,
            education: ["Morehouse College - B.A.", "Union Theological Seminary - M.Div., Ph.D."],
            hometown: "Savannah, Georgia",
            family: "Father of two children",
            politicalScore: -68,
            positions: [
              {
                issue: "Healthcare Access",
                stance: "Progressive",
                description:
                  "Advocates for expanding Medicaid in Georgia, lowering prescription drug costs, and protecting coverage for pre-existing conditions.",
              },
              {
                issue: "Voting Rights",
                stance: "Supportive",
                description:
                  "Champion of the John Lewis Voting Rights Advancement Act and the Freedom to Vote Act. Opposes voter suppression efforts in Georgia.",
              },
              {
                issue: "Economic Justice",
                stance: "Progressive",
                description:
                  "Supports raising the minimum wage, paid family leave, and investments in job training and education programs.",
              },
            ],
            votingRecord: [
              {
                bill: "Inflation Reduction Act",
                vote: "Yes",
                date: "August 7, 2022",
                description: "Climate and healthcare legislation",
              },
              {
                bill: "Infrastructure Investment Act",
                vote: "Yes",
                date: "August 10, 2021",
                description: "Infrastructure funding for Georgia",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/SenatorWarnock",
              facebook: "https://facebook.com/SenatorWarnock",
              instagram: "https://instagram.com/senatorwarnock",
            },
            contactInfo: {
              email: "info@warnockforgeorgia.com",
              phone: "(404) 555-0789",
              campaignOffice: "5678 Martin Luther King Jr Dr, Atlanta, GA 30312",
            },
          },
          {
            name: "Herschel Walker",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Former NFL Player", "Heisman Trophy Winner", "Business Owner"],
            keyIssues: ["Economic Growth", "Public Safety", "Veterans Affairs", "Education"],
            endorsements: ["Georgia Republican Party"],
            fundraising: {
              totalRaised: "$4.2M",
              lastQuarter: "$1.1M",
            },
            bio: "Herschel Walker is a former NFL star and Heisman Trophy winner from the University of Georgia. After his football career, he became a successful businessman and is running to bring conservative values and economic growth to Georgia.",
            age: 62,
            education: ["University of Georgia"],
            hometown: "Wrightsville, Georgia",
            family: "Father of four children",
            politicalScore: 72,
            positions: [
              {
                issue: "Economic Growth",
                stance: "Conservative",
                description:
                  "Advocates for lower taxes, reduced regulations, and support for small businesses to create jobs in Georgia.",
              },
              {
                issue: "Public Safety",
                stance: "Law and Order",
                description:
                  "Supports increased funding for law enforcement, tougher penalties for violent crimes, and backing the blue.",
              },
              {
                issue: "Veterans Affairs",
                stance: "Supportive",
                description:
                  "Advocates for improved VA services, mental health support for veterans, and honoring those who served.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/HerschelWalker",
              facebook: "https://facebook.com/HerschelWalker",
            },
            contactInfo: {
              email: "info@herschelforgeorgia.com",
              phone: "(770) 555-0123",
            },
          },
        ],
      },
    ],
    pollingLocation: {
      name: "Atlanta City Hall",
      address: "55 Trinity Ave SW, Atlanta, GA 30303",
      hours: "7:00 AM - 7:00 PM",
    },
  },
}

interface PoliticalProfileProps {
  initialZipCode?: string
}

export function PoliticalProfile({ initialZipCode = "30309" }: PoliticalProfileProps) {
  const [zipCode, setZipCode] = useState(initialZipCode)
  const [editingZip, setEditingZip] = useState(false)
  const [tempZipCode, setTempZipCode] = useState(zipCode)
  const [selectedCandidate, setSelectedCandidate] = useState<{
    candidate: Candidate
    office: string
    electionDate: string
  } | null>(null)

  const profileData = politicalData[zipCode as keyof typeof politicalData]

  const handleZipCodeUpdate = () => {
    if (tempZipCode in politicalData) {
      setZipCode(tempZipCode)
      setEditingZip(false)
    } else {
      alert("Sorry, we don't have data for that zip code yet. Try 30309 for Atlanta.")
    }
  }

  const cancelEdit = () => {
    setTempZipCode(zipCode)
    setEditingZip(false)
  }

  const getPartyColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-[#1F3A93] text-white border-[#1F3A93]"
      case "Republican":
        return "bg-[#D64541] text-white border-[#D64541]"
      case "Independent":
        return "bg-[#F39C12] text-white border-[#F39C12]"
      case "Green":
        return "bg-[#27AE60] text-white border-[#27AE60]"
      case "Libertarian":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openCandidateProfile = (candidate: Candidate, office: string, electionDate: string) => {
    setSelectedCandidate({ candidate, office, electionDate })
  }

  const renderCandidate = (candidate: Candidate, office: string, electionDate: string) => {
    const compatibility = calculateCompatibility(currentUser, {
      politicalScore: candidate.politicalScore || 0,
      keyIssues: candidate.keyIssues,
      positions: candidate.positions || [],
      votingRecord: candidate.votingRecord || [],
    })

    return (
      <Card
        key={candidate.name}
        className={`${candidate.isIncumbent ? "border-2 border-[#1F3A93] bg-blue-50" : ""} hover:shadow-lg transition-shadow cursor-pointer`}
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
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-lg">{candidate.name}</h4>
                {candidate.isIncumbent && (
                  <Badge variant="default" className="bg-[#1F3A93] text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Incumbent
                  </Badge>
                )}
                <Badge variant="outline" className={getPartyColor(candidate.party)}>
                  {candidate.party}
                </Badge>
                <CompatibilityScore compatibility={compatibility} mode="compact" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-[#4A4A4A] mb-1">Experience</h5>
                  <ul className="text-[#4A4A4A] space-y-1">
                    {candidate.experience.slice(0, 3).map((exp, i) => (
                      <li key={i}>• {exp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-[#4A4A4A] mb-1">Key Issues</h5>
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
            <div>
              <h5 className="font-medium text-[#4A4A4A] mb-1">Fundraising</h5>
              <p className="text-[#4A4A4A]">Total: {candidate.fundraising.totalRaised}</p>
              <p className="text-[#4A4A4A]">Last Quarter: {candidate.fundraising.lastQuarter}</p>
            </div>
            <div>
              <h5 className="font-medium text-[#4A4A4A] mb-1">Endorsements</h5>
              <div className="space-y-1">
                {candidate.endorsements.slice(0, 2).map((endorsement, i) => (
                  <p key={i} className="text-[#4A4A4A] text-xs">
                    • {endorsement}
                  </p>
                ))}
                {candidate.endorsements.length > 2 && (
                  <p className="text-gray-500 text-xs">+{candidate.endorsements.length - 2} more</p>
                )}
              </div>
            </div>
            <div className="flex items-end justify-between">
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
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profileData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No political data available for this zip code.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Location Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#1F3A93]" />
              <div>
                <CardTitle className="text-xl">Your Political Profile</CardTitle>
                <CardDescription>{profileData.location}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editingZip ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempZipCode}
                    onChange={(e) => setTempZipCode(e.target.value)}
                    placeholder="Zip Code"
                    className="w-24"
                  />
                  <Button size="sm" onClick={handleZipCodeUpdate}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {zipCode}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditingZip(true)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upcoming Elections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Upcoming Elections & Candidates
          </CardTitle>
          <CardDescription>Official candidates on your ballot with compatibility scores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileData.upcomingElections.map((election, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{election.office}</h3>
                  <p className="text-[#4A4A4A]">{election.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Election: {election.date}
                    </div>
                    <div>Registration Deadline: {election.registrationDeadline}</div>
                    {election.earlyVotingStart && (
                      <div>
                        Early Voting: {election.earlyVotingStart} - {election.earlyVotingEnd}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {election.type}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[#4A4A4A] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Candidates ({election.candidates.length})
                </h4>
                <div className="space-y-3">
                  {election.candidates.map((candidate) => renderCandidate(candidate, election.office, election.date))}
                </div>
              </div>

              {index < profileData.upcomingElections.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Representative Profiles */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Your Current Representatives</h2>

          {/* House Representative */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F3A93] mb-4">U.S. House of Representatives</h3>
            <RepresentativeProfile representative={profileData.representatives.congress} />
          </div>

          {/* Senate Representatives */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1F3A93] mb-4">U.S. Senate</h3>
            <div className="space-y-6">
              {profileData.representatives.senate.map((senator, index) => (
                <RepresentativeProfile key={index} representative={senator} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Polling Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Your Polling Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">{profileData.pollingLocation.name}</p>
            <p className="text-sm text-[#4A4A4A]">{profileData.pollingLocation.address}</p>
            <p className="text-sm text-gray-500">Hours: {profileData.pollingLocation.hours}</p>
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
    </div>
  )
}
