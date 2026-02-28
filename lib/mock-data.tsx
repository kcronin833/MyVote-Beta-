export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  location: string
  joinDate: string
  verified: boolean
  politicalLean: "left" | "center" | "right"
}

export interface Comment {
  id: string
  userId: string
  articleUrl: string
  articleTitle: string
  content: string
  mentions: string[] // usernames mentioned
  timestamp: string
  likes: number
  replies: Comment[]
  edited: boolean
}

export interface UserActivity {
  id: string
  type: "comment" | "like" | "share"
  userId: string
  articleUrl: string
  articleTitle: string
  content?: string
  timestamp: string
}

export interface Representative {
  id: string
  name: string
  position: string
  district: string
  party: string
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  bio: string
  issues: string[]
}

export interface Issue {
  id: string
  name: string
  description: string
  location: string
  status: "Proposed" | "In Progress" | "Completed" | "Stalled"
  priority: "High" | "Medium" | "Low"
  supporters: number
  opponents: number
  relatedRepresentatives: string[]
}

export const mockUsers: User[] = [
  {
    id: "1",
    username: "atlanta_sarah",
    displayName: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Political science student at Georgia State University. Passionate about civic engagement and Atlanta local politics.",
    location: "Atlanta, GA",
    joinDate: "2023-03-15",
    verified: true,
    politicalLean: "left",
  },
  {
    id: "2",
    username: "mike_atl",
    displayName: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Independent voter focused on facts and data-driven policy. Software engineer in Atlanta tech scene.",
    location: "Atlanta, GA",
    joinDate: "2023-07-22",
    verified: false,
    politicalLean: "center",
  },
  {
    id: "3",
    username: "conservative_tom_ga",
    displayName: "Tom Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Small business owner in Atlanta. Advocate for fiscal responsibility and traditional values.",
    location: "Atlanta, GA",
    joinDate: "2023-01-10",
    verified: true,
    politicalLean: "right",
  },
  {
    id: "4",
    username: "policy_expert_atl",
    displayName: "Dr. Lisa Park",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Policy researcher and political analyst. PhD in Public Policy from Emory University.",
    location: "Atlanta, GA",
    joinDate: "2022-11-05",
    verified: true,
    politicalLean: "center",
  },
]

export const mockComments: Comment[] = [
  {
    id: "1",
    userId: "1",
    articleUrl: "https://www.ajc.com/news/atlanta-news/marta-expansion-proposal-gains-support",
    articleTitle: "MARTA Expansion Proposal Gains Support in Atlanta",
    content:
      "This is encouraging news! Atlanta desperately needs better public transit. @mike_atl what do you think about the proposed MARTA expansion?",
    mentions: ["mike_atl"],
    timestamp: "2024-01-15T14:30:00Z",
    likes: 12,
    replies: [
      {
        id: "2",
        userId: "2",
        articleUrl: "https://www.ajc.com/news/atlanta-news/marta-expansion-proposal-gains-support",
        articleTitle: "MARTA Expansion Proposal Gains Support in Atlanta",
        content:
          "@atlanta_sarah I think we need to look at the funding sources carefully. The tax implications for Atlanta residents matter a lot.",
        mentions: ["atlanta_sarah"],
        timestamp: "2024-01-15T15:45:00Z",
        likes: 8,
        replies: [],
        edited: false,
      },
    ],
    edited: false,
  },
  {
    id: "3",
    userId: "3",
    articleUrl: "https://www.wsbtv.com/news/local/atlanta/atlanta-housing-crisis-affordable-housing-shortage",
    articleTitle: "Atlanta Housing Crisis: Affordable Housing Shortage Reaches Critical Point",
    content:
      "The housing situation in Atlanta is getting out of hand. @policy_expert_atl have you analyzed the economic impact of these housing policies?",
    mentions: ["policy_expert_atl"],
    timestamp: "2024-01-15T16:20:00Z",
    likes: 15,
    replies: [],
    edited: false,
  },
]

