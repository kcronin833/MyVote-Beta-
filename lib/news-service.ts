// News service using NewsAPI.org
// Get your free API key at https://newsapi.org

const BASE_URL = "https://newsapi.org/v2";

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
export async function getLocalNews(location: string): Promise<NewsArticle[]> {
  if (!location) return [];
  const city = location.split(",")[0].trim();
  return fetchEverything(`"${city}" local government OR city council OR mayor`);
}

// Search news
export async function searchNews(query: string): Promise<NewsArticle[]> {
  return fetchEverything(query);
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

// Strip HTML tags from strings to prevent script injection from external content
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
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
