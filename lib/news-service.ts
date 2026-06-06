// News service using NewsAPI.org
// Get your free API key at https://newsapi.org

import {
  STOP_WORDS,
  POLITICAL_KEYWORDS,
  HOT_BUTTON_KEYWORDS,
  LEFT_DOMAINS,
  RIGHT_DOMAINS,
} from "@/lib/news-constants"

const BASE_URL = "https://newsapi.org/v2"

// Source IDs recognized by NewsAPI — used in the `sources=` param to lock API-level filtering
const ALLOWED_SOURCE_IDS =
  "associated-press,reuters,politico,the-hill,axios,npr,pbs-newshour"

// Left-leaning source IDs available on NewsAPI free plan
const LEFT_SOURCE_IDS =
  "cnn,msnbc,the-huffington-post,nbc-news,the-washington-post,the-new-york-times,abc-news"

// Right-leaning source IDs available on NewsAPI free plan
const RIGHT_SOURCE_IDS =
  "fox-news,national-review,the-washington-examiner,the-wall-street-journal,breitbart-news"

// Canonical source names returned by NewsAPI for the allowlisted outlets.
// WSJ, NYT, and AJC are fetched via domains rather than source IDs.
const ALLOWED_SOURCE_NAMES = new Set([
  "associated press",
  "reuters",
  "politico",
  "the hill",
  "axios",
  "npr",
  "pbs newshour",
  "the wall street journal",
  "the new york times",
  "atlanta journal-constitution",
  "ajc",
])

// Terms in title OR description that indicate non-political content.
// Checked server-side before any article reaches the frontend.
const CONTENT_BLOCKLIST =
  /\b(athlete|athletes|baseball|football|basketball|soccer|sports|sport|poll|polls|ranking|rankings|standings|NFL|NBA|MLB|NHL|Marvel|comics|superhero|cricket|Bihar|Modi|Malaysian|Malaysia|Indonesia|Indonesian|Premier League|Champions League|Bollywood|Nollywood|K-pop|anime|manga|Eurovision|LaLiga|Bundesliga|Serie\s+A|Ligue\s+1|IPL|PSL|BBL|T20|Test\s+match|Rugby|Formula\s+1|F1\s+race|UFC|MMA|WWE|boxing|horse\s+racing|tennis|golf|swim|swimmer|gymnastics|Olympics|Olympic\s+trial|track\s+and\s+field|photo\s+gallery|photo\s+of|photos\s+of|image\s+of|gallery)\b/i

// Source names that are explicitly blocked regardless of topic.
const BLOCKED_SOURCE_NAMES = new Set([
  "savannah morning news",
  "sports illustrated",
  "espn",
  "bleacher report",
  "the athletic",
  "deadspin",
])

function isBlocklisted(article: { title: string; description: string; source: string }): boolean {
  const titleAndDesc = `${article.title} ${article.description}`

  if (CONTENT_BLOCKLIST.test(titleAndDesc)) {
    console.log(`[news-filter] Keyword drop – source="${article.source}": "${article.title}"`)
    return true
  }

  if (BLOCKED_SOURCE_NAMES.has(article.source.toLowerCase())) {
    console.log(`[news-filter] Source drop – "${article.source}": "${article.title}"`)
    return true
  }

  return false
}

function isAllowedSource(sourceName: string): boolean {
  return ALLOWED_SOURCE_NAMES.has(sourceName.toLowerCase())
}

// Strip HTML tags from API responses to prevent React script tag warnings
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getApiKey() {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    console.error("[v0] NEWS_API_KEY is not set");
  }
  return key || "";
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
  content: string | null;
}

// Fetch national political news - left-leaning sources
export async function getLeftNews(): Promise<NewsArticle[]> {
  const sources = "huffpost,the-huffington-post,the-nation,mother-jones,msnbc";
  return fetchNewsFromSources(sources, "politics OR policy OR government");
}

// Fetch national political news - right-leaning sources
export async function getRightNews(): Promise<NewsArticle[]> {
  const sources = "fox-news,breitbart-news,the-daily-wire,the-washington-examiner";
  return fetchNewsFromSources(sources, "politics OR policy OR government");
}

