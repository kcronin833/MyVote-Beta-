import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCountySlugs,
  getCountyBySlug,
  type CountyLookup,
} from "@/lib/county-utils";
import { TopNav } from "@/components/desktop/top-nav";
import { C, RaceCard, SectionHeading, cardStyle } from "@/components/elections/ballot-ui";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";
import { SaveBallotNudge } from "@/components/elections/save-ballot-nudge";

/* Static generation for every Georgia county we have data for
   (~156 of the 159 counties → one prebuilt SEO page each). */
export async function generateStaticParams() {
  return getAllCountySlugs().map((county) => ({ county }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county } = await params;
  const found = getCountyBySlug(county);
  if (!found) return { title: "County not found · MyVote" };

  const raceCount =
    found.statewideRaces.length +
    (found.congressionalRace ? 1 : 0) +
    found.countyRaces.length;

  const title = `${found.name} County, GA 2026 Ballot & Voting Guide · MyVote`;
  const description = `See every 2026 race on the ballot in ${found.name} County, Georgia (${found.congressionalDistrict}) — governor, U.S. House, statewide and local offices. ${raceCount} races, candidates, key issues, and voting deadlines.`;

  return {
    title,
    description,
    alternates: { canonical: `/g/${found.slug}` },
    openGraph: {
      title: `${found.name} County, GA — 2026 Ballot`,
      description,
      type: "website",
    },
  };
}


function RailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        padding: "6px 0",
        borderBottom: `1px solid ${C.ruleSoft}`,
        fontSize: 12.5,
      }}
    >
      <span style={{ color: C.ink500 }}>{label}</span>
      <span style={{ color: C.ink900, fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county } = await params;
  const found: CountyLookup | null = getCountyBySlug(county);
  if (!found) notFound();

  const { name, congressionalDistrict, pollingInfo, statewideRaces, congressionalRace, countyRaces } =
    found;

  // Pull representative voting dates from the general statewide race.
  const generalRace =
    statewideRaces.find((r) => r.type === "General Election") ?? statewideRaces[0];
  const primaryRace = statewideRaces.find((r) => r.type === "Primary Election");

  const raceCount =
    statewideRaces.length + (congressionalRace ? 1 : 0) + countyRaces.length;

  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <TopNav active="ballot" />

      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Hero */}
          <div style={{ ...cardStyle(), overflow: "hidden" }}>
            <div
              style={{
                height: 120,
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
                    id="cdots"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cdots)" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 14,
                  right: 18,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
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
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#fff",
                      margin: "2px 0 0",
                      lineHeight: 1.1,
                    }}
                  >
                    {name} County
                  </h1>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    background: "rgba(255,255,255,0.16)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 6,
                    padding: "3px 9px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {congressionalDistrict}
                </span>
              </div>
            </div>
            <div style={{ padding: "12px 16px 14px" }}>
              <p style={{ fontSize: 13.5, color: C.ink700, margin: 0, lineHeight: 1.55 }}>
                Your complete 2026 ballot for{" "}
                <strong style={{ color: C.ink900 }}>{name} County, Georgia</strong> —{" "}
                {raceCount} races spanning statewide offices, the{" "}
                {congressionalDistrict} congressional seat, and local government.
                Review candidates, compare key issues, and check your voting
                deadlines below.
              </p>
            </div>
          </div>

          {/* Trust guardrail — candidate data is provisional */}
          <BallotDataDisclaimer />

          {/* Statewide */}
          <SectionHeading label="Statewide races" count={statewideRaces.length} />
          {statewideRaces.map((race) => (
            <RaceCard key={race.office} race={race} />
          ))}

          {/* Congressional */}
          {congressionalRace && (
            <>
              <SectionHeading
                label={`U.S. House · ${congressionalDistrict}`}
                count={1}
              />
              <RaceCard race={congressionalRace} />
            </>
          )}

          {/* Local */}
          {countyRaces.length > 0 && (
            <>
              <SectionHeading
                label={`${name} County · local races`}
                count={countyRaces.length}
              />
              {countyRaces.map((race) => (
                <RaceCard key={race.office} race={race} />
              ))}
            </>
          )}
        </div>

        {/* RIGHT RAIL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Sign-up nudge — only visible to logged-out visitors */}
          <SaveBallotNudge />

          {/* How to vote */}
          <div style={{ ...cardStyle(), padding: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: C.ink900 }}>
              Key 2026 dates
            </h2>
            {primaryRace && (
              <RailRow label="Primary election" value={primaryRace.date} />
            )}
            {primaryRace && (
              <RailRow
                label="Primary reg. deadline"
                value={primaryRace.registrationDeadline}
              />
            )}
            <RailRow label="General election" value={generalRace.date} />
            <RailRow
              label="General reg. deadline"
              value={generalRace.registrationDeadline}
            />
            <RailRow
              label="Early voting"
              value={`${generalRace.earlyVotingStart} – ${generalRace.earlyVotingEnd}`}
            />
          </div>

          {/* Polling / county office */}
          <div style={{ ...cardStyle(), padding: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", color: C.ink900 }}>
              {name} County elections
            </h2>
            <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 10px", lineHeight: 1.5 }}>
              {pollingInfo}
            </p>
            <a
              href="https://mvp.sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: 12.5,
                fontWeight: 700,
                color: "#fff",
                background: C.teal,
                borderRadius: 8,
                padding: "9px 12px",
                textDecoration: "none",
              }}
            >
              Check your registration ↗
            </a>
            <p style={{ fontSize: 11, color: C.ink400, margin: "8px 0 0", lineHeight: 1.5 }}>
              Look up your precinct, sample ballot, and absentee status on the
              Georgia My Voter Page.
            </p>
          </div>

          {/* Cross-link */}
          <div style={{ ...cardStyle(), padding: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", color: C.ink900 }}>
              Not your county?
            </h2>
            <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 10px", lineHeight: 1.5 }}>
              Enter your ZIP on the elections page to jump to your exact ballot.
            </p>
            <Link
              href="/elections"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: 12.5,
                fontWeight: 700,
                color: C.teal,
                background: C.tealSoft,
                borderRadius: 8,
                padding: "9px 12px",
                textDecoration: "none",
              }}
            >
              Find my ballot by ZIP
            </Link>
            <Link
              href="/g"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: C.ink500,
                marginTop: 8,
                textDecoration: "none",
              }}
            >
              Browse all counties →
            </Link>
          </div>

          <Link
            href="/"
            style={{ fontSize: 12.5, color: C.ink500, textDecoration: "none", padding: "0 2px" }}
          >
            ← Back to MyVote home
          </Link>
        </div>
      </div>
    </div>
  );
}
