import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCountySlugs,
  getCountyBySlug,
  candidateDetailHref,
  type CountyLookup,
} from "@/lib/county-utils";
import type { BallotRace, BallotCandidate } from "@/lib/georgia-ballot-data";
import { TopNav } from "@/components/desktop/top-nav";

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
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
  red: "#B33A2C",
  redSoft: "#F5E3DF",
  amber: "#B8862F",
  amberSoft: "#F4ECD8",
  plum: "#6B3A6B",
  navy: "#1F3A5F",
  olive: "#5A6A2E",
};

const TONE_BY_PARTY: Record<string, string> = {
  Democrat: C.navy,
  Republican: C.olive,
  Independent: C.plum,
  Libertarian: C.plum,
  Green: C.olive,
};

const PARTY_ABBR: Record<string, string> = {
  Democrat: "D",
  Republican: "R",
  Independent: "I",
  Libertarian: "L",
  Green: "G",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function cardStyle(): React.CSSProperties {
  return {
    background: C.card,
    border: `1px solid ${C.rule}`,
    borderRadius: 10,
    boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
  };
}

function CandidateRow({
  candidate,
  raceOffice,
}: {
  candidate: BallotCandidate;
  raceOffice: string;
}) {
  const href = candidateDetailHref(candidate.name, raceOffice);
  const tone = TONE_BY_PARTY[candidate.party] || C.ink900;
  const abbr = PARTY_ABBR[candidate.party] || "·";

  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${C.ruleSoft}`,
        background: C.shade,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: tone,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials(candidate.name)}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: C.ink900,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidate.name}
          </span>
          {candidate.isIncumbent && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.teal,
                background: C.tealSoft,
                borderRadius: 4,
                padding: "1px 5px",
                whiteSpace: "nowrap",
              }}
            >
              Incumbent
            </span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: C.ink500 }}>
          {candidate.party}
          {candidate.keyIssues.length > 0 && (
            <span style={{ color: C.ink400 }}>
              {" · "}
              {candidate.keyIssues.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `1px solid ${tone}`,
          color: tone,
          fontSize: 10.5,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {abbr}
      </span>
      {href && (
        <span style={{ fontSize: 11, color: C.teal, fontWeight: 600, flexShrink: 0 }}>
          View →
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

function RaceCard({ race }: { race: BallotRace }) {
  const named = race.candidates.filter((c) => !c.name.includes("TBD"));
  const tbdCount = race.candidates.length - named.length;

  return (
    <div style={{ ...cardStyle(), padding: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>
          {race.office}
        </h3>
        <span style={{ fontSize: 11, color: C.ink500, whiteSpace: "nowrap" }}>
          {race.date}
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 10px", lineHeight: 1.5 }}>
        {race.description}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {named.map((c) => (
          <CandidateRow key={c.name} candidate={c} raceOffice={race.office} />
        ))}
        {tbdCount > 0 && (
          <div style={{ fontSize: 11.5, color: C.ink400, padding: "4px 10px" }}>
            {tbdCount} nominee{tbdCount > 1 ? "s" : ""} to be determined after the
            primary.
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "6px 2px 2px",
      }}
    >
      <h2
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: C.ink500,
          margin: 0,
        }}
      >
        {label}
      </h2>
      <span style={{ fontSize: 11, color: C.ink400 }}>{count}</span>
      <div style={{ flex: 1, height: 1, background: C.rule }} />
    </div>
  );
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