// Fetch factual/objective news from mainstream sources - politics only
export async function getFactualNews(): Promise<NewsArticle[]> {
  const [headlines, political] = await Promise.all([
    fetchTopHeadlines(),
    fetchEverything("Congress OR Senate OR White House OR Supreme Court OR election OR legislation OR Georgia politics"),
  ]);
  const seen = new Set<string>();
  const combined: NewsArticle[] = [];
  for (const a of [...headlines, ...political]) {
    if (!seen.has(a.url)) { seen.add(a.url); combined.push(a); }
  }
  return combined
    .filter(isPoliticalArticle)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 15);
}

// ─── Atlanta local news ───────────────────────────────────────────────────────
// Two-layer strategy:
//   1. RSS feeds pulled directly from each outlet — widest topic variety
//   2. Topic-bucketed GNews queries — guaranteed coverage across civic areas
// Results are merged, deduplicated by URL AND title fingerprint, sports/fluff filtered.

// Direct RSS feeds — WordPress sites are most reliable; TV stations vary
const ATLANTA_RSS_SOURCES: { name: string; urls: string[] }[] = [
  {
    name: "AJC",
    urls: [
      "https://www.ajc.com/news/?outputType=rss",
      "https://www.ajc.com/news/georgia/?outputType=rss",
      "https://www.ajc.com/news/local/?outputType=rss",
    ],
  },
  {
    name: "WSB-TV",
    urls: [
      "https://www.wsbtv.com/rss/section/news",
      "https://www.wsbtv.com/rss/",
    ],
  },
  {
    name: "11Alive",
    urls: [
      "https://www.11alive.com/feeds/rss/news/home",
      "https://www.11alive.com/feeds/syndication/rss/",
      "https://www.11alive.com/feeds/syndication/rss/?topicID=66262",
    ],
  },
  {
    name: "The Atlanta Voice",
    urls: ["https://theatlantavoice.com/feed/"],
  },
  {
    name: "Saporta Report",
    urls: ["https://saportareport.com/feed/"],
  },
  {
    name: "Decaturish",
    urls: ["https://decaturish.com/feed/"],
  },
  {
    name: "CBS46",
    urls: [
      "https://www.cbs46.com/rss/section/news",
      "https://www.cbs46.com/arcio/rss/",
    ],
  },
]

// Topic-bucketed GNews queries — run in parallel, one topic per bucket
// so diverse subjects are always represented even if RSS is sparse
const ATLANTA_GNEWS_BUCKETS = [
  `"Atlanta" (mayor OR "city council" OR "city hall" OR zoning OR "city budget")`,
  `"Atlanta" Georgia (crime OR police OR shooting OR arrest OR fire OR emergency)`,
  `Georgia (school board OR "public schools" OR education OR teacher OR superintendent)`,
  `"Atlanta" (hospital OR "public health" OR Medicaid OR healthcare OR "mental health")`,
  `"Atlanta" (MARTA OR transit OR traffic OR road OR highway OR airport OR infrastructure)`,
  `"Atlanta" (housing OR homeless OR "affordable housing" OR rent OR development OR zoning)`,
  `"Atlanta" Georgia (jobs OR "economic development" OR business OR unemployment OR economy)`,
  `Georgia (governor OR legislature OR "state senate" OR "state house" OR Kemp OR "2026 election")`,
]

// Strip sports, entertainment and lifestyle fluff — keep civic content
const LOCAL_JUNK = /\b(NFL|NBA|MLB|NHL|MLS|WNBA|NASCAR|PGA|ATP|WTA|Falcons|Braves|Hawks|Atlanta United|Gwinnett Stripers|football game|football score|basketball game|baseball game|soccer match|soccer score|tennis match|golf tournament|boxing|MMA|UFC|WWE|Olympics|gymnastics|swim meet|draft pick|trade rumor|box score|game recap|standings|fashion week|style tips|beauty tips|makeup|skincare|celebrity|Hollywood|movie review|film review|TV recap|album review|concert review|restaurant review|food review|recipe|horoscope|zodiac|lottery results|crossword|photo gallery)\b/i

// ── RSS helpers ───────────────────────────────────────────────────────────────

function extractRssText(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, "i"))
  if (cdata) return cdata[1].trim()
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))
  return plain ? plain[1].trim() : ""
}

function cleanRssHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&#039;|&apos;/g, "'")
    .replace(/\s+/g, " ").trim()
}

