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

// Enhanced political data with detailed election information
const politicalData = {
  "94102": {
    location: "San Francisco, CA",
    district: {
      congressional: "CA-11",
      state: "Assembly District 17, Senate District 11",
      local: "District 5",
    },
    representatives: {
      congress: {
        name: "Nancy Pelosi",
        party: "Democrat" as const,
        office: "U.S. House of Representatives",
        district: "California's 11th Congressional District",
        photo: "/placeholder.svg?height=128&width=128",
        coverPhoto: "/placeholder.svg?height=128&width=400",
        politicalScore: -75,
        yearsInOffice: 37,
        contact: {
          phone: "(202) 225-4965",
          email: "sf.nancy@mail.house.gov",
          website: "https://pelosi.house.gov",
          twitter: "https://twitter.com/SpeakerPelosi",
          facebook: "https://facebook.com/NancyPelosi",
        },
        biography: {
          age: 83,
          hometown: "San Francisco, CA",
          education: [
            "Trinity College, Washington D.C. - B.A. Political Science",
            "Honorary Doctorates from multiple universities",
          ],
          previousJobs: [
            "Democratic Party organizer",
            "Chair of California Democratic Party",
            "Speaker of the House (2007-2011, 2019-2023)",
          ],
          committees: ["House Democratic Steering Committee", "House Democratic Policy Committee"],
          keyIssues: [
            "Healthcare Reform",
            "Climate Change",
            "Women's Rights",
            "Economic Justice",
            "Immigration Reform",
          ],
        },
        votingRecord: {
          totalVotes: 1247,
          partyLineVoting: 95,
          keyVotes: [
            {
              bill: "Infrastructure Investment Act",
              vote: "Yes" as const,
              description: "Bipartisan infrastructure bill for roads, bridges, and broadband",
              date: "November 5, 2021",
            },
            {
              bill: "Build Back Better Act",
              vote: "Yes" as const,
              description: "Social spending and climate change legislation",
              date: "November 19, 2021",
            },
            {
              bill: "CHIPS and Science Act",
              vote: "Yes" as const,
              description: "Semiconductor manufacturing and research funding",
              date: "July 28, 2022",
            },
          ],
        },
      },
      senate: [
        {
          name: "Alex Padilla",
          party: "Democrat" as const,
          office: "U.S. Senate",
          district: "California",
          photo: "/placeholder.svg?height=128&width=128",
          coverPhoto: "/placeholder.svg?height=128&width=400",
          politicalScore: -65,
          yearsInOffice: 3,
          contact: {
            phone: "(202) 224-3553",
            email: "senator@padilla.senate.gov",
            website: "https://padilla.senate.gov",
            twitter: "https://twitter.com/SenAlexPadilla",
          },
          biography: {
            age: 50,
            hometown: "Los Angeles, CA",
            education: ["MIT - B.S. Mechanical Engineering", "UCLA - Public Policy Certificate"],
            previousJobs: ["California Secretary of State", "Los Angeles City Council", "California State Senate"],
            committees: [
              "Committee on Environment and Public Works",
              "Committee on Homeland Security",
              "Committee on the Judiciary",
            ],
            keyIssues: ["Voting Rights", "Immigration", "Climate Action", "Technology Policy", "Infrastructure"],
          },
          votingRecord: {
            totalVotes: 456,
            partyLineVoting: 92,
            keyVotes: [
              {
                bill: "John Lewis Voting Rights Act",
                vote: "Yes" as const,
                description: "Restoration of voting rights protections",
                date: "August 24, 2021",
              },
              {
                bill: "Inflation Reduction Act",
                vote: "Yes" as const,
                description: "Climate and healthcare legislation",
                date: "August 7, 2022",
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
        office: "U.S. House of Representatives - CA-11",
        description: "Congressional election for California's 11th District",
        registrationDeadline: "October 21, 2024",
        earlyVotingStart: "October 7, 2024",
        earlyVotingEnd: "November 4, 2024",
        candidates: [
          {
            name: "Nancy Pelosi",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://pelosi.house.gov",
            experience: [
              "Current U.S. Representative (1987-present)",
              "Former Speaker of the House",
              "House Democratic Leader",
            ],
            keyIssues: ["Healthcare Access", "Climate Action", "Economic Equality", "Women's Rights"],
            endorsements: ["California Democratic Party", "AFL-CIO", "Sierra Club", "Planned Parenthood"],
            fundraising: {
              totalRaised: "$2.1M",
              lastQuarter: "$485K",
            },
            bio: "Nancy Pelosi has represented San Francisco in Congress since 1987 and made history as the first woman to serve as Speaker of the House. Throughout her career, she has been a champion for healthcare reform, environmental protection, and economic opportunity for working families.",
            age: 83,
            education: ["Trinity College, Washington D.C. - B.A. Political Science"],
            hometown: "Baltimore, Maryland",
            family: "Married to Paul Pelosi with 5 children and 9 grandchildren",
            positions: [
              {
                issue: "Healthcare",
                stance: "Supportive",
                description:
                  "Strong advocate for the Affordable Care Act and expanding healthcare access. Supports lowering prescription drug costs and protecting coverage for pre-existing conditions.",
              },
              {
                issue: "Climate Change",
                stance: "Supportive",
                description:
                  "Champion of climate legislation including the Climate Action Now Act. Supports rejoining the Paris Climate Agreement and investing in clean energy infrastructure.",
              },
              {
                issue: "Economic Policy",
                stance: "Progressive",
                description:
                  "Advocates for raising the minimum wage, paid family leave, and closing the gender pay gap. Supports progressive taxation and infrastructure investment to create jobs.",
              },
            ],
            votingRecord: [
              {
                bill: "American Rescue Plan Act",
                vote: "Yes",
                date: "March 10, 2021",
                description: "COVID-19 relief package providing economic stimulus",
              },
              {
                bill: "Infrastructure Investment and Jobs Act",
                vote: "Yes",
                date: "November 5, 2021",
                description: "Bipartisan infrastructure bill for roads, bridges, and broadband",
              },
              {
                bill: "Inflation Reduction Act",
                vote: "Yes",
                date: "August 12, 2022",
                description: "Climate, healthcare, and tax legislation",
              },
            ],
            endorsementDetails: [
              {
                organization: "California Democratic Party",
                type: "Party",
                quote: "Speaker Pelosi continues to be a tireless advocate for California values.",
              },
              {
                organization: "Sierra Club",
                type: "Environmental",
                quote: "A champion for climate action and environmental protection.",
              },
              {
                organization: "Planned Parenthood",
                type: "Healthcare",
                quote: "Unwavering defender of reproductive rights and healthcare access.",
              },
            ],
            campaignFinance: {
              totalRaised: "$2,100,000",
              totalSpent: "$1,450,000",
              cashOnHand: "$650,000",
              averageDonation: "$175",
              smallDonorPercentage: "42%",
              topIndustries: [
                { name: "Healthcare Professionals", amount: "$285,000" },
                { name: "Education", amount: "$210,000" },
                { name: "Technology", amount: "$195,000" },
                { name: "Labor Unions", amount: "$175,000" },
              ],
            },
            socialMedia: {
              twitter: "https://twitter.com/SpeakerPelosi",
              facebook: "https://facebook.com/NancyPelosi",
              instagram: "https://instagram.com/speakerpelosi",
            },
            contactInfo: {
              email: "campaign@pelosiforcongress.org",
              phone: "(415) 555-0123",
              campaignOffice: "1234 Market St, San Francisco, CA 94102",
            },
            events: [
              {
                name: "Town Hall Meeting",
                date: "August 15, 2024",
                location: "San Francisco City College",
                description: "Discussion on healthcare and economic issues facing the district",
              },
              {
                name: "Climate Action Rally",
                date: "September 3, 2024",
                location: "Golden Gate Park",
                description: "Join Speaker Pelosi and environmental advocates to discuss climate policy",
              },
            ],
          },
          {
            name: "John Martinez",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://martinez2024.com",
            experience: ["Small Business Owner", "San Francisco Planning Commission", "Navy Veteran"],
            keyIssues: ["Fiscal Responsibility", "Public Safety", "Small Business Support", "Veterans Affairs"],
            endorsements: ["California Republican Party", "Small Business Association"],
            fundraising: {
              totalRaised: "$340K",
              lastQuarter: "$95K",
            },
            bio: "John Martinez is a small business owner, Navy veteran, and former member of the San Francisco Planning Commission. He is running to bring fiscal responsibility, support for small businesses, and improved public safety to California's 11th District.",
            age: 45,
            education: ["U.S. Naval Academy - B.S. Engineering", "Stanford University - MBA"],
            hometown: "San Francisco, California",
            family: "Married with 2 children",
            positions: [
              {
                issue: "Economy",
                stance: "Conservative",
                description:
                  "Advocates for lower taxes on small businesses, reduced regulations, and fiscal responsibility. Supports balanced budget initiatives and reducing government spending.",
              },
              {
                issue: "Public Safety",
                stance: "Supportive",
                description:
                  "Prioritizes increased funding for law enforcement, addressing homelessness through both services and enforcement, and tougher penalties for repeat offenders.",
              },
              {
                issue: "Veterans Affairs",
                stance: "Supportive",
                description:
                  "Advocates for improved VA healthcare services, better transition programs for veterans entering civilian life, and increased mental health resources for veterans.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/martinez2024",
              facebook: "https://facebook.com/martinez2024",
            },
            contactInfo: {
              email: "info@martinez2024.com",
              phone: "(415) 555-0456",
              campaignOffice: "5678 Mission St, San Francisco, CA 94102",
            },
            events: [
              {
                name: "Small Business Roundtable",
                date: "August 20, 2024",
                location: "Chamber of Commerce",
                description: "Discussion with local business owners about economic challenges",
              },
            ],
          },
          {
            name: "Sarah Chen",
            party: "Independent" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Environmental Lawyer", "City Council Member", "Community Organizer"],
            keyIssues: ["Environmental Justice", "Government Reform", "Housing Affordability", "Transportation"],
            endorsements: ["Green Party of California", "League of Conservation Voters"],
            fundraising: {
              totalRaised: "$125K",
              lastQuarter: "$32K",
            },
            bio: "Sarah Chen is an environmental lawyer, former city council member, and community organizer. She is running as an independent to bring fresh perspectives on environmental justice, government reform, and affordable housing to Congress.",
            age: 38,
            education: ["UC Berkeley - B.A. Environmental Studies", "UC Hastings - J.D. Environmental Law"],
            hometown: "Oakland, California",
            family: "Single",
            positions: [
              {
                issue: "Environment",
                stance: "Progressive",
                description:
                  "Advocates for aggressive climate action, environmental justice for disadvantaged communities, and transitioning to 100% renewable energy by 2035.",
              },
              {
                issue: "Housing",
                stance: "Progressive",
                description:
                  "Supports rent control, increased affordable housing requirements for developers, and federal funding for public housing and first-time homebuyer assistance.",
              },
              {
                issue: "Government Reform",
                stance: "Reformist",
                description:
                  "Advocates for campaign finance reform, ranked choice voting, and increased transparency in government. Refuses corporate PAC donations.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/sarahchen2024",
              instagram: "https://instagram.com/sarahchenforchange",
            },
            contactInfo: {
              email: "info@sarahchenforcongress.org",
              phone: "(415) 555-0789",
            },
          },
        ],
      },
      {
        date: "November 5, 2024",
        type: "General Election" as const,
        office: "U.S. Senate - California",
        description: "U.S. Senate election for California",
        registrationDeadline: "October 21, 2024",
        earlyVotingStart: "October 7, 2024",
        earlyVotingEnd: "November 4, 2024",
        candidates: [
          {
            name: "Alex Padilla",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://padilla.senate.gov",
            experience: ["Current U.S. Senator (2021-present)", "Former California Secretary of State"],
            keyIssues: ["Voting Rights", "Immigration Reform", "Climate Change", "Technology Policy"],
            endorsements: ["California Democratic Party", "SEIU", "California Teachers Association"],
            fundraising: {
              totalRaised: "$4.2M",
              lastQuarter: "$1.1M",
            },
            bio: "Alex Padilla was appointed to the U.S. Senate in January 2021 to fill the vacancy created by Kamala Harris becoming Vice President. Prior to his appointment, he served as California's Secretary of State and has been a champion for voting rights, immigration reform, and climate action.",
            age: 51,
            education: ["Massachusetts Institute of Technology - B.S. Mechanical Engineering"],
            hometown: "Pacoima, California",
            family: "Married with three sons",
            positions: [
              {
                issue: "Voting Rights",
                stance: "Supportive",
                description:
                  "Champion of the Freedom to Vote Act and John Lewis Voting Rights Advancement Act. Advocates for automatic voter registration and expanded early voting access.",
              },
              {
                issue: "Immigration",
                stance: "Supportive",
                description:
                  "Supports comprehensive immigration reform with a pathway to citizenship for Dreamers and undocumented immigrants. Advocates for modernizing the immigration system.",
              },
              {
                issue: "Climate Change",
                stance: "Supportive",
                description:
                  "Supports the Green New Deal framework and investments in clean energy infrastructure. Advocates for environmental justice and reducing pollution in disadvantaged communities.",
              },
            ],
            votingRecord: [
              {
                bill: "American Rescue Plan Act",
                vote: "Yes",
                date: "March 6, 2021",
                description: "COVID-19 relief and economic stimulus",
              },
              {
                bill: "Infrastructure Investment and Jobs Act",
                vote: "Yes",
                date: "August 10, 2021",
                description: "Bipartisan infrastructure legislation",
              },
              {
                bill: "Inflation Reduction Act",
                vote: "Yes",
                date: "August 7, 2022",
                description: "Climate and healthcare legislation",
              },
            ],
            endorsementDetails: [
              {
                organization: "California Democratic Party",
                type: "Party",
                quote: "Senator Padilla has been a tireless advocate for California values.",
              },
              {
                organization: "SEIU",
                type: "Labor",
                quote: "A champion for working families and economic justice.",
              },
              {
                organization: "California Teachers Association",
                type: "Education",
                quote: "Committed to strengthening public education and supporting teachers.",
              },
            ],
            campaignFinance: {
              totalRaised: "$4,200,000",
              totalSpent: "$2,800,000",
              cashOnHand: "$1,400,000",
              averageDonation: "$85",
              smallDonorPercentage: "58%",
              topIndustries: [
                { name: "Technology", amount: "$650,000" },
                { name: "Labor Unions", amount: "$580,000" },
                { name: "Education", amount: "$425,000" },
                { name: "Healthcare", amount: "$390,000" },
              ],
            },
            socialMedia: {
              twitter: "https://twitter.com/SenAlexPadilla",
              facebook: "https://facebook.com/SenAlexPadilla",
              instagram: "https://instagram.com/senalexpadilla",
            },
            contactInfo: {
              email: "info@padilla2024.com",
              phone: "(213) 555-0123",
              campaignOffice: "5678 Wilshire Blvd, Los Angeles, CA 90036",
            },
            events: [
              {
                name: "Latino Community Town Hall",
                date: "September 15, 2024",
                location: "East Los Angeles College",
                description: "Discussion on immigration reform and community issues",
              },
              {
                name: "Climate Action Forum",
                date: "October 1, 2024",
                location: "UC Berkeley",
                description: "Panel discussion on climate policy and environmental justice",
              },
            ],
          },
          {
            name: "Steve Garvey",
            party: "Republican" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Former MLB Player", "Business Executive", "Community Leader"],
            keyIssues: ["Border Security", "Economic Growth", "Public Safety", "Education"],
            endorsements: ["California Republican Party"],
            fundraising: {
              totalRaised: "$1.8M",
              lastQuarter: "$425K",
            },
            bio: "Steve Garvey is a former Major League Baseball player who spent 14 seasons with the Los Angeles Dodgers and 5 seasons with the San Diego Padres. After his baseball career, he became a successful business executive and community leader. He is running to bring new leadership to California.",
            age: 75,
            education: ["Michigan State University - B.A. Business Administration"],
            hometown: "Tampa, Florida",
            family: "Married with children",
            positions: [
              {
                issue: "Economy",
                stance: "Conservative",
                description:
                  "Advocates for lower taxes, reduced regulations on businesses, and fiscal responsibility. Supports energy independence and domestic manufacturing.",
              },
              {
                issue: "Border Security",
                stance: "Strict",
                description:
                  "Supports strengthening border security, completing the border wall, and reforming the immigration system to prioritize legal immigration.",
              },
              {
                issue: "Public Safety",
                stance: "Supportive",
                description:
                  "Advocates for supporting law enforcement, addressing crime and homelessness, and tougher penalties for violent offenders.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/stevegarvey2024",
              facebook: "https://facebook.com/stevegarvey2024",
            },
            contactInfo: {
              email: "info@garveyforsenate.com",
              phone: "(619) 555-0456",
              campaignOffice: "1234 Broadway, San Diego, CA 92101",
            },
          },
        ],
      },
      {
        date: "March 5, 2024",
        type: "Primary Election" as const,
        office: "California State Assembly - District 17",
        description: "Primary election for State Assembly District 17",
        registrationDeadline: "February 20, 2024",
        candidates: [
          {
            name: "David Chiu",
            party: "Democrat" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Current Assembly Member", "Former SF Board President"],
            keyIssues: ["Housing", "Transportation", "Small Business"],
            endorsements: ["California Democratic Party"],
            fundraising: {
              totalRaised: "$285K",
              lastQuarter: "$67K",
            },
            bio: "David Chiu has served in the California State Assembly since 2014, representing the 17th Assembly District which encompasses eastern San Francisco. Prior to his election to the Assembly, he was the President of the San Francisco Board of Supervisors.",
            age: 54,
            education: ["Harvard University - B.A. Government", "Harvard Law School - J.D."],
            hometown: "Boston, Massachusetts",
            family: "Married with one child",
            positions: [
              {
                issue: "Housing",
                stance: "Progressive",
                description:
                  "Author of numerous housing bills to protect tenants, fund affordable housing, and address homelessness. Supports rent control and tenant protections.",
              },
              {
                issue: "Transportation",
                stance: "Progressive",
                description:
                  "Advocates for expanded public transit funding, bicycle and pedestrian infrastructure, and reduced car dependency in urban areas.",
              },
              {
                issue: "Small Business",
                stance: "Supportive",
                description:
                  "Supports grants and loans for small businesses, streamlined permitting processes, and programs to fill vacant storefronts.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/DavidChiu",
              facebook: "https://facebook.com/DavidChiu",
            },
            contactInfo: {
              email: "info@davidchiu.com",
              phone: "(415) 555-0123",
              campaignOffice: "1234 Market St, San Francisco, CA 94102",
            },
          },
        ],
      },
    ],
    pollingLocation: {
      name: "City Hall",
      address: "1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102",
      hours: "7:00 AM - 8:00 PM",
    },
  },
  "78701": {
    location: "Austin, TX",
    district: {
      congressional: "TX-25",
      state: "House District 49, Senate District 14",
      local: "District 9",
    },
    representatives: {
      congress: {
        name: "Roger Williams",
        party: "Republican" as const,
        office: "U.S. House of Representatives",
        district: "Texas's 25th Congressional District",
        photo: "/placeholder.svg?height=128&width=128",
        coverPhoto: "/placeholder.svg?height=128&width=400",
        politicalScore: 68,
        yearsInOffice: 11,
        contact: {
          phone: "(202) 225-9896",
          email: "roger.williams@mail.house.gov",
          website: "https://williams.house.gov",
          twitter: "https://twitter.com/RepRWilliams",
        },
        biography: {
          age: 74,
          hometown: "Austin, TX",
          education: ["Texas Christian University - B.S. Business"],
          previousJobs: [
            "Texas Secretary of State",
            "Small Business Owner",
            "Professional Baseball Player (Texas Rangers)",
          ],
          committees: ["House Committee on Financial Services", "House Committee on Small Business"],
          keyIssues: [
            "Small Business",
            "Financial Services",
            "Border Security",
            "Second Amendment",
            "Energy Independence",
          ],
        },
        votingRecord: {
          totalVotes: 892,
          partyLineVoting: 89,
          keyVotes: [
            {
              bill: "Tax Cuts and Jobs Act",
              vote: "Yes" as const,
              description: "Comprehensive tax reform legislation",
              date: "December 19, 2017",
            },
            {
              bill: "First Step Act",
              vote: "Yes" as const,
              description: "Criminal justice reform legislation",
              date: "December 20, 2018",
            },
          ],
        },
      },
      senate: [
        {
          name: "Ted Cruz",
          party: "Republican" as const,
          office: "U.S. Senate",
          district: "Texas",
          photo: "/placeholder.svg?height=128&width=128",
          coverPhoto: "/placeholder.svg?height=128&width=400",
          politicalScore: 82,
          yearsInOffice: 11,
          contact: {
            phone: "(202) 224-5922",
            email: "senator_cruz@cruz.senate.gov",
            website: "https://cruz.senate.gov",
            twitter: "https://twitter.com/SenTedCruz",
          },
          biography: {
            age: 53,
            hometown: "Houston, TX",
            education: ["Princeton University - B.A. Public Policy", "Harvard Law School - J.D."],
            previousJobs: ["Texas Solicitor General", "Supreme Court Clerk", "Private Practice Attorney"],
            committees: [
              "Committee on the Judiciary",
              "Committee on Commerce, Science, and Transportation",
              "Committee on Foreign Relations",
            ],
            keyIssues: [
              "Constitutional Rights",
              "Border Security",
              "Energy",
              "Religious Liberty",
              "Free Market Economics",
            ],
          },
          votingRecord: {
            totalVotes: 1156,
            partyLineVoting: 85,
            keyVotes: [
              {
                bill: "American Rescue Plan Act",
                vote: "No" as const,
                description: "COVID-19 relief and economic stimulus",
                date: "March 6, 2021",
              },
              {
                bill: "Infrastructure Investment Act",
                vote: "No" as const,
                description: "Bipartisan infrastructure legislation",
                date: "August 10, 2021",
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
        office: "U.S. House of Representatives - TX-25",
        description: "Congressional election for Texas's 25th District",
        registrationDeadline: "October 7, 2024",
        earlyVotingStart: "October 21, 2024",
        earlyVotingEnd: "November 1, 2024",
        candidates: [
          {
            name: "Roger Williams",
            party: "Republican" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://williams.house.gov",
            experience: ["Current U.S. Representative", "Former Texas Secretary of State", "Small Business Owner"],
            keyIssues: ["Small Business Growth", "Border Security", "Energy Independence", "Second Amendment"],
            endorsements: ["Texas Republican Party", "NFIB", "NRA"],
            fundraising: {
              totalRaised: "$1.2M",
              lastQuarter: "$285K",
            },
            bio: "Roger Williams has represented Texas's 25th Congressional District since 2013. He is a former Secretary of State of Texas and a successful small business owner. Before entering politics, he played professional baseball in the Atlanta Braves farm system.",
            age: 74,
            education: ["Texas Christian University - B.S. Business"],
            hometown: "Fort Worth, Texas",
            family: "Married with two children",
            positions: [
              {
                issue: "Economy",
                stance: "Conservative",
                description:
                  "Advocates for lower taxes, reduced regulations, and support for small businesses. Authored legislation to provide tax relief for small business owners.",
              },
              {
                issue: "Border Security",
                stance: "Strict",
                description:
                  "Supports completing the border wall, increasing Border Patrol resources, and stricter immigration enforcement.",
              },
              {
                issue: "Energy",
                stance: "Pro-development",
                description:
                  "Supports expanded domestic oil and gas production, reduced regulations on energy companies, and energy independence.",
              },
            ],
            votingRecord: [
              {
                bill: "Tax Cuts and Jobs Act",
                vote: "Yes",
                date: "December 19, 2017",
                description: "Comprehensive tax reform legislation",
              },
              {
                bill: "American Rescue Plan Act",
                vote: "No",
                date: "March 10, 2021",
                description: "COVID-19 relief package",
              },
              {
                bill: "Infrastructure Investment and Jobs Act",
                vote: "No",
                date: "November 5, 2021",
                description: "Bipartisan infrastructure bill",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/RepRWilliams",
              facebook: "https://facebook.com/RepRogerWilliams",
            },
            contactInfo: {
              email: "info@rogerwilliamsforcongress.com",
              phone: "(512) 555-0123",
              campaignOffice: "1234 Congress Ave, Austin, TX 78701",
            },
          },
          {
            name: "Julie Oliver",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Healthcare Policy Advocate", "Former Congressional Candidate", "Community Organizer"],
            keyIssues: ["Healthcare Access", "Education Funding", "Climate Action", "Economic Opportunity"],
            endorsements: ["Texas Democratic Party", "Texas AFL-CIO"],
            fundraising: {
              totalRaised: "$675K",
              lastQuarter: "$145K",
            },
            bio: "Julie Oliver is a healthcare advocate and attorney who previously ran for Congress in 2020. She has worked in healthcare administration and policy for over 20 years and is focused on expanding healthcare access, improving education, and addressing climate change.",
            age: 50,
            education: ["University of Texas - B.A. Accounting", "University of Texas School of Law - J.D."],
            hometown: "Austin, Texas",
            family: "Married with four children",
            positions: [
              {
                issue: "Healthcare",
                stance: "Progressive",
                description:
                  "Supports Medicare for All, lowering prescription drug costs, and protecting coverage for pre-existing conditions.",
              },
              {
                issue: "Education",
                stance: "Progressive",
                description:
                  "Advocates for increased public education funding, student loan forgiveness, and making college more affordable.",
              },
              {
                issue: "Climate",
                stance: "Progressive",
                description:
                  "Supports the Green New Deal, transitioning to renewable energy, and creating clean energy jobs.",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/JulieForTX",
              facebook: "https://facebook.com/JulieForTX",
              instagram: "https://instagram.com/juliefortx",
            },
            contactInfo: {
              email: "info@juliefortexas.com",
              phone: "(512) 555-0456",
              campaignOffice: "5678 Lamar Blvd, Austin, TX 78752",
            },
            events: [
              {
                name: "Healthcare Town Hall",
                date: "September 10, 2024",
                location: "Austin Community College",
                description: "Discussion on healthcare access and affordability",
              },
            ],
          },
        ],
      },
      {
        date: "November 5, 2024",
        type: "General Election" as const,
        office: "U.S. Senate - Texas",
        description: "U.S. Senate election for Texas",
        registrationDeadline: "October 7, 2024",
        earlyVotingStart: "October 21, 2024",
        earlyVotingEnd: "November 1, 2024",
        candidates: [
          {
            name: "Ted Cruz",
            party: "Republican" as const,
            isIncumbent: true,
            photo: "/placeholder.svg?height=64&width=64",
            website: "https://cruz.senate.gov",
            experience: ["Current U.S. Senator", "Former Texas Solicitor General", "Constitutional Lawyer"],
            keyIssues: ["Constitutional Rights", "Border Security", "Energy Policy", "Religious Liberty"],
            endorsements: ["Texas Republican Party", "Texas Right to Life"],
            fundraising: {
              totalRaised: "$8.5M",
              lastQuarter: "$2.1M",
            },
            bio: "Ted Cruz has served as a U.S. Senator for Texas since 2013. Before his election to the Senate, he was the Solicitor General of Texas and a partner at a private law firm. He is known for his conservative positions on constitutional issues, border security, and energy policy.",
            age: 53,
            education: ["Princeton University - B.A. Public Policy", "Harvard Law School - J.D."],
            hometown: "Houston, Texas",
            family: "Married with two daughters",
            positions: [
              {
                issue: "Constitutional Rights",
                stance: "Conservative",
                description:
                  "Strong defender of the Second Amendment, religious liberty, and limited government. Opposes restrictions on free speech and supports originalist interpretation of the Constitution.",
              },
              {
                issue: "Border Security",
                stance: "Strict",
                description:
                  "Advocates for completing the border wall, increasing Border Patrol resources, and stricter immigration enforcement. Opposes amnesty for undocumented immigrants.",
              },
              {
                issue: "Energy",
                stance: "Pro-development",
                description:
                  "Supports expanded domestic oil and gas production, reduced regulations on energy companies, and energy independence. Opposes the Green New Deal and carbon taxes.",
              },
            ],
            votingRecord: [
              {
                bill: "American Rescue Plan Act",
                vote: "No",
                date: "March 6, 2021",
                description: "COVID-19 relief and economic stimulus",
              },
              {
                bill: "Infrastructure Investment and Jobs Act",
                vote: "No",
                date: "August 10, 2021",
                description: "Bipartisan infrastructure legislation",
              },
              {
                bill: "Inflation Reduction Act",
                vote: "No",
                date: "August 7, 2022",
                description: "Climate and healthcare legislation",
              },
            ],
            endorsementDetails: [
              {
                organization: "Texas Republican Party",
                type: "Party",
                quote: "Senator Cruz continues to be a strong voice for Texas values and conservative principles.",
              },
              {
                organization: "Texas Right to Life",
                type: "Issue Advocacy",
                quote: "A consistent champion for the unborn and pro-life policies.",
              },
              {
                organization: "NRA",
                type: "Second Amendment",
                quote: "Unwavering defender of Second Amendment rights.",
              },
            ],
            campaignFinance: {
              totalRaised: "$8,500,000",
              totalSpent: "$5,200,000",
              cashOnHand: "$3,300,000",
              averageDonation: "$65",
              smallDonorPercentage: "62%",
              topIndustries: [
                { name: "Oil & Gas", amount: "$950,000" },
                { name: "Finance/Insurance", amount: "$780,000" },
                { name: "Real Estate", amount: "$650,000" },
                { name: "Healthcare", amount: "$520,000" },
              ],
            },
            socialMedia: {
              twitter: "https://twitter.com/SenTedCruz",
              facebook: "https://facebook.com/SenatorTedCruz",
              instagram: "https://instagram.com/sentedcruz",
              youtube: "https://youtube.com/SenatorTedCruz",
            },
            contactInfo: {
              email: "info@tedcruz.org",
              phone: "(713) 555-0123",
              campaignOffice: "5678 Westheimer Rd, Houston, TX 77056",
            },
            events: [
              {
                name: "Energy Policy Town Hall",
                date: "September 20, 2024",
                location: "University of Houston",
                description: "Discussion on American energy independence and jobs",
              },
              {
                name: "Faith & Family Rally",
                date: "October 15, 2024",
                location: "First Baptist Church, Dallas",
                description: "Event focused on religious liberty and family values",
              },
            ],
          },
          {
            name: "Colin Allred",
            party: "Democrat" as const,
            isIncumbent: false,
            photo: "/placeholder.svg?height=64&width=64",
            experience: ["Current U.S. Representative", "Former NFL Player", "Civil Rights Lawyer"],
            keyIssues: ["Healthcare", "Voting Rights", "Economic Opportunity", "Public Safety"],
            endorsements: ["Texas Democratic Party", "Texas Teachers Association"],
            fundraising: {
              totalRaised: "$6.2M",
              lastQuarter: "$1.8M",
            },
            bio: "Colin Allred is currently serving as a U.S. Representative for Texas's 32nd congressional district. Before entering politics, he was an NFL linebacker for the Tennessee Titans and later a civil rights attorney. He is focused on healthcare access, voting rights, and economic opportunity.",
            age: 41,
            education: ["Baylor University - B.A. History", "UC Berkeley School of Law - J.D."],
            hometown: "Dallas, Texas",
            family: "Married with two young sons",
            positions: [
              {
                issue: "Healthcare",
                stance: "Progressive",
                description:
                  "Supports protecting and expanding the Affordable Care Act, lowering prescription drug costs, and expanding Medicaid in Texas.",
              },
              {
                issue: "Voting Rights",
                stance: "Progressive",
                description:
                  "Advocates for the John Lewis Voting Rights Act, automatic voter registration, and making Election Day a federal holiday.",
              },
              {
                issue: "Economy",
                stance: "Moderate Progressive",
                description:
                  "Supports raising the minimum wage, paid family leave, and investments in infrastructure and clean energy jobs.",
              },
            ],
            votingRecord: [
              {
                bill: "American Rescue Plan Act",
                vote: "Yes",
                date: "March 10, 2021",
                description: "COVID-19 relief package",
              },
              {
                bill: "Infrastructure Investment and Jobs Act",
                vote: "Yes",
                date: "November 5, 2021",
                description: "Bipartisan infrastructure bill",
              },
              {
                bill: "Inflation Reduction Act",
                vote: "Yes",
                date: "August 12, 2022",
                description: "Climate, healthcare, and tax legislation",
              },
            ],
            socialMedia: {
              twitter: "https://twitter.com/ColinAllredTX",
              facebook: "https://facebook.com/ColinAllredTX",
              instagram: "https://instagram.com/colinallredtx",
            },
            contactInfo: {
              email: "info@colinallred.com",
              phone: "(214) 555-0789",
              campaignOffice: "1234 Main St, Dallas, TX 75201",
            },
            events: [
              {
                name: "Healthcare Town Hall",
                date: "September 5, 2024",
                location: "Dallas Community College",
                description: "Discussion on healthcare access and affordability",
              },
              {
                name: "Veterans Roundtable",
                date: "September 25, 2024",
                location: "VFW Post 3377, Garland",
                description: "Meeting with veterans to discuss VA services and support",
              },
            ],
          },
        ],
      },
    ],
    pollingLocation: {
      name: "Austin Community College",
      address: "1212 Rio Grande St, Austin, TX 78701",
      hours: "7:00 AM - 7:00 PM",
    },
  },
}

interface PoliticalProfileProps {
  initialZipCode?: string
}

export function PoliticalProfile({ initialZipCode = "94102" }: PoliticalProfileProps) {
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
      alert("Sorry, we don't have data for that zip code yet. Try 94102 or 78701.")
    }
  }

  const cancelEdit = () => {
    setTempZipCode(zipCode)
    setEditingZip(false)
  }

  const getPartyColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Republican":
        return "bg-red-100 text-red-800 border-red-200"
      case "Independent":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Green":
        return "bg-green-100 text-green-800 border-green-200"
      case "Libertarian":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openCandidateProfile = (candidate: Candidate, office: string, electionDate: string) => {
    setSelectedCandidate({ candidate, office, electionDate })
  }

  const renderCandidate = (candidate: Candidate, office: string, electionDate: string) => (
    <Card
      key={candidate.name}
      className={`${candidate.isIncumbent ? "border-2 border-blue-400 bg-blue-50" : ""} hover:shadow-lg transition-shadow cursor-pointer`}
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
                <Badge variant="default" className="bg-blue-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Incumbent
                </Badge>
              )}
              <Badge variant="outline" className={getPartyColor(candidate.party)}>
                {candidate.party}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Experience</h5>
                <ul className="text-gray-600 space-y-1">
                  {candidate.experience.slice(0, 3).map((exp, i) => (
                    <li key={i}>• {exp}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Key Issues</h5>
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
            <h5 className="font-medium text-gray-700 mb-1">Fundraising</h5>
            <p className="text-gray-600">Total: {candidate.fundraising.totalRaised}</p>
            <p className="text-gray-600">Last Quarter: {candidate.fundraising.lastQuarter}</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Endorsements</h5>
            <div className="space-y-1">
              {candidate.endorsements.slice(0, 2).map((endorsement, i) => (
                <p key={i} className="text-gray-600 text-xs">
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
              <MapPin className="w-5 h-5 text-blue-600" />
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
          <CardDescription>Official candidates on your ballot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileData.upcomingElections.map((election, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{election.office}</h3>
                  <p className="text-gray-600">{election.description}</p>
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
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Current Representatives</h2>

          {/* House Representative */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">U.S. House of Representatives</h3>
            <RepresentativeProfile representative={profileData.representatives.congress} />
          </div>

          {/* Senate Representatives */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">U.S. Senate</h3>
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
            <p className="text-sm text-gray-600">{profileData.pollingLocation.address}</p>
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
