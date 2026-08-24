import { ImageResponse } from "next/og";
import { getCountyBySlug } from "@/lib/county-utils";

export const alt = "MyVote county ballot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function ascii(s: string): string {
  return s.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\x7F]/g, "");
}

export default async function OgImage({ params }: { params: Promise<{ county: string }> }) {
  const { county } = await params;
  const found = getCountyBySlug(county);
  const name = ascii(found?.name ?? "Georgia");
  const district = ascii(found?.congressionalDistrict ?? "");
  const raceCount = found
    ? found.statewideRaces.length + (found.congressionalRace ? 1 : 0) + found.countyRaces.length
    : 0;

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
            YOUR 2026 BALLOT
            {district ? (
              <>
                <span style={{ display: "flex", width: 7, height: 7, borderRadius: 7, background: "#D4183D", margin: "0 14px" }} />
                {district}
              </>
            ) : null}
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, color: "#030213", lineHeight: 1.05 }}>
            {name} County
          </div>
          <div style={{ fontSize: 30, color: "#3D435A", marginTop: 18 }}>
            {raceCount > 0 ? `${raceCount} races - governor to school board` : "Every 2026 race, candidate, and key date"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#3D435A" }}>See who is running where you live</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#030213" }}>myvotega.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
