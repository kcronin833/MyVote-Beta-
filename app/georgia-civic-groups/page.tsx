import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TOP_COUNTY_SLUGS, countyDisplayName, PETITION_CATEGORIES, categoryLabel } from "@/lib/petitions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Georgia Civic Groups — Nonpartisan Local Voter Groups · MyVote",
  description:
    "Find nonpartisan civic groups in Georgia organized by county, city, school district, and issue. Join or start a free Georgia voter group on MyVote.",
  keywords: "Georgia civic groups, Georgia political group, Georgia voter groups, nonpartisan Georgia community group",
  alternates: { canonical: "/georgia-civic-groups" },
};

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

const GROUP_FAQ = [
  { q: "How do I create a free political group in Georgia?", a: "Create a free MyVote account, open Groups, and start a group. Name it, write a short description, choose your Georgia county focus and a category, and publish. Your group gets its own public page and shareable link instantly." },
  { q: "Are MyVote civic groups partisan?", a: "No. MyVote groups are nonpartisan by design — they aren't affiliated with a political party or candidate campaign. Groups are organized around Georgia counties, local issues, and government bodies, not party lines." },
  { q: "What is a MyVote civic group used for?", a: "Civic groups help Georgia voters organize around local issues — school board decisions, county commissioner votes, zoning changes, and more. Members can share updates, document how officials voted, and start petitions." },
  { q: "How is MyVote different from Facebook Groups for local organizing?", a: "Unlike a Facebook Group, a MyVote civic group sits alongside real Georgia ballot data, local candidate profiles, and nonpartisan news — and members can start a Georgia-targeted petition directly tied to the issue." },
];

export default async function GeorgiaCivicGroupsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("id, slug, name, description, category, county_slug")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);
  const featured = (data as { id: string; slug: string; name: string; description: string | null; category: string | null; county_slug: string | null }[]) ?? [];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUP_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
      { "@type": "ListItem", position: 2, name: "Georgia Civic Groups", item: "https://www.myvotega.com/georgia-civic-groups" },
    ],
  };

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          Georgia Civic Groups — Connect With Voters Near You
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 22px", maxWidth: 640 }}>
          Find or start a free, nonpartisan civic group in Georgia — organized by county, city,
          school district, or the issues that matter most to your community.
        </p>
        <Link href="/groups" style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: 15, fontWeight: 700, padding: "12px 26px", borderRadius: 999, textDecoration: "none", marginBottom: 34 }}>
          Create a group free →
        </Link>

        <Section h="What is a Georgia civic group?">
          A civic group is a free, nonpartisan space for Georgia voters to organize around something
          local — a school board decision, a county commission vote, a zoning fight, a safety concern.
          Members share what's happening, document how their officials voted, and turn shared
          frustration into concrete action like a petition.
        </Section>

        <Section h="Why local groups matter in 2026">
          Statewide races get the headlines, but most decisions that shape daily life are made by
          county commissions, city councils, and school boards — bodies that often turn on a few
          hundred votes. Organized neighbors who show up and speak with one voice have outsized
          influence on these local decisions, in election years and between them.
        </Section>

        {featured.length > 0 && (
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Featured Georgia civic groups</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {featured.map((g) => (
                <Link key={g.id} href={`/groups/${g.slug}`} style={{ display: "block", background: C.card, border: `1px solid ${C.rule}`, borderRadius: 10, padding: "12px 14px", textDecoration: "none" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                    {countyDisplayName(g.county_slug) && <span style={miniBadge}>{countyDisplayName(g.county_slug)} County</span>}
                    {g.category && <span style={miniBadge}>{categoryLabel(g.category)}</span>}
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900 }}>{g.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Browse by county</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TOP_COUNTY_SLUGS.map((slug) => (
              <Link key={slug} href={`/groups/county/${slug}`} style={{ fontSize: 13, fontWeight: 600, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "8px 14px", textDecoration: "none" }}>
                {countyDisplayName(slug)} County
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Browse by issue</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PETITION_CATEGORIES.map((c) => (
              <span key={c.value} style={{ fontSize: 13, fontWeight: 600, color: C.ink700, background: C.card, border: `1px solid ${C.rule}`, borderRadius: 999, padding: "8px 14px" }}>{c.label}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>Frequently asked questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {GROUP_FAQ.map((f) => (
              <div key={f.q}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, margin: "0 0 5px", lineHeight: 1.35 }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: "#1A2138", margin: "0 0 8px" }}>{h}</h2>
      <p style={{ fontSize: 15, color: "#3D435A", lineHeight: 1.7, margin: 0 }}>{children}</p>
    </section>
  );
}

const miniBadge: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: "#2F6358", background: "#E6F0ED", border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" };
