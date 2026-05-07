// lib/ai-news-service.ts

interface NewsArticle {
  title: string
  content: string
  category: string
  location: string
  keywords: string[]
}

class AiNewsService {
  private newsArticles: NewsArticle[] = []

  constructor() {
    // Initialize with some default news categories
    this.addNewsCategory("Technology")
    this.addNewsCategory("Business")
    this.addNewsCategory("World")
    this.addNewsCategory("Politics")
    this.addNewsCategory("Sports")

    // Add Atlanta-specific news categories
    this.addNewsCategory("Atlanta Local")
    this.addNewsCategory("Georgia Politics")
    this.addNewsCategory("Atlanta Business")
  }

  private newsCategories: string[] = []

  addNewsCategory(category: string): void {
    if (!this.newsCategories.includes(category)) {
      this.newsCategories.push(category)
    }
  }

  generateNews(topic: string, location: string): NewsArticle {
    // Prioritize Georgia/Atlanta content
    let prioritizedLocation = location
    if (location.toLowerCase().includes("georgia") || location.toLowerCase().includes("atlanta")) {
      prioritizedLocation = "Atlanta, GA"
    }

    const article: NewsArticle = {
      title: `AI Generated News: ${topic} in ${prioritizedLocation}`,
      content: `This is AI generated news about ${topic} in ${prioritizedLocation}. More details to follow.`,
      category: this.getRandomCategory(),
      location: prioritizedLocation,
      keywords: this.generateKeywords(topic, prioritizedLocation),
    }

    this.newsArticles.push(article)
    return article
  }

  getNewsByCategory(category: string): NewsArticle[] {
    return this.newsArticles.filter((article) => article.category === category)
  }

  getNewsByLocation(location: string): NewsArticle[] {
    return this.newsArticles.filter((article) => article.location.toLowerCase().includes(location.toLowerCase()))
  }

  private getRandomCategory(): string {
    const randomIndex = Math.floor(Math.random() * this.newsCategories.length)
    return this.newsCategories[randomIndex]
  }

  private generateKeywords(topic: string, location: string): string[] {
    let keywords = [topic, location]

    // Include Atlanta political keywords
    if (location.toLowerCase().includes("atlanta")) {
      keywords = keywords.concat(["Atlanta Politics", "Georgia Legislation", "Mayor of Atlanta"])
    }

    return keywords
  }
}

export default AiNewsService
