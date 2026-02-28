// News service using NewsAPI.org
// Get your free API key at https://newsapi.org

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const BASE_URL = "https://newsapi.org/v2";

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
  if (!NEWS_API_KEY) return getMockNews();
  const url = `${BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=10&apiKey=${NEWS_API_KEY}`;
  return fetchAndParse(url);
}

async function fetchNewsFromSources(
  sources: string,
  q: string
): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) return getMockNews();
  const encoded = encodeURIComponent(q);
  const url = `${BASE_URL}/everything?sources=${sources}&q=${encoded}&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`;
  return fetchAndParse(url);
}

async function fetchEverything(q: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) return getMockNews();
  const encoded = encodeURIComponent(q);
  const url = `${BASE_URL}/everything?q=${encoded}&sortBy=publishedAt&language=en&pageSize=8&apiKey=${NEWS_API_KEY}`;
  return fetchAndParse(url);
}

async function fetchAndParse(url: string): Promise<NewsArticle[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) {
      console.error("NewsAPI error:", res.status, await res.text());
      return getMockNews();
    }
    const data = await res.json();
    if (data.status !== "ok") return getMockNews();

    const articles = (data.articles || [])
      .filter((a: any) => a.title && a.title !== "[Removed]")
      .map((a: any) => ({
        title: a.title,
        description: a.description || "",
        url: a.url,
        source: a.source?.name || "Unknown",
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage || null,
        content: a.content || null,
      }));

    return articles.length > 0 ? articles : getMockNews();
  } catch (err) {
    console.error("Failed to fetch news:", err);
    return getMockNews();
  }
}

// Fallback mock news when API key is not set
function getMockNews(): NewsArticle[] {
  return [
    {
      title: "Congress Debates New Infrastructure Bill",
      description: "Lawmakers from both parties discuss the merits of a new infrastructure spending package that could reshape American cities.",
      url: "https://example.com/infrastructure-bill",
      source: "Associated Press",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      urlToImage: null,
      content: null,
    },
    {
      title: "Supreme Court to Hear Major Privacy Case",
      description: "The Supreme Court has agreed to review a case that could have broad implications for digital privacy rights.",
      url: "https://example.com/privacy-case",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      urlToImage: null,
      content: null,
    },
    {
      title: "Federal Reserve Announces New Economic Policy",
      description: "The Federal Reserve outlined new measures aimed at stabilizing the economy amid ongoing concerns about inflation.",
      url: "https://example.com/fed-policy",
      source: "Bloomberg",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      urlToImage: null,
      content: null,
    },
    {
      title: "New Education Reform Bill Gains Bipartisan Support",
      description: "A new education reform bill has received support from lawmakers on both sides of the aisle, focusing on school funding equity.",
      url: "https://example.com/education-reform",
      source: "NPR",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      urlToImage: null,
      content: null,
    },
  ];
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
