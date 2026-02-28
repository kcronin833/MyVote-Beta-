export interface UserLikePattern {
  userId: string
  likedArticles: Array<{
    url: string
    title: string
    politicalBias: number // -100 to 100 (left to right)
    topics: string[]
    timestamp: string
  }>
  likedComments: Array<{
    commentId: string
    politicalLean: "left" | "center" | "right"
    topics: string[]
    timestamp: string
  }>
  likedPoliticians: Array<{
    politicianId: string
    politicalScore: number
    timestamp: string
  }>
  issueEngagement: Array<{
    issue: string
    engagementType: "like" | "comment" | "share"
    stance: "support" | "oppose" | "neutral"
    timestamp: string
  }>
}

export interface PoliticianProfile {
  id: string
  name: string
  politicalScore: number // -100 to 100 (left to right)
  keyIssues: Array<{
    issue: string
    stance: "support" | "oppose" | "neutral"
    importance: number // 1-10
  }>
  votingRecord: Array<{
    bill: string
    vote: "yes" | "no" | "abstain"
    politicalBias: number
  }>
  endorsements: Array<{
    organization: string
    politicalLean: "left" | "center" | "right"
  }>
}

export interface CompatibilityScore {
  overall: number // 0-100 percentage
  issueAlignment: number // 0-100 percentage
  politicalAlignment: number // 0-100 percentage
  engagementSimilarity: number // 0-100 percentage
  breakdown: {
    sharedIssues: string[]
    conflictingIssues: string[]
    alignedVotes: number
    totalVotes: number
    reasonsForMatch: string[]
    reasonsForMismatch: string[]
  }
}

