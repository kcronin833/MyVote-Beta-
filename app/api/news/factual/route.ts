import { NextResponse } from "next/server"
import { getFactualNewsWithPerspectives, buildOverview } from "@/lib/news-service"
import { generateFactualSummaries } from "@/lib/news-ai"

// Cache this route for 30 minutes — one RSS fetch + one Claude call per 30 min
// regardless of traffic.
export const revalidate = 1800

export async function GET() {
  try {
    const news = await getFactualNewsWithPerspectives()
    if (news.length === 0) {
      return NextResponse.json({ success: false, news: [], error: "No articles returned" })
    }
    // Real AI "Just the Facts": one grounded Claude call summarizes every
    // headline from its cross-spectrum coverage. Falls back to the templated
    // overview per-item if the model is unavailable, so the feed never breaks.
    const aiSummaries = await generateFactualSummaries(news)
    const newsWithOverviews = news.map((article, i) => ({
      ...article,
      aiOverview: aiSummaries?.get(i) || buildOverview(article),
      aiGenerated: !!aiSummaries?.get(i),
    }))
    return NextResponse.json({ success: true, news: newsWithOverviews })
  } catch (err) {
    console.error("Factual news error:", err)
    return NextResponse.json({ success: false, news: [], error: "Failed to fetch news" })
  }
}
