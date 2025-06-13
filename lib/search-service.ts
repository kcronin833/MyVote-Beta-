import { mockUsers, mockComments } from "./mock-data"
import { generateFactualNews } from "./mock-ai-service"

export interface SearchResult {
  id: string
  type: "news" | "representative" | "comment" | "user" | "factual"
  title: string
  description: string
  url?: string
  source?: string
  timestamp?: string
  category?: string
  relevanceScore: number
  metadata?: {
    author?: string
    location?: string
    party?: string
    office?: string
    likes?: number
    replies?: number
  }
}

// Mock news data for search
const allNewsArticles = [
  // Left perspective news
  {
    id: "news-1",
    title: "Progressive Policy Gains Support in Latest Poll",
    url: "https://www.huffpost.com/entry/progressive-policies-polling_n_5f8a1234e4b0c5b1f8d9e123",
    description: "New polling data shows increasing support for progressive initiatives across key demographics.",
    source: "HuffPost",
    category: "Politics",
    perspective: "left",
    timestamp: "2024-01-15T14:00:00Z",
  },
  {
    id: "news-2",
    title: "Climate Action Rally Draws Thousands to Capitol",
    url: "https://www.motherjones.com/environment/2024/01/climate-rally-capitol-thousands/",
    description:
      "Environmental activists gather to demand stronger climate legislation and renewable energy investments.",
    source: "Mother Jones",
    category: "Environment",
    perspective: "left",
    timestamp: "2024-01-15T12:00:00Z",
  },
  {
    id: "news-3",
    title: "Healthcare Reform Advocates Push for Universal Coverage",
    url: "https://www.thenation.com/article/politics/healthcare-universal-coverage-reform/",
    description: "Coalition of healthcare advocates presents comprehensive plan for universal healthcare system.",
    source: "The Nation",
    category: "Healthcare",
    perspective: "left",
    timestamp: "2024-01-15T10:00:00Z",
  },
  // Right perspective news
  {
    id: "news-4",
    title: "Tax Reform Proposal Backed by Conservative Coalition",
    url: "https://www.foxnews.com/politics/tax-reform-proposal-conservative-coalition-support",
    description: "Business leaders and conservative lawmakers unite behind comprehensive tax reduction plan.",
    source: "Fox News",
    category: "Economics",
    perspective: "right",
    timestamp: "2024-01-15T15:00:00Z",
  },
  {
    id: "news-5",
    title: "Second Amendment Debate Intensifies in State Legislatures",
    url: "https://www.dailywire.com/news/second-amendment-debate-state-legislatures-gun-rights",
    description: "Gun rights advocates mobilize as several states consider new firearms legislation.",
    source: "The Daily Wire",
    category: "Rights",
    perspective: "right",
    timestamp: "2024-01-15T13:00:00Z",
  },
  {
    id: "news-6",
    title: "Border Security Measures Show Positive Results",
    url: "https://www.breitbart.com/politics/2024/01/border-security-measures-positive-results/",
    description: "New data shows decreased illegal crossings following implementation of enhanced border policies.",
    source: "Breitbart",
    category: "Immigration",
    perspective: "right",
    timestamp: "2024-01-15T08:00:00Z",
  },
  // Local news
  {
    id: "news-7",
    title: "City Council Approves New Housing Development in Mission District",
    url: "https://www.sfgate.com/bayarea/article/san-francisco-mission-housing-development-approved-18234567.php",
    description:
      "The San Francisco City Council approved a new affordable housing development in the Mission District that will provide 200 units.",
    source: "SF Gate",
    category: "Local Government",
    perspective: "local",
    timestamp: "2024-01-15T16:00:00Z",
  },
  {
    id: "news-8",
    title: "Local Tech Company Announces 200 New Jobs in SOMA",
    url: "https://www.bizjournals.com/sanfrancisco/news/2024/01/15/tech-company-hiring-soma-jobs.html",
    description:
      "A San Francisco-based tech company plans to hire 200 new employees over the next six months in their SOMA headquarters.",
    source: "San Francisco Business Times",
    category: "Business",
    perspective: "local",
    timestamp: "2024-01-15T11:00:00Z",
  },
]