function parseRssItems(xml: string, sourceName: string): NewsArticle[] {
  const items: NewsArticle[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null
  while ((m = itemRegex.exec(xml)) !== null) {
    const raw = m[1]
    const title = cleanRssHtml(extractRssText(raw, "title"))
    const link =
      extractRssText(raw, "link") ||
      raw.match(/<link[^>]+href="([^"]+)"/)?.[1] ||
      extractRssText(raw, "guid")
    if (!title || !link || title === "[Removed]") continue
    const description = cleanRssHtml(extractRssText(raw, "description") || extractRssText(raw, "summary"))
    const pubDate = extractRssText(raw, "pubDate") || extractRssText(raw, "published") || extractRssText(raw, "dc:date")
    const urlToImage =
      raw.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ||
      raw.match(/<media:content[^>]+url="([^"]+)"/)?.[1] ||
      raw.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
      null
    let publishedAt = new Date().toISOString()
    if (pubDate) { const d = new Date(pubDate); if (!isNaN(d.getTime())) publishedAt = d.toISOString() }
    items.push({ title, description: description.substring(0, 400), url: link.trim(), source: sourceName, publishedAt, urlToImage, content: null })
  }
  return items
}

async function fetchOneRss(name: string, urls: string[]): Promise<NewsArticle[]> {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MyVote/1.0 (news aggregator)" },
        next: { revalidate: 3600 },
      })
      if (!res.ok) continue
      const xml = await res.text()
      const items = parseRssItems(xml, name)
      if (items.length > 0) return items
    } catch { /* try next URL */ }
  }
  console.warn(`[local-rss] ${name}: all URLs failed`)
  return []
}

async function fetchAtlantaRss(): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    ATLANTA_RSS_SOURCES.map(({ name, urls }) => fetchOneRss(name, urls))
  )
  const all: NewsArticle[] = []
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value)
  }
  return all
}

// ── GNews topic-bucket helper ─────────────────────────────────────────────────

async function fetchAtlantaGNewsBuckets(apiKey: string): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    ATLANTA_GNEWS_BUCKETS.map(async (q) => {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=us&max=5&apikey=${apiKey}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) return [] as NewsArticle[]
      const data = await res.json()
      return ((data.articles || []) as any[]).map((a: any) => ({
        title: a.title || "",
        description: a.description || "",
        url: a.url,
        source: a.source?.name || "Unknown",
        publishedAt: a.publishedAt,
        urlToImage: a.image || null,
        content: null,
      }))
    })
  )
  const all: NewsArticle[] = []
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value)
  }
  return all
}

// ── Title fingerprint deduplication ──────────────────────────────────────────
// Strips punctuation/stopwords and keeps first 8 words as a fingerprint so
// the same story from AJC and WSB-TV only appears once.
const TITLE_STOP = new Set(["the", "a", "an", "and", "or", "of", "in", "to", "is", "are", "was", "were", "for", "on", "at", "by", "with"])
function titleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !TITLE_STOP.has(w))
    .slice(0, 8)
    .join(" ")
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function getLocalNews(location: string = "Atlanta"): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY

  const isAtlanta = !location || location === "Atlanta"

  // Fetch both layers in parallel for Atlanta
  const [rssArticles, gnewsArticles] = await Promise.all([
    isAtlanta ? fetchAtlantaRss().catch(() => [] as NewsArticle[]) : Promise.resolve([] as NewsArticle[]),
    apiKey
      ? (isAtlanta
          ? fetchAtlantaGNewsBuckets(apiKey).catch(() => [] as NewsArticle[])
          : (async () => {
              const q = `"${location}" Georgia (government OR crime OR education OR health OR housing OR transit OR business)`
              try {
                const res = await fetch(
                  `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=us&max=25&apikey=${apiKey}`,
                  { next: { revalidate: 3600 } }
                )
                if (!res.ok) return [] as NewsArticle[]
                const data = await res.json()
                return ((data.articles || []) as any[]).map((a: any) => ({
                  title: a.title || "", description: a.description || "", url: a.url,
                  source: a.source?.name || "Unknown", publishedAt: a.publishedAt,
                  urlToImage: a.image || null, content: null,
                }))
              } catch { return [] as NewsArticle[] }
            })()
        )
      : Promise.resolve([] as NewsArticle[]),
  ])

  // Merge: RSS first (real outlet breadth), then GNews buckets (topic fill)
  const seenUrl = new Set<string>()
  const seenTitle = new Set<string>()
  const merged: NewsArticle[] = []

  for (const article of [...rssArticles, ...gnewsArticles]) {
    if (!article.url || !article.title) continue
    if (seenUrl.has(article.url)) continue
    const fp = titleFingerprint(article.title)
    if (fp && seenTitle.has(fp)) continue
    const text = `${article.title} ${article.description}`
    if (LOCAL_JUNK.test(text)) continue
    seenUrl.add(article.url)
    if (fp) seenTitle.add(fp)
    merged.push(article)
  }

  return merged
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 40)
}

