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
import { getBallotForZip } from "@/lib/georgia-ballot-data"

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
    location: "Atlanta, GA 30309",
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
            experience: ["Current U.S. Representative (2021-present)", "Former Georgia State Senator", "Former Georgia Democratic Party Chair"],
            keyIssues: ["Voting Rights", "MARTA Expansion", "Atlanta Housing", "Healthcare Access"],
            endorsements: ["Georgia Democratic Party", "AFL-CIO", "Sierra Club", "Planned Parenthood"],
            fundraising: { totalRaised: "$2.1M", lastQuarter: "$485K" },
            bio: "Nikema Williams represents Georgia's 5th Congressional District. She champions voting rights, transit expansion, and affordable housing.",
            age: 48,
            education: ["Talladega College - B.A. English", "Georgia State University - M.P.A."],
            hometown: "Atlanta, Georgia",
            politicalScore: -72,
            positions: [
              { issue: "MARTA Expansion", stance: "Supportive", description: "Strong advocate for federal funding for MARTA expansion and Atlanta public transit." },
              { issue: "Voting Rights", stance: "Supportive", description: "Champion of the John Lewis Voting Rights Advancement Act." },
            ],
            socialMedia: { twitter: "https://twitter.com/RepNikema" },
            contactInfo: { email: "info@nikemaforatlanta.com" },
          },
        ],
      },
      // ── STATE RACES ──────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Georgia State Senate – District 38",
        description: "Georgia State Senate seat covering Midtown Atlanta and surrounding neighborhoods",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Sonya Halpern",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Georgia State Senator, District 38 (2021-present)", "Community Advocate", "Business Owner"],
            keyIssues: ["Education Funding", "Healthcare Access", "LGBTQ+ Rights", "Affordable Housing"],
            endorsements: ["Georgia Democratic Party"],
            fundraising: { totalRaised: "$420K", lastQuarter: "$95K" },
            bio: "Sen. Sonya Halpern has represented District 38 since 2021, focusing on education, healthcare, and civil rights legislation.",
            politicalScore: -60,
            positions: [
              { issue: "Education", stance: "Progressive", description: "Advocates for increased state funding for Atlanta Public Schools." },
              { issue: "Healthcare", stance: "Supportive", description: "Supports Medicaid expansion and mental health funding." },
            ],
            socialMedia: { twitter: "https://twitter.com/SonyaHalpernGA" },
            contactInfo: { email: "info@halpernforsenate.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Georgia State House – District 57",
        description: "Georgia House of Representatives seat covering parts of Atlanta, including Buckhead and Midtown",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Teri Anulewicz",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Georgia State Representative, District 57 (2019-present)", "Former Smyrna City Council", "Attorney"],
            keyIssues: ["Transit", "Education", "Public Safety", "Women's Rights"],
            endorsements: ["Georgia Democratic Party", "Georgia AFL-CIO"],
            fundraising: { totalRaised: "$280K", lastQuarter: "$62K" },
            bio: "Rep. Teri Anulewicz has served District 57 since 2019 and is a leading voice for public transit and education in the Georgia House.",
            politicalScore: -58,
            positions: [
              { issue: "Public Transit", stance: "Supportive", description: "Advocates for expanded MARTA and regional transit funding." },
              { issue: "Education", stance: "Progressive", description: "Supports teacher pay raises and increased school funding." },
            ],
            socialMedia: { twitter: "https://twitter.com/TeriAnulewicz" },
            contactInfo: { email: "info@anulewiczforga.com" },
          },
        ],
      },
      // ── COUNTY RACES ─────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Commission – District 6",
        description: "Fulton County Board of Commissioners seat covering central Atlanta",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Khadijah Abdur-Rahman",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Commissioner, District 6 (2021-present)", "Community Organizer", "Public Health Advocate"],
            keyIssues: ["Public Health", "Criminal Justice Reform", "Affordable Housing", "Mental Health Services"],
            endorsements: ["Fulton County Democratic Party"],
            fundraising: { totalRaised: "$185K", lastQuarter: "$41K" },
            bio: "Commissioner Abdur-Rahman oversees county services for District 6, focusing on public health infrastructure and justice reform.",
            politicalScore: -65,
            positions: [
              { issue: "Criminal Justice", stance: "Reform", description: "Supports investing in alternatives to incarceration and community-based programs." },
              { issue: "Affordable Housing", stance: "Progressive", description: "Advocates for county-funded affordable housing and renter protections." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@abdurrahmanforfulton.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Sheriff",
        description: "Fulton County Sheriff — responsible for county jail, courts, and unincorporated area law enforcement",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Patrick Labat",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Sheriff (2021-present)", "30+ years law enforcement", "Former ATF Agent"],
            keyIssues: ["Jail Reform", "Public Safety", "Community Policing", "Mental Health Diversion"],
            endorsements: ["Fulton County Democratic Party"],
            fundraising: { totalRaised: "$310K", lastQuarter: "$72K" },
            bio: "Sheriff Patrick Labat has served as Fulton County Sheriff since 2021, overseeing the county jail and pushing for mental health diversion programs.",
            politicalScore: -30,
            positions: [
              { issue: "Jail Reform", stance: "Moderate", description: "Working to reduce jail overcrowding and expand mental health services for inmates." },
              { issue: "Community Policing", stance: "Supportive", description: "Expanding community partnerships to build trust between law enforcement and residents." },
            ],
            socialMedia: { twitter: "https://twitter.com/SheriffLabat" },
            contactInfo: { email: "info@labatforsheriff.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County District Attorney",
        description: "Fulton County District Attorney — chief prosecutor for Fulton County",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Christian Wise Smith",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Chief Deputy DA, Fulton County", "Senior Prosecutor", "Homicide Division Lead"],
            keyIssues: ["Public Safety", "Violent Crime Prosecution", "Victim Services", "Accountability"],
            endorsements: [],
            fundraising: { totalRaised: "$220K", lastQuarter: "$58K" },
            bio: "Christian Wise Smith is a career prosecutor running to lead the Fulton County DA's office with a focus on reducing violent crime and supporting victims.",
            politicalScore: -20,
            positions: [
              { issue: "Violent Crime", stance: "Tough", description: "Prioritizes prosecution of violent and gun crimes affecting Atlanta communities." },
              { issue: "Victim Services", stance: "Supportive", description: "Wants to expand resources and support for crime victims throughout the county." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@wisesmithforDA.com" },
          },
        ],
      },
      // ── LOCAL / SCHOOL BOARD ─────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Atlanta Board of Education – District 3",
        description: "Atlanta Public Schools Board of Education seat covering Midtown, Buckhead, and surrounding neighborhoods",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Eshe' Collins",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["APS Board Member, District 3 (2019-present)", "Former APS Parent Advocate", "Education Consultant"],
            keyIssues: ["School Funding", "Teacher Retention", "Special Education", "School Safety"],
            endorsements: ["Atlanta Federation of Teachers"],
            fundraising: { totalRaised: "$95K", lastQuarter: "$22K" },
            bio: "Board Member Eshe' Collins has served Atlanta Public Schools' District 3 since 2019, championing teacher support and special education services.",
            politicalScore: -45,
            positions: [
              { issue: "Teacher Retention", stance: "Supportive", description: "Advocates for competitive pay and support systems to keep experienced teachers in APS." },
              { issue: "Special Education", stance: "Progressive", description: "Pushing for expanded IEP resources and inclusion programs across district schools." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@collinsforAPS.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Board of Education – District 4",
        description: "Fulton County Schools Board of Education seat (North Fulton / Sandy Springs area)",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Julia Bernath",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Schools Board (2008-present)", "Former PTA President", "Education Advocate"],
            keyIssues: ["Academic Excellence", "School Funding", "Mental Health Support", "Technology in Schools"],
            endorsements: [],
            fundraising: { totalRaised: "$78K", lastQuarter: "$18K" },
            bio: "Julia Bernath is a long-serving member of the Fulton County Board of Education focused on academic achievement and student mental health.",
            politicalScore: -10,
            positions: [
              { issue: "Mental Health", stance: "Supportive", description: "Pushed to hire more school counselors and expand mental health resources district-wide." },
              { issue: "Technology", stance: "Progressive", description: "Supports 1:1 device programs and technology-integrated learning across all grade levels." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@bernathforschools.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Atlanta City Council – District 6",
        description: "Atlanta City Council seat covering Buckhead, Midtown, and surrounding neighborhoods",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Alex Wan",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Atlanta City Council, District 6 (2022-present)", "Former City Council Member (2010-2018)", "Nonprofit Executive"],
            keyIssues: ["Affordable Housing", "Public Safety", "MARTA", "Small Business Support"],
            endorsements: ["Atlanta Democratic Party"],
            fundraising: { totalRaised: "$130K", lastQuarter: "$31K" },
            bio: "Alex Wan is a veteran Atlanta City Council member focused on affordable housing, neighborhood safety, and transit-oriented development.",
            politicalScore: -50,
            positions: [
              { issue: "Affordable Housing", stance: "Supportive", description: "Supports inclusionary zoning and city investments in affordable units." },
              { issue: "MARTA", stance: "Supportive", description: "Advocates for transit-oriented development around MARTA stations." },
            ],
            socialMedia: { twitter: "https://twitter.com/AlexWanATL" },
            contactInfo: { email: "info@alexwanatl.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Soil & Water Conservation District Supervisor",
        description: "Non-partisan seat overseeing land and water resource conservation in Fulton County",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Karen Spears",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Soil & Water Supervisor (2018-present)", "Environmental Scientist", "Watershed Restoration Expert"],
            keyIssues: ["Watershed Protection", "Urban Farming", "Stormwater Management", "Tree Canopy"],
            endorsements: [],
            fundraising: { totalRaised: "$12K", lastQuarter: "$3K" },
            bio: "Karen Spears oversees conservation programs for Fulton County, including watershed protection and urban green infrastructure.",
            politicalScore: 0,
            positions: [
              { issue: "Stormwater", stance: "Supportive", description: "Managing urban runoff through green infrastructure to protect Atlanta's waterways." },
              { issue: "Tree Canopy", stance: "Progressive", description: "Expanding Fulton County's urban tree canopy to reduce heat islands." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@spearsforsw.com" },
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

  // ── SANDY SPRINGS / NORTH FULTON ─────────────────────────────────────────
  "30328": {
    location: "Sandy Springs, GA 30328",
    district: {
      congressional: "GA-6",
      state: "House District 48, Senate District 56",
      local: "Sandy Springs City Council Post 4",
    },
    representatives: {
      congress: {
        name: "Rich McCormick",
        party: "Republican" as const,
        office: "U.S. House of Representatives",
        district: "Georgia's 6th Congressional District",
        photo: "/placeholder.svg?height=128&width=128",
        coverPhoto: "/placeholder.svg?height=128&width=400",
        politicalScore: 75,
        yearsInOffice: 4,
        contact: {
          phone: "(202) 225-4272",
          email: "rep.mccormick@mail.house.gov",
          website: "https://mccormick.house.gov",
          twitter: "https://twitter.com/RepMcCormick",
          facebook: "https://facebook.com/RepRichMcCormick",
        },
        biography: {
          age: 57,
          hometown: "Suwanee, GA",
          education: ["U.S. Naval Academy", "Medical College of Georgia - M.D."],
          previousJobs: ["Emergency Room Physician", "U.S. Marine Corps Pilot", "U.S. Navy Flight Surgeon"],
          committees: ["House Committee on Armed Services", "House Committee on Science, Space, and Technology"],
          keyIssues: ["Border Security", "Fiscal Responsibility", "Veterans Affairs", "Energy Independence", "National Defense"],
        },
        votingRecord: {
          totalVotes: 612,
          partyLineVoting: 92,
          keyVotes: [
            { bill: "Laken Riley Act", vote: "Yes" as const, description: "Mandated detention of undocumented immigrants charged with certain crimes", date: "January 22, 2025" },
            { bill: "Speaker Mike Johnson", vote: "Yes" as const, description: "Voted to re-elect Mike Johnson as Speaker of the House", date: "January 3, 2025" },
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
          contact: { phone: "(202) 224-3643", website: "https://warnock.senate.gov", twitter: "https://twitter.com/SenatorWarnock" },
          biography: {
            age: 55,
            hometown: "Savannah, GA",
            education: ["Morehouse College - B.A.", "Union Theological Seminary - M.Div., Ph.D."],
            previousJobs: ["Senior Pastor, Ebenezer Baptist Church", "Civil Rights Advocate"],
            committees: ["Committee on Agriculture", "Committee on Banking", "Committee on Commerce"],
            keyIssues: ["Healthcare Access", "Voting Rights", "Economic Justice", "Rural Development"],
          },
          votingRecord: { totalVotes: 456, partyLineVoting: 91, keyVotes: [] },
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
          contact: { phone: "(202) 224-3521", website: "https://ossoff.senate.gov", twitter: "https://twitter.com/SenOssoff" },
          biography: {
            age: 37,
            hometown: "Atlanta, GA",
            education: ["Georgetown University - B.S.", "London School of Economics - M.Sc."],
            previousJobs: ["Investigative Journalist", "Documentary Filmmaker"],
            committees: ["Committee on Homeland Security", "Committee on the Judiciary"],
            keyIssues: ["Government Accountability", "Criminal Justice Reform", "Healthcare", "Technology Policy"],
          },
          votingRecord: { totalVotes: 456, partyLineVoting: 89, keyVotes: [] },
        },
      ],
    },
    upcomingElections: [
      {
        date: "May 19, 2026",
        type: "Primary Election" as const,
        office: "Georgia Governor - Republican Primary",
        description: "Republican primary for Georgia Governor (Gov. Brian Kemp is term-limited)",
        registrationDeadline: "April 20, 2026",
        earlyVotingStart: "April 27, 2026",
        earlyVotingEnd: "May 15, 2026",
        candidates: [
          {
            name: "Brian Jack",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://brianjack.com",
            experience: ["U.S. Representative, GA-4 (2023-present)", "Former Trump White House Political Director"],
            keyIssues: ["Border Security", "Economic Growth", "Education Freedom", "America First"],
            endorsements: ["President Donald Trump"],
            fundraising: { totalRaised: "$4.1M", lastQuarter: "$1.2M" },
            bio: "Brian Jack is a U.S. Congressman and former Trump White House Political Director running for Governor with President Trump's endorsement. He focuses on border security, economic growth, and school choice.",
            age: 38,
            education: ["Clemson University"],
            hometown: "McDonough, Georgia",
            politicalScore: 82,
            positions: [
              { issue: "Border Security", stance: "Conservative", description: "Supports strict border enforcement and deportation of undocumented immigrants." },
              { issue: "School Choice", stance: "Supportive", description: "Advocates for expanding education savings accounts and charter schools." },
            ],
            socialMedia: { twitter: "https://twitter.com/RepBrianJack" },
            contactInfo: { email: "info@brianjackforgovernor.com" },
          },
          {
            name: "John King",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Georgia Insurance Commissioner (2019-present)", "Former Army Ranger"],
            keyIssues: ["Consumer Protection", "Insurance Reform", "Veteran Support", "Fiscal Responsibility"],
            endorsements: [],
            fundraising: { totalRaised: "$2.3M", lastQuarter: "$680K" },
            bio: "Georgia Insurance Commissioner John King is an Army Ranger veteran running for Governor focused on protecting consumers, fiscal responsibility, and supporting Georgia's veterans.",
            age: 52,
            education: ["United States Military Academy (West Point)"],
            hometown: "Woodstock, Georgia",
            politicalScore: 65,
            positions: [
              { issue: "Insurance Reform", stance: "Conservative", description: "Wants to lower insurance costs and protect Georgians from fraud." },
              { issue: "Veterans", stance: "Supportive", description: "Committed to expanding services and job opportunities for Georgia veterans." },
            ],
            socialMedia: { twitter: "https://twitter.com/GAInsComm" },
            contactInfo: { email: "info@johnkingforgovernor.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "U.S. Senate - Georgia",
        description: "U.S. Senate — Sen. Jon Ossoff (D) seeking re-election",
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
            experience: ["Current U.S. Senator (2021-present)", "Investigative Journalist", "CEO, Insight TWI"],
            keyIssues: ["Government Accountability", "Criminal Justice Reform", "Healthcare", "Technology Policy"],
            endorsements: ["Georgia Democratic Party"],
            fundraising: { totalRaised: "$8.5M", lastQuarter: "$2.3M" },
            bio: "Sen. Jon Ossoff is seeking re-election after serving since 2021. He is focused on government accountability, healthcare access, and technology policy.",
            age: 39,
            politicalScore: -65,
            positions: [
              { issue: "Government Accountability", stance: "Reform", description: "Champions transparency and oversight of federal spending." },
              { issue: "Healthcare", stance: "Progressive", description: "Supports expanding healthcare access for Georgians." },
            ],
            socialMedia: { twitter: "https://twitter.com/SenOssoff" },
            contactInfo: { email: "info@ossoffforgeorgia.com" },
          },
          {
            name: "Mike Collins",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://mikecollinsforsenate.com",
            experience: ["U.S. Representative, GA-10 (2023-present)", "Founder, Collins Trucking Co.", "Led passage of the Laken Riley Act"],
            keyIssues: ["Border Security", "Economic Growth", "America First Agenda", "Public Safety"],
            endorsements: ["Georgia Republican Party"],
            fundraising: { totalRaised: "$3.8M", lastQuarter: "$1.1M" },
            bio: "Rep. Mike Collins is running on an America First platform to unseat Jon Ossoff, citing border security and economic growth as top priorities.",
            age: 58,
            politicalScore: 78,
            positions: [
              { issue: "Border Security", stance: "Conservative", description: "Strong supporter of border enforcement and the Laken Riley Act." },
              { issue: "Economic Growth", stance: "Pro-Business", description: "Advocates for lower taxes and reduced regulations." },
            ],
            socialMedia: { twitter: "https://twitter.com/RepMikeCollins" },
            contactInfo: { email: "info@mikecollinsforsenate.com" },
          },
          {
            name: "Buddy Carter",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://buddycarter.com",
            experience: ["U.S. Representative, GA-1 (2015-present)", "Former Mayor of Pooler, GA", "Pharmacist & Business Owner"],
            keyIssues: ["Healthcare Costs", "Conservative Values", "Veterans Affairs", "Small Business"],
            endorsements: [],
            fundraising: { totalRaised: "$2.5M", lastQuarter: "$780K" },
            bio: "Rep. Buddy Carter, a pharmacist and former mayor, is focused on lowering healthcare costs and bringing conservative leadership to the Senate.",
            age: 69,
            politicalScore: 72,
            positions: [
              { issue: "Healthcare Costs", stance: "Market-Based", description: "Advocates for market-based solutions to lower prescription drug costs." },
            ],
            socialMedia: { twitter: "https://twitter.com/RepBuddyCarter" },
            contactInfo: { email: "info@buddycarterforsenate.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "U.S. House of Representatives - GA-6",
        description: "Congressional election for Georgia's 6th District — Rep. Rich McCormick (R) seeking re-election",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Rich McCormick",
            party: "Republican" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://mccormick.house.gov",
            experience: ["U.S. Representative, GA-6 (2023-present)", "Emergency Room Physician", "Marine Corps Pilot"],
            keyIssues: ["Border Security", "Fiscal Responsibility", "Veterans Affairs", "National Defense"],
            endorsements: ["Georgia Republican Party", "NRA"],
            fundraising: { totalRaised: "$3.2M", lastQuarter: "$820K" },
            bio: "Dr. Rich McCormick is a Marine veteran and ER physician serving GA-6. He focuses on border security, fiscal discipline, and strong national defense.",
            age: 57,
            politicalScore: 75,
            positions: [
              { issue: "Border Security", stance: "Conservative", description: "Supports strict border enforcement and reducing illegal immigration." },
              { issue: "National Defense", stance: "Hawkish", description: "Advocates for a strong military and veteran support programs." },
            ],
            socialMedia: { twitter: "https://twitter.com/RepMcCormick" },
            contactInfo: { email: "info@mccormickforcongress.com" },
          },
          {
            name: "TBD - Democratic Challenger",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Primary winner to be determined May 19, 2026"],
            keyIssues: ["Healthcare", "Economic Justice", "Education", "Climate"],
            endorsements: [],
            fundraising: { totalRaised: "TBD", lastQuarter: "TBD" },
            bio: "The Democratic nominee for GA-6 will be determined after the May 19, 2026 primary. Check back for candidate details.",
            politicalScore: -50,
            positions: [],
            socialMedia: {},
            contactInfo: {},
          },
        ],
      },
      // ── STATE RACES ──────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Georgia State Senate – District 56",
        description: "Georgia State Senate seat covering Sandy Springs and North Fulton County",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Kay Kirkpatrick",
            party: "Republican" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Georgia State Senator, District 56 (2017-present)", "Orthopedic Surgeon", "East Cobb Community Leader"],
            keyIssues: ["Healthcare", "Education", "Business Regulation", "Property Rights"],
            endorsements: ["Georgia Republican Party"],
            fundraising: { totalRaised: "$380K", lastQuarter: "$88K" },
            bio: "Sen. Kay Kirkpatrick is an orthopedic surgeon and longtime North Fulton legislator focusing on healthcare policy, education, and responsible governance.",
            age: 65,
            politicalScore: 55,
            positions: [
              { issue: "Healthcare", stance: "Market-Based", description: "Draws on her medical background to advocate for market-driven healthcare solutions." },
              { issue: "Education", stance: "Conservative", description: "Supports parental rights and school choice alongside traditional public schools." },
            ],
            socialMedia: { twitter: "https://twitter.com/KayKirkpatrickGA" },
            contactInfo: { email: "info@kirkpatrickforsenate.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Georgia State House – District 48",
        description: "Georgia House seat covering Sandy Springs and parts of North Atlanta",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Beth Moore",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Georgia State Representative, District 48 (2021-present)", "Former Sandy Springs City Council Member", "Nonprofit Executive"],
            keyIssues: ["Education Funding", "Womens Rights", "Gun Safety", "Ethics Reform"],
            endorsements: ["Georgia Democratic Party", "Moms Demand Action"],
            fundraising: { totalRaised: "$260K", lastQuarter: "$59K" },
            bio: "Rep. Beth Moore flipped District 48 in 2020 and has been a voice for education funding, women's healthcare, and gun safety legislation.",
            age: 58,
            politicalScore: -55,
            positions: [
              { issue: "Gun Safety", stance: "Progressive", description: "Supports universal background checks and red flag laws in Georgia." },
              { issue: "Women's Rights", stance: "Supportive", description: "Opposes Georgia's abortion restrictions and supports reproductive healthcare access." },
            ],
            socialMedia: { twitter: "https://twitter.com/BethMooreGA" },
            contactInfo: { email: "info@bethmooreforga.com" },
          },
        ],
      },
      // ── COUNTY RACES ─────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Commission – District 2",
        description: "Fulton County Board of Commissioners seat covering Sandy Springs and North Fulton",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Bob Ellis",
            party: "Republican" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Commissioner, District 2 (2019-present)", "Former Sandy Springs City Councilman", "Business Executive"],
            keyIssues: ["Fiscal Responsibility", "Public Safety", "Tax Reduction", "Government Efficiency"],
            endorsements: ["Fulton County Republican Party"],
            fundraising: { totalRaised: "$210K", lastQuarter: "$48K" },
            bio: "Commissioner Bob Ellis represents North Fulton on the county commission, focusing on keeping taxes low and improving county services for residents.",
            age: 61,
            politicalScore: 60,
            positions: [
              { issue: "Fiscal Responsibility", stance: "Conservative", description: "Fights to reduce the Fulton County millage rate and eliminate wasteful spending." },
              { issue: "Public Safety", stance: "Tough", description: "Supports increased law enforcement funding and jail accountability." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@bobellis.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Sheriff",
        description: "Fulton County Sheriff — county jail, courts, and law enforcement",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Patrick Labat",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Sheriff (2021-present)", "30+ years law enforcement", "Former ATF Agent"],
            keyIssues: ["Jail Reform", "Public Safety", "Community Policing", "Mental Health Diversion"],
            endorsements: ["Fulton County Democratic Party"],
            fundraising: { totalRaised: "$310K", lastQuarter: "$72K" },
            bio: "Sheriff Patrick Labat oversees the Fulton County jail and has pushed for mental health diversion programs and community policing.",
            age: 56,
            politicalScore: -30,
            positions: [
              { issue: "Jail Reform", stance: "Moderate", description: "Working to reduce overcrowding and expand mental health services." },
            ],
            socialMedia: { twitter: "https://twitter.com/SheriffLabat" },
            contactInfo: { email: "info@labatforsheriff.com" },
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County District Attorney",
        description: "Fulton County District Attorney — chief prosecutor for Fulton County",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Christian Wise Smith",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Chief Deputy DA, Fulton County", "Senior Prosecutor", "Homicide Division Lead"],
            keyIssues: ["Public Safety", "Violent Crime Prosecution", "Victim Services", "Accountability"],
            endorsements: [],
            fundraising: { totalRaised: "$220K", lastQuarter: "$58K" },
            bio: "Career prosecutor running to lead the Fulton County DA's office with a focus on reducing violent crime and supporting victims.",
            age: 45,
            politicalScore: -20,
            positions: [
              { issue: "Violent Crime", stance: "Tough", description: "Prioritizes prosecution of violent and gun crimes affecting communities." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@wisesmithforDA.com" },
          },
        ],
      },
      // ── SCHOOL BOARD ─────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Board of Education – District 4",
        description: "Fulton County Schools Board seat covering Sandy Springs and North Fulton",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Julia Bernath",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Fulton County Schools Board (2008-present)", "Former PTA President", "Education Advocate"],
            keyIssues: ["Academic Excellence", "School Funding", "Mental Health Support", "Technology in Schools"],
            endorsements: [],
            fundraising: { totalRaised: "$78K", lastQuarter: "$18K" },
            bio: "Long-serving Fulton County school board member focused on academic achievement, mental health support, and technology in classrooms.",
            age: 62,
            politicalScore: -10,
            positions: [
              { issue: "Mental Health", stance: "Supportive", description: "Pushed to hire more school counselors and expand mental health resources." },
              { issue: "Technology", stance: "Progressive", description: "Supports 1:1 device programs and technology-integrated learning." },
            ],
            socialMedia: {},
            contactInfo: { email: "info@bernathforschools.com" },
          },
        ],
      },
      // ── LOCAL ─────────────────────────────────────────────────────────────────
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Sandy Springs City Council – Post 4",
        description: "Sandy Springs City Council seat — non-partisan local government",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Incumbent TBD",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Sandy Springs City Council (current term)"],
            keyIssues: ["City Services", "Roads & Infrastructure", "Parks", "Public Safety"],
            endorsements: [],
            fundraising: { totalRaised: "TBD", lastQuarter: "TBD" },
            bio: "Sandy Springs City Council races are non-partisan. Candidates for this seat will be confirmed closer to qualifying in 2026. Check sandyspringsga.gov for updates.",
            politicalScore: 0,
            positions: [],
            socialMedia: {},
            contactInfo: {},
          },
        ],
      },
      {
        date: "November 3, 2026",
        type: "General Election" as const,
        office: "Fulton County Soil & Water Conservation District Supervisor",
        description: "Non-partisan seat overseeing land and water resource conservation in Fulton County",
        registrationDeadline: "October 5, 2026",
        earlyVotingStart: "October 12, 2026",
        earlyVotingEnd: "October 30, 2026",
        candidates: [
          {
            name: "Karen Spears",
            party: "Independent" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Soil & Water Supervisor (2018-present)", "Environmental Scientist", "Watershed Restoration Expert"],
            keyIssues: ["Watershed Protection", "Urban Farming", "Stormwater Management", "Tree Canopy"],
            endorsements: [],
            fundraising: { totalRaised: "$12K", lastQuarter: "$3K" },
            bio: "Karen Spears oversees conservation programs for Fulton County including watershed protection and urban green infrastructure.",
            politicalScore: 0,
            positions: [
              { issue: "Stormwater", stance: "Supportive", description: "Managing urban runoff through green infrastructure to protect waterways." },
            ],
            socialMedia: {},
            contactInfo: {},
          },
        ],
      },
    ],
    pollingLocation: {
      name: "Sandy Springs City Hall",
      address: "1 Galambos Way, Sandy Springs, GA 30328",
      hours: "7:00 AM - 7:00 PM",
    },
  },
}

