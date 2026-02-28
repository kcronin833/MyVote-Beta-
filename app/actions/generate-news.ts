"use server"

import { generateText } from "ai"
import {
  getFactualNewsWithPerspectives,
  type FactualNewsWithPerspectives,
} from "@/lib/news-service"

async function generateAIOverview(article: FactualNewsWithPerspectives): Promise<string> {
  try {
    const leftContext = article.leftArticles
      .map((a) => `- ${a.title} (${a.source})`)
      .join("\n")
    const rightContext = article.rightArticles
      .map((a) => `- ${a.title} (${a.source})`)
      .join("\n")

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a neutral, nonpartisan news analyst. Given the following headline and coverage from both left-leaning and right-leaning outlets, write a 2-3 sentence objective overview explaining what this story is about and why it matters. Do NOT take any political side. Stick only to verified facts. Do not editorialize.

Headline: ${article.title}
Description: ${article.description || "N/A"}
Source: ${article.source}

Left-leaning coverage:
${leftContext || "No coverage found."}

Right-leaning coverage:
${rightContext || "No coverage found."}

Write a concise, factual overview:`,
    })

    return result.text.trim()
  } catch (err) {
    console.error("AI overview generation failed for:", article.title, err)
    return article.description || ""
  }
}

export async function generateFactualNewsAction(): Promise<{
  success: boolean
  news: FactualNewsWithPerspectives[]
  error?: string
}> {
  try {
    const news = await getFactualNewsWithPerspectives()
    if (news.length > 0) {
      // Generate AI overviews for all articles in parallel
      const newsWithOverviews = await Promise.all(
        news.map(async (article) => {
          const aiOverview = await generateAIOverview(article)
          return { ...article, aiOverview }
        })
      )
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