// Search news
export async function searchNews(query: string): Promise<NewsArticle[]> {
  return fetchEverything(query);
}

// Fetch factual headlines with left & right perspective articles for each topic
export interface FactualNewsWithPerspectives {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  urlToImage: string | null
  category: string
  aiOverview: string
  controversyScore: number // 0-100
  leftArticles: NewsArticle[]
  rightArticles: NewsArticle[]
}

// Constants (STOP_WORDS, POLITICAL_KEYWORDS, HOT_BUTTON_KEYWORDS, LEFT_DOMAINS, RIGHT_DOMAINS)
// are imported from @/lib/news-constants

function isPoliticalArticle(article: NewsArticle): boolean {
  const text = `${article.title} ${article.description}`.toLowerCase()
  return POLITICAL_KEYWORDS.test(text)
}

// Rough filter: exclude stories that are clearly about non-US countries' domestic politics
const FOREIGN_POLITICS_PATTERN = /\b(uk parliament|british pm|prime minister (starmer|sunak|trudeau|modi|macron|scholz)|french (election|president|senate)|german (bundestag|chancellor)|canadian (parliament|trudeau)|australian (parliament|pm)|israeli (knesset|netanyahu)|russian (duma|kremlin|putin)|chinese (xi jinping|ccp|politburo)|north korea|south korean|japanese (diet|kishida)|indian (modi|parliament|bjp)|european parliament|eu commission)\b/i

function isAmericanNews(article: NewsArticle): boolean {
  const text = `${article.title} ${article.description}`
  return !FOREIGN_POLITICS_PATTERN.test(text)
}

/**
 * Build a tight search query from a headline: keep only meaningful words,
 * strip source attribution, and limit length.
 */
function buildSearchQuery(title: string): string {
  const cleaned = title
    .replace(/\s*[-|]\s*[A-Z][\w\s.]*$/, "") // strip trailing " - Source Name"
    .replace(/['']/g, "'")
    .replace(/[^a-zA-Z0-9\s']/g, " ")
    .trim()

  const words = cleaned
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()))

  // Take up to 6 meaningful words to keep the query specific
  return words.slice(0, 6).join(" ")
}

/**
 * Calculate a controversy score (0-100) based on:
 * - Coverage breadth: how many left AND right outlets are covering it
 * - Topic heat: whether the headline contains hot-button keywords
 * - Cross-spectrum coverage: bonus when both sides cover the same story
 */
export function calculateControversyScore(
  article: Pick<FactualNewsWithPerspectives, "title" | "description" | "leftArticles" | "rightArticles">
): number {
  let score = 0
  const leftCount = article.leftArticles.length
  const rightCount = article.rightArticles.length
  const totalCoverage = leftCount + rightCount

  // Base score from total coverage (max 35 points)
  score += Math.min(totalCoverage * 7, 35)

  // Cross-spectrum bonus: both sides covering = more controversial (max 30 points)
  if (leftCount > 0 && rightCount > 0) {
    const minSide = Math.min(leftCount, rightCount)
    score += Math.min(minSide * 15, 30)
  }

  // Hot-button keyword bonus (max 35 points)
  const text = `${article.title} ${article.description}`
  const matches = text.match(new RegExp(HOT_BUTTON_KEYWORDS.source, "gi"))
  if (matches) {
    score += Math.min(matches.length * 12, 35)
  }

  return Math.min(Math.max(score, 0), 100)
}

/**
 * Build a factual overview from headline data and perspective coverage.
 * Synthesizes context from the description + left/right article titles.
 */