// Race level labels for grouping
const LEVEL_COLORS: Record<string, { label: string; color: string }> = {
  "Federal":      { label: "Federal",      color: "bg-[#1F3A93] text-white" },
  "State":        { label: "State",        color: "bg-[#27AE60] text-white" },
  "County":       { label: "County",       color: "bg-[#F39C12] text-white" },
  "School Board": { label: "School Board", color: "bg-[#8E44AD] text-white" },
  "Local":        { label: "Local",        color: "bg-[#D64541] text-white" },
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

  const ballotData = getBallotForZip(zipCode)
  const profileData = politicalData[zipCode as keyof typeof politicalData]

  const handleAddressUpdate = () => {
    const z = tempAddress.zip.trim()
    const result = getBallotForZip(z)
    if (result.found) {
      setZipCode(z)
      setAddress(tempAddress)
      setEditingAddress(false)
    } else {
      alert(`We don't have data for zip code ${z} yet. Visit mvp.sos.ga.gov to find your Georgia ballot information.`)
    }
  }

  const cancelEdit = () => {
    setTempAddress(address)
    setEditingAddress(false)
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

  if (!ballotData.found) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <MapPin className="w-8 h-8 text-[#1F3A93] mx-auto" />
          <p className="text-[#4A4A4A]">We don&apos;t have ballot data for zip code <strong>{zipCode}</strong> yet.</p>
          <a
            href={ballotData.sosLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#1F3A93] underline text-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Find your ballot on the Georgia Secretary of State website
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Address / Location Header */}
      <Card className="border-[#E5E5E5]">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#1F3A93]" />
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
              <Button size="sm" variant="outline" onClick={() => setEditingAddress(true)}>
                <Edit3 className="w-4 h-4 mr-1" />
                {address.street ? "Edit Address" : "Add Address"}
              </Button>
            )}
          </div>

          {editingAddress && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-[#4A4A4A] mb-1 block">Street Address</label>
                <Input
                  value={tempAddress.street}
                  onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                  placeholder="123 Peachtree St NW"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#4A4A4A] mb-1 block">City</label>
                  <Input
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                    placeholder="Atlanta"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#4A4A4A] mb-1 block">State</label>
                  <Input
                    value={tempAddress.state}
                    onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                    placeholder="GA"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-medium text-[#4A4A4A] mb-1 block">ZIP Code</label>
                  <Input
                    value={tempAddress.zip}
                    onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
                    placeholder="30309"
                    maxLength={5}
                  />
                </div>
              </div>
              <p className="text-xs text-[#4A4A4A]/60">
                Your zip code is used to show your specific ballot races across all 159 Georgia counties.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddressUpdate} className="bg-[#1F3A93] text-white hover:bg-[#1F3A93]/90">
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
              <div className="bg-[#1F3A93]/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#4A4A4A]/60 font-medium uppercase tracking-wide">Congressional</p>
                <p className="font-medium text-[#4A4A4A]">{ballotData.congressionalDistrict}</p>
              </div>
              <div className="bg-[#27AE60]/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#4A4A4A]/60 font-medium uppercase tracking-wide">County</p>
                <p className="font-medium text-[#4A4A4A]">{ballotData.county} County</p>
              </div>
              <div className="bg-[#D64541]/5 rounded-lg px-3 py-2">
                <p className="text-xs text-[#4A4A4A]/60 font-medium uppercase tracking-wide">State</p>
                <p className="font-medium text-[#4A4A4A]">Georgia</p>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Upcoming Elections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Your Full Ballot – 2026
          </CardTitle>
          <CardDescription>All races on your ballot from federal down to school board</CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: "Federal",      color: "bg-[#1F3A93] text-white" },
              { label: "State",        color: "bg-[#27AE60] text-white" },
              { label: "County",       color: "bg-[#F39C12] text-white" },
              { label: "School Board", color: "bg-[#8E44AD] text-white" },
              { label: "Local",        color: "bg-[#D64541] text-white" },
            ].map(({ label, color }) => (
              <span key={label} className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {ballotData.races.map((election, index) => {
            const levelInfo = LEVEL_COLORS[election.level] ?? { label: election.level, color: "bg-gray-500 text-white" }
            return (
            <div key={index} className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelInfo.color}`}>{levelInfo.label}</span>
                    <h3 className="font-semibold text-base">{election.office}</h3>
                  </div>
                  <p className="text-sm text-[#4A4A4A]/70">{election.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Election: {election.date}
                    </div>
                    <div>Reg. Deadline: {election.registrationDeadline}</div>
                    {election.earlyVotingStart && (
                      <div>Early Voting: {election.earlyVotingStart} – {election.earlyVotingEnd}</div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {election.type}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[#4A4A4A] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Candidates ({election.candidates.length})
                </h4>
                <div className="space-y-3">
                  {election.candidates.map((candidate) => renderCandidate(candidate as unknown as Candidate, election.office, election.date))}
                </div>
              </div>

              {index < ballotData.races.length - 1 && <Separator />}
            </div>
          )})}
        </CardContent>
      </Card>

      {/* Representative Profiles — only available for select zip codes */}
      {profileData && (
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
      )}

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
              <p className="font-medium text-[#4A4A4A]">{ballotData.pollingInfo}</p>
            )}
            <p className="text-sm text-[#4A4A4A]/70">Confirm your exact polling location before election day.</p>
            <a
              href={ballotData.sosLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#1F3A93] underline text-sm"
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
    </div>
  )
}
