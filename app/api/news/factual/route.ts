import { NextResponse } from "next/server"
import { getFactualNewsWithPerspectives, buildOverview } from "@/lib/news-service"

// Cache this route for 30 minutes — one NewsAPI call per 30 min regardless of traffic
export const revalidate = 1800

export async function GET() {
  try {
    const news = await getFactualNewsWithPerspectives()
    if (news.length === 0) {
      return NextResponse.json({ success: false, news: [], error: "No articles returned" })
    }
    const newsWithOverviews = news.map((article) => ({
      ...article,
      aiOverview: buildOverview(article),
    }))
    return NextResponse.json({ success: true, news: newsWithOverviews })
  } catch (err) {
    console.error("Factual news error:", err)
    return NextResponse.json({ success: false, news: [], error: "Failed to fetch news" })
  }
}
