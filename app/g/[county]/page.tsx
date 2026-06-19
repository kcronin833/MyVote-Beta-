import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCountySlugs,
  getCountyBySlug,
  type CountyLookup,
} from "@/lib/county-utils";
import { C, RaceCard, SectionHeading, cardStyle } from "@/components/elections/ballot-ui";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";
import { ReminderSignup } from "@/components/reminder-signup";
import { ReportErrorLink } from "@/components/report-error-link";
import { QuizPromo } from "@/components/quiz-promo";
import { ShareBallot } from "@/components/share-ballot";
import { SaveBallotNudge } from "@/components/elections/save-ballot-nudge";
import { BallotPickTracker } from "@/components/elections/ballot-pick-tracker";
import { EarlyVotingBanner } from "@/components/early-voting-banner";

/* Static generation for all 159 Georgia counties — one prebuilt SEO page each. */
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
  if (!found) return { title: "County not found" };

  const raceCount =
    found.statewideRaces.length +
    (found.congressionalRace ? 1 : 0) +
    found.countyRaces.length;

  const title = `${found.name} County, GA — 2026 Ballot & Voting Guide`;
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

/* County-specific voter FAQs — rendered visibly AND emitted as FAQPage
   JSON-LD so Google can show expandable Q&A rich results for queries like
   "when is early voting in Fulton County". Answers are built from the same
   ballot data the page already displays. */
