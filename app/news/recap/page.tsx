import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ReminderSignup } from "@/components/reminder-signup";

/* "The Day in Review" — a single grounded digest of the last ~48h of
   clustered stories (yesterday & today), each with its sourced synopsis and
   spectrum. Original, recurring, indexable content + a daily return habit,
   and the natural payload for the email list. Built from already-sourced
   data — no freeform AI essay. */

export const revalidate = 1800; // refresh at most every 30 min

const C = {
  page: "#F5F3EE",
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ruleSoft: "#EDEAE0",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
  left: "#1E88E5",
  center: "#78909C",
  right: "#B33A2C",
};

interface ArticleEntry { lean: number }
interface Story {
  id: string;
  headline: string;
  synopsis: string;
  article_data: ArticleEntry[];
  lean_min: number;
  lean_max: number;
  created_at: string;
}

export const metadata: Metadata = {
  title: "The Day in Review — Georgia & National News, Across the Spectrum · MyVote",
  description:
    "Yesterday and today's top news stories in one place — each summarized neutrally with coverage from the left, center, and right. A free, non-partisan daily recap from MyVote.",
  alternates: { canonical: "/news/recap" },
  openGraph: {
    title: "The Day in Review — MyVote",
    description:
      "Yesterday and today's top stories, each summarized with coverage across the political spectrum. Free and non-partisan.",
    type: "website",
  },
};

async function getRecentStories(): Promise<Story[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
  );
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("clustered_stories")
    .select("id, headline, synopsis, article_data, lean_min, lean_max, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(40);
  return (data as Story[]) ?? [];
}

export default async function DayInReviewPage() {
  const stories = await getRecentStories();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });

  // Data-derived lead — factual, not generated prose.
  const crossSpectrum = stories.filter((s) => s.lean_max - s.lean_min >= 4).length;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
      <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.ink400, margin: "0 0 6px" }}>
        Non-partisan · Across the spectrum
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
          fontWeight: 600,
          color: C.ink900,
          lineHeight: 1.15,
          margin: "0 0 6px",
          letterSpacing: -0.4,
        }}
      >
        The Day in Review
      </h1>
      <p style={{ fontSize: 14, color: C.ink500, margin: "0 0 18px" }}>
        Yesterday &amp; today · {today}
      </p>

      {stories.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "32px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: C.ink500, margin: 0 }}>
            No stories in the last 48 hours yet — check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Factual lead */}
          <div
            style={{
              background: C.tealSoft,
              border: "1px solid #C0DAD4",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 18,
            }}
          >
            <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: C.ink900 }}>{stories.length} stories</strong> from the
              last 48 hours, each summarized neutrally with coverage from the
              left, center, and right
              {crossSpectrum > 0 ? ` — ${crossSpectrum} covered clear across the spectrum` : ""}.
              Tap any story for the full breakdown.
            </p>
          </div>

          {/* Digest */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stories.map((s) => {
              const arts = s.article_data || [];
              const left = arts.filter((a) => a.lean < 0).length;
              const center = arts.filter((a) => a.lean === 0).length;
              const right = arts.filter((a) => a.lean > 0).length;
              return (
                <Link
                  key={s.id}
                  href={`/news/story/${s.id}`}
                  style={{
                    display: "block",
                    background: C.card,
                    border: `1px solid ${C.rule}`,
                    borderRadius: 12,
                    boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
                    padding: "16px 18px",
                    textDecoration: "none",
                  }}
                >
                  <p style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, margin: "0 0 5px", lineHeight: 1.3 }}>
                    {s.headline}
                  </p>
                  <p style={{ fontSize: 13.5, color: C.ink700, margin: "0 0 10px", lineHeight: 1.6 }}>
                    {s.synopsis}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, fontWeight: 600 }}>
                    {left > 0 && <span style={{ color: C.left }}>{left} Left</span>}
                    {center > 0 && <span style={{ color: C.center }}>{center} Center</span>}
                    {right > 0 && <span style={{ color: C.right }}>{right} Right</span>}
                    <span style={{ marginLeft: "auto", color: C.teal, fontWeight: 700 }}>Full breakdown →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Email payload hook — the recap is the reason to subscribe */}
      <div style={{ marginTop: 22 }}>
        <ReminderSignup
          source="daily-recap"
          title="Get the Day in Review in your inbox"
          blurb="One email, the day's top stories across the spectrum — plus reminders before every 2026 Georgia election. No spam, never sold."
        />
      </div>

      {/* Loop to the core action */}
      <p style={{ fontSize: 13, color: C.ink500, textAlign: "center", margin: "22px 0 0", lineHeight: 1.6 }}>
        News first, then your ballot.{" "}
        <Link href="/elections" style={{ color: C.teal, fontWeight: 700 }}>
          See what&rsquo;s on yours →
        </Link>
      </p>
    </div>
  );
}
