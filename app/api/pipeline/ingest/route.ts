import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const maxDuration = 60

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

// Extracts a tag's text content, handling CDATA and nested tags
function extractTag(xml: string, tag: string): string {
  const cdataRe = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i")
  const m = xml.match(cdataRe)
  if (m) return m[1].trim()
  const plainRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  const m2 = xml.match(plainRe)
  return m2 ? m2[1].replace(/<[^>]+>/g, "").trim() : ""
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, "i")
  const m = xml.match(re)
  return m ? m[1] : ""
}

function extractImageUrl(item: string): string | null {
  return (
    extractAttr(item, "media:content", "url") ||
    extractAttr(item, "media:thumbnail", "url") ||
    extractAttr(item, "enclosure", "url") ||
    null
  )
}

interface RSSItem {
  title: string
  description: string
  url: string
  imageUrl: string | null
  publishedAt: string | null
}

function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRe.exec(xml)) !== null) {
    const raw = match[1]
    const title = extractTag(raw, "title")
    const description = extractTag(raw, "description")
    const link = extractTag(raw, "link") || extractTag(raw, "guid")
    const pubDate = extractTag(raw, "pubDate") || extractTag(raw, "dc:date")
    const imageUrl = extractImageUrl(raw)
    if (title && link && link.startsWith("http")) {
      items.push({
        title: title.slice(0, 500),
        description: description.slice(0, 1000),
        url: link,
        imageUrl: imageUrl ? imageUrl.slice(0, 500) : null,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      })
    }
  }
  return items
}

async function fetchRSS(url: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "MyVote-Bot/1.0 (news aggregator)" },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseRSS(xml)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Fetch all active sources
  const { data: sources, error: srcErr } = await supabase
    .from("sources")
    .select("id, name, rss_url, lean, lean_label")
    .eq("active", true)

  if (srcErr || !sources) {
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 })
  }

  // Fetch all RSS feeds in parallel
  const feedResults = await Promise.all(
    sources.map(async (src) => {
      const items = await fetchRSS(src.rss_url)
      return { source: src, items }
    })
  )

  // Build rows, deduplicating on URL across all feeds
  const seen = new Set<string>()
  const rows: Array<{
    source_id: string
    title: string
    description: string
    url: string
    image_url: string | null
    published_at: string | null
  }> = []

  for (const { source, items } of feedResults) {
    for (const item of items) {
      if (seen.has(item.url)) continue
      seen.add(item.url)
      rows.push({
        source_id: source.id,
        title: item.title,
        description: item.description,
        url: item.url,
        image_url: item.imageUrl,
        published_at: item.publishedAt,
      })
    }
  }

  // Upsert in batches of 100 (ignore conflicts on URL)
  let inserted = 0
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100)
    const { error } = await supabase
      .from("raw_articles")
      .upsert(batch, { onConflict: "url", ignoreDuplicates: true })
    if (!error) inserted += batch.length
  }

  return NextResponse.json({
    ok: true,
    sources: sources.length,
    articles_fetched: rows.length,
    articles_inserted: inserted,
    timestamp: new Date().toISOString(),
  })
}

// Allow Vercel cron (GET) to hit this route
export async function GET(req: NextRequest) {
  return POST(req)
}