// Mock user like patterns for Atlanta users
export const mockUserLikePatterns: Record<string, UserLikePattern> = {
  "1": {
    // Sarah Johnson - Progressive Atlanta student
    userId: "1",
    likedArticles: [
      {
        url: "https://www.ajc.com/news/atlanta-news/marta-expansion-proposal-gains-support",
        title: "MARTA Expansion Proposal Gains Support in Atlanta",
        politicalBias: -65,
        topics: ["public transit", "urban development", "atlanta"],
        timestamp: "2024-01-15T14:30:00Z",
      },
      {
        url: "https://www.wsbtv.com/news/local/atlanta/atlanta-housing-crisis-affordable-housing-shortage",
        title: "Atlanta Housing Crisis: Affordable Housing Shortage",
        politicalBias: -70,
        topics: ["housing", "social justice", "atlanta"],
        timestamp: "2024-01-14T10:20:00Z",
      },
      {
        url: "https://www.11alive.com/article/news/politics/georgia-voting-rights-legislation",
        title: "Georgia Voting Rights Legislation Advances",
        politicalBias: -80,
        topics: ["voting rights", "democracy", "georgia"],
        timestamp: "2024-01-13T16:45:00Z",
      },
    ],
    likedComments: [
      {
        commentId: "progressive_comment_1",
        politicalLean: "left",
        topics: ["climate change", "social justice"],
        timestamp: "2024-01-15T15:30:00Z",
      },
      {
        commentId: "progressive_comment_2",
        politicalLean: "left",
        topics: ["healthcare", "education"],
        timestamp: "2024-01-14T12:15:00Z",
      },
    ],
    likedPoliticians: [
      {
        politicianId: "warnock",
        politicalScore: -75,
        timestamp: "2024-01-12T09:00:00Z",
      },
      {
        politicianId: "ossoff",
        politicalScore: -65,
        timestamp: "2024-01-11T14:30:00Z",
      },
    ],
    issueEngagement: [
      {
        issue: "MARTA Expansion",
        engagementType: "like",
        stance: "support",
        timestamp: "2024-01-15T14:30:00Z",
      },
      {
        issue: "Atlanta Housing Crisis",
        engagementType: "comment",
        stance: "support",
        timestamp: "2024-01-14T10:20:00Z",
      },
      {
        issue: "Georgia Voting Rights",
        engagementType: "share",
        stance: "support",
        timestamp: "2024-01-13T16:45:00Z",
      },
    ],
  },
  "2": {
    // Mike Chen - Moderate Atlanta tech worker
    userId: "2",
    likedArticles: [
      {
        url: "https://www.ajc.com/news/atlanta-news/atlanta-traffic-infrastructure-bipartisan-support",
        title: "Atlanta Traffic Infrastructure Gets Bipartisan Support",
        politicalBias: -10,
        topics: ["infrastructure", "bipartisan", "atlanta"],
        timestamp: "2024-01-15T11:20:00Z",
      },
      {
        url: "https://www.wsbtv.com/news/local/atlanta/hartsfield-jackson-airport-modernization",
        title: "Hartsfield-Jackson Airport Modernization Plan",
        politicalBias: 5,
        topics: ["infrastructure", "economy", "atlanta"],
        timestamp: "2024-01-14T13:45:00Z",
      },
    ],
    likedComments: [
      {
        commentId: "moderate_comment_1",
        politicalLean: "center",
        topics: ["fiscal responsibility", "infrastructure"],
        timestamp: "2024-01-15T12:30:00Z",
      },
    ],
    likedPoliticians: [
      {
        politicianId: "ossoff",
        politicalScore: -65,
        timestamp: "2024-01-12T10:00:00Z",
      },
    ],
    issueEngagement: [
      {
        issue: "Atlanta Traffic Infrastructure",
        engagementType: "like",
        stance: "support",
        timestamp: "2024-01-15T11:20:00Z",
      },
      {
        issue: "Hartsfield-Jackson Airport",
        engagementType: "like",
        stance: "support",
        timestamp: "2024-01-14T13:45:00Z",
      },
    ],
  },
  "3": {
    // Tom Rodriguez - Conservative Atlanta business owner
    userId: "3",
    likedArticles: [
      {
        url: "https://www.wsbtv.com/news/local/atlanta/atlanta-small-business-tax-relief",
        title: "Atlanta Small Business Tax Relief Proposal",
        politicalBias: 60,
        topics: ["taxes", "small business", "atlanta"],
        timestamp: "2024-01-15T09:30:00Z",
      },
      {
        url: "https://www.ajc.com/news/georgia-news/georgia-fiscal-responsibility-initiative",
        title: "Georgia Fiscal Responsibility Initiative",
        politicalBias: 70,
        topics: ["fiscal policy", "government spending", "georgia"],
        timestamp: "2024-01-14T08:15:00Z",
      },
    ],
    likedComments: [
      {
        commentId: "conservative_comment_1",
        politicalLean: "right",
        topics: ["fiscal responsibility", "small business"],
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
    likedPoliticians: [
      {
        politicianId: "rich_mccormick",
        politicalScore: 68,
        timestamp: "2024-01-12T11:00:00Z",
      },
    ],
    issueEngagement: [
      {
        issue: "Atlanta Small Business Support",
        engagementType: "like",
        stance: "support",
        timestamp: "2024-01-15T09:30:00Z",
      },
    ],
  },
}

// Atlanta politicians with detailed profiles
export const atlantaPoliticians: Record<string, PoliticianProfile> = {
  warnock: {
    id: "warnock",
    name: "Raphael Warnock",
    politicalScore: -75,
    keyIssues: [
      { issue: "Georgia Voting Rights", stance: "support", importance: 10 },
      { issue: "Atlanta Housing Crisis", stance: "support", importance: 9 },
      { issue: "MARTA Expansion", stance: "support", importance: 8 },
      { issue: "Healthcare Access", stance: "support", importance: 9 },
      { issue: "Climate Action", stance: "support", importance: 7 },
    ],
    votingRecord: [
      { bill: "Infrastructure Investment Act", vote: "yes", politicalBias: -30 },
      { bill: "Build Back Better Act", vote: "yes", politicalBias: -70 },
      { bill: "Voting Rights Act", vote: "yes", politicalBias: -80 },
    ],
    endorsements: [
      { organization: "Georgia AFL-CIO", politicalLean: "left" },
      { organization: "Sierra Club Georgia", politicalLean: "left" },
      { organization: "Georgia Democratic Party", politicalLean: "left" },
    ],
  },
  ossoff: {
    id: "ossoff",
    name: "Jon Ossoff",
    politicalScore: -65,
    keyIssues: [
      { issue: "Atlanta Housing Crisis", stance: "support", importance: 9 },
      { issue: "Hartsfield-Jackson Airport", stance: "support", importance: 7 },
      { issue: "Atlanta Traffic Infrastructure", stance: "support", importance: 8 },
      { issue: "Technology Policy", stance: "support", importance: 8 },
      { issue: "Climate Action", stance: "support", importance: 7 },
    ],
    votingRecord: [
      { bill: "Infrastructure Investment Act", vote: "yes", politicalBias: -30 },
      { bill: "CHIPS Act", vote: "yes", politicalBias: -20 },
      { bill: "Climate Action Bill", vote: "yes", politicalBias: -60 },
    ],
    endorsements: [
      { organization: "Georgia Democratic Party", politicalLean: "left" },
      { organization: "Atlanta Tech Coalition", politicalLean: "center" },
      { organization: "Georgia Environmental Coalition", politicalLean: "left" },
    ],
  },
  nikema_williams: {
    id: "nikema_williams",
    name: "Nikema Williams",
    politicalScore: -80,
    keyIssues: [
      { issue: "Georgia Voting Rights", stance: "support", importance: 10 },
      { issue: "Atlanta Housing Crisis", stance: "support", importance: 9 },
      { issue: "MARTA Expansion", stance: "support", importance: 9 },
      { issue: "Social Justice", stance: "support", importance: 10 },
      { issue: "Education Funding", stance: "support", importance: 8 },
    ],
    votingRecord: [
      { bill: "Voting Rights Act", vote: "yes", politicalBias: -80 },
      { bill: "Social Justice Reform", vote: "yes", politicalBias: -85 },
      { bill: "Education Funding Bill", vote: "yes", politicalBias: -70 },
    ],
    endorsements: [
      { organization: "Georgia Democratic Party", politicalLean: "left" },
      { organization: "NAACP Georgia", politicalLean: "left" },
      { organization: "Georgia Teachers Association", politicalLean: "left" },
    ],
  },
  rich_mccormick: {
    id: "rich_mccormick",
    name: "Rich McCormick",
    politicalScore: 68,
    keyIssues: [
      { issue: "Atlanta Traffic Infrastructure", stance: "support", importance: 8 },
      { issue: "Hartsfield-Jackson Airport", stance: "support", importance: 7 },
      { issue: "Fiscal Responsibility", stance: "support", importance: 9 },
      { issue: "Small Business Support", stance: "support", importance: 8 },
      { issue: "Healthcare Reform", stance: "support", importance: 7 },
    ],
    votingRecord: [
      { bill: "Tax Relief Act", vote: "yes", politicalBias: 70 },
      { bill: "Small Business Support Act", vote: "yes", politicalBias: 50 },
      { bill: "Infrastructure Investment Act", vote: "yes", politicalBias: -30 },
    ],
    endorsements: [
      { organization: "Georgia Republican Party", politicalLean: "right" },
      { organization: "Georgia Chamber of Commerce", politicalLean: "right" },
      { organization: "Atlanta Business Coalition", politicalLean: "center" },
    ],
  },
  lucy_mcbath: {
    id: "lucy_mcbath",
    name: "Lucy McBath",
    politicalScore: -70,
    keyIssues: [
      { issue: "Gun Safety", stance: "support", importance: 10 },
      { issue: "Georgia Voting Rights", stance: "support", importance: 9 },
      { issue: "Atlanta Housing Crisis", stance: "support", importance: 8 },
      { issue: "Healthcare Access", stance: "support", importance: 9 },
      { issue: "Education Funding", stance: "support", importance: 8 },
    ],
    votingRecord: [
      { bill: "Gun Safety Act", vote: "yes", politicalBias: -75 },
      { bill: "Voting Rights Act", vote: "yes", politicalBias: -80 },
      { bill: "Healthcare Access Bill", vote: "yes", politicalBias: -65 },
    ],
    endorsements: [
      { organization: "Georgia Democratic Party", politicalLean: "left" },
      { organization: "Moms Demand Action", politicalLean: "left" },
      { organization: "Georgia Healthcare Coalition", politicalLean: "left" },
    ],
  },
}

export function calculateCompatibilityScore(
  userPattern: UserLikePattern,
  politician: PoliticianProfile,
): CompatibilityScore {
  // Calculate political alignment based on liked articles and politician's score
  const userPoliticalBias =
    userPattern.likedArticles.reduce((sum, article) => sum + article.politicalBias, 0) /
    Math.max(userPattern.likedArticles.length, 1)

  const politicalAlignmentScore = Math.max(0, 100 - Math.abs(userPoliticalBias - politician.politicalScore))

  // Calculate issue alignment
  const userIssues = new Set([
    ...userPattern.issueEngagement.map((e) => e.issue),
    ...userPattern.likedArticles.flatMap((a) => a.topics),
  ])

  const politicianIssues = new Set(politician.keyIssues.map((i) => i.issue))
  const sharedIssues = Array.from(userIssues).filter((issue) =>
    politician.keyIssues.some(
      (pi) =>
        pi.issue.toLowerCase().includes(issue.toLowerCase()) || issue.toLowerCase().includes(pi.issue.toLowerCase()),
    ),
  )

  const issueAlignmentScore = (sharedIssues.length / Math.max(politician.keyIssues.length, 1)) * 100

  // Calculate engagement similarity based on liked politicians
  const engagementScore = userPattern.likedPoliticians.some((lp) => lp.politicianId === politician.id)
    ? 100
    : userPattern.likedPoliticians.some((lp) => Math.abs(lp.politicalScore - politician.politicalScore) < 20)
      ? 70
      : 30

  // Calculate overall compatibility
  const overall = Math.round(politicalAlignmentScore * 0.4 + issueAlignmentScore * 0.4 + engagementScore * 0.2)

  // Find conflicting issues
  const conflictingIssues = politician.keyIssues
    .filter((issue) =>
      userPattern.issueEngagement.some(
        (ue) =>
          ue.issue.toLowerCase().includes(issue.issue.toLowerCase()) &&
          ((issue.stance === "support" && ue.stance === "oppose") ||
            (issue.stance === "oppose" && ue.stance === "support")),
      ),
    )
    .map((issue) => issue.issue)

  // Generate reasons for match/mismatch
  const reasonsForMatch = []
  const reasonsForMismatch = []

  if (sharedIssues.length > 0) {
    reasonsForMatch.push(`Shared interest in ${sharedIssues.slice(0, 3).join(", ")}`)
  }

  if (Math.abs(userPoliticalBias - politician.politicalScore) < 30) {
    reasonsForMatch.push("Similar political alignment")
  } else {
    reasonsForMismatch.push("Different political alignment")
  }

  if (conflictingIssues.length > 0) {
    reasonsForMismatch.push(`Opposing views on ${conflictingIssues.slice(0, 2).join(", ")}`)
  }

  // Calculate aligned votes
  const alignedVotes = politician.votingRecord.filter((vote) => {
    const voteAlignment = vote.politicalBias > 0 ? "right" : vote.politicalBias < -30 ? "left" : "center"
    const userAlignment = userPoliticalBias > 30 ? "right" : userPoliticalBias < -30 ? "left" : "center"
    return voteAlignment === userAlignment
  }).length

  return {
    overall: Math.min(100, Math.max(0, overall)),
    issueAlignment: Math.round(issueAlignmentScore),
    politicalAlignment: Math.round(politicalAlignmentScore),
    engagementSimilarity: Math.round(engagementScore),
    breakdown: {
      sharedIssues,
      conflictingIssues,
      alignedVotes,
      totalVotes: politician.votingRecord.length,
      reasonsForMatch,
      reasonsForMismatch,
    },
  }
}

// Add alias for the missing export
export const calculateCompatibility = calculateCompatibilityScore

export function getUserCompatibilityScores(userId: string): Record<string, CompatibilityScore> {
  const userPattern = mockUserLikePatterns[userId]
  if (!userPattern) return {}

  const scores: Record<string, CompatibilityScore> = {}

  Object.values(atlantaPoliticians).forEach((politician) => {
    scores[politician.id] = calculateCompatibilityScore(userPattern, politician)
  })

  return scores
}

export function getCompatibilityLevel(score: number): {
  level: "Excellent" | "Good" | "Fair" | "Poor"
  color: string
  description: string
} {
  if (score >= 80) {
    return {
      level: "Excellent",
      color: "text-green-600 bg-green-50 border-green-200",
      description: "Strong alignment on most issues",
    }
  } else if (score >= 60) {
    return {
      level: "Good",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      description: "Good alignment on key issues",
    }
  } else if (score >= 40) {
    return {
      level: "Fair",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      description: "Some alignment, some differences",
    }
  } else {
    return {
      level: "Poor",
      color: "text-red-600 bg-red-50 border-red-200",
      description: "Limited alignment on issues",
    }
  }
}
