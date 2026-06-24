import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllCountySlugs } from "@/lib/county-utils";
import { PETITION_SELECT, type PetitionRow, TOP_COUNTY_SLUGS, countyDisplayName, categoryLabel } from "@/lib/petitions";

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

export async function generateMetadata({ params }: { params: Promise<{ county: string }> }): Promise<Metadata> {
  const { county } = await params;
  const name = countyDisplayName(county);
  if (!KNOWN.has(county) || !name) return { title: "County not found" };
  return {
    title: `${name} County Petitions — Local Georgia Civic Petitions · MyVote`,
    description: `Browse and sign active petitions in ${name} County, Georgia. Start a free petition targeting ${name} County commissioners, the school board, or local officials.`,
    alternates: { canonical: `/petitions/county/${county}` },
  };
}

export default async function CountyPetitionsPage({ params }: { params: Promise<{ county: string }> }) {
  const { county } = await params;
  const name = countyDisplayName(county);
  if (!KNOWN.has(county) || !name) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("group_petitions")
    .select(PETITION_SELECT)
    .eq("status", "active")
    .eq("county_slug", county)
    .not("share_slug", "is", null)
    .order("signature_count", { ascending: false })
    .limit(50);
  const petitions = (data as PetitionRow[]) ?? [];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
      { "@type": "ListItem", position: 2, name: "Georgia Petitions", item: "https://www.myvotega.com/petitions" },
      { "@type": "ListItem", position: 3, name: `${name} County`, item: `https://www.myvotega.com/petitions/county/${county}` },
    ],
  };

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/petitions" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>← All petitions</Link>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.7rem, 4.5vw, 2.3rem)", fontWeight: 600, color: C.ink900, lineHeight: 1.15, letterSpacing: -0.3, margin: "0 0 8px" }}>
          {name} County petitions
        </h1>
        <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.6, margin: "0 0 20px" }}>
          Browse and sign petitions in {name} County, Georgia — or start a free one targeting
          the {name} County commission, school board, or your local officials.
        </p>

        <Link href="/petitions/create" style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, padding: "11px 24px", borderRadius: 999, textDecoration: "none", marginBottom: 24 }}>
          Start a petition in {name} County →
        </Link>

        {petitions.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>No petitions in {name} County yet</p>
            <p style={{ fontSize: 13, color: C.ink500, margin: 0 }}>Be the first — start one above and rally your neighbors.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {petitions.map((p) => {
              const pct = Math.min(100, Math.round((p.signature_count / Math.max(1, p.goal)) * 100));
              return (
                <Link key={p.id} href={`/petitions/${p.share_slug}`} style={{ display: "block", background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "14px 16px", textDecoration: "none" }}>
                  {p.category && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" }}>{categoryLabel(p.category)}</span>}
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "6px 0 8px", lineHeight: 1.3 }}>{p.title}</p>
                  <div style={{ height: 6, background: C.tealSoft, borderRadius: 999, overflow: "hidden", marginBottom: 5 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: C.teal }} />
                  </div>
                  <span style={{ fontSize: 12, color: C.ink500, fontWeight: 600 }}>{p.signature_count.toLocaleString()} of {p.goal.toLocaleString()} signatures</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