export function buildOverview(
  article: FactualNewsWithPerspectives
): string {
  // Start with the description as the base
  const base = article.description
    ? article.description.replace(/\s*\[\+\d+ chars\]$/, "").trim()
    : ""

  // Summarise how many outlets are covering it
  const leftCount = article.leftArticles.length
  const rightCount = article.rightArticles.length

  const leftNames = [...new Set(article.leftArticles.map((a) => a.source))].slice(0, 3)
  const rightNames = [...new Set(article.rightArticles.map((a) => a.source))].slice(0, 3)

  let coverage = ""
  if (leftCount > 0 && rightCount > 0) {
    coverage = `This story is being covered across the political spectrum, including ${leftNames.join(", ")} on the left and ${rightNames.join(", ")} on the right.`
  } else if (leftCount > 0) {
    coverage = `This story is being covered by left-leaning outlets including ${leftNames.join(", ")}.`
  } else if (rightCount > 0) {
    coverage = `This story is being covered by right-leaning outlets including ${rightNames.join(", ")}.`
  }

  return [base, coverage].filter(Boolean).join(" ")
}

// ─── National news RSS sources (no API key, no rate limit) ──────────────────

// Classify an outlet's political lean by name
function getOutletLean(sourceName: string): "left" | "center" | "right" {
  const n = sourceName.toLowerCase()
  if (/\b(cnn|msnbc|huffpost|huffington|guardian|vox|slate|salon|daily beast|mother jones|the nation|intercept|democracy now|talking points memo)\b/.test(n)) return "left"
  if (/\b(fox news|foxnews|daily wire|breitbart|washington examiner|national review|new york post|daily caller|federalist|newsmax|oann|western journal|epoch times)\b/.test(n)) return "right"
  return "center"
}

// Center/neutral outlets — these are the "headline" stories shown as cards
const NATIONAL_CENTER_RSS: { name: string; urls: string[] }[] = [
  { name: "Associated Press", urls: ["https://feeds.apnews.com/apnews/topnews", "https://apnews.com/hub/ap-top-news?format=rss"] },
  { name: "NPR", urls: ["https://feeds.npr.org/1001/rss.xml"] },
  { name: "PBS NewsHour", urls: ["https://www.pbs.org/newshour/feeds/rss/headlines"] },
  { name: "The Hill", urls: ["https://thehill.com/homenews/feed/", "https://thehill.com/feed/"] },
  { name: "Politico", urls: ["https://www.politico.com/rss/politicopicks.xml", "https://www.politico.com/rss/congress.xml"] },
  { name: "Axios", urls: ["https://api.axios.com/feed/"] },
  { name: "Reuters", urls: ["https://feeds.reuters.com/reuters/topNews", "https://www.reutersagency.com/feed/?priority=top-news&format=rss"] },
]

// Left-leaning outlets — used for perspective matching
// Note: CNN and MSNBC have retired/blocked their public RSS feeds; replaced with
//       ABC News (politics) and Vox which publish reliable Atom/RSS.
const NATIONAL_LEFT_RSS: { name: string; urls: string[] }[] = [
  { name: "ABC News", urls: ["https://feeds.abcnews.com/abcnews/politicsheadlines", "https://feeds.abcnews.com/abcnews/topstories"] },
  { name: "The Guardian", urls: ["https://www.theguardian.com/us/rss", "https://www.theguardian.com/world/rss"] },
  { name: "HuffPost", urls: ["https://www.huffpost.com/section/front-page/feed", "https://www.huffpost.com/section/politics/feed"] },
  { name: "Vox", urls: ["https://www.vox.com/rss/index.xml", "https://www.vox.com/politics/rss"] },
]

// Right-leaning outlets — used for perspective matching
const NATIONAL_RIGHT_RSS: { name: string; urls: string[] }[] = [
  { name: "Fox News", urls: ["https://moxie.foxnews.com/google-publisher/politics.xml", "https://feeds.foxnews.com/foxnews/politics"] },
  { name: "Washington Examiner", urls: ["https://www.washingtonexaminer.com/section/politics/feed", "https://www.washingtonexaminer.com/feed"] },
  { name: "Breitbart", urls: ["https://feeds.feedburner.com/breitbart", "https://www.breitbart.com/feed/"] },
  { name: "Daily Caller", urls: ["https://dailycaller.com/feed/"] },
]

async function fetchNationalRssPool(
  sources: { name: string; urls: string[] }[]
): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    sources.map(({ name, urls }) => fetchOneRss(name, urls))
  )
  const all: NewsArticle[] = []
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value)
  }
  return all
}

