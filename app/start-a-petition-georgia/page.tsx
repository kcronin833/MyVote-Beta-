import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PETITION_FAQ, type PetitionRow, PETITION_SELECT } from "@/lib/petitions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How to Start a Petition in Georgia — Free Guide · MyVote",
  description:
    "Step-by-step guide to starting a free petition in Georgia. Target school boards, county commissioners, state legislators, and more — start in minutes on MyVote.",
  alternates: { canonical: "/start-a-petition-georgia" },
};

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

const STEPS = [
  { h: "Step 1 — Choose your target official", b: "Decide who has the power to make the change you want — your county commission, school board, city council, mayor, or a state or federal legislator. On MyVote you pick the target type and name when you create the petition." },
  { h: "Step 2 — Write your petition", b: "Give it a clear title and explain why it matters: what's happening, who it affects, and exactly what you're asking the official to do. Specific, factual petitions gather more signatures than vague complaints." },
  { h: "Step 3 — Set your signature goal", b: "Pick a realistic goal (the default is 100). A visible goal and progress bar create momentum — supporters can see how close you are and share to push past it." },
  { h: "Step 4 — Share with Georgia voters", b: "Every petition gets its own link. Share it by text, in your county civic group, and on social media. Signatures come from real Georgians engaged in local politics." },
  { h: "Step 5 — Deliver to the official", b: "When you've gathered support, take the petition and its public record to the official — at a public meeting, by email, or in person. The signatures are your evidence that the community is behind the ask." },
];

const HOWTO_FAQ = [
  ...PETITION_FAQ,
  { q: "How many signatures do I need for a Georgia petition?", a: "There is no fixed legal number for a community petition to an official — it's about demonstrating support. A few dozen signatures can move a local school board item; larger county or state asks benefit from hundreds. Set a goal you can realistically reach and exceed." },
  { q: "Can I petition a Georgia school board?", a: "Yes. School boards are one of the most common and effective petition targets because they make local decisions about closures, budgets, and policies. Choose 'School Board' as your target type and name your county's board." },
  { q: "Is an online petition legally binding in Georgia?", a: "A community petition is not a binding legal filing — it's a way to show officials that constituents support a change. It carries weight as public, organized pressure, especially when signatures come from voters in the official's own district." },
];

export default async function StartAPetitionGeorgia() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_petitions")
    .select(PETITION_SELECT)
    .eq("status", "active")
    .not("share_slug", "is", null)
    .order("signature_count", { ascending: false })
    .limit(5);
  const examples = (data as PetitionRow[]) ?? [];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOWTO_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
      { "@type": "ListItem", position: 2, name: "Georgia Petitions", item: "https://www.myvotega.com/petitions" },
      { "@type": "ListItem", position: 3, name: "How to Start a Petition", item: "https://www.myvotega.com/start-a-petition-georgia" },
    ],
  };

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/petitions" style={{ color: C.teal, textDecoration: "none" }}>Petitions</Link>
          <span style={{ margin: "0 6px" }}>/</span><span>How to Start a Petition</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          How to Start a Petition in Georgia
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 640 }}>
          A free, five-step guide to starting a petition that actually reaches Georgia officials —
          school boards, county commissioners, city councils, and state legislators.
        </p>

        <Link href="/petitions/create" style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: 15, fontWeight: 700, padding: "12px 26px", borderRadius: 999, textDecoration: "none", marginBottom: 32 }}>
          Start your Georgia petition now →
        </Link>

        {STEPS.map((s) => (
          <section key={s.h} style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 8px" }}>{s.h}</h2>
            <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7, margin: 0 }}>{s.b}</p>
          </section>
        ))}

        {examples.length > 0 && (
          <section style={{ margin: "10px 0 28px" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Georgia petition examples</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {examples.map((p) => (
                <Link key={p.id} href={`/petitions/${p.share_slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: C.card, border: `1px solid ${C.rule}`, borderRadius: 10, padding: "11px 14px", textDecoration: "none" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink900 }}>{p.title}</span>
                  <span style={{ fontSize: 12, color: C.ink400, whiteSpace: "nowrap" }}>{p.signature_count.toLocaleString()} signed</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>Frequently asked questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {HOWTO_FAQ.map((f) => (
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
