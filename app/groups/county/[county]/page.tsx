import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCountySlugs } from "@/lib/county-utils";
import { TOP_COUNTY_SLUGS, countyDisplayName, categoryLabel } from "@/lib/petitions";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return TOP_COUNTY_SLUGS.map((county) => ({ county }));
}

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

const KNOWN = new Set(getAllCountySlugs());

interface GroupRow { id: string; slug: string; name: string; description: string | null; category: string | null; }

export async function generateMetadata({ params }: { params: Promise<{ county: string }> }): Promise<Metadata> {
  const { county } = await params;
  const name = countyDisplayName(county);
  if (!KNOWN.has(county) || !name) return { title: "County not found" };
  return {
    title: `${name} County Civic Groups — Local Georgia Voter Groups · MyVote`,
    description: `Find or start a civic group in ${name} County, Georgia. Connect with local voters, track ${name} County races, and organize around the issues that matter in your community.`,
    alternates: { canonical: `/groups/county/${county}` },
  };
}

export default async function CountyGroupsPage({ params }: { params: Promise<{ county: string }> }) {
  const { county } = await params;
  const name = countyDisplayName(county);
  if (!KNOWN.has(county) || !name) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("id, slug, name, description, category")
    .eq("status", "active")
    .eq("county_slug", county)
    .order("created_at", { ascending: false })
    .limit(50);
  const groups = (data as GroupRow[]) ?? [];

  const { data: members } = await supabase.from("group_members").select("group_id");
  const counts = new Map<string, number>();
  for (const m of (members as { group_id: string }[]) || []) counts.set(m.group_id, (counts.get(m.group_id) ?? 0) + 1);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
      { "@type": "ListItem", position: 2, name: "Georgia Civic Groups", item: "https://www.myvotega.com/groups" },
      { "@type": "ListItem", position: 3, name: `${name} County`, item: `https://www.myvotega.com/groups/county/${county}` },
    ],
  };

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/groups" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>← All groups</Link>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.7rem, 4.5vw, 2.3rem)", fontWeight: 600, color: C.ink900, lineHeight: 1.15, letterSpacing: -0.3, margin: "0 0 8px" }}>
          {name} County civic groups
        </h1>
        <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.6, margin: "0 0 20px" }}>
          Find or start a free, nonpartisan civic group in {name} County, Georgia — connect with
          local voters, track {name} County races, and organize around local issues.
        </p>

        <Link href="/groups" style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, padding: "11px 24px", borderRadius: 999, textDecoration: "none", marginBottom: 24 }}>
          Start a group in {name} County →
        </Link>

        {groups.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>No groups in {name} County yet</p>
            <p style={{ fontSize: 13, color: C.ink500, margin: 0 }}>Be the first — start one and bring your neighbors together.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {groups.map((g) => (
              <Link key={g.id} href={`/groups/${g.slug}`} style={{ display: "block", background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "14px 16px", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  {g.category && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" }}>{categoryLabel(g.category)}</span>}
                  <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.ink400 }}>{counts.get(g.id) ?? 0} {(counts.get(g.id) ?? 0) === 1 ? "member" : "members"}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 3px", lineHeight: 1.3 }}>{g.name}</p>
                {g.description && <p style={{ fontSize: 13, color: C.ink500, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{g.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