export async function getFactualNewsWithPerspectives(): Promise<FactualNewsWithPerspectives[]> {
  // Fetch all three RSS pools in parallel — no API key, no rate limit
  const [centerRaw, leftRaw, rightRaw] = await Promise.all([
    fetchNationalRssPool(NATIONAL_CENTER_RSS),
    fetchNationalRssPool(NATIONAL_LEFT_RSS),
    fetchNationalRssPool(NATIONAL_RIGHT_RSS),
  ])

  // Deduplicate center pool by URL + title fingerprint, filter junk
  const seenUrl = new Set<string>()
  const seenFp = new Set<string>()
  const centerArticles: NewsArticle[] = []
  for (const a of centerRaw) {
    if (!a.title || !a.url) continue
    const fp = titleFingerprint(a.title)
    if (seenUrl.has(a.url) || seenFp.has(fp)) continue
    if (isBlocklisted(a)) continue
    seenUrl.add(a.url)
    seenFp.add(fp)
    centerArticles.push(a)
  }

  // Sort by recency, take top 12 center stories
  centerArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const topHeadlines = centerArticles.slice(0, 12)

  if (topHeadlines.length === 0) return []

  // For each center story, find related left/right articles by keyword overlap
  return topHeadlines.map((headline) => {
    const keywords = buildSearchQuery(headline.title)
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)

    const matchLeft = leftRaw
      .filter(a => !isBlocklisted(a) && keywords.some(kw => `${a.title} ${a.description}`.toLowerCase().includes(kw)))
      .slice(0, 3)
    const matchRight = rightRaw
      .filter(a => !isBlocklisted(a) && keywords.some(kw => `${a.title} ${a.description}`.toLowerCase().includes(kw)))
      .slice(0, 3)

    return {
      title: headline.title,
      description: headline.description,
      source: headline.source,
      publishedAt: headline.publishedAt,
      url: headline.url,
      urlToImage: headline.urlToImage,
      category: "political",
      aiOverview: "",
      controversyScore: calculateControversyScore({
        title: headline.title,
        description: headline.description,
        leftArticles: matchLeft,
        rightArticles: matchRight,
      }),
      leftArticles: matchLeft,
      rightArticles: matchRight,
    }
  })
}

// ---- Internal helpers ----

async function fetchTopHeadlines(): Promise<NewsArticle[]> {
  const url = `${BASE_URL}/top-headlines?sources=${ALLOWED_SOURCE_IDS}&pageSize=30&apiKey=${getApiKey()}`
  return fetchAndParse(url)
}

async function fetchFromSourceIds(sourceIds: string, pageSize = 20): Promise<NewsArticle[]> {
  const url = `${BASE_URL}/everything?sources=${sourceIds}&sortBy=publishedAt&language=en&pageSize=${pageSize}&apiKey=${getApiKey()}`
  return fetchAndParse(url)
}

async function fetchNewsFromSources(
  sources: string,
  q: string
): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(q);
  const url = `${BASE_URL}/everything?sources=${sources}&q=${encoded}&sortBy=publishedAt&pageSize=6&apiKey=${getApiKey()}`;
  return fetchAndParse(url);
}

async function fetchEverything(q: string): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(q)
  // sources= locks results to the allowlist; language=en ensures US English only
  const url = `${BASE_URL}/everything?sources=${ALLOWED_SOURCE_IDS}&q=${encoded}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${getApiKey()}`
  return fetchAndParse(url)
}

async function fetchEverythingFromDomains(
  q: string,
  domains: string
): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(q);
  const url = `${BASE_URL}/everything?q=${encoded}&domains=${domains}&sortBy=relevancy&language=en&pageSize=5&apiKey=${getApiKey()}`;
  return fetchAndParse(url);
}

async function fetchAndParse(url: string): Promise<NewsArticle[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 900 } }); // cache 15 min
    if (!res.ok) {
      console.error("NewsAPI error:", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    if (data.status !== "ok") return [];

    const mapped: NewsArticle[] = (data.articles || [])
      .filter((a: any) => a.title && a.title !== "[Removed]")
      .map((a: any) => ({
        title: stripHtml(a.title || ""),
        description: stripHtml(a.description || ""),
        url: a.url,
        source: a.source?.name || "Unknown",
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage || null,
        content: stripHtml(a.content || ""),
      }))

    return mapped.filter((a) => {
      if (isBlocklisted(a)) return false
      return true
    })
    // Note: source allowlist enforcement happens at the API query level via
    // sources= param. The blocklist above is the post-fetch safety net.
  } catch (err) {
    console.error("Failed to fetch news:", err);
    return [];
  }
}

// Format relative time like "2 hours ago"
export function formatNewsTime(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
