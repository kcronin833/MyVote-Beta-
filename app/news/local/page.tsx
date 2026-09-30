import type { Metadata } from "next";
import { getLocalNews } from "@/lib/news-service";
import { LocalNewsClient, type LocalArticle } from "@/components/news/local-news-client";

/* ISR: fetch a default city's local news on the server so the initial HTML has
   real, crawlable content (previously this page was fully client-rendered and
   Google flagged it as a Soft 404 — an empty shell). The client component takes
   over for the city picker + refresh. */
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Local Georgia News — Atlanta, Savannah, Augusta & More",
  description:
    "Local news from across Georgia — Atlanta, Savannah, Augusta, Columbus, Macon, Athens and dozens more cities — from the AJC, 11Alive, WSB-TV, Axios Atlanta and other Georgia sources. Free and nonpartisan.",
  alternates: { canonical: "/news/local" },
  openGraph: {
    title: "Local Georgia News, by City",
    description: "Local news from across Georgia — pick your city. Free and nonpartisan.",
    type: "website",
  },
};

const DEFAULT_CITY = "Atlanta";

export default async function LocalNewsPage() {
  let initialArticles: LocalArticle[] = [];
  try {
    initialArticles = (await getLocalNews(DEFAULT_CITY)) as LocalArticle[];
  } catch {
    initialArticles = [];
  }
  return <LocalNewsClient initialArticles={initialArticles} initialLocation={DEFAULT_CITY} />;
}
