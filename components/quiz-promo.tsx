import Link from "next/link";

const C = {
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  teal: "#3D8073",
  tealDk: "#2F6358",
};

/* Quiz funnel for deep SEO-landing pages (candidate / county / guide).
   Most discovery traffic lands on these pages and leaves; this pulls the
   curious reader into the civic quiz — the most engaging asset, which also
   captures email and drives shares (the viral loop). */
export function QuizPromo({ source = "deep-page" }: { source?: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1A2138 0%, #2F6358 100%)",
        borderRadius: 14,
        padding: "18px 20px",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 240px", minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 800, margin: "0 0 3px" }}>
          Not sure where you stand?
        </p>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.5 }}>
          Take the free 2-minute civic quiz — no partisan labels, no wrong
          answers. Find your civic profile and the historical figures who shared
          your values.
        </p>
      </div>
      <Link
        href={`/quiz?from=${encodeURIComponent(source)}`}
        style={{
          flexShrink: 0,
          display: "inline-block",
          padding: "11px 22px",
          background: "#fff",
          color: C.tealDk,
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        Take the quiz →
      </Link>
    </div>
  );
}
