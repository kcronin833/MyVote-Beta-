import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCandidateSlugs,
  getCandidateBySlug,
  candidateSlug,
} from "@/lib/candidate-utils";
import { TopNav } from "@/components/desktop/top-nav";
import { ClaimProfile } from "@/components/elections/claim-profile";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";

/* Static generation for every candidate slug we know about.
   159 counties × handful of races = ~50 pages prebuilt at build time. */
export async function generateStaticParams() {
  return getAllCandidateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getCandidateBySlug(slug);
  if (!found) return { title: "Candidate not found · MyVote" };
  return {
    title: `${found.candidate.name} · ${found.race.office} · MyVote`,
    description: found.candidate.bio.slice(0, 200),
    openGraph: {
      title: `${found.candidate.name} — ${found.candidate.party}`,
      description: found.candidate.bio.slice(0, 200),
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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getCandidateBySlug(slug);
  if (!found) notFound();

  const { candidate, race, otherCandidates } = found;
  const avatarBg = TONE_BY_PARTY[candidate.party] || C.ink900;
  const hasWebsite = !!candidate.website;
  const hasTwitter = !!candidate.socialMedia?.twitter;
  const fundraisingReal =
    candidate.fundraising.totalRaised &&
    candidate.fundraising.totalRaised !== "TBD";

  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <TopNav active="ballot" />

      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Hero card */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.rule}`,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
            }}
          >
            {/* Banner */}
            <div
              style={{
                height: 180,
                background: `linear-gradient(120deg, ${C.navy} 0%, ${C.ink900} 50%, ${C.teal} 110%)`,
                position: "relative",
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0, opacity: 0.18 }}
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  display: "flex",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    background: C.ink900,
                    color: "#fff",
                    padding: "4px 9px",
                    borderRadius: 999,
                    border: `1px solid ${C.ink900}`,
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {candidate.party}
                </span>
                <span
                  style={{
                    background: C.ink900,
                    color: "#fff",
                    padding: "4px 9px",
                    borderRadius: 999,
                    border: `1px solid ${C.ink900}`,
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {race.level}
                </span>
              </div>
            </div>

            {/* Avatar overlap + name + actions */}
            <div
              style={{
                padding: "0 24px 20px",
                display: "flex",
                alignItems: "flex-end",
                gap: 18,
                marginTop: -52,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: avatarBg,
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 44,
                  boxShadow: `0 0 0 3px ${C.card}, 0 0 0 4px ${C.rule}`,
                  flexShrink: 0,
                }}
              >
                {initials(candidate.name)}
              </div>
              <div style={{ flex: 1, paddingBottom: 4, minWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.ink900,
                      letterSpacing: -0.5,
                    }}
                  >
                    {candidate.name}
                  </span>
                  {candidate.isIncumbent && (
                    <span
                      style={{
                        background: C.amberSoft,
                        color: C.amber,
                        border: `1px solid #E2D2A8`,
                        padding: "2px 9px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Incumbent
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 15, color: C.ink700, marginTop: 2 }}>
                  {race.office} · {candidate.party}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 6,
                    color: C.ink500,
                    fontSize: 12.5,
                    flexWrap: "wrap",
                  }}
                >
                  <span>Election day: {race.date}</span>
                  <span>·</span>
                  <span>Race type: {race.type}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, paddingBottom: 4, flexWrap: "wrap" }}>
                {hasWebsite && (
                  <a
                    href={candidate.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "9px 16px",
                      borderRadius: 999,
                      background: "transparent",
                      color: C.ink900,
                      border: `1.5px solid ${C.ink900}`,
                      fontWeight: 600,
                      fontSize: 13.5,
                      textDecoration: "none",
                    }}
                  >
                    Official site ↗
                  </a>
                )}
                {hasTwitter && (
                  <a
                    href={candidate.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "9px 16px",
                      borderRadius: 999,
                      background: C.shade,
                      color: C.ink900,
                      border: `1.5px solid ${C.rule}`,
                      fontWeight: 600,
                      fontSize: 13.5,
                      textDecoration: "none",
                    }}
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Trust guardrail — candidate data is provisional */}
          <BallotDataDisclaimer />

          {/* AI-generated disclosure + claim */}
          <ClaimProfile
            candidateName={candidate.name}
            raceOffice={race.office}
            slug={slug}
          />

          {/* About */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.rule}`,
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.ink900,
                marginBottom: 8,
              }}
            >
              About
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.ink700,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {candidate.bio}
            </div>

            {/* Key issues */}
            {candidate.keyIssues.length > 0 && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.ruleSoft}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: C.ink500,
                    marginBottom: 10,
                  }}
                >
                  Key Issues
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {candidate.keyIssues.map((issue) => (
                    <span
                      key={issue}
                      style={{
                        background: C.tealSoft,
                        color: C.tealDk,
                        border: `1px solid #C9DDD7`,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Positions (if any have content) */}
            {candidate.positions && candidate.positions.length > 0 && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.ruleSoft}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: C.ink500,
                    marginBottom: 10,
                  }}
                >
                  Where they stand
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {candidate.positions.map((pos, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 12,
                        border: `1px solid ${C.ruleSoft}`,
                        borderRadius: 8,
                        background: C.shade,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.ink900,
                        }}
                      >
                        {pos.issue}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.ink500,
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        {pos.stance}
                      </div>
                      {pos.description && (
                        <div
                          style={{
                            fontSize: 12.5,
                            color: C.ink700,
                            marginTop: 6,
                            lineHeight: 1.45,
                          }}
                        >
                          {pos.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.rule}`,
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.ink900,
                  marginBottom: 12,
                }}
              >
                Experience
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {candidate.experience.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        i === candidate.experience.length - 1
                          ? "none"
                          : `1px solid ${C.ruleSoft}`,
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      fontSize: 13.5,
                      color: C.ink700,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: C.teal,
                        marginTop: 7,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Endorsements */}
          {candidate.endorsements && candidate.endorsements.length > 0 && (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.rule}`,
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.ink900,
                  marginBottom: 12,
                }}
              >
                Endorsements
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {candidate.endorsements.map((endorsement, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: C.ink700,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        background: C.shade,
                        border: `1px solid ${C.ruleSoft}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.amber,
                      }}
                    >
                      ★
                    </span>
                    {endorsement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT RAIL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Race info */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.rule}`,
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.ink900,
                marginBottom: 8,
              }}
            >
              About this race
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: C.ink700,
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              {race.description}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <Row label="Election day"        value={race.date} />
              <Row label="Race type"           value={race.type} />
              <Row label="Registration ends"   value={race.registrationDeadline} />
              <Row label="Early voting starts" value={race.earlyVotingStart} />
              <Row label="Early voting ends"   value={race.earlyVotingEnd} />
            </div>
          </div>

          {/* Fundraising */}
          {fundraisingReal && (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.rule}`,
                borderRadius: 10,
                padding: 16,
                boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.ink900,
                  marginBottom: 10,
                }}
              >
                Fundraising
              </div>
              <Row label="Total raised" value={candidate.fundraising.totalRaised} />
              <Row label="Last quarter" value={candidate.fundraising.lastQuarter} />
            </div>
          )}

          {/* Other candidates in this race */}
          {otherCandidates.length > 0 && (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.rule}`,
                borderRadius: 10,
                boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
              }}
            >
              <div style={{ padding: "14px 16px 6px" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.ink900,
                  }}
                >
                  Also in this race
                </div>
                <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
                  {otherCandidates.length} other candidate{otherCandidates.length === 1 ? "" : "s"}
                </div>
              </div>
              {otherCandidates.map((other, i) => {
                const slug = candidateSlug(other.name, race.office);
                const tone = TONE_BY_PARTY[other.party] || C.ink900;
                return (
                  <Link
                    key={slug}
                    href={`/elections/candidate/${slug}`}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 16px",
                      borderTop:
                        i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
                      textDecoration: "none",
                      color: C.ink900,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: tone,
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {initials(other.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.ink900,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        {other.name}
                        {other.isIncumbent && (
                          <span
                            style={{
                              background: C.amberSoft,
                              color: C.amber,
                              padding: "1px 6px",
                              borderRadius: 999,
                              fontSize: 9.5,
                              fontWeight: 700,
                              border: `1px solid #E2D2A8`,
                            }}
                          >
                            Incumbent
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.ink500 }}>
                        {other.party}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Back to elections */}
          <Link
            href="/elections"
            style={{
              background: C.card,
              border: `1px solid ${C.rule}`,
              borderRadius: 10,
              padding: "12px 16px",
              textAlign: "center",
              fontSize: 12.5,
              fontWeight: 600,
              color: C.teal,
              textDecoration: "none",
              boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
            }}
          >
            ← Back to all 2026 races
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 12,
        padding: "4px 0",
      }}
    >
      <span style={{ color: C.ink500 }}>{label}</span>
      <span style={{ color: C.ink900, fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}