function buildCountyFaqs(found: CountyLookup, generalRace: CountyLookup["statewideRaces"][number]) {
  const { name, congressionalDistrict, pollingInfo, statewideRaces, congressionalRace, countyRaces } = found;
  const raceCount =
    statewideRaces.length + (congressionalRace ? 1 : 0) + countyRaces.length;
  const offices = [
    ...statewideRaces.map((r) => r.office),
    ...(congressionalRace ? [`U.S. House (${congressionalDistrict})`] : []),
    ...countyRaces.map((r) => r.office),
  ];

  return [
    {
      q: `What's on the ballot in ${name} County, Georgia in 2026?`,
      a: `${name} County voters will see ${raceCount} races in 2026, including ${offices.slice(0, 4).join(", ")}${offices.length > 4 ? `, and ${offices.length - 4} more` : ""}. This page lists every race with candidates and key issues.`,
    },
    {
      q: `When is the deadline to register to vote in ${name} County?`,
      a: `The registration deadline for the November 2026 general election is ${generalRace.registrationDeadline}. You can register or check your status at the Georgia Secretary of State's My Voter Page (mvp.sos.ga.gov).`,
    },
    {
      q: `When is early voting in ${name} County for the 2026 general election?`,
      a: `Early (advance) voting for the November 2026 general election runs ${generalRace.earlyVotingStart} through ${generalRace.earlyVotingEnd}. Locations are set by the county — contact the ${name} County elections office or check mvp.sos.ga.gov for sites and hours.`,
    },
    {
      q: `Where do I vote in ${name} County?`,
      a: `${pollingInfo} Find your assigned Election Day precinct and a sample ballot on the Georgia My Voter Page (mvp.sos.ga.gov).`,
    },
    {
      q: `What ID do I need to vote in Georgia?`,
      a: `Georgia requires photo ID to vote in person: a Georgia driver's license (even if expired), free state voter ID card, U.S. passport, military ID, tribal ID, or government employee photo ID. Absentee-by-mail voters provide their driver's license or state ID number.`,
    },
  ];
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

  /* Group races by ELECTION, not just geography — voters think in terms of
     "which election am I voting in", and mixing June runoff races into the
     same stack as November races was genuinely confusing. Runoff section
     auto-retires after election day (build-time date; pages rebuild on each
     deploy, which happens at least weekly). */
  const RUNOFF_DATE = "June 16, 2026";
  const runoffPassed = Date.now() > new Date("2026-06-17T00:00:00-04:00").getTime();
  const isRunoffRace = (r: { date: string }) => r.date === RUNOFF_DATE;
  const runoffRaces = runoffPassed ? [] : statewideRaces.filter(isRunoffRace);
  const novStatewideRaces = statewideRaces.filter((r) => !isRunoffRace(r));

  const faqs = buildCountyFaqs(found, generalRace);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Serialisable race list for the client-side pick tracker
  const allRacesForTracker = [
    ...statewideRaces,
    ...(congressionalRace ? [congressionalRace] : []),
    ...countyRaces,
  ].map((r) => ({
    office: r.office,
    candidates: r.candidates
      .filter((c) => !c.name.includes("TBD"))
      .map((c) => c.name),
  }));

  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, paddingBottom: 2 }}>
            <Link
              href="/elections"
              style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}
            >
              ← Elections
            </Link>
            <span style={{ color: C.ink300 }}>·</span>
            <span style={{ color: C.ink700 }}>{name} County</span>
          </div>

          {/* Hero */}
          <div style={{ ...cardStyle(), overflow: "hidden" }}>
            <div
              style={{
                height: 130,
                background: `linear-gradient(135deg, #0F1929 0%, ${C.ink900} 50%, ${C.tealDk} 100%)`,
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

          {/* High-intent conversion: the visitor just pulled up their ballot —
              the moment of peak intent to capture a reminder so they return to
              vote. North-Star metric = email reminder signups. */}
          <ReminderSignup
            countySlug={found.slug}
            source="county-ballot-top"
            highlight
            title="Get a reminder before you vote"
            blurb={`You found your ${name} County ballot. We’ll email you once before each 2026 Georgia election — registration deadline, early voting, and election day. No spam, never sold.`}
          />

          {/* CRITICAL accuracy guardrail: the race list below is our 2026
              tracker (general election preview + statewide runoffs we cover).
              It is NOT the voter's actual June 16 runoff ballot — runoff
              ballots are county- and party-specific and may include local
              runoffs we don't track. Route runoff voters to the authoritative
              SoS sample ballot rather than implying completeness. */}
          <div
            style={{
              background: "#FFF7ED",
              border: "1px solid #FDBA74",
              borderRadius: 12,
              padding: "14px 16px",
            }}
            role="note"
          >
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "#9A3412", margin: "0 0 4px" }}>
              Voting in the June 16 runoff?
            </p>
            <p style={{ fontSize: 13, color: "#7C2D12", lineHeight: 1.55, margin: "0 0 8px" }}>
              Runoff ballots differ by county and by which primary you voted in,
              and may include local runoff races not listed below. The races on
              this page are MyVote&rsquo;s 2026 election tracker — not your exact
              runoff ballot.
            </p>
            <a
              href="https://mvp.sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 700, color: "#9A3412", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              See your official sample ballot on the GA My Voter Page ↗
            </a>
          </div>

          {/* ── Election 1: June 16 runoff (auto-retires after election day) ── */}
          {runoffRaces.length > 0 && (
            <>
              <div style={{ marginTop: 6 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#B33A2C", margin: "0 0 2px" }}>
                  Happening now
                </p>
                <SectionHeading
                  label="June 16 Primary Runoff"
                  count={runoffRaces.length}
                />
              </div>
              {runoffRaces.map((race) => (
                <RaceCard key={race.office} race={race} />
              ))}
              <p style={{ fontSize: 12, color: C.ink500, lineHeight: 1.5, margin: "2px 2px 6px" }}>
                Statewide runoffs we track. Your county&rsquo;s runoff ballot may
                also include local runoff races — confirm at mvp.sos.ga.gov.{" "}
                <Link href="/guides/what-is-a-runoff" style={{ color: C.teal, fontWeight: 700, textDecoration: "none" }}>
                  New to runoffs? What is a runoff election? →
                </Link>
              </p>
            </>
          )}

          {/* ── Election 2: November 3 general ── */}
          <div style={{ marginTop: runoffRaces.length > 0 ? 10 : 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.ink400, margin: "0 0 2px" }}>
              November 3, 2026
            </p>
            <SectionHeading label="General Election · statewide races" count={novStatewideRaces.length} />
          </div>
          {novStatewideRaces.map((race) => (
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

          {/* Acquisition wedge → viral: let ballot-finders spread it */}
          <ShareBallot countyName={name} countySlug={found.slug} />

          {/* Quiz funnel — convert ballot-readers into the engagement loop */}
          <QuizPromo source="county-page" />

          {/* Voter FAQ — visible content backing the FAQPage JSON-LD */}
          <SectionHeading label={`${name} County voter FAQ`} count={faqs.length} />
          <div style={{ ...cardStyle(), padding: "4px 16px" }}>
            {faqs.map((f, i) => (
              <details
                key={f.q}
                style={{
                  padding: "12px 0",
                  borderBottom: i < faqs.length - 1 ? `1px solid ${C.ruleSoft}` : "none",
                }}
              >
                <summary
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: C.ink900,
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                >
                  {f.q}
                </summary>
                <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.6, margin: "8px 0 0" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          {/* Self-correction: invite readers to flag wrong info */}
          <div style={{ paddingTop: 4, textAlign: "center" }}>
            <ReportErrorLink refPath={`/g/${found.slug}`} />
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </div>

        {/* RIGHT RAIL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Time-sensitive early voting banner */}
          <EarlyVotingBanner />

          {/* Candidate pick tracker — client island */}
          <BallotPickTracker
            races={allRacesForTracker}
            countyName={name}
            countySlug={found.slug}
          />

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
