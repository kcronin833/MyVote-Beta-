import type { Metadata } from "next";
import Link from "next/link";
import { GA_VOTER_FAQ, faqPageSchema } from "@/lib/ga-election-facts";

export const metadata: Metadata = {
  title: "Georgia Voter FAQ 2026 — Your Questions Answered · MyVote",
  description:
    "Answers to the most common questions Georgia voters ask about the 2026 election — registration, photo ID, early and absentee voting, who's running for governor and U.S. Senate, and ballot rules.",
  alternates: { canonical: "/georgia-voter-faq" },
  openGraph: {
    title: "Georgia Voter FAQ 2026 · MyVote",
    description:
      "Clear answers on registration, ID, early voting, and the 2026 Georgia races for governor and U.S. Senate.",
    type: "website",
  },
};

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138",
  ink700: "#3D435A", ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358",
};

export default function GeorgiaVoterFaqPage() {
  // Preserve first-seen category order from the source list.
  const categories: string[] = [];
  for (const e of GA_VOTER_FAQ) if (!categories.includes(e.category)) categories.push(e.category);

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      {/* FAQPage schema for AI engines + featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(GA_VOTER_FAQ)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
            { "@type": "ListItem", position: 2, name: "Georgia Voter FAQ", item: "https://www.myvotega.com/georgia-voter-faq" },
          ],
        }) }}
      />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>Georgia Voter FAQ</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          Georgia Voter FAQ for the 2026 Election
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 10px", maxWidth: 640 }}>
          Straight answers to what Georgia voters actually ask about the 2026 election —
          how to register, what ID you need, when and how to vote early or by mail, and
          who is on the ballot for governor and U.S. Senate.
        </p>
        <p style={{ fontSize: 12.5, color: C.ink400, lineHeight: 1.6, margin: "0 0 32px" }}>
          Dates and candidates verified June 23, 2026 against the Georgia Secretary of State
          and election results reporting. Always confirm your specifics at{" "}
          <a href="https://mvp.sos.ga.gov" target="_blank" rel="noopener noreferrer" style={{ color: C.teal }}>
            the Georgia My Voter Page
          </a>.
        </p>

        {categories.map((cat) => (
          <section key={cat} style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.tealDk, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${C.rule}` }}>
              {cat}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {GA_VOTER_FAQ.filter((e) => e.category === cat).map((e) => (
                <div key={e.q}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, lineHeight: 1.35, margin: "0 0 5px" }}>
                    {e.q}
                  </h3>
                  <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>
                    {e.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "20px 22px", marginTop: 8, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.ink900, margin: "0 0 6px" }}>
            See your exact 2026 ballot
          </p>
          <p style={{ fontSize: 13.5, color: C.ink500, lineHeight: 1.6, margin: "0 0 14px" }}>
            Enter your ZIP to see every race — governor to school board — with candidates and key dates.
          </p>
          <Link href="/elections" style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, padding: "11px 26px", borderRadius: 999, textDecoration: "none" }}>
            Find your ballot →
          </Link>
        </div>

        <p style={{ fontSize: 12, color: C.ink400, lineHeight: 1.6, margin: "24px 0 0", textAlign: "center" }}>
          MyVote is nonpartisan and not affiliated with any party or government entity. Official
          information is always at{" "}
          <a href="https://sos.ga.gov" target="_blank" rel="noopener noreferrer" style={{ color: C.ink500, textDecoration: "underline" }}>sos.ga.gov</a>.
        </p>
      </div>
    </div>
  );
}
