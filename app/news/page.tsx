import type { Metadata } from "next";
import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";
import { DayInReviewBanner } from "@/components/day-in-review-banner";
import { getClusteredFactualNews } from "@/lib/news-feed";

/* ISR: the feed is fetched + clustered server-side and passed to the client
   component as initial data, so the cards (neutral headline + facts) render
   into the SSR HTML — crawlable by Google AND interactive after hydration.
   Refreshed at most every 30 min. */
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Political News, Every Perspective — Left, Right & Center · MyVote",
  description:
    "The day's biggest national political stories, told just the facts — one neutral AI summary per event, with the left/center/right spectrum on each. No opinion pieces.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Political News, Every Perspective — Left, Right & Center · MyVote",
    description:
      "Just the facts on the day's national politics — one neutral summary per story, with the full coverage spectrum.",
    type: "website",
  },
};

export default async function NewsFeed() {
  const news = await getClusteredFactualNews();

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "National political news — just the facts",
    itemListElement: news.slice(0, 12).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: s.title,
        description: (s.aiOverview || "").slice(0, 220),
        datePublished: s.publishedAt,
        publisher: { "@type": "Organization", name: "MyVote" },
        about: { "@type": "Thing", name: "U.S. Politics" },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-paper-100">
      {news.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }} />
      )}
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />
        <DayInReviewBanner />
        <AIFactualNews initialNews={news} />
      </div>
    </div>
  );
}
