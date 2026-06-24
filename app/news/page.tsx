import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { NewsNavigation } from "@/components/news-nav";
import { AIFactualNews } from "@/components/ai-factual-news";
import { DayInReviewBanner } from "@/components/day-in-review-banner";

/* ISR: the page is server-rendered so crawlers receive real story HTML (the
   live <AIFactualNews/> feed below is client-only and invisible to Googlebot,
   which is why /news was indexing as a near-empty shell). Refreshed at most
   every 30 min. */
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Political News, Every Perspective — Left, Right & Center · MyVote",
  description:
    "Read the day's biggest Georgia and national political stories from left, center, and right — side by side. Neutral cross-source synopses that always link to the originals, so you decide for yourself.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Political News, Every Perspective — Left, Right & Center · MyVote",
    description:
      "The same story from left, center, and right, side by side. Neutral synopses, always linking to the originals.",
    type: "website",
  },
};

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358",
};

interface StoryRow {
  id: string;
  headline: string;
  synopsis: string;
  article_data: { source_name?: string }[] | null;
  created_at: string;
}

async function getRecentStories(): Promise<StoryRow[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
    );
    const { data } = await supabase
      .from("clustered_stories")
      .select("id, headline, synopsis, article_data, created_at")
      .order("created_at", { ascending: false })
      .limit(12);
    return (data as StoryRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function NewsFeed() {
  const stories = await getRecentStories();

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />
        <DayInReviewBanner />

        {/* ── Server-rendered, crawlable lead so search engines can read the
            site's core differentiator (the live feed below is client-only). ── */}
        <section style={{ maxWidth: 760, margin: "8px auto 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
              fontWeight: 700,
              color: C.ink900,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 8px",
            }}
          >
            Political news from every perspective
          </h1>
          <p style={{ fontSize: 15, color: C.ink500, lineHeight: 1.6, margin: "0 0 22px", maxWidth: 600 }}>
            Read the same Georgia and national stories from the left, the center, and
            the right — side by side. Each synopsis is neutral and always links to the
            original reporting, so you can decide for yourself.
          </p>

          {stories.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {stories.map((s) => {
                const sources = Array.isArray(s.article_data) ? s.article_data.length : 0;
                return (
                  <article
                    key={s.id}
                    style={{
                      background: C.card,
                      border: `1px solid ${C.rule}`,
                      borderRadius: 14,
                      padding: "16px 18px",
                      boxShadow: "0 1px 6px rgba(20,24,40,0.05)",
                    }}
                  >
                    <h2 style={{ fontSize: 16.5, fontWeight: 700, color: C.ink900, lineHeight: 1.3, margin: "0 0 6px" }}>
                      <Link href={`/news/story/${s.id}`} style={{ color: C.ink900, textDecoration: "none" }}>
                        {s.headline}
                      </Link>
                    </h2>
                    {s.synopsis && (
                      <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.6, margin: "0 0 10px" }}>
                        {s.synopsis.length > 260 ? `${s.synopsis.slice(0, 260)}…` : s.synopsis}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      {sources > 0 && (
                        <span style={{ fontSize: 12, color: C.ink400, fontWeight: 500 }}>
                          {sources} source{sources === 1 ? "" : "s"} across the spectrum
                        </span>
                      )}
                      <Link
                        href={`/news/story/${s.id}`}
                        style={{ fontSize: 12.5, fontWeight: 600, color: C.teal, textDecoration: "none" }}
                      >
                        Read every side →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Live interactive feed (client-rendered). */}
        <AIFactualNews />
      </div>
    </div>
  );
}
