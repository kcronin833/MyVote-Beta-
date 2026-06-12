/* Sponsor card — sits above the footer on every page.

   Previously this was a dark strip at the very top of every page, which was
   the first thing visitors saw and pattern-matched to a hijacked/scam site
   (an out-of-state phone number above a voter guide). Moved here and
   reframed as the honest founder story: independently funded, no political
   money. Same ad, same phone number — but now it *builds* trust instead of
   burning it. */

export function SupportBanner() {
  return (
    <div style={{ background: "#F0EDE6", borderTop: "1px solid #E4E0D3" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "18px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <span aria-hidden style={{ fontSize: 22 }}>🏠</span>
        <p
          style={{
            fontSize: 13,
            color: "#3D435A",
            lineHeight: 1.55,
            margin: 0,
            maxWidth: 480,
          }}
        >
          <strong style={{ color: "#1A2138" }}>
            MyVote is independent and self-funded
          </strong>{" "}
          — built and paid for by its founder&rsquo;s roofing business. No PACs,
          no political money. Need a roof inspection? It keeps this site free.
        </p>
        <a
          href="tel:+14014191025"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#3D8073",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: "8px 16px",
            borderRadius: 999,
            textDecoration: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 8px rgba(61,128,115,0.25)",
            flexShrink: 0,
          }}
        >
          <span aria-hidden>📞</span> (401) 419-1025
        </a>
      </div>
    </div>
  )
}
