"use server"

import { generateFactualNews } from "@/lib/mock-ai-service"

export async function generateFactualNewsAction() {
  try {
    const news = await generateFactualNews()
    return { success: true, news }
  } catch (error) {
    console.error("Error generating factual news:", error)
    return {
      success: false,
      error: "Failed to generate news",
      news: [],
    }
  }
}
