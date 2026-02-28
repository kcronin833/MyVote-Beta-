"use server"

import {
  getFactualNewsWithPerspectives,
  buildOverview,
  type FactualNewsWithPerspectives,
} from "@/lib/news-service"

export async function generateFactualNewsAction(): Promise<{
  success: boolean
  news: FactualNewsWithPerspectives[]
  error?: string
}> {
  try {
    const news = await getFactualNewsWithPerspectives()
    if (news.length > 0) {
      // Build overviews from article data + perspective coverage
      const newsWithOverviews = news.map((article) => ({
        ...article,
        aiOverview: buildOverview(article),
      }))
      return { success: true, news: newsWithOverviews }
    }
    return {
      success: false,
      error: "No articles returned. Check your NEWS_API_KEY.",
      news: [],
    }
  } catch (error) {
    console.error("Error generating factual news:", error)
    return {
      success: false,
      error: "Failed to generate news",
      news: [],
    }
  }
}
