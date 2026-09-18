import Link from "next/link";
import { MERCH_COLLECTION, MERCH_TAGLINE, MERCH_BRAND } from "@/lib/merch";

/* On-site advertisement for the coming-soon Undecided 2028 store.
   Two layouts:
     - "rail"   → compact card for the desktop home right rail
     - "banner" → wide strip for landing / full-width sections
   Dark, serif, matches the /store hero so it reads as one brand. */

const DARK = "linear-gradient(135deg, #030213 0%, #0A0A14 100%)";

export function StorePromo({ layout = "rail" }: { layout?: "rail" | "banner" }) {
  const Pill = (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "#C7CAD1",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 999,
        padding: "3px 10px",
      }}
    >
      Coming Soon · {MERCH_BRAND} Merch
    </span>
  );

  const Title = (
    <span
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.01em",
        lineHeight: 1.1,
        display: "block",
      }}
    >
      {MERCH_COLLECTION}
    </span>
  );

  const Tagline = (
    <span
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        color: "#E86A5C",
        display: "block",
      }}
    >
      {MERCH_TAGLINE}
    </span>
  );

  if (layout === "banner") {
    return (
      <Link
        href="/store"
        className="mv-lift"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 20,
          background: DARK,
          borderRadius: 16,
          padding: "22px 24px",
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>🧢</span>
        <span style={{ flex: "1 1 260px", minWidth: 0 }}>
          {Pill}
          <span style={{ fontSize: "clamp(1.3rem, 3vw, 1.75rem)", marginTop: 8, display: "block" }}>{Title}</span>
          <span style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", marginTop: 2, display: "block" }}>{Tagline}</span>
          <span style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.55, marginTop: 8 }}>
            Hats, mugs, hoodies &amp; more. It&rsquo;s not for sale yet — tell us
            what you&rsquo;d wear and your size, and we&rsquo;ll make it first.
          </span>
        </span>
        <span
          style={{
            flexShrink: 0,
            background: "#fff",
            color: "#030213",
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 999,
            padding: "12px 22px",
            whiteSpace: "nowrap",
          }}
        >
          Reserve your pick →
        </span>
      </Link>
    );
  }

  // rail
  return (
    <Link
      href="/store"
      className="mv-lift"
      style={{
        display: "block",
        background: DARK,
        borderRadius: 12,
        padding: "16px",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 2px 10px rgba(20,24,40,0.12)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {Pill}
        <span style={{ fontSize: 22, lineHeight: 1 }}>🧢</span>
      </div>
      <div style={{ fontSize: 18, marginTop: 10 }}>{Title}</div>
      <div style={{ fontSize: 14, marginTop: 2 }}>{Tagline}</div>
      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.5, margin: "10px 0 12px" }}>
        Hats, mugs, hoodies &amp; more — tell us what to make first.
      </p>
      <span
        style={{
          display: "block",
          textAlign: "center",
          background: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.32)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Reserve your pick →
      </span>
    </Link>
  );
}
