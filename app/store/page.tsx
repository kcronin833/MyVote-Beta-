import type { Metadata } from "next";
import Link from "next/link";
import { C } from "@/lib/design-tokens";
import { InterestButton } from "@/components/merch/interest-button";
import { Lookbook } from "@/components/merch/lookbook";
import { ProductArt } from "@/components/merch/product-art";
import {
  MERCH_PRODUCTS,
  MERCH_CATEGORIES,
  MERCH_COLLECTION,
  MERCH_BRAND,
  MERCH_TAGLINE,
  MERCH_SUBHEAD,
} from "@/lib/merch";

export const metadata: Metadata = {
  title: "CITIZN.APP 2028 Merch",
  description:
    "The 2028 collection is coming soon — hats, mugs, apparel and more, in Undefined and Undecided 2028 wordmarks. Tell us what you'd wear and we'll make it first.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "The 2028 Collection — Merch, coming soon",
    description: "Less noise. More options. Undefined or Undecided 2028 — register interest and we'll make your pick first.",
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
  const featured = MERCH_PRODUCTS.filter((p) => p.featured && p.image);
  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #030213 0%, #0A0A14 100%)", padding: "56px 16px 52px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#C7CAD1", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
            Coming Soon · {MERCH_BRAND}
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.1rem, 6vw, 3.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: -0.5, margin: "0 0 12px" }}>
            {MERCH_COLLECTION}
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: "#E86A5C", margin: "0 0 16px" }}>
            {MERCH_TAGLINE}
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            {MERCH_SUBHEAD}
          </p>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 18 }}>
            Nothing to buy yet — no charge, no spam. Just tell us the wordmark, color or size you&rsquo;d want.
          </p>
        </div>

        {/* Lookbook — the full mockup sheet (hides itself until the file exists). */}
        <Lookbook />
      </section>

      {/* Product grid, by category */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 16px 72px" }}>

        {/* Featured — real product sheets */}
        {featured.map((p) => (
          <section key={p.slug} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 2px 14px" }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.ink500, margin: 0 }}>Featured</h2>
              <div style={{ flex: 1, height: 1, background: C.rule }} />
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#fff", background: C.red, borderRadius: 999, padding: "2px 9px" }}>New</span>
            </div>
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden", gap: 0 }}>
              <img
                src={p.image}
                alt={`${p.name} — ${MERCH_COLLECTION} by ${MERCH_BRAND}: front, back and detail views`}
                style={{ width: "100%", height: "auto", display: "block", borderBottom: `1px solid ${C.rule}` }}
              />
              <div style={{ padding: 18, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ink900, margin: 0 }}>{p.name}</h3>
                    {p.price && <span style={{ fontSize: 16, fontWeight: 700, color: C.ink500 }}>{p.price}</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: C.ink400 }}>Coming soon</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: C.ink500, lineHeight: 1.55, margin: "7px 0 0", maxWidth: 480 }}>{p.blurb}</p>
                </div>
                <div style={{ flex: "0 1 260px", minWidth: 220 }}>
                  <InterestButton product={p} />
                </div>
              </div>
            </div>
          </section>
        ))}

        {MERCH_CATEGORIES.map((cat) => {
          const items = MERCH_PRODUCTS.filter((p) => p.category === cat && !p.featured);
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
                    {/* Vector product art (recreated from the mockup sheet).
                        Swap for real photos later. */}
                    <div style={{ height: 128, borderRadius: 10, background: "linear-gradient(160deg, #12121C 0%, #0A0A14 100%)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, padding: "10px 10px 4px" }}>
                        <ProductArt slug={p.slug} />
                      </div>
                      <span style={{ position: "absolute", bottom: 7, left: 0, right: 0, textAlign: "center", fontSize: 8, letterSpacing: 3, color: "rgba(255,255,255,0.5)" }}>{MERCH_BRAND}</span>
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
