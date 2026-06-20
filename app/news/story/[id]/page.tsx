import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

/* Permanent, indexable page for one clustered news story — the "free Ground
   News" product, made searchable. Each page is original cross-source
   analysis: a neutral synopsis plus how Left / Center / Right cover the
   story, linking out to the originals. This is content search engines can't
   dedupe (it's analysis, not a copy of any single article). */

export const revalidate = 1800; // refresh story data at most every 30 min

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

interface ArticleEntry {
  id: string;
  title: string;
  url: string;
  image_url: string | null;
  published_at: string | null;
  source_name: string;
  source_domain: string;
  lean: number;
  lean_label: string;
}
interface Story {
  id: string;
  headline: string;
  synopsis: string;
  article_data: ArticleEntry[];
  lean_min: number;
  lean_max: number;
  created_at: string;
}

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
  );
}

async function getStory(id: string): Promise<Story | null> {
  const { data } = await db()
    .from("clustered_stories")
    .select("id, headline, synopsis, article_data, lean_min, lean_max, created_at")
    .eq("id", id)
    .maybeSingle();
  return (data as Story) ?? null;
}

export async function generateStaticParams() {
  // Pre-render recent stories; older/newer ones render on demand (dynamicParams).
  const { data } = await db()
    .from("clustered_stories")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []).map((s: { id: string }) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) return { title: "Story not found" };
  const desc = story.synopsis.slice(0, 200);
  return {
    title: `${story.headline} — Across the Spectrum`,
    description: desc,
    alternates: { canonical: `/news/story/${id}` },
    openGraph: {
      title: story.headline,
      description: desc,
      type: "article",
      publishedTime: story.created_at,
    },
  };
}

function leanCategory(lean: number): "left" | "center" | "right" {
  if (lean < 0) return "left";
  if (lean > 0) return "right";
  return "center";
}

function SourceRow({ a }: { a: ArticleEntry }) {
  const cat = leanCategory(a.lean);
  const color = cat === "left" ? C.left : cat === "right" ? C.right : C.center;
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "10px 0",
        borderBottom: `1px solid ${C.ruleSoft}`,
        textDecoration: "none",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          marginTop: 2,
          fontSize: 10,
          fontWeight: 700,
          color,
          background: `${color}14`,
          border: `1px solid ${color}33`,
          borderRadius: 999,
          padding: "1px 8px",
          whiteSpace: "nowrap",
        }}
      >
        {a.lean_label}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.ink900, lineHeight: 1.4 }}>
          {a.title}
        </span>
        <span style={{ fontSize: 11.5, color: C.ink500 }}>{a.source_name} ↗</span>
      </span>
    </a>
  );
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  const arts = story.article_data || [];
  const left = arts.filter((a) => a.lean < 0);
  const center = arts.filter((a) => a.lean === 0);
  const right = arts.filter((a) => a.lean > 0);
  const total = arts.length || 1;
  const pct = (n: number) => Math.round((n / total) * 100);

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.headline,
    description: story.synopsis.slice(0, 250),
    datePublished: story.created_at,
    dateModified: story.created_at,
    author: { "@type": "Organization", name: "MyVote" },
    publisher: { "@type": "Organization", name: "MyVote" },
  };

  const groups: [string, ArticleEntry[], string][] = [
    ["Left", left, C.left],
    ["Center", center, C.center],
    ["Right", right, C.right],
  ];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12.5, marginBottom: 14 }}>
        <Link href="/news" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
          ← All news
        </Link>
        <span style={{ color: C.ink400 }}> · Across the spectrum</span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
          fontWeight: 600,
          color: C.ink900,
          lineHeight: 1.2,
          margin: "0 0 10px",
          letterSpacing: -0.4,
        }}
      >
        {story.headline}
      </h1>

      {/* Coverage spectrum bar */}
      <div style={{ margin: "0 0 6px" }}>
        <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.rule}` }}>
          {left.length > 0 && <div style={{ width: `${pct(left.length)}%`, background: C.left }} />}
          {center.length > 0 && <div style={{ width: `${pct(center.length)}%`, background: C.center }} />}
          {right.length > 0 && <div style={{ width: `${pct(right.length)}%`, background: C.right }} />}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, fontWeight: 600 }}>
          <span style={{ color: C.left }}>{left.length} Left</span>
          <span style={{ color: C.center }}>{center.length} Center</span>
          <span style={{ color: C.right }}>{right.length} Right</span>
          <span style={{ marginLeft: "auto", color: C.ink400, fontWeight: 500 }}>
            {arts.length} source{arts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Synopsis — clearly labeled as a neutral brief, not original reporting */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.rule}`,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
          padding: "18px 20px",
          margin: "18px 0",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.ink400, margin: "0 0 8px" }}>
          The story, in brief
        </p>
        <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7, margin: 0 }}>{story.synopsis}</p>
        <p style={{ fontSize: 11.5, color: C.ink400, margin: "12px 0 0", lineHeight: 1.5 }}>
          A neutral summary of how the sources below reported this story. For full
          reporting, read the originals — we always link out.
        </p>
      </div>

      {/* Coverage across the spectrum */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: "0 0 10px" }}>
        How each side is covering it
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {groups.map(([label, list, color]) =>
          list.length === 0 ? null : (
            <div
              key={label}
              style={{
                background: C.card,
                border: `1px solid ${C.rule}`,
                borderRadius: 12,
                padding: "4px 18px 8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0 4px" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900 }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, color: C.ink400 }}>
                  {list.length} source{list.length !== 1 ? "s" : ""}
                </span>
              </div>
              {list.map((a) => (
                <SourceRow key={a.id} a={a} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Methodology / trust */}
      <p style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.6, margin: "20px 2px" }}>
        MyVote groups coverage by each outlet&rsquo;s general political lean so you
        can see the full picture, not one slant.{" "}
        <Link href="/about" style={{ color: C.teal, fontWeight: 600 }}>
          How our spectrum works
        </Link>
        .
      </p>

      {/* Loop back to the core action */}
      <div
        style={{
          background: C.tealSoft,
          border: "1px solid #C0DAD4",
          borderRadius: 14,
          padding: "18px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>
          News first. Then your ballot.
        </p>
        <p style={{ fontSize: 13, color: C.ink700, margin: "0 0 14px", lineHeight: 1.55 }}>
          MyVote is a free, non-partisan way to read the news across the spectrum —
          and see exactly what&rsquo;s on your Georgia ballot.
        </p>
        <Link
          href="/elections"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: C.teal,
            color: "#fff",
            borderRadius: 999,
            fontSize: 14.5,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(61,128,115,0.35)",
          }}
        >
          See my ballot →
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
    </div>
  );
}
