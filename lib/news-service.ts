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

const SPORTS_KEYWORDS = /\b(baseball|football|basketball|soccer|NFL|NBA|MLB|NHL|NASCAR|tournament|standings|draft|trade|roster|coach|athletics|Olympics|Super Bowl|World Series|March Madness|playoff|game seven|slam dunk|touchdown|home run|grand slam|hat trick)\b/i

function isSportsArticle(article: { title: string; description: string }): boolean {
  const text = `${article.title} ${article.description}`
  if (SPORTS_KEYWORDS.test(text)) {
    console.log(`[news-filter] Dropped sports article: ${article.title}`)
    return true
  }
  return false
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
    fetchTopHeadlines("us", "politics"),
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

// Georgia & Atlanta local news outlets
const GEORGIA_LOCAL_DOMAINS =
  "ajc.com,wsbtv.com,11alive.com,fox5atlanta.com,wabe.org,gpb.org,savannahnow.com,macon.com,augustachronicle.com,mdjonline.com,times-herald.com,Cherokee Tribune,gainesville.com,albanyherald.com,valdostadailytimes.com"

// Fetch local Georgia political news — restricted to Georgia/Atlanta local outlets
export async function getLocalNews(location: string = "Atlanta"): Promise<NewsArticle[]> {
  const queries = [
    "Georgia politics OR election OR legislature OR governor OR mayor OR \"city council\" OR \"state senate\" OR \"state house\" OR policy",
    "Atlanta OR Georgia 2026 OR Ossoff OR \"Georgia primary\" OR \"Georgia General Assembly\"",
  ];

  // Try local domains first
  const localResults = await Promise.all(
    queries.map((q) => fetchEverythingFromDomains(q, GEORGIA_LOCAL_DOMAINS))
  );

  const seen = new Set<string>();
  const combined: NewsArticle[] = [];
  for (const articles of localResults) {
    for (const article of articles) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        combined.push(article);
      }
    }
  }

  // If still thin, try one more query against the same local domains only
  if (combined.length < 5) {
    const extra = await fetchEverythingFromDomains(
      "Georgia vote OR legislature OR Atlanta OR Ossoff OR Kemp OR Georgia 2026",
      GEORGIA_LOCAL_DOMAINS
    );
    for (const article of extra) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        combined.push(article);
      }
    }
  }

  return combined
    .filter(isPoliticalArticle)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 15);
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

export async function getFactualNewsWithPerspectives(): Promise<FactualNewsWithPerspectives[]> {
  // Fetch from multiple political queries in parallel to get a good pool
  const [generalHeadlines, politicalSearch] = await Promise.all([
    fetchTopHeadlines("us", "politics"),
    fetchEverything("US Congress OR White House OR legislation OR Supreme Court OR election OR Georgia politics"),
  ])

  // Combine & deduplicate
  const seen = new Set<string>()
  const allArticles: NewsArticle[] = []
  for (const article of [...generalHeadlines, ...politicalSearch]) {
    if (!seen.has(article.url)) {
      seen.add(article.url)
      allArticles.push(article)
    }
  }

  // Filter to ONLY US political articles
  const politicalHeadlines = allArticles.filter((a) => isPoliticalArticle(a) && isAmericanNews(a))

  if (politicalHeadlines.length === 0) return []

  // Sort by most recent first
  politicalHeadlines.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Take top 6 political headlines
  const topHeadlines = politicalHeadlines.slice(0, 6)

  // For each headline, fetch directly-related articles from left and right sources
  const results = await Promise.all(
    topHeadlines.map(async (headline) => {
      const query = buildSearchQuery(headline.title)
      if (!query || query.split(" ").length < 2) return null

      const [leftArticles, rightArticles] = await Promise.all([
        fetchEverythingFromDomains(query, LEFT_DOMAINS),
        fetchEverythingFromDomains(query, RIGHT_DOMAINS),
      ])

      const trimmedLeft = leftArticles.slice(0, 5)
      const trimmedRight = rightArticles.slice(0, 5)

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
          leftArticles: trimmedLeft,
          rightArticles: trimmedRight,
        }),
        leftArticles: trimmedLeft,
        rightArticles: trimmedRight,
      }
    })
  )

  return results.filter(Boolean) as FactualNewsWithPerspectives[]
}

// ---- Internal helpers ----

async function fetchTopHeadlines(
  country = "us",
  category = "politics"
): Promise<NewsArticle[]> {
  const url = `${BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=10&apiKey=${getApiKey()}`;
  return fetchAndParse(url);
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
  const encoded = encodeURIComponent(q);
  const url = `${BASE_URL}/everything?q=${encoded}&sortBy=publishedAt&language=en&pageSize=8&apiKey=${getApiKey()}`;
  return fetchAndParse(url);
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
    return mapped.filter((a) => !isSportsArticle(a))
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
