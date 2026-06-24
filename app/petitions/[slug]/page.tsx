import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PetitionSign } from "@/components/petitions/petition-sign";
import { ReportErrorLink } from "@/components/report-error-link";
import { PETITION_SELECT, type PetitionRow, targetTypeLabel, categoryLabel, countyDisplayName } from "@/lib/petitions";

export const dynamic = "force-dynamic";

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

async function getPetition(slug: string): Promise<PetitionRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_petitions")
    .select(PETITION_SELECT)
    .eq("share_slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return (data as PetitionRow) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPetition(slug);
  if (!p) return { title: "Petition not found" };
  const where = countyDisplayName(p.county_slug) ? `${countyDisplayName(p.county_slug)}, Georgia` : "Georgia";
  return {
    title: `${p.title} — Georgia Petition · MyVote`,
    description: `Sign this Georgia petition: ${p.title}. ${p.signature_count} signatures so far${p.target ? `, petitioning ${p.target}` : ""} in ${where}.`,
    alternates: { canonical: `/petitions/${slug}` },
    openGraph: { title: `${p.title} · MyVote`, description: `Sign this Georgia petition — ${p.signature_count} signatures so far.`, type: "website" },
  };
}

export default async function PetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPetition(slug);
  if (!p) notFound();

  const countyName = countyDisplayName(p.county_slug);
  const url = `https://www.myvotega.com/petitions/${slug}`;
  const body = p.description || p.summary || "";
  const isMyVote = p.creator_name === "MyVote";

  const schema = {
    "@context": "https://schema.org",
    "@type": "GovernmentAction",
    name: p.title,
    description: body.slice(0, 500),
    url,
    agent: p.creator_name ? { "@type": "Person", name: p.creator_name } : undefined,
    object: p.target ? { "@type": "GovernmentOrganization", name: p.target } : undefined,
    location: { "@type": "State", name: "Georgia" },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
      { "@type": "ListItem", position: 2, name: "Georgia Petitions", item: "https://www.myvotega.com/petitions" },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };

  // Related petitions — same county or category.
  const supabase = await createClient();
  const { data: relatedRows } = await supabase
    .from("group_petitions")
    .select("title, share_slug, signature_count, county_slug")
    .eq("status", "active")
    .neq("id", p.id)
    .not("share_slug", "is", null)
    .or(`county_slug.eq.${p.county_slug ?? "___none"},category.eq.${p.category ?? "___none"}`)
    .order("signature_count", { ascending: false })
    .limit(4);
  const related = (relatedRows as { title: string; share_slug: string; signature_count: number; county_slug: string | null }[]) ?? [];

  const shareText = encodeURIComponent(`Sign this Georgia petition: ${p.title}`);
  const shareUrl = encodeURIComponent(url);

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 56px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/petitions" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>← All petitions</Link>
        </nav>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {countyName && <span style={badge}>{countyName} County</span>}
          {p.category && <span style={badge}>{categoryLabel(p.category)}</span>}
          {p.target_type && <span style={badge}>{targetTypeLabel(p.target_type)}</span>}
        </div>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)", fontWeight: 600, color: C.ink900, lineHeight: 1.15, letterSpacing: -0.3, margin: "0 0 10px" }}>
          {p.title}
        </h1>
        {p.target && (
          <p style={{ fontSize: 14, color: C.tealDk, fontWeight: 600, margin: "0 0 14px" }}>
            Petitioning: {p.target}{p.target_district ? ` · ${p.target_district}` : ""}
          </p>
        )}

        {p.creator_name && (
          <p style={{ fontSize: 12.5, color: C.ink500, fontWeight: 600, margin: "0 0 18px", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            Started by {p.creator_name}
            {isMyVote && (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#2F6358", background: "#E6F0ED", border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" }}>
                ✓ Official MyVote petition
              </span>
            )}
          </p>
        )}

        {/* Sign box */}
        <div style={{ marginBottom: 22 }}>
          <PetitionSign petitionId={p.id} goal={p.goal} initialCount={p.signature_count} />
        </div>

        {/* Body */}
        {body && (
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "18px 20px", marginBottom: 22 }}>
            <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{body}</p>
          </div>
        )}

        {/* Share */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink700 }}>Share:</span>
          <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" style={shareBtn}>Post on X</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" style={shareBtn}>Facebook</a>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 10px" }}>Related Georgia petitions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map((r) => (
                <Link key={r.share_slug} href={`/petitions/${r.share_slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: C.card, border: `1px solid ${C.rule}`, borderRadius: 10, padding: "11px 14px", textDecoration: "none" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink900 }}>{r.title}</span>
                  <span style={{ fontSize: 12, color: C.ink400, whiteSpace: "nowrap" }}>{r.signature_count.toLocaleString()} signed</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 14 }}>
          <p style={{ fontSize: 11.5, color: C.ink400, lineHeight: 1.5, margin: "0 0 6px" }}>
            {isMyVote
              ? "This is a MyVote-led petition on a good-government issue. MyVote is nonpartisan and not affiliated with any political party, candidate, or campaign — we advocate only on transparency and accountability matters, not partisan ones. Signatures are collected by MyVote and are not an official government filing."
              : "This petition was created by a MyVote community member. Signatures are collected by MyVote and are not an official government filing. MyVote is nonpartisan and not affiliated with any party or campaign."}
          </p>
          <ReportErrorLink refPath={`/petitions/${slug}`} />
        </div>
      </div>
    </div>
  );
}

const badge: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#2F6358", background: "#E6F0ED", border: "1px solid #C0DAD4", borderRadius: 999, padding: "2px 10px" };
const shareBtn: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "#3D435A", background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 999, padding: "7px 14px", textDecoration: "none" };
