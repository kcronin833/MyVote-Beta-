import type { SupabaseClient } from "@supabase/supabase-js"

const GNEWS_BASE = "https://gnews.io/api/v4"
const TOPICS = ["nation", "politics", "world", "business"]

// Reject articles that are clearly sports, entertainment, or lifestyle — not relevant
// to a political-news platform. Keep this list specific to avoid false positives
// (e.g. "draft" without a sport context is fine).
const OFF_TOPIC_BLOCKLIST = /\b(nfl|nba|mlb|nhl|nascar|ufc|mma|espn|ncaa|super\s?bowl|world\s?series|stanley\s?cup|nba\s?finals|play-?off|championship\s+game|tournament\s+bracket|traded?\s+(to|from)|free\s?agent|roster\s+move|starting\s+lineup|head\s+coach|touchdown|quarterback|home\s?run|slam\s?dunk|hat\s?trick|grand\s?prix|formula\s+one|f1\s+race|grammy|oscar\s+winner|academy\s+award|box\s+office|movie\s+review|album\s+release|music\s+video|celebrity\s+couple|reality\s+tv|bachelor|dancing\s+with|survivor\s+cast|nfl\s+draft|nba\s+draft|mlb\s+draft)\b/i

function isOffTopic(article: GNewsArticle): boolean {
  const text = `${article.title} ${article.description || ""}`.toLowerCase()
  return OFF_TOPIC_BLOCKLIST.test(text)
}

const FALLBACK_LEANS: Record<string, { lean: number; lean_label: string; name: string }> = {
  "nytimes.com":        { lean: -1, lean_label: "Center Left",  name: "New York Times" },
  "washingtonpost.com": { lean: -1, lean_label: "Center Left",  name: "Washington Post" },
  "cnn.com":            { lean: -1, lean_label: "Center Left",  name: "CNN" },
  "abcnews.go.com":     { lean: -1, lean_label: "Center Left",  name: "ABC News" },
  "cbsnews.com":        { lean: -1, lean_label: "Center Left",  name: "CBS News" },
  "nbcnews.com":        { lean: -1, lean_label: "Center Left",  name: "NBC News" },
  "pbs.org":            { lean: -1, lean_label: "Center Left",  name: "PBS NewsHour" },
  "theatlantic.com":    { lean: -2, lean_label: "Left",         name: "The Atlantic" },
  "vox.com":            { lean: -2, lean_label: "Left",         name: "Vox" },
  "slate.com":          { lean: -2, lean_label: "Left",         name: "Slate" },
  "motherjones.com":    { lean: -3, lean_label: "Far Left",     name: "Mother Jones" },
  "politico.com":       { lean:  0, lean_label: "Center",       name: "Politico" },
  "bbc.com":            { lean:  0, lean_label: "Center",       name: "BBC News" },
  "axios.com":          { lean:  0, lean_label: "Center",       name: "Axios" },
  "bloomberg.com":      { lean:  0, lean_label: "Center",       name: "Bloomberg" },
  "usatoday.com":       { lean:  0, lean_label: "Center",       name: "USA Today" },
  "newsweek.com":       { lean:  0, lean_label: "Center",       name: "Newsweek" },
  "theweek.com":        { lean:  0, lean_label: "Center",       name: "The Week" },
  "time.com":           { lean: -1, lean_label: "Center Left",  name: "Time" },
  "forbes.com":         { lean:  1, lean_label: "Center Right", name: "Forbes" },
  "wsj.com":            { lean:  1, lean_label: "Center Right", name: "Wall Street Journal" },
  "nypost.com":         { lean:  2, lean_label: "Right",        name: "New York Post" },
  "reason.com":         { lean:  1, lean_label: "Center Right", name: "Reason" },
  "dailycaller.com":    { lean:  2, lean_label: "Right",        name: "Daily Caller" },
  "theepochtimes.com":  { lean:  3, lean_label: "Far Right",    name: "Epoch Times" },
  "thefederalist.com":  { lean:  3, lean_label: "Far Right",    name: "The Federalist" },
}

const UNKNOWN_SOURCE_ID = "fb736fd8-12f5-4af4-8dfe-9e550de4b340"

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, "") }
  catch { return "" }
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
      console.error(`[ingest] GNews ${res.status}:`, await res.text())
      return []
    }
    const data = await res.json()
    return data.articles || []
  } catch (err) {
    console.error("[ingest] fetch error:", err)
    return []
  }
}

export async function runIngest(supabase: SupabaseClient) {
  const gnewsKey = process.env.GNEWS_API_KEY
  if (!gnewsKey) throw new Error("GNEWS_API_KEY is not set in environment variables")

  // Load sources indexed by domain
  const { data: sourceRows } = await supabase
    .from("sources")
    .select("id, domain, lean, lean_label, name")

  const sourceMap = new Map((sourceRows || []).map((s: { domain: string; id: string; lean: number; lean_label: string; name: string }) => [s.domain, s]))

  // Fetch GNews feeds — topic-specific only (no undirected top-headlines which pulls in sports/entertainment)
  const params = `lang=en&country=us&max=10&apikey=${gnewsKey}`
  const feeds = TOPICS.map((t) => `${GNEWS_BASE}/top-headlines?topic=${t}&${params}`)

  const allArticles: GNewsArticle[] = []
  for (let i = 0; i < feeds.length; i++) {
    const articles = await fetchGNews(feeds[i])
    allArticles.push(...articles)
    if (i < feeds.length - 1) await new Promise((r) => setTimeout(r, 300))
  }

  if (allArticles.length === 0) throw new Error("GNews returned no articles — check GNEWS_API_KEY")

  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = allArticles.filter((a) => {
    if (!a.url || seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })

  // Upsert any new sources from FALLBACK_LEANS
  const toInsert: Array<{ name: string; domain: string; lean: number; lean_label: string }> = []
  const queued = new Set<string>()
  for (const a of unique) {
    const domain = extractDomain(a.url)
    if (!domain || sourceMap.has(domain) || queued.has(domain)) continue
    const fb = FALLBACK_LEANS[domain]
    if (fb) {
      toInsert.push({ name: fb.name, domain, lean: fb.lean, lean_label: fb.lean_label })
      queued.add(domain)
    }
  }
  if (toInsert.length > 0) {
    const { data: inserted } = await supabase
      .from("sources")
      .upsert(toInsert, { onConflict: "domain", ignoreDuplicates: true })
      .select("id, domain, lean, lean_label, name")
    for (const s of inserted || []) sourceMap.set(s.domain, s)
  }

  // Strip sports / entertainment articles before they enter the database
  const relevant = unique.filter((a) => a.title && !isOffTopic(a))
  const skipped = unique.length - relevant.length
  if (skipped > 0) console.log(`[ingest] filtered out ${skipped} off-topic articles`)

  // Build rows
  const rows = relevant
    .filter((a) => a.url)
    .map((a) => {
      const domain = extractDomain(a.url)
      const src = sourceMap.get(domain)
      return {
        source_id: src?.id ?? UNKNOWN_SOURCE_ID,
        title: a.title.slice(0, 500),
        description: (a.description || a.content || "").slice(0, 1000) || null,
        url: a.url,
        image_url: null as null,
        published_at: a.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString(),
      }
    })

  let inserted = 0
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await supabase
      .from("raw_articles")
      .upsert(rows.slice(i, i + 100), { onConflict: "url", ignoreDuplicates: true })
    if (!error) inserted += Math.min(100, rows.length - i)
  }

  return { fetched: allArticles.length, deduped: unique.length, off_topic_filtered: skipped, articles_inserted: inserted }
}
