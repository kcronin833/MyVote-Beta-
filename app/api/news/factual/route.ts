import { NextResponse } from "next/server"
import { getClusteredFactualNews } from "@/lib/news-feed"

// Cache this route for 30 minutes — one RSS fetch + one Claude call per 30 min
// regardless of traffic.
export const revalidate = 1800

export async function GET() {
  try {
    // One card per event: cross-spectrum coverage clustered + fact-summarized
    // by a single grounded Claude call (with opinion pieces excluded).
    const news = await getClusteredFactualNews()
    if (news.length === 0) {
      return NextResponse.json({ success: false, news: [], error: "No articles returned" })
    }
    return NextResponse.json({ success: true, news })
  } catch (err) {
    console.error("Factual news error:", err)
    return NextResponse.json({ success: false, news: [], error: "Failed to fetch news" })
  }
}
