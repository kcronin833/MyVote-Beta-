import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { ZipBallotLookup } from "@/components/elections/zip-ballot-lookup";
import {
  C,
  RaceCard,
  SectionHeading,
  cardStyle,
} from "@/components/elections/ballot-ui";
import { STATEWIDE_RACES } from "@/lib/georgia-ballot-data";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";
import { GA_2026 } from "@/lib/ga-election-facts";

/* Upcoming general-election events for rich results. The June 16 runoff is
   complete (Jackson & Collins won the GOP nominations), so it is intentionally
   NOT listed as an upcoming Event. Dates verified 2026-06-23. */
const electionEventsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "2026 Georgia General Election Key Dates",
  itemListElement: [
    {
      "@type": "ListItem", position: 1,
      item: {
        "@type": "Event",
        name: "Georgia Voter Registration Deadline — 2026 General Election",
        startDate: GA_2026.registrationDeadline.iso,
        endDate: GA_2026.registrationDeadline.iso,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: "Georgia", address: { "@type": "PostalAddress", addressRegion: "GA", addressCountry: "US" } },
        description: "Last day to register to vote in Georgia's November 3, 2026 general election.",
      },
    },
    {
      "@type": "ListItem", position: 2,
      item: {
        "@type": "Event",
        name: "Georgia Early Voting — 2026 General Election",
        startDate: GA_2026.earlyVoting.startIso,
        endDate: GA_2026.earlyVoting.endIso,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: "Georgia", address: { "@type": "PostalAddress", addressRegion: "GA", addressCountry: "US" } },
        description: "In-person early voting period for the 2026 Georgia general election at county sites statewide.",
      },
    },
    {
      "@type": "ListItem", position: 3,
      item: {
        "@type": "Event",
        name: "2026 Georgia General Election",
        startDate: GA_2026.generalElection.iso,
        endDate: GA_2026.generalElection.iso,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: "Georgia", address: { "@type": "PostalAddress", addressRegion: "GA", addressCountry: "US" } },
        description: "Georgia General Election Day. Polls open 7am–7pm. Races include U.S. Senate, Governor, all 14 U.S. House seats, and dozens of local offices.",
        organizer: { "@type": "GovernmentOrganization", name: "Georgia Secretary of State" },
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Georgia 2026 Ballot Guide — Every Race, Every Candidate · MyVote",
  description:
    "Find every race on your 2026 Georgia ballot — governor, U.S. Senate, all 14 U.S. House districts, and local offices. Real candidates, key dates, and nonpartisan coverage. Enter your ZIP to start.",
  alternates: { canonical: "/elections" },
};

const KEY_DATES: { date: string; label: string; critical?: boolean; past?: boolean }[] = [
  { date: "May 19, 2026", label: "Georgia Primary Election — completed", past: true },
  { date: "June 16, 2026", label: "Primary Runoff — completed (Jackson & Collins won GOP nominations)", past: true },
  { date: "October 5, 2026", label: "Voter registration deadline (General)", critical: true },
  { date: "Oct 12 – Oct 30, 2026", label: "Early voting — General Election" },
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

/* Runoff banner — server-rendered, only shows between June 7 and June 16.
   noStore() prevents stale build-time dates in cached static pages. */
function RunoffBanner() {
  noStore();
  const now = new Date();
  const runoff = new Date("2026-06-16T19:00:00-04:00"); // polls close 7pm ET
  // Advance voting: began June 6–8 by county, ends statewide Fri June 12
  const earlyStart = new Date("2026-06-06T00:00:00-04:00");
  const earlyEnd = new Date("2026-06-13T00:00:00-04:00"); // after last day
  if (now >= runoff) return null;
  const daysLeft = Math.max(0, Math.ceil((runoff.getTime() - now.getTime()) / 86_400_000));
  const earlyOpen = now >= earlyStart && now < earlyEnd;
  const earlyOver = now >= earlyEnd;
  return (
    <div style={{
      background: `linear-gradient(135deg, #7C1A0F 0%, #B33A2C 100%)`,
      borderRadius: 10,
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      color: "#fff",
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>🗳️</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14.5 }}>
          June 16 Runoff — {daysLeft === 0 ? "Today!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} away`}
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.88)", marginTop: 2, lineHeight: 1.45 }}>
          GOP nominations for Georgia Governor &amp; U.S. Senate are decided June 16.
          {earlyOpen
            ? " Early voting is open now — it ends Friday, June 12; hours vary by county."
            : earlyOver
              ? " Early voting has ended — vote in person on election day."
              : " Early voting opens June 6–8, depending on your county."}
          {" "}Election day polls open 7am–7pm.
        </div>
      </div>
    </div>
  );
}

export default function ElectionsPage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(electionEventsSchema) }}
      />

      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Runoff urgency banner */}
          <RunoffBanner />
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
                    fontFamily: "var(--font-serif)",
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "2px 0 4px",
                    lineHeight: 1.1,
                    letterSpacing: -0.4,
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
                Browse all 159 counties →
              </Link>
              <Link
                href="/profile"
                style={{
                  display: "inline-block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.teal,
                  background: C.tealSoft,
                  border: `1px solid ${C.tealMid}`,
                  borderRadius: 8,
                  padding: "10px 16px",
                  textDecoration: "none",
                }}
              >
                Your saved ballot &amp; profile →
              </Link>
            </div>
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
                <div key={d.date} style={{ display: "flex", gap: 9, alignItems: "flex-start", opacity: d.past ? 0.45 : 1 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: d.past ? C.ink400 : d.critical ? C.red : C.ink400,
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: d.past ? C.ink500 : C.ink900, textDecoration: d.past ? "line-through" : "none" }}>
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

        </div>
      </div>
    </div>
  );
}
