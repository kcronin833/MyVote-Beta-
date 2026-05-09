import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const maxDuration = 60

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

const GNEWS_KEY = process.env.GNEWS_API_KEY
const GNEWS_BASE = "https://gnews.io/api/v4"

// Political topics — each counts as one API request against the daily quota.
// Free tier = 100 req/day. Daily cron uses 3 requests/run = safe on free tier.
// Upgrade to GNews Basic ($9/mo) to unlock hourly runs (100 articles/call).
const TOPICS = ["nation", "politics", "world"]

// Lean scores for outlets not yet in the sources table.
// Scale: -3 (far left) to +3 (far right), matching our sources table.
const FALLBACK_LEANS: Record<string, { lean: number; lean_label: string; name: string }> = {
  "nytimes.com":         { lean: -1, lean_label: "Center Left",  name: "New York Times" },
  "washingtonpost.com":  { lean: -1, lean_label: "Center Left",  name: "Washington Post" },
  "cnn.com":             { lean: -1, lean_label: "Center Left",  name: "CNN" },
  "abcnews.go.com":      { lean: -1, lean_label: "Center Left",  name: "ABC News" },
  "cbsnews.com":         { lean: -1, lean_label: "Center Left",  name: "CBS News" },
  "nbcnews.com":         { lean: -1, lean_label: "Center Left",  name: "NBC News" },
  "pbs.org":             { lean: -1, lean_label: "Center Left",  name: "PBS NewsHour" },
  "theatlantic.com":     { lean: -2, lean_label: "Left",         name: "The Atlantic" },
  "vox.com":             { lean: -2, lean_label: "Left",         name: "Vox" },
  "slate.com":           { lean: -2, lean_label: "Left",         name: "Slate" },
  "motherjones.com":     { lean: -3, lean_label: "Far Left",     name: "Mother Jones" },
  "politico.com":        { lean:  0, lean_label: "Center",       name: "Politico" },
  "bbc.com":             { lean:  0, lean_label: "Center",       name: "BBC News" },
  "axios.com":           { lean:  0, lean_label: "Center",       name: "Axios" },
  "bloomberg.com":       { lean:  0, lean_label: "Center",       name: "Bloomberg" },
  "usatoday.com":        { lean:  0, lean_label: "Center",       name: "USA Today" },
  "newsweek.com":        { lean:  0, lean_label: "Center",       name: "Newsweek" },
  "theweek.com":         { lean:  0, lean_label: "Center",       name: "The Week" },
  "time.com":            { lean: -1, lean_label: "Center Left",  name: "Time" },
  "forbes.com":          { lean:  1, lean_label: "Center Right", name: "Forbes" },
  "wsj.com":             { lean:  1, lean_label: "Center Right", name: "Wall Street Journal" },
  "nypost.com":          { lean:  2, lean_label: "Right",        name: "New York Post" },
  "reason.com":          { lean:  1, lean_label: "Center Right", name: "Reason" },
  "dailycaller.com":     { lean:  2, lean_label: "Right",        name: "Daily Caller" },
  "theepochtimes.com":   { lean:  3, lean_label: "Far Right",    name: "Epoch Times" },
  "thefederalist.com":   { lean:  3, lean_label: "Far Right",    name: "The Federalist" },
}

// Fallback source ID for domains not in DB and not in FALLBACK_LEANS
const UNKNOWN_SOURCE_ID = "fb736fd8-12f5-4af4-8dfe-9e550de4b340"

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

interface GNewsArticle {
  title: string
  description: string | null
  content: string | null
  url: string
  publishedAt: string
  source: { name: string; url: string }
}

async function fetchGNews(endpoint: string): Promise<GNewsArticle[]> {
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) {
      console.error(`[ingest] GNews ${res.status}: ${await res.text()}`)
      return []
    }
    const data = await res.json()
    return data.articles || []
  } catch (err) {
    console.error("[ingest] GNews fetch error:", err)
    return []
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!GNEWS_KEY) {
    return NextResponse.json({ error: "GNEWS_API_KEY not set" }, { status: 500 })
  }

  const supabase = createServiceClient()

  // Load all sources indexed by domain for O(1) lookup
  const { data: sourceRows } = await supabase
    .from("sources")
    .select("id, domain, lean, lean_label, name")

  // domain → source row (mutable — we add new sources during this run)
  const sourceMap = new Map(
    (sourceRows || []).map((s) => [s.domain, s])
  )

  // Fetch GNews: top headlines + political topic feeds
  const params = `lang=en&country=us&max=10&apikey=${GNEWS_KEY}`
  const feeds = [
    `${GNEWS_BASE}/top-headlines?${params}`,
    ...TOPICS.map((t) => `${GNEWS_BASE}/top-headlines?topic=${t}&${params}`),
  ]

  const allArticles: GNewsArticle[] = []
  for (const url of feeds) {
    const articles = await fetchGNews(url)
    allArticles.push(...articles)
    // Small delay between requests to stay within rate limits
    if (feeds.indexOf(url) < feeds.length - 1) {
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  if (allArticles.length === 0) {
    return NextResponse.json({ error: "GNews returned no articles" }, { status: 500 })
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = allArticles.filter((a) => {
    if (!a.url || seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })

  // For each article, resolve source_id — upsert unknown sources into DB
  const newSourcesToInsert: Array<{ name: string; domain: string; lean: number; lean_label: string }> = []
  const domainToNewSource = new Map<string, (typeof newSourcesToInsert)[0]>()

  for (const article of unique) {
    const domain = extractDomain(article.url)
    if (!domain || sourceMap.has(domain)) continue

    // Already queued for insert this run?
    if (domainToNewSource.has(domain)) continue

    const fallback = FALLBACK_LEANS[domain]
    if (fallback) {
      const row = { name: fallback.name, domain, lean: fallback.lean, lean_label: fallback.lean_label }
      newSourcesToInsert.push(row)
      domainToNewSource.set(domain, row)
    }
    // Truly unknown domains get UNKNOWN_SOURCE_ID — no insert needed
  }

  // Batch-upsert new sources
  if (newSourcesToInsert.length > 0) {
    const { data: inserted } = await supabase
      .from("sources")
      .upsert(newSourcesToInsert, { onConflict: "domain", ignoreDuplicates: true })
      .select("id, domain, lean, lean_label, name")

    for (const src of inserted || []) {
      sourceMap.set(src.domain, src)
    }
  }

  // Build raw_articles rows
  const rows: Array<{
    source_id: string
    title: string
    description: string | null
    url: string
    image_url: null
    published_at: string
  }> = []

  for (const article of unique) {
    if (!article.title || !article.url) continue
    const domain = extractDomain(article.url)
    const source = sourceMap.get(domain)
    const sourceId = source?.id ?? UNKNOWN_SOURCE_ID

    const description = (article.description || article.content || "").slice(0, 1000) || null

    rows.push({
      source_id: sourceId,
      title: article.title.slice(0, 500),
      description,
      url: article.url,
      image_url: null,
      published_at: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : new Date().toISOString(),
    })
  }

  // Upsert in batches of 100, ignore duplicate URLs
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
    fetched: allArticles.length,
    deduped: unique.length,
    articles_inserted: inserted,
    new_sources: newSourcesToInsert.length,
    timestamp: new Date().toISOString(),
  })
}

// Vercel cron hits GET
export async function GET(req: NextRequest) {
  return POST(req)
}
