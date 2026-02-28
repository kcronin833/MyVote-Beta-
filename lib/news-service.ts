// News service using NewsAPI.org
// Get your free API key at https://newsapi.org

const BASE_URL = "https://newsapi.org/v2";

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

// Fetch factual/objective news from mainstream sources
export async function getFactualNews(): Promise<NewsArticle[]> {
  return fetchTopHeadlines("us", "politics");
}

// Fetch local news based on city/state
export async function getLocalNews(location: string = "Atlanta"): Promise<NewsArticle[]> {
  const city = (location || "Atlanta").split(",")[0].trim();
  // Use multiple query strategies for better local coverage
  const queries = [
    `"${city}" local news OR city council OR mayor OR county`,
    `"${city}" Georgia politics OR crime OR development OR schools`,
  ];
  const results = await Promise.all(queries.map((q) => fetchEverything(q)));
  // Deduplicate by URL
  const seen = new Set<string>();
  const combined: NewsArticle[] = [];
  for (const articles of results) {
    for (const article of articles) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        combined.push(article);
      }
    }
  }
  // Sort by date, most recent first
  combined.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return combined.slice(0, 15);
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
  leftArticles: NewsArticle[]
  rightArticles: NewsArticle[]
}

// Left-leaning and right-leaning source domains for filtering
const LEFT_DOMAINS =
  "huffpost.com,msnbc.com,cnn.com,nytimes.com,washingtonpost.com,vox.com,thenation.com,motherjones.com,slate.com"
const RIGHT_DOMAINS =
  "foxnews.com,dailywire.com,breitbart.com,washingtontimes.com,nationalreview.com,nypost.com,dailycaller.com,thefederalist.com"

// Stop-words to strip when building search queries
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","been","be","have","has","had","do",
  "does","did","will","would","could","should","may","might","shall","can",
  "its","it","that","this","than","he","she","they","his","her","their",
  "our","we","you","your","my","says","said","new","also","about","after",
  "over","into","more","how","what","when","who","why","not","just","some",
])

/**
 * Build a tight search query from a headline: keep only meaningful words,
 * quote multi-word proper nouns / names if present, and limit length.
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

export async function getFactualNewsWithPerspectives(): Promise<FactualNewsWithPerspectives[]> {
  // Fetch political headlines as the factual base
  const headlines = await fetchTopHeadlines("us", "politics")

  // If politics category returns few results, supplement with general + political filter
  let politicalHeadlines = headlines
  if (politicalHeadlines.length < 4) {
    const general = await fetchEverything("US politics OR Congress OR White House OR legislation OR Supreme Court")
    const seen = new Set(politicalHeadlines.map((h) => h.url))
    for (const a of general) {
      if (!seen.has(a.url)) {
        politicalHeadlines.push(a)
        seen.add(a.url)
      }
    }
  }

  if (politicalHeadlines.length === 0) return []

  // Take top 6 headlines
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

      return {
        title: headline.title,
        description: headline.description,
        source: headline.source,
        publishedAt: headline.publishedAt,
        url: headline.url,
        urlToImage: headline.urlToImage,
        category: "political",
        aiOverview: "", // Populated by the server action via AI
        leftArticles: leftArticles.slice(0, 3),
        rightArticles: rightArticles.slice(0, 3),
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

    return (data.articles || [])
      .filter((a: any) => a.title && a.title !== "[Removed]")
      .map((a: any) => ({
        title: stripHtml(a.title || ""),
        description: stripHtml(a.description || ""),
        url: a.url,
        source: a.source?.name || "Unknown",
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage || null,
        content: stripHtml(a.content || ""),
      }));
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
