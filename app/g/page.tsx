import type { Metadata } from "next";
import Link from "next/link";
import { listCounties } from "@/lib/county-utils";
import { TopNav } from "@/components/desktop/top-nav";

export const metadata: Metadata = {
  title: "Georgia 2026 Ballot by County · MyVote",
  description:
    "Browse 2026 election ballots for every Georgia county. Find your governor, U.S. House, statewide, and local races plus voting deadlines — organized by congressional district.",
  alternates: { canonical: "/g" },
  openGraph: {
    title: "Georgia 2026 Ballot — Browse by County",
    description:
      "Every Georgia county's 2026 ballot, candidates, and voting deadlines in one place.",
    type: "website",
  },
};

const C = {
  page: "#F3F1EB",
  card: "#FFFFFF",
  rule: "#E4E0D3",
  ruleSoft: "#EFEBE0",
  shade: "#F7F5EF",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealSoft: "#E6F0ED",
  navy: "#1F3A5F",
};

/** Sort GA-1 … GA-14 numerically, "Unknown" last. */
function districtSort(a: string, b: string): number {
  const na = parseInt(a.replace(/\D/g, ""), 10);
  const nb = parseInt(b.replace(/\D/g, ""), 10);
  if (isNaN(na)) return 1;
  if (isNaN(nb)) return -1;
  return na - nb;
}

export default function CountyIndexPage() {
  const counties = listCounties();

  // Group counties by congressional district.
  const byDistrict = new Map<string, typeof counties>();
  for (const c of counties) {
    const list = byDistrict.get(c.congressionalDistrict) ?? [];
    list.push(c);
    byDistrict.set(c.congressionalDistrict, list);
  }
  const districts = Array.from(byDistrict.keys()).sort(districtSort);

  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <TopNav active="ballot" />

      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 lg:px-6 lg:pt-4">
        {/* Hero */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.rule}`,
            borderRadius: 10,
            boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              height: 96,
              background: `linear-gradient(120deg, ${C.navy} 0%, ${C.ink900} 55%, ${C.teal} 115%)`,
              position: "relative",
            }}
          >
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0, opacity: 0.16 }}
            >
              <defs>
                <pattern
                  id="gdots"
                  x="0"
                  y="0"
                  width="14"
                  height="14"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gdots)" />
            </svg>
            <div style={{ position: "absolute", left: 18, bottom: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                GEORGIA · 2026 ELECTION
              </div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "2px 0 0",
                  lineHeight: 1.1,
                }}
              >
                Browse your ballot by county
              </h1>
            </div>
          </div>
          <div style={{ padding: "12px 16px 14px" }}>
            <p
              style={{
                fontSize: 13.5,
                color: C.ink700,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              Pick your county to see every 2026 race on the ballot — governor,
              U.S. House, statewide and local offices — with candidates, key
              issues, and voting deadlines. {counties.length} Georgia counties,
              grouped by congressional district.{" "}
              <Link href="/elections" style={{ color: C.teal, fontWeight: 600 }}>
                Or find it by ZIP →
              </Link>
            </p>
          </div>
        </div>

        {/* District groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {districts.map((district) => {
            const list = byDistrict.get(district)!;
            return (
              <section
                key={district}
                style={{
                  background: C.card,
                  border: `1px solid ${C.rule}`,
                  borderRadius: 10,
                  boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.ink900,
                      margin: 0,
                    }}
                  >
                    {district === "Unknown" ? "Other counties" : `U.S. House · ${district}`}
                  </h2>
                  <span style={{ fontSize: 11, color: C.ink400 }}>
                    {list.length}
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.rule }} />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 6,
                  }}
                >
                  {list.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.href}
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.ink900,
                        background: C.shade,
                        border: `1px solid ${C.ruleSoft}`,
                        borderRadius: 8,
                        padding: "8px 10px",
                        textDecoration: "none",
                      }}
                    >
                      {c.name}{" "}
                      <span style={{ color: C.ink400, fontWeight: 400 }}>
                        County
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            href="/"
            style={{
              fontSize: 12.5,
              color: C.ink500,
              textDecoration: "none",
            }}
          >
            ← Back to MyVote home
          </Link>
        </div>
      </div>
    </div>
  );
}
