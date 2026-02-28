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
        yearsInOffice: 6,
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
          yearsInOffice: 6,
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
          district: "Georgia (up for re-election Nov 2026)",
          photo: "/placeholder.svg?height=128&width=128",
          coverPhoto: "/placeholder.svg?height=128&width=400",
          politicalScore: -65,
          yearsInOffice: 6,
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
        date: "May 19, 2026",
        type: "Primary Election" as const,
        office: "Georgia Governor - Democratic Primary",
        description: "Democratic primary for Georgia Governor (Gov. Brian Kemp is term-limited)",
        registrationDeadline: "April 20, 2026",
        earlyVotingStart: "April 27, 2026",
        earlyVotingEnd: "May 15, 2026",
        candidates: [
          {
            name: "Keisha Lance Bottoms",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://keishaforgovernor.com",
            experience: [
              "Mayor of Atlanta (2018-2022)",
              "Senior Adviser to President Biden",
              "Atlanta City Council Member",
            ],
            keyIssues: ["Medicaid Expansion", "Public Education", "Small Business Support", "Free Community College"],
            endorsements: ["Atlanta Democratic Leadership"],
            fundraising: {
              totalRaised: "$3.2M",
              lastQuarter: "$890K",
            },
            bio: "Keisha Lance Bottoms served as the 60th Mayor of Atlanta from 2018 to 2022 and was a senior adviser to President Biden. She is running to expand Medicaid, improve public education, eliminate state income taxes for teachers, and help small businesses across all 159 Georgia counties.",
            age: 55,
            education: ["Florida A&M University - B.A.", "Georgia State University - J.D."],
            hometown: "Atlanta, Georgia",
            family: "Married with four children",
            politicalScore: -62,
            positions: [
              {
                issue: "Medicaid Expansion",
                stance: "Supportive",
                description: "Advocates for full Medicaid expansion in Georgia to cover hundreds of thousands of uninsured Georgians.",
              },
              {
                issue: "Public Education",
                stance: "Progressive",
                description: "Supports eliminating state income taxes for teachers, increasing public school funding, and offering free technical and community college.",
              },
              {
                issue: "Small Business",
                stance: "Supportive",
                description: "Plans to create new support programs for small businesses and entrepreneurs in underserved communities across Georgia.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/KeishaBottoms",
              facebook: "https://facebook.com/KeishaLanceBottoms",
              instagram: "https://instagram.com/keaborgeorgia",
            },
            contactInfo: {
              email: "info@keishaforgovernor.com",
              phone: "(404) 555-0201",
              campaignOffice: "Atlanta, GA",
            },
          },
          {
            name: "Geoff Duncan",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://geoffduncan.com",
            experience: [
              "Lieutenant Governor of Georgia (2019-2023, as Republican)",
              "Georgia State Representative",
              "Switched to Democratic Party in 2025",
            ],
            keyIssues: ["Childcare Affordability", "Healthcare Costs", "Housing Costs", "Rejecting Extremism"],
            endorsements: [],
            fundraising: {
              totalRaised: "$2.1M",
              lastQuarter: "$640K",
            },
            bio: "Geoff Duncan served as Georgia's Republican Lt. Governor from 2019 to 2023 before switching to the Democratic Party in August 2025. He says he's the only Democrat who can win the general election by attracting Democrats, independents, and disaffected Republicans. He's focused on lowering the cost of childcare, healthcare, and housing.",
            age: 47,
            education: ["Georgia Tech"],
            hometown: "Lawrenceville, Georgia",
            family: "Married with three sons",
            politicalScore: -15,
            positions: [
              {
                issue: "Childcare & Cost of Living",
                stance: "Moderate",
                description: "Focused on bringing down the cost of childcare, healthcare, and housing for Georgia families in all 159 counties.",
              },
              {
                issue: "Rejecting Extremism",
                stance: "Centrist",
                description: "Campaigning on fairness, opportunity, and 'love thy neighbor' values, rejecting extremism from both parties.",
              },
              {
                issue: "Healthcare",
                stance: "Supportive",
                description: "Supports expanding healthcare access and lowering costs for Georgia families.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/GeoffDuncanGA",
            },
            contactInfo: {
              email: "info@geoffduncan.com",
              phone: "(770) 555-0302",
            },
          },
          {
            name: "Jason Esteves",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: [
              "Georgia State Senator",
              "Former Atlanta Public Schools Board Member",
              "Public School Teacher & Lawyer",
            ],
            keyIssues: ["Public Education Funding", "Lowering Cost of Living", "Healthcare Access", "Overturning Abortion Ban"],
            endorsements: [],
            fundraising: {
              totalRaised: "$1.5M",
              lastQuarter: "$420K",
            },
            bio: "Jason Esteves is a Georgia State Senator, former public school teacher, and lawyer who served on the Atlanta Public Schools board. He's running to make Georgia the best place to work, start a business, and raise a family, with a focus on education, healthcare, and reproductive rights.",
            age: 42,
            education: ["Emory University - J.D."],
            hometown: "Atlanta, Georgia",
            politicalScore: -70,
            positions: [
              {
                issue: "Public Education",
                stance: "Progressive",
                description: "Wants to increase public education funding and create multiple pathways to success for Georgia students.",
              },
              {
                issue: "Reproductive Rights",
                stance: "Supportive",
                description: "Advocates for overturning Georgia's abortion ban and protecting reproductive healthcare access.",
              },
              {
                issue: "Small Business",
                stance: "Supportive",
                description: "Plans to invest in small businesses and lower the cost of living for working families.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/JasonEsteves",
            },
            contactInfo: {
              email: "info@estevesforgovernor.com",
            },
          },
          {
            name: "Michael Thurmond",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: [
              "DeKalb County CEO",
              "Georgia State Labor Commissioner",
              "Former State Representative",
              "Interim DeKalb County School Superintendent",
            ],
            keyIssues: ["Working Families", "Healthcare Expansion", "Education Pathways", "Public Safety"],
            endorsements: [],
            fundraising: {
              totalRaised: "$1.8M",
              lastQuarter: "$510K",
            },
            bio: "Michael Thurmond is the CEO of DeKalb County and has decades of public service including as Georgia's Labor Commissioner and a State Representative. He's running to fight for working families, expand healthcare access, and build an education system with multiple pathways to success.",
            age: 72,
            education: ["Paine College - B.A.", "University of South Carolina - J.D."],
            hometown: "Athens, Georgia",
            politicalScore: -55,
            positions: [
              {
                issue: "Working Families",
                stance: "Progressive",
                description: "Focused on growing Georgia faster, stronger, safer, and more equitable for working families.",
              },
              {
                issue: "Healthcare",
                stance: "Supportive",
                description: "Supports expanding access to healthcare for all Georgians.",
              },
              {
                issue: "Education",
                stance: "Progressive",
                description: "Wants to create multiple pathways to success through expanded education and job training programs.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/MikeThurmond",
            },
            contactInfo: {
              email: "info@thurmondforgovernor.com",
            },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "U.S. Senate - Georgia",
        description: "U.S. Senate election - Sen. Jon Ossoff (D) seeking re-election against a field of challengers",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Jon Ossoff",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://ossoff.senate.gov",
            experience: [
              "Current U.S. Senator (2021-present)",
              "Investigative Journalist & Documentary Filmmaker",
              "CEO, Insight TWI",
            ],
            keyIssues: ["Government Accountability", "Criminal Justice Reform", "Healthcare", "Technology Policy"],
            endorsements: ["Georgia Democratic Party"],
            fundraising: {
              totalRaised: "$8.5M",
              lastQuarter: "$2.3M",
            },
            bio: "Jon Ossoff has served as Georgia's junior U.S. Senator since 2021. He's focused on government accountability, criminal justice reform, healthcare access, and technology policy. He previously worked as an investigative journalist and CEO of a media company investigating corruption and human rights abuses.",
            age: 39,
            education: ["Georgetown University - B.S. Foreign Service", "London School of Economics - M.Sc."],
            hometown: "Atlanta, Georgia",
            family: "Married",
            politicalScore: -65,
            positions: [
              {
                issue: "Government Accountability",
                stance: "Reform",
                description: "Led investigations into government waste, fraud, and abuse. Champions transparency and oversight of federal spending.",
              },
              {
                issue: "Criminal Justice Reform",
                stance: "Progressive",
                description: "Advocates for sentencing reform, ending cash bail for non-violent offenses, and investing in reentry programs.",
              },
              {
                issue: "Technology & Privacy",
                stance: "Progressive",
                description: "Supports data privacy protections, AI regulation, and ensuring technology companies are held accountable.",
              },
            ],
            votingRecord: [
              {
                bill: "CHIPS and Science Act",
                vote: "Yes",
                date: "July 27, 2022",
                description: "Technology and manufacturing investment",
              },
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
                description: "Infrastructure funding including Georgia projects",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/SenOssoff",
              facebook: "https://facebook.com/SenatorOssoff",
              instagram: "https://instagram.com/senossoff",
            },
            contactInfo: {
              email: "info@ossoffforgeorgia.com",
              phone: "(404) 555-0789",
              campaignOffice: "Atlanta, GA",
            },
          },
          {
            name: "Mike Collins",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://mikecollinsforsenate.com",
            experience: [
              "U.S. Representative, GA-10 (2023-present)",
              "Founder, Collins Trucking Co.",
              "Led passage of the Laken Riley Act",
            ],
            keyIssues: ["Border Security", "Economic Growth", "America First Agenda", "Public Safety"],
            endorsements: ["Georgia Republican Party"],
            fundraising: {
              totalRaised: "$3.8M",
              lastQuarter: "$1.1M",
            },
            bio: "Mike Collins represents Georgia's 10th Congressional District and is the founder of Collins Trucking. He's one of the key figures behind the Laken Riley Act and is running on an America First platform to unseat Jon Ossoff.",
            age: 58,
            education: ["University of Georgia"],
            hometown: "Jackson, Georgia",
            politicalScore: 78,
            positions: [
              {
                issue: "Border Security",
                stance: "Conservative",
                description: "Strong supporter of border enforcement, the Laken Riley Act, and cracking down on illegal immigration.",
              },
              {
                issue: "Economic Growth",
                stance: "Pro-Business",
                description: "Advocates for lower taxes, reduced regulations, and supporting Georgia's trucking and logistics industries.",
              },
              {
                issue: "America First",
                stance: "Conservative",
                description: "Supports President Trump's America First agenda across trade, defense, and domestic policy.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/RepMikeCollins",
            },
            contactInfo: {
              email: "info@mikecollinsforsenate.com",
            },
          },
          {
            name: "Buddy Carter",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://buddycarter.com",
            experience: [
              "U.S. Representative, GA-1 (2015-present)",
              "Former Mayor of Pooler, GA",
              "Pharmacist & Business Owner",
            ],
            keyIssues: ["Healthcare Costs", "Conservative Values", "Veterans Affairs", "Small Business"],
            endorsements: [],
            fundraising: {
              totalRaised: "$2.5M",
              lastQuarter: "$780K",
            },
            bio: "Buddy Carter has represented Georgia's 1st Congressional District (Savannah area) since 2015. A pharmacist and former mayor, he's focused on lowering healthcare costs and bringing conservative leadership to the Senate.",
            age: 69,
            education: ["University of Georgia - B.S. Pharmacy"],
            hometown: "Pooler, Georgia",
            politicalScore: 72,
            positions: [
              {
                issue: "Healthcare Costs",
                stance: "Market-Based",
                description: "Pharmacist by trade who advocates for market-based solutions to lower prescription drug costs and increase competition.",
              },
              {
                issue: "Small Business",
                stance: "Pro-Business",
                description: "As a business owner himself, supports reducing regulations and taxes on small businesses.",
              },
              {
                issue: "Veterans",
                stance: "Supportive",
                description: "Advocates for improved VA services and mental health support for Georgia's veterans.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/RepBuddyCarter",
            },
            contactInfo: {
              email: "info@buddycarterforsenate.com",
            },
          },
          {
            name: "Derek Dooley",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: [
              "Attorney",
              "Former NCAA Head Football Coach (Tennessee, Louisiana Tech)",
              "UGA Law School Graduate",
            ],
            keyIssues: ["Georgia First", "Common Sense Governance", "Supporting Trump Agenda", "Economic Growth"],
            endorsements: [],
            fundraising: {
              totalRaised: "$1.2M",
              lastQuarter: "$380K",
            },
            bio: "Derek Dooley is an Athens native, UGA law school graduate, and former college football head coach. The son of legendary UGA coach Vince Dooley, he's running to bring Georgia common sense to Washington and work with President Trump to deliver results.",
            age: 58,
            education: ["University of Virginia - B.A.", "University of Georgia - J.D."],
            hometown: "Athens, Georgia",
            politicalScore: 65,
            positions: [
              {
                issue: "Georgia First",
                stance: "Conservative",
                description: "Pledges to put Georgia's interests first and work with President Trump to advance his agenda.",
              },
              {
                issue: "Common Sense",
                stance: "Moderate Conservative",
                description: "Advocates for practical, common-sense solutions over partisan gridlock.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/DerekDooley",
            },
            contactInfo: {
              email: "info@dooleyforgeorgia.com",
            },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "U.S. House of Representatives - GA-5",
        description: "Congressional election for Georgia's 5th District (Atlanta) - Rep. Nikema Williams (D) seeking re-election",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
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
              totalRaised: "$2.1M",
              lastQuarter: "$485K",
            },
            bio: "Nikema Williams represents Georgia's 5th Congressional District, which includes most of Atlanta. Now in her third term, she previously served in the Georgia State Senate and as Chair of the Georgia Democratic Party. She continues to champion voting rights, transit expansion, and affordable housing.",
            age: 48,
            education: ["Talladega College - B.A. English", "Georgia State University - M.P.A."],
            hometown: "Atlanta, Georgia",
            family: "Married with one son",
            politicalScore: -72,
            positions: [
              {
                issue: "MARTA Expansion",
                stance: "Supportive",
                description: "Strong advocate for federal funding for MARTA expansion and Atlanta public transit. Supports connecting underserved communities to job centers.",
              },
              {
                issue: "Voting Rights",
                stance: "Supportive",
                description: "Champion of the John Lewis Voting Rights Advancement Act. Advocates for automatic voter registration and expanded early voting access in Georgia.",
              },
              {
                issue: "Atlanta Housing",
                stance: "Progressive",
                description: "Supports federal investment in affordable housing, tenant protections, and addressing Atlanta's housing affordability crisis.",
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
              totalRaised: "$2,100,000",
              totalSpent: "$1,400,000",
              cashOnHand: "$700,000",
              averageDonation: "$130",
              smallDonorPercentage: "66%",
              topIndustries: [
                { name: "Education", amount: "$310,000" },
                { name: "Healthcare", amount: "$240,000" },
                { name: "Labor Unions", amount: "$215,000" },
                { name: "Transportation", amount: "$190,000" },
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
                name: "Transit & Housing Town Hall",
                date: "April 10, 2026",
                location: "Atlanta City Hall",
                description: "Discussion on MARTA expansion and affordable housing in Atlanta",
              },
              {
                name: "Voting Rights Community Forum",
                date: "May 1, 2026",
                location: "Ebenezer Baptist Church",
                description: "Community discussion on protecting voting rights in Georgia",
              },
            ],
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