// Mock representative data for search
const allRepresentatives = [
  {
    id: "rep-1",
    name: "Nancy Pelosi",
    office: "U.S. House of Representatives",
    district: "California's 11th Congressional District",
    party: "Democrat",
    location: "San Francisco, CA",
    description:
      "Former Speaker of the House, serving California's 11th district since 1987. Focus on healthcare reform, climate change, and women's rights.",
  },
  {
    id: "rep-2",
    name: "Alex Padilla",
    office: "U.S. Senate",
    district: "California",
    party: "Democrat",
    location: "California",
    description:
      "U.S. Senator from California, former Secretary of State. Focuses on voting rights, immigration, and technology policy.",
  },
  {
    id: "rep-3",
    name: "Roger Williams",
    office: "U.S. House of Representatives",
    district: "Texas's 25th Congressional District",
    party: "Republican",
    location: "Austin, TX",
    description:
      "Represents Texas's 25th district, former Texas Secretary of State. Focuses on small business, financial services, and border security.",
  },
  {
    id: "rep-4",
    name: "Ted Cruz",
    office: "U.S. Senate",
    district: "Texas",
    party: "Republican",
    location: "Texas",
    description:
      "U.S. Senator from Texas, former Solicitor General. Focuses on constitutional rights, border security, and energy policy.",
  },
]

export class SearchService {
  private static calculateRelevance(query: string, text: string): number {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()

    if (textLower.includes(queryLower)) {
      // Exact match gets highest score
      if (textLower === queryLower) return 100
      // Title/name matches get high score
      if (textLower.startsWith(queryLower)) return 90
      // Word boundary matches get good score
      const words = queryLower.split(" ")
      let wordMatches = 0
      words.forEach((word) => {
        if (textLower.includes(word)) wordMatches++
      })
      return (wordMatches / words.length) * 80
    }
    return 0
  }

