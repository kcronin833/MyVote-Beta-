import { ImageResponse } from "next/og";
import { getCandidateBySlug } from "@/lib/candidate-utils";

export const alt = "MyVote candidate profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og's bundled font doesn't cover every glyph; keep dynamic text ASCII so
// share cards never 500 on a missing glyph (see the June 2026 OG-font incident).
function ascii(s: string): string {
  return s.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\x7F]/g, "");
}

const PARTY_TONE: Record<string, string> = {
  Democrat: "#1F3A5F", Republican: "#5A6A2E", Independent: "#6B3A6B", Libertarian: "#6B3A6B", Green: "#5A6A2E",
};

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getCandidateBySlug(slug);
  const name = ascii(found?.candidate.name ?? "Candidate");
  const office = ascii(found?.race.office ?? "Georgia 2026 Election");
  const party = found ? ascii(found.candidate.party) : "";
  const incumbent = found?.candidate.isIncumbent ?? false;
  const tone = found ? PARTY_TONE[found.candidate.party] ?? "#030213" : "#030213";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: "64px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, color: "#030213" }}>
          My
          <svg width="30" height="30" viewBox="0 0 24 24" style={{ margin: "0 1px" }}>
            <path d="M5 13l4 4L19 7" stroke="#D4183D" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ote
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, letterSpacing: 2, color: "#717182", marginBottom: 18 }}>
            GEORGIA 2026
            <span style={{ display: "flex", width: 7, height: 7, borderRadius: 7, background: "#D4183D", margin: "0 14px" }} />
            {office}
          </div>
          <div style={{ fontSize: 78, fontWeight: 800, color: "#030213", lineHeight: 1.05, maxWidth: 1050 }}>
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
            <span style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#FFFFFF", background: tone, borderRadius: 8, padding: "6px 18px" }}>
              {party}{incumbent ? " - Incumbent" : ""}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#3D435A" }}>See where they stand, and how they compare</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#030213" }}>myvotega.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
