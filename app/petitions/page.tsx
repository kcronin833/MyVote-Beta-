import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  PETITION_SELECT, type PetitionRow, PETITION_CATEGORIES, PETITION_FAQ,
  TOP_COUNTY_SLUGS, categoryLabel, countyDisplayName,
} from "@/lib/petitions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Georgia Petitions — Start or Sign a Free Petition · MyVote",
  description:
    "Start a free petition for Georgia — target your county commissioner, school board, state legislator, or any local official. Nonpartisan, Georgia-focused, always free.",
  keywords: "start a petition Georgia, free petition Georgia 2026, Georgia school board petition, Georgia county petition, nonpartisan petition Georgia",
  alternates: { canonical: "/petitions" },
};

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

export default async function PetitionsHub() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_petitions")
    .select(PETITION_SELECT)
    .eq("status", "active")
    .not("share_slug", "is", null)
    .order("signature_count", { ascending: false })
    .limit(12);
  const petitions = (data as PetitionRow[]) ?? [];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PETITION_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)", padding: "56px 16px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Make your voice heard in Georgia
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.4vw, 1.15rem)", color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 28px" }}>
            Start a free petition, collect signatures from Georgia voters, and deliver it
            directly to your elected officials — school board, county commissioner, state
            legislator, or beyond.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/petitions/create" style={{ background: "#B33A2C", color: "#fff", fontSize: 15, fontWeight: 700, padding: "13px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 2px 16px rgba(179,58,44,0.4)" }}>
              Start a Petition →
            </Link>
            <a href="#browse" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 15, fontWeight: 600, padding: "13px 28px", borderRadius: 999, textDecoration: "none" }}>
              Browse Georgia Petitions
            </a>
          </div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 18 }}>
            Free forever · No spam · Nonpartisan · Georgia only
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 16px 64px" }}>
        {/* How it works */}
        <section style={{ marginBottom: 38 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {[
              { n: "1", h: "Create", b: "Write your petition and choose the Georgia official or body you're petitioning." },
              { n: "2", h: "Share", b: "Get a shareable link and collect signatures from Georgia voters." },
              { n: "3", h: "Deliver", b: "Take your signatures — and the public record — to the official." },
            ].map((s) => (
              <div key={s.n} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "18px 18px" }}>
                <div style={{ width: 30, height: 30, borderRadius: 999, background: C.tealSoft, color: C.tealDk, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink900, marginBottom: 4 }}>{s.h}</div>
                <div style={{ fontSize: 13, color: C.ink500, lineHeight: 1.55 }}>{s.b}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured petitions */}
        <section id="browse" style={{ marginBottom: 38 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>Active Georgia petitions</h2>
          {petitions.length === 0 ? (
            <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>No petitions yet</p>
              <p style={{ fontSize: 13, color: C.ink500, margin: "0 0 14px" }}>Be the first to start one.</p>
              <Link href="/petitions/create" style={{ background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, padding: "10px 22px", borderRadius: 999, textDecoration: "none" }}>Start a Petition →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {petitions.map((p) => {
                const pct = Math.min(100, Math.round((p.signature_count / Math.max(1, p.goal)) * 100));
                return (
                  <Link key={p.id} href={`/petitions/${p.share_slug}`} style={{ display: "block", background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "14px 16px", textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      {countyDisplayName(p.county_slug) && <span style={miniBadge}>{countyDisplayName(p.county_slug)} County</span>}
                      {p.category && <span style={miniBadge}>{categoryLabel(p.category)}</span>}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 8px", lineHeight: 1.3 }}>{p.title}</p>
                    <div style={{ height: 6, background: C.tealSoft, borderRadius: 999, overflow: "hidden", marginBottom: 5 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: C.teal }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.ink500, fontWeight: 600 }}>{p.signature_count.toLocaleString()} of {p.goal.toLocaleString()} signatures</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Browse by category */}
        <section style={{ marginBottom: 38 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Browse by issue</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PETITION_CATEGORIES.map((c) => (
              <span key={c.value} style={{ fontSize: 13, fontWeight: 600, color: C.ink700, background: C.card, border: `1px solid ${C.rule}`, borderRadius: 999, padding: "8px 14px" }}>{c.label}</span>
            ))}
          </div>
        </section>

        {/* Browse by county */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Browse by county</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TOP_COUNTY_SLUGS.map((slug) => (
              <Link key={slug} href={`/petitions/county/${slug}`} style={{ fontSize: 13, fontWeight: 600, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "8px 14px", textDecoration: "none" }}>
                {countyDisplayName(slug)} County
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>Frequently asked questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PETITION_FAQ.map((f) => (
              <div key={f.q}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 5px", lineHeight: 1.35 }}>{f.q}</h3>
                <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.65, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const miniBadge: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: "#2F6358", background: "#E6F0ED", border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" };
