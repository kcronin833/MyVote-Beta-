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

export const mockUsers: User[] = [
  {
    id: "1",
    username: "sarah_voter",
    displayName: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Political science student at UC Berkeley. Passionate about civic engagement and social justice.",
    location: "San Francisco, CA",
    joinDate: "2023-03-15",
    verified: true,
    politicalLean: "left",
  },
  {
    id: "2",
    username: "mike_moderate",
    displayName: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Independent voter focused on facts and data-driven policy. Software engineer by day.",
    location: "Austin, TX",
    joinDate: "2023-07-22",
    verified: false,
    politicalLean: "center",
  },
  {
    id: "3",
    username: "conservative_tom",
    displayName: "Tom Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Small business owner. Advocate for fiscal responsibility and traditional values.",
    location: "Chicago, IL",
    joinDate: "2023-01-10",
    verified: true,
    politicalLean: "right",
  },
  {
    id: "4",
    username: "policy_expert",
    displayName: "Dr. Lisa Park",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Policy researcher and political analyst. PhD in Public Policy from Georgetown.",
    location: "Washington, DC",
    joinDate: "2022-11-05",
    verified: true,
    politicalLean: "center",
  },
]

export const mockComments: Comment[] = [
  {
    id: "1",
    userId: "1",
    articleUrl: "https://www.huffpost.com/entry/progressive-policies-polling_n_5f8a1234e4b0c5b1f8d9e123",
    articleTitle: "Progressive Policy Gains Support in Latest Poll",
    content:
      "This is encouraging news! It's great to see more Americans supporting progressive policies. @mike_moderate what do you think about these polling numbers?",
    mentions: ["mike_moderate"],
    timestamp: "2024-01-15T14:30:00Z",
    likes: 12,
    replies: [
      {
        id: "2",
        userId: "2",
        articleUrl: "https://www.huffpost.com/entry/progressive-policies-polling_n_5f8a1234e4b0c5b1f8d9e123",
        articleTitle: "Progressive Policy Gains Support in Latest Poll",
        content:
          "@sarah_voter I think we need to look at the methodology behind these polls. The sample size and demographics matter a lot.",
        mentions: ["sarah_voter"],
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
    articleUrl: "https://www.foxnews.com/politics/tax-reform-proposal-conservative-coalition-support",
    articleTitle: "Tax Reform Proposal Backed by Conservative Coalition",
    content:
      "Finally! This tax reform proposal could really help small businesses like mine. @policy_expert have you analyzed the economic impact of these changes?",
    mentions: ["policy_expert"],
    timestamp: "2024-01-15T16:20:00Z",
    likes: 15,
    replies: [],
    edited: false,
  },
]

// Mock current user (in a real app, this would come from authentication)
export const currentUser: User = mockUsers[0] // Sarah Johnson
