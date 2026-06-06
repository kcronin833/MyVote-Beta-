import type { Metadata } from "next";
import Link from "next/link";
import { TopNav } from "@/components/desktop/top-nav";
import { ZipBallotLookup } from "@/components/elections/zip-ballot-lookup";
import {
  C,
  RaceCard,
  SectionHeading,
  cardStyle,
} from "@/components/elections/ballot-ui";
import { STATEWIDE_RACES } from "@/lib/georgia-ballot-data";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";

export const metadata: Metadata = {
  title: "Georgia 2026 Elections — Find Your Ballot · MyVote",
  description:
    "Enter your ZIP to see your complete 2026 Georgia ballot — governor, U.S. Senate, U.S. House, and local races with candidates, key issues, and voting deadlines.",
  alternates: { canonical: "/elections" },
};

const KEY_DATES: { date: string; label: string; critical?: boolean }[] = [
  { date: "March 2026", label: "Voter registration deadline (Primary)", critical: true },
  { date: "May 19, 2026", label: "Georgia Primary Election", critical: true },
  { date: "June 16, 2026", label: "Primary runoff (if needed)" },
  { date: "October 5, 2026", label: "Voter registration deadline (General)", critical: true },
  { date: "Oct 19 – Oct 30, 2026", label: "Early voting period" },
  { date: "November 3, 2026", label: "General Election Day — polls 7am–7pm", critical: true },
];

const VOTER_RESOURCES: { title: string; cta: string; url: string }[] = [
  { title: "Check your registration", cta: "Check now", url: "https://mvp.sos.ga.gov/" },
  { title: "Register to vote", cta: "Register", url: "https://registertovote.sos.ga.gov/" },
  { title: "Find your polling place", cta: "Look up", url: "https://mvp.sos.ga.gov/" },
  { title: "Request an absentee ballot", cta: "Request", url: "https://registertovote.sos.ga.gov/" },
];

const VOTING_RULES: { title: string; body: string }[] = [
  {
    title: "Photo ID required",
    body: "Georgia requires a photo ID to vote in person — driver's license, passport, or free Georgia voter ID card.",
  },
  {
    title: "Registration deadline",
    body: "Register at least 28 days before an election. No same-day registration in Georgia.",
  },
  {
    title: "Early voting",
    body: "In-person early voting starts about 4 weeks before each election at county sites.",
  },
  {
    title: "Absentee voting",
    body: "Any registered voter may request an absentee ballot; include a copy of your photo ID.",
  },
];

export default function ElectionsPage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <TopNav active="ballot" />

      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Hero + ZIP lookup */}
          <div style={{ ...cardStyle(), overflow: "hidden" }}>
            <div
              style={{
                background: `linear-gradient(120deg, ${C.navy} 0%, ${C.ink900} 55%, ${C.teal} 120%)`,
                position: "relative",
                padding: "22px 20px 20px",
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0, opacity: 0.14 }}
              >
                <defs>
                  <pattern
                    id="edots"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#edots)" />
              </svg>
              <div style={{ position: "relative" }}>
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
                    margin: "2px 0 4px",
                    lineHeight: 1.12,
                  }}
                >
                  Find your 2026 ballot
                </h1>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 14px",
                    maxWidth: 520,
                    lineHeight: 1.5,
                  }}
                >
                  Enter your ZIP to jump to every race on your ballot — statewide,
                  U.S. House, and local — with candidates and voting deadlines.
                </p>
                <ZipBallotLookup variant="onDark" />
              </div>
            </div>
          </div>

          {/* Trust guardrail — candidate data is provisional */}
          <BallotDataDisclaimer />

          {/* Statewide races — every Georgia voter */}
          <SectionHeading label="Statewide races · every GA voter" count={STATEWIDE_RACES.length} />
          {STATEWIDE_RACES.map((race) => (
            <RaceCard key={race.office} race={race} />
          ))}

          {/* Local ballot pointer */}
          <SectionHeading label="Your U.S. House & local races" count={2} />
          <div style={{ ...cardStyle(), padding: 16 }}>
            <p style={{ fontSize: 13.5, color: C.ink700, margin: "0 0 12px", lineHeight: 1.55 }}>
              Your congressional district and county, school board, and sheriff
              races depend on where you live. Enter your ZIP above, or pick your
              county to see the full local ballot.
            </p>
            <Link
              href="/g"
              style={{
                display: "inline-block",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                background: C.teal,
                borderRadius: 8,
                padding: "10px 16px",
                textDecoration: "none",
              }}
            >
              Browse all 156 counties →
            </Link>
          </div>

          {/* Voting rules */}
          <SectionHeading label="Georgia voting rules" count={VOTING_RULES.length} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 8,
            }}
          >
            {VOTING_RULES.map((rule) => (
              <div key={rule.title} style={{ ...cardStyle(), padding: 14 }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>
                  {rule.title}
                </h3>
                <p style={{ fontSize: 12.5, color: C.ink700, margin: 0, lineHeight: 1.5 }}>
                  {rule.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Key dates */}
          <div style={{ ...cardStyle(), padding: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: C.ink900 }}>
              Key 2026 dates
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {KEY_DATES.map((d) => (
                <div key={d.date} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: d.critical ? C.red : C.ink400,
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900 }}>
                      {d.date}
                    </div>
                    <div style={{ fontSize: 12, color: C.ink500, lineHeight: 1.4 }}>
                      {d.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: C.ink400, margin: "10px 0 0", lineHeight: 1.5 }}>
              Dates set by the GA Secretary of State and may change. Verify at{" "}
              <a
                href="https://sos.ga.gov/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.teal, fontWeight: 600 }}
              >
                sos.ga.gov
              </a>
              .
            </p>
          </div>

          {/* Voter resources */}
          <div style={{ ...cardStyle(), padding: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: C.ink900 }}>
              Voter resources
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {VOTER_RESOURCES.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 11px",
                    borderRadius: 8,
                    border: `1px solid ${C.ruleSoft}`,
                    background: C.shade,
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink900 }}>
                    {r.title}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: C.teal, whiteSpace: "nowrap" }}>
                    {r.cta} ↗
                  </span>
                </a>
              ))}
            </div>
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
