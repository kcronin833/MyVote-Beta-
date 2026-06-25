import {
  getFactualNewsWithPerspectives,
  buildOverview,
  calculateControversyScore,
  type FactualNewsWithPerspectives,
  type NewsArticle,
} from "@/lib/news-service";
import { generateClusteredFacts } from "@/lib/news-ai";

export type FeedItem = FactualNewsWithPerspectives & { aiGenerated: boolean };

/* Build the National news feed: fetch cross-spectrum coverage, then cluster it
   into one card per event with a neutral AI headline + facts. Shared by the
   /news page (server-rendered, crawlable) and /api/news/factual (refresh).
   Falls back to the un-clustered, templated list if the model is unavailable,
   so the feed never breaks. */
export async function getClusteredFactualNews(): Promise<FeedItem[]> {
  const stories = await getFactualNewsWithPerspectives();
  if (stories.length === 0) return [];

  const events = await generateClusteredFacts(stories);

  // Fallback: no AI clustering → per-headline list with the templated overview.
  if (!events) {
    return stories.map((s) => ({ ...s, aiOverview: buildOverview(s), aiGenerated: false }));
  }

  return events.map((ev) => {
    const members = ev.members
      .filter((i) => i >= 0 && i < stories.length)
      .map((i) => stories[i]);
    const lead = members[0] ?? stories[0];

    // Merge each member's perspective coverage, de-duplicated by URL.
    const seen = new Set<string>();
    const left: NewsArticle[] = [];
    const right: NewsArticle[] = [];
    for (const m of members) {
      for (const a of m.leftArticles) if (a.url && !seen.has(a.url)) { seen.add(a.url); left.push(a); }
      for (const a of m.rightArticles) if (a.url && !seen.has(a.url)) { seen.add(a.url); right.push(a); }
    }

    const image = members.find((m) => m.urlToImage)?.urlToImage ?? lead.urlToImage ?? null;

    return {
      title: ev.headline,
      description: lead.description,
      source: lead.source,
      publishedAt: lead.publishedAt,
      url: lead.url,
      urlToImage: image,
      category: "political",
      aiOverview: ev.summary,
      aiGenerated: true,
      controversyScore: calculateControversyScore({
        title: ev.headline,
        description: lead.description,
        leftArticles: left,
        rightArticles: right,
      }),
      leftArticles: left,
      rightArticles: right,
    } satisfies FeedItem;
  });
}
