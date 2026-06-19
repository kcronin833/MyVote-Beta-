import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides-data";

const C = {
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
};

export const metadata: Metadata = {
  title: "Georgia Voter Guides · MyVote",
  description:
    "Plain-English, non-partisan guides for Georgia voters — how runoffs work, voter ID, registration, early voting, absentee ballots, and what each statewide office actually does.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Georgia Voter Guides — MyVote",
    description:
      "Plain-English, non-partisan guides for Georgia voters: registration, ID, early voting, runoffs, and what each office actually does.",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 56px" }}>
      <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.ink400, margin: "0 0 6px" }}>
        Non-partisan · Georgia
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
          fontWeight: 600,
          color: C.ink900,
          lineHeight: 1.15,
          margin: "0 0 8px",
          letterSpacing: -0.4,
        }}
      >
        Voter Guides
      </h1>
      <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.6, margin: "0 0 24px" }}>
        Straight answers to the questions Georgians actually have — how voting
        works here, and what the people on your ballot actually do. No jargon,
        no spin.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
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
            <p style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, margin: "0 0 4px", lineHeight: 1.3 }}>
              {g.title}
            </p>
            <p style={{ fontSize: 13, color: C.ink500, margin: 0, lineHeight: 1.55 }}>
              {g.description}
            </p>
            <span style={{ display: "inline-block", marginTop: 8, fontSize: 13, fontWeight: 700, color: C.teal }}>
              Read guide →
            </span>
          </Link>
        ))}
      </div>

      {/* Loop back to the core action */}
      <div
        style={{
          marginTop: 24,
          background: C.tealSoft,
          border: "1px solid #C0DAD4",
          borderRadius: 14,
          padding: "18px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>
          Ready to see your actual ballot?
        </p>
        <p style={{ fontSize: 13, color: C.ink700, margin: "0 0 14px", lineHeight: 1.55 }}>
          Enter your ZIP and see every race you&rsquo;ll vote on — statewide,
          your district, and local offices.
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
    </div>
  );
}
