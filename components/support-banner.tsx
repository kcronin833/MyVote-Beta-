/* Funding-transparency line — sits above the footer on every page.

   Previously a roofing-business ad with a phone number, which read like a
   hijacked/scam site (an out-of-state number above a voter guide). Replaced
   with a clean, commercial-free statement of independence: the trust signal
   without the solicitation. The founder story lives on the About page. */

export function SupportBanner() {
  return (
    <div style={{ background: "#F0EDE6", borderTop: "1px solid #E4E0D3" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "16px 16px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#3D435A",
            lineHeight: 1.55,
            margin: "0 auto",
            maxWidth: 520,
            fontWeight: 500,
          }}
        >
          <strong style={{ color: "#1A2138" }}>MyVote is independently funded</strong>{" "}
          — no PAC money, no political advertisers, no agenda. Just Georgia voters.
        </p>
      </div>
    </div>
  )
}
