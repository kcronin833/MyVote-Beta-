import type { Metadata } from "next";
import Link from "next/link";
import { C } from "@/lib/design-tokens";
import { InterestButton } from "@/components/merch/interest-button";
import {
  MERCH_PRODUCTS,
  MERCH_CATEGORIES,
  MERCH_COLLECTION,
  MERCH_TAGLINE,
  MERCH_SUBHEAD,
} from "@/lib/merch";

export const metadata: Metadata = {
  title: "Undecided 2028 Merch",
  description:
    "The Undecided 2028 collection is coming soon — hats, mugs, apparel and more. Tell us what you'd wear and we'll make it first.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Undecided 2028 — Merch, coming soon",
    description: "Less noise. More options. Register interest and we'll make your pick first.",
    type: "website",
  },
};

const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 14,
  boxShadow: "0 1px 2px rgba(3,2,19,0.04)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

export default function StorePage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #030213 0%, #0A0A14 100%)", padding: "56px 16px 52px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#C7CAD1", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
            Coming Soon
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.1rem, 6vw, 3.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: -0.5, margin: "0 0 12px" }}>
            The {MERCH_COLLECTION} Collection
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: "#E86A5C", margin: "0 0 16px" }}>
            {MERCH_TAGLINE}
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
            {MERCH_SUBHEAD}
          </p>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 18 }}>
            Nothing to buy yet — no charge, no spam. Just tell us what you want and your size/color.
          </p>
        </div>
      </section>

      {/* Product grid, by category */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 16px 72px" }}>
        {MERCH_CATEGORIES.map((cat) => {
          const items = MERCH_PRODUCTS.filter((p) => p.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} style={{ marginBottom: 34 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 2px 14px" }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.ink500, margin: 0 }}>{cat}</h2>
                <div style={{ flex: 1, height: 1, background: C.rule }} />
                <span style={{ fontSize: 11.5, color: C.ink400 }}>{items.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                {items.map((p) => (
                  <div key={p.slug} style={cardStyle}>
                    {/* Placeholder tile — real product photos drop with the store */}
                    <div style={{ height: 120, borderRadius: 10, background: "#0A0A14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <span style={{ fontSize: 34, lineHeight: 1 }}>{p.emoji}</span>
                      <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "#fff" }}>Undecided</span>
                      <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.6)" }}>2028</span>
                    </div>
                    <div style={{ minHeight: 66 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 3px" }}>{p.name}</h3>
                      <p style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.45, margin: 0 }}>{p.blurb}</p>
                    </div>
                    <InterestButton product={p} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p style={{ textAlign: "center", fontSize: 13, color: C.ink500, marginTop: 8 }}>
          While you wait,{" "}
          <Link href="/elections" style={{ color: C.teal, fontWeight: 700, textDecoration: "none" }}>
            check your 2026 ballot →
          </Link>
        </p>
      </div>
    </div>
  );
}