export const mockRepresentatives: Representative[] = [
  {
    id: "warnock",
    name: "Raphael Warnock",
    position: "Senator",
    district: "Georgia",
    party: "D",
    location: "Atlanta, GA",
    contact: {
      phone: "(202) 224-3643",
      email: "contact_warnock@warnock.senate.gov",
      website: "https://www.warnock.senate.gov/",
    },
    bio: "Reverend Raphael Warnock is a Senator from Georgia.",
    issues: ["Georgia Voting Rights", "Atlanta Housing Crisis", "MARTA Expansion"],
  },
  {
    id: "ossoff",
    name: "Jon Ossoff",
    position: "Senator",
    district: "Georgia",
    party: "D",
    location: "Atlanta, GA",
    contact: {
      phone: "(202) 224-3521",
      email: "contact_ossoff@ossoff.senate.gov",
      website: "https://www.ossoff.senate.gov/",
    },
    bio: "Jon Ossoff is a Senator from Georgia.",
    issues: ["Atlanta Housing Crisis", "Hartsfield-Jackson Airport", "Atlanta Traffic Infrastructure"],
  },
  {
    id: "nikema_williams",
    name: "Nikema Williams",
    position: "Representative",
    district: "Georgia's 5th Congressional District",
    party: "D",
    location: "Atlanta, GA",
    contact: {
      phone: "(202) 225-3801",
      email: "contact_williams@mail.house.gov",
      website: "https://nikemawilliams.house.gov/",
    },
    bio: "Nikema Williams is a Representative for Georgia's 5th Congressional District.",
    issues: ["Georgia Voting Rights", "Atlanta Housing Crisis", "MARTA Expansion"],
  },
  {
    id: "rich_mccormick",
    name: "Rich McCormick",
    position: "Representative",
    district: "Georgia's 6th Congressional District",
    party: "R",
    location: "Atlanta, GA",
    contact: {
      phone: "(202) 225-4272",
      email: "contact_mccormick@mail.house.gov",
      website: "https://mccormick.house.gov/",
    },
    bio: "Rich McCormick is a Representative for Georgia's 6th Congressional District.",
    issues: ["Atlanta Traffic Infrastructure", "Hartsfield-Jackson Airport"],
  },
  {
    id: "lucy_mcbath",
    name: "Lucy McBath",
    position: "Representative",
    district: "Georgia's 7th Congressional District",
    party: "D",
    location: "Atlanta, GA",
    contact: {
      phone: "(202) 225-5131",
      email: "contact_mcbath@mail.house.gov",
      website: "https://mcbath.house.gov/",
    },
    bio: "Lucy McBath is a Representative for Georgia's 7th Congressional District.",
    issues: ["Georgia Voting Rights", "Atlanta Housing Crisis", "MARTA Expansion"],
  },
]

export const mockIssues: Issue[] = [
  {
    id: "marta_expansion",
    name: "MARTA Expansion",
    description: "Expanding MARTA services to underserved areas of Atlanta.",
    location: "Atlanta, GA",
    status: "Proposed",
    priority: "High",
    supporters: 1500,
    opponents: 500,
    relatedRepresentatives: ["warnock", "nikema_williams", "lucy_mcbath"],
  },
  {
    id: "atlanta_housing_crisis",
    name: "Atlanta Housing Crisis",
    description: "Addressing the affordable housing shortage in Atlanta.",
    location: "Atlanta, GA",
    status: "In Progress",
    priority: "High",
    supporters: 2000,
    opponents: 200,
    relatedRepresentatives: ["ossoff", "nikema_williams", "lucy_mcbath"],
  },
  {
    id: "hartsfield_jackson_airport",
    name: "Hartsfield-Jackson Airport",
    description: "Modernization and expansion of Hartsfield-Jackson Airport.",
    location: "Atlanta, GA",
    status: "In Progress",
    priority: "Medium",
    supporters: 1200,
    opponents: 800,
    relatedRepresentatives: ["ossoff", "rich_mccormick"],
  },
  {
    id: "georgia_voting_rights",
    name: "Georgia Voting Rights",
    description: "Protecting and expanding voting rights in Georgia.",
    location: "Atlanta, GA",
    status: "Stalled",
    priority: "High",
    supporters: 2500,
    opponents: 1000,
    relatedRepresentatives: ["warnock", "nikema_williams", "lucy_mcbath"],
  },
  {
    id: "atlanta_traffic_infrastructure",
    name: "Atlanta Traffic Infrastructure",
    description: "Improving traffic flow and infrastructure in Atlanta.",
    location: "Atlanta, GA",
    status: "Proposed",
    priority: "Medium",
    supporters: 1800,
    opponents: 700,
    relatedRepresentatives: ["ossoff", "rich_mccormick"],
  },
]

// Mock current user (in a real app, this would come from authentication)
export const currentUser: User = mockUsers[0] // Sarah Johnson from Atlanta