  static async searchAll(
    query: string,
    filters?: {
      type?: string[]
      category?: string[]
      perspective?: string[]
      timeRange?: string
    },
  ): Promise<SearchResult[]> {
    if (!query.trim()) return []

    const results: SearchResult[] = []

    // Search news articles
    if (!filters?.type || filters.type.includes("news")) {
      allNewsArticles.forEach((article) => {
        const titleRelevance = this.calculateRelevance(query, article.title)
        const descRelevance = this.calculateRelevance(query, article.description)
        const sourceRelevance = this.calculateRelevance(query, article.source)
        const categoryRelevance = this.calculateRelevance(query, article.category)

        const maxRelevance = Math.max(titleRelevance, descRelevance, sourceRelevance, categoryRelevance)

        if (maxRelevance > 0) {
          // Apply filters
          if (filters?.category && !filters.category.includes(article.category)) return
          if (filters?.perspective && !filters.perspective.includes(article.perspective)) return

          results.push({
            id: article.id,
            type: "news",
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source,
            timestamp: article.timestamp,
            category: article.category,
            relevanceScore: maxRelevance,
            metadata: {
              author: article.source,
            },
          })
        }
      })
    }

    // Search representatives
    if (!filters?.type || filters.type.includes("representative")) {
      allRepresentatives.forEach((rep) => {
        const nameRelevance = this.calculateRelevance(query, rep.name)
        const officeRelevance = this.calculateRelevance(query, rep.office)
        const districtRelevance = this.calculateRelevance(query, rep.district)
        const partyRelevance = this.calculateRelevance(query, rep.party)
        const locationRelevance = this.calculateRelevance(query, rep.location)
        const descRelevance = this.calculateRelevance(query, rep.description)

        const maxRelevance = Math.max(
          nameRelevance,
          officeRelevance,
          districtRelevance,
          partyRelevance,
          locationRelevance,
          descRelevance,
        )

        if (maxRelevance > 0) {
          results.push({
            id: rep.id,
            type: "representative",
            title: rep.name,
            description: `${rep.office} - ${rep.district}`,
            category: rep.party,
            relevanceScore: maxRelevance,
            metadata: {
              party: rep.party,
              office: rep.office,
              location: rep.location,
            },
          })
        }
      })
    }

    // Search users
    if (!filters?.type || filters.type.includes("user")) {
      mockUsers.forEach((user) => {
        const nameRelevance = this.calculateRelevance(query, user.displayName)
        const usernameRelevance = this.calculateRelevance(query, user.username)
        const bioRelevance = this.calculateRelevance(query, user.bio)
        const locationRelevance = this.calculateRelevance(query, user.location)

        const maxRelevance = Math.max(nameRelevance, usernameRelevance, bioRelevance, locationRelevance)

        if (maxRelevance > 0) {
          results.push({
            id: user.id,
            type: "user",
            title: user.displayName,
            description: user.bio,
            category: user.politicalLean,
            relevanceScore: maxRelevance,
            metadata: {
              author: `@${user.username}`,
              location: user.location,
            },
          })
        }
      })
    }

    // Search comments
    if (!filters?.type || filters.type.includes("comment")) {
      const allComments = [...mockComments, ...mockComments.flatMap((c) => c.replies)]

      allComments.forEach((comment) => {
        const contentRelevance = this.calculateRelevance(query, comment.content)
        const titleRelevance = this.calculateRelevance(query, comment.articleTitle)

        const maxRelevance = Math.max(contentRelevance, titleRelevance)

        if (maxRelevance > 0) {
          const user = mockUsers.find((u) => u.id === comment.userId)
          results.push({
            id: comment.id,
            type: "comment",
            title: `Comment on: ${comment.articleTitle}`,
            description: comment.content,
            url: comment.articleUrl,
            timestamp: comment.timestamp,
            relevanceScore: maxRelevance,
            metadata: {
              author: user?.displayName || "Unknown User",
              likes: comment.likes,
              replies: comment.replies?.length || 0,
            },
          })
        }
      })
    }

    // Search AI-generated factual content
    if (!filters?.type || filters.type.includes("factual")) {
      try {
        const factualNews = await generateFactualNews()
        factualNews.forEach((article, index) => {
          const titleRelevance = this.calculateRelevance(query, article.title)
          const descRelevance = this.calculateRelevance(query, article.description)
          const sourceRelevance = this.calculateRelevance(query, article.source)
          const categoryRelevance = this.calculateRelevance(query, article.category)

          const maxRelevance = Math.max(titleRelevance, descRelevance, sourceRelevance, categoryRelevance)

          if (maxRelevance > 0) {
            results.push({
              id: `factual-${index}`,
              type: "factual",
              title: article.title,
              description: article.description,
              source: article.source,
              category: article.category,
              relevanceScore: maxRelevance,
              metadata: {
                author: article.source,
              },
            })
          }
        })
      } catch (error) {
        console.error("Error searching factual content:", error)
      }
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  static getSearchSuggestions(query: string): string[] {
    const suggestions = [
      // Topic suggestions
      "healthcare",
      "climate change",
      "tax reform",
      "immigration",
      "education",
      "economy",
      "jobs",
      "infrastructure",
      "voting rights",
      "gun rights",
      // Representative names
      "Nancy Pelosi",
      "Ted Cruz",
      "Alex Padilla",
      "Roger Williams",
      // Locations
      "California",
      "Texas",
      "San Francisco",
      "Austin",
      // Parties
      "Democrat",
      "Republican",
      "Independent",
      // Government bodies
      "House",
      "Senate",
      "Supreme Court",
      "Federal Reserve",
    ]

    if (!query.trim()) return suggestions.slice(0, 5)

    const queryLower = query.toLowerCase()
    return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(queryLower)).slice(0, 5)
  }
}
