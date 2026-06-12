import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCandidateSlugs,
  getCandidateBySlug,
  candidateSlug,
} from "@/lib/candidate-utils";
import { ClaimProfile } from "@/components/elections/claim-profile";
import { BallotDataDisclaimer } from "@/components/ballot-data-disclaimer";
import { CandidateDonateSection } from "@/components/elections/candidate-donate-section";
import { SidebarAd } from "@/components/ads/ad-unit";
import { CandidatePhoto } from "@/components/elections/candidate-photo";
import { CandidateNews } from "@/components/elections/candidate-news";
import { ZipBallotLookup } from "@/components/elections/zip-ballot-lookup";
import { C } from "@/lib/design-tokens";

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
  if (!found) return { title: "Candidate not found" };
  const { candidate, race } = found;
  const desc = candidate.bio.slice(0, 200);
  return {
    title: `${candidate.name} · ${race.office}`,
    description: desc,
    openGraph: {
      title: `${candidate.name} — ${candidate.party} · ${race.office}`,
      description: desc,
    },
  };
}

const PARTY_BG: Record<string, string> = {
  Democrat:    C.navy,
  Republican:  C.olive,
  Independent: C.plum,
  Libertarian: C.plum,
  Green:       C.olive,
};

const PARTY_LABEL_BG: Record<string, string> = {
  Democrat:    C.blueSoft,
  Republican:  C.redSoft,
  Independent: "#EDE9FE",
  Libertarian: "#FEF3C7",
  Green:       "#D1FAE5",
};

const PARTY_LABEL_COLOR: Record<string, string> = {
  Democrat:    C.blue,
  Republican:  C.red,
  Independent: C.plum,
  Libertarian: "#92400E",
  Green:       "#065F46",
};

function initials(name: string) {
  return name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

function cardStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: C.card,
    border: `1px solid ${C.rule}`,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
    ...extra,
  };
}

/* ── Lean meter ─────────────────────────────────────────────────────── */
function LeanMeter({ score }: { score: number }) {
  // score: -100 (far left) → +100 (far right)
  const pct = Math.round(((score + 100) / 200) * 100);
  const label =
    score <= -60 ? "Very Liberal" :
    score <= -20 ? "Liberal" :
    score <=  20 ? "Moderate" :
    score <=  60 ? "Conservative" :
                   "Very Conservative";
  const dotColor =
    score < -20 ? C.blue :
    score >  20 ? C.red  :
                  C.teal;

  return (
    <div style={cardStyle({ padding: 16 })}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 10 }}>
        Political Lean
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to right, ${C.blue} 0%, #A5B4FC 30%, #E4E0D3 50%, #FCA5A5 70%, ${C.red} 100%)`,
          }}
        />
        {/* marker */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: dotColor,
            border: "2px solid #fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: C.ink400,
          marginTop: 5,
        }}
      >
        <span>Liberal</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 11,
            color: dotColor,
          }}
        >
          {label}
        </span>
        <span>Conservative</span>
      </div>
      <div style={{ fontSize: 10, color: C.ink400, marginTop: 6, lineHeight: 1.4 }}>
        Based on stated positions, voting record, and endorsements. MyVote does not
        endorse or oppose any candidate.
      </div>
    </div>
  );
}

/* ── Stat chip ───────────────────────────────────────────────────────── */
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: "8px 12px",
        background: C.shade,
        borderRadius: 8,
        border: `1px solid ${C.ruleSoft}`,
        minWidth: 80,
      }}
    >
      <span style={{ fontSize: 9.5, fontWeight: 700, color: C.ink400, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink900, lineHeight: 1.2 }}>
        {value}
      </span>
    </div>
  );
}

/* ── Row helper for race/fundraising cards ─────────────────────────── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 12,
        padding: "5px 0",
        borderBottom: `1px solid ${C.ruleSoft}`,
      }}
    >
      <span style={{ color: C.ink500 }}>{label}</span>
      <span style={{ color: C.ink900, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default async function CandidatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getCandidateBySlug(slug);
  if (!found) notFound();

  const { candidate: c, race, otherCandidates } = found;
  const avatarBg   = PARTY_BG[c.party]         || C.ink900;
  const partyBg    = PARTY_LABEL_BG[c.party]   || C.shade;
  const partyColor = PARTY_LABEL_COLOR[c.party] || C.ink500;
  const hasWebsite = !!c.website;
  const hasTwitter = !!c.socialMedia?.twitter;
  const hasFacebook = !!c.socialMedia?.facebook;
  const hasInstagram = !!c.socialMedia?.instagram;
  const fundraisingReal = c.fundraising.totalRaised && c.fundraising.totalRaised !== "TBD";

  return (
    <div style={{ background: C.page, minHeight: "100vh", color: C.ink900 }}>
      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-3 items-start lg:grid-cols-[1fr_300px] lg:gap-4 lg:px-6 lg:pt-4">

        {/* ══ MAIN COLUMN ══════════════════════════════════════════════ */}
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
            <span style={{ color: C.ink500 }}>{race.office}</span>
            <span style={{ color: C.ink300 }}>·</span>
            <span style={{ color: C.ink700 }}>{c.name}</span>
          </div>

          {/* Hero card — no overflow:hidden so the photo can cross the banner/content boundary */}
          <div style={cardStyle()}>
            {/* Banner — owns its own overflow:hidden so the dot pattern clips to its rounded top corners */}
            <div
              style={{
                height: 168,
                background: `linear-gradient(135deg, #0F1929 0%, ${C.ink900} 45%, ${C.tealDk} 100%)`,
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.16 }}>
                <defs>
                  <pattern id="cdots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cdots)" />
              </svg>
              {/* Race level badge top-right */}
              <div style={{ position: "absolute", top: 12, right: 14, display: "flex", gap: 6 }}>
                <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                  {race.level}
                </span>
              </div>
            </div>

            {/* Identity — photo uses negative margin + z-index to overlap the banner above */}
            <div style={{ padding: "0 20px 20px" }}>

              {/* Photo — pulled up 65 px into the banner, sits on top via zIndex */}
              <div style={{ marginTop: -65, marginBottom: 12, position: "relative", zIndex: 10 }}>
                <CandidatePhoto
                  name={c.name}
                  wikipediaTitle={c.wikipediaTitle}
                  partyColor={avatarBg}
                  size={130}
                />
              </div>

              {/* Name row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, color: C.ink900, margin: 0, letterSpacing: -0.5 }}>
                  {c.name}
                </h1>
                {c.isIncumbent && (
                  <span style={{ background: C.amberSoft, color: C.amber, border: `1px solid #E2D2A8`, padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                    Incumbent
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ background: partyBg, color: partyColor, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  {c.party}
                </span>
                <span style={{ fontSize: 14, color: C.ink700 }}>{race.office}</span>
              </div>

              {/* Quick stat chips */}
              {(c.age || c.hometown || c.education?.length) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {c.age       && <StatChip label="Age"      value={String(c.age)} />}
                  {c.hometown  && <StatChip label="Hometown" value={c.hometown} />}
                  {c.education?.[0] && (
                    <StatChip label="Education" value={c.education[0].split(",")[0]} />
                  )}
                  <StatChip label="Election" value={race.date} />
                </div>
              )}

              {/* Campaign slogan */}
              {c.campaignSlogan && (
                <div style={{ fontSize: 13, fontStyle: "italic", color: C.ink500, marginBottom: 14, paddingLeft: 2 }}>
                  &ldquo;{c.campaignSlogan}&rdquo;
                </div>
              )}

              {/* Social / external links */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {hasWebsite && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: C.ink900, color: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                    🌐 Official site
                  </a>
                )}
                {hasTwitter && (
                  <a href={c.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: C.shade, color: C.ink900, border: `1px solid ${C.rule}`, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                    𝕏 Twitter
                  </a>
                )}
                {hasFacebook && (
                  <a href={c.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "#EEF2FF", color: "#3730A3", border: "1px solid #C7D2FE", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                    f Facebook
                  </a>
                )}
                {hasInstagram && (
                  <a href={c.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "#FDF4FF", color: "#7E22CE", border: "1px solid #E9D5FF", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                    ◎ Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Trust / claim */}
          <BallotDataDisclaimer />
          <ClaimProfile candidateName={c.name} raceOffice={race.office} slug={slug} />

          {/* About + Key Issues + Policy Positions */}
          <div style={cardStyle({ padding: 20 })}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: "0 0 10px" }}>About</h2>
            <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.65, margin: "0 0 16px", whiteSpace: "pre-wrap" }}>
              {c.bio}
            </p>

            {/* Education detail */}
            {c.education && c.education.length > 0 && (
              <div style={{ marginBottom: 16, paddingTop: 14, borderTop: `1px solid ${C.ruleSoft}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.ink500, marginBottom: 8 }}>
                  Education
                </div>
                {c.education.map((ed, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: C.ink700, padding: "5px 0", borderBottom: i === (c.education!.length - 1) ? "none" : `1px solid ${C.ruleSoft}` }}>
                    <span style={{ color: C.teal, marginTop: 4, flexShrink: 0 }}>🎓</span>
                    {ed}
                  </div>
                ))}
              </div>
            )}

            {/* Key issues */}
            {c.keyIssues.length > 0 && (
              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.ruleSoft}`, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.ink500, marginBottom: 10 }}>
                  Key Issues
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.keyIssues.map((issue) => (
                    <span key={issue} style={{ background: C.tealSoft, color: C.tealDk, border: "1px solid #C9DDD7", padding: "4px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600 }}>
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Policy positions */}
            {c.positions && c.positions.length > 0 && (
              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.ruleSoft}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.ink500, marginBottom: 12 }}>
                  Where They Stand
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                  {c.positions.map((pos, i) => (
                    <div key={i} style={{ padding: 14, border: `1px solid ${C.ruleSoft}`, borderRadius: 8, background: C.shade }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 2 }}>{pos.issue}</div>
                      <div style={{ fontSize: 12, color: c.party === "Democrat" ? C.blue : C.red, fontWeight: 700, marginBottom: 6 }}>{pos.stance}</div>
                      {pos.description && (
                        <div style={{ fontSize: 12.5, color: C.ink700, lineHeight: 1.5 }}>{pos.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          {c.experience && c.experience.length > 0 && (
            <div style={cardStyle({ padding: 20 })}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Experience</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {c.experience.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i === c.experience.length - 1 ? "none" : `1px solid ${C.ruleSoft}`, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.5 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endorsements */}
          {c.endorsements && c.endorsements.length > 0 && (
            <div style={cardStyle({ padding: 20 })}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: "0 0 12px" }}>Endorsements</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.endorsements.map((e) => (
                  <span key={e} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.amberSoft, color: C.amber, border: "1px solid #E2D2A8", padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600 }}>
                    ★ {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent news */}
          <CandidateNews candidateName={c.name} />
        </div>

        {/* ══ RIGHT RAIL ═══════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Ballot funnel — most visitors arrive here from a name search and
              this is their only prompt to discover their full ballot. */}
          <div style={cardStyle({ padding: 16 })}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, marginBottom: 3 }}>
              {c.name.split(" ")[0]} is one race on your ballot
            </div>
            <p style={{ fontSize: 12, color: C.ink500, lineHeight: 1.5, margin: "0 0 12px" }}>
              See every race you&rsquo;ll vote on — statewide, your district, and local offices.
            </p>
            <ZipBallotLookup />
          </div>

          {/* Donate */}
          <CandidateDonateSection slug={slug} candidateName={c.name} />

          {/* Political lean */}
          <LeanMeter score={c.politicalScore} />

          {/* Stay-informed news bridge — above the fold so search visitors who
              land on a candidate page discover the news product without
              scrolling to the very bottom. */}
          <div style={cardStyle({ padding: 16 })}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 3 }}>
              Stay informed on {race.office.split("(")[0].trim()}
            </div>
            <p style={{ fontSize: 12, color: C.ink500, lineHeight: 1.5, margin: "0 0 12px" }}>
              Read how this race is covered across the political spectrum.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link
                href="/news"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: C.teal,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <span>🌐 National news — every side</span>
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/news/local"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: C.tealSoft,
                  border: `1px solid ${C.tealBorder}`,
                  color: C.tealDk,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <span>📍 Local Georgia news</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Race info */}
          <div style={cardStyle({ padding: 16 })}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>
              About this race
            </div>
            <p style={{ fontSize: 12.5, color: C.ink700, lineHeight: 1.55, margin: "0 0 12px" }}>
              {race.description}
            </p>
            <Row label="Election day"        value={race.date} />
            <Row label="Race type"           value={race.type} />
            <Row label="Registration ends"   value={race.registrationDeadline} />
            <Row label="Early voting starts" value={race.earlyVotingStart} />
            <Row label="Early voting ends"   value={race.earlyVotingEnd} />
          </div>

          {/* Fundraising */}
          {fundraisingReal && (
            <div style={cardStyle({ padding: 16 })}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 10 }}>
                Fundraising
              </div>
              <Row label="Total raised" value={c.fundraising.totalRaised} />
              <Row label="Last quarter" value={c.fundraising.lastQuarter} />
              <p style={{ fontSize: 11, color: C.ink400, margin: "8px 0 0", lineHeight: 1.45 }}>
                FEC-reported figures. Verify at fec.gov.
              </p>
            </div>
          )}

          {/* Other candidates */}
          {otherCandidates.length > 0 && (
            <div style={cardStyle()}>
              <div style={{ padding: "14px 16px 6px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>Also in this race</div>
                <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
                  {otherCandidates.length} other candidate{otherCandidates.length !== 1 ? "s" : ""}
                </div>
              </div>
              {otherCandidates.map((other, i) => {
                const s = candidateSlug(other.name, race.office);
                const tone = PARTY_BG[other.party] || C.ink900;
                return (
                  <Link key={s} href={`/elections/candidate/${s}`}
                    style={{ display: "flex", gap: 10, padding: "10px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`, textDecoration: "none", color: C.ink900 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: tone, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {initials(other.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink900, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        {other.name}
                        {other.isIncumbent && (
                          <span style={{ background: C.amberSoft, color: C.amber, padding: "1px 6px", borderRadius: 999, fontSize: 9.5, fontWeight: 700, border: "1px solid #E2D2A8" }}>
                            Incumbent
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.ink500 }}>{other.party}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <SidebarAd />

          <Link href="/elections"
            style={cardStyle({ padding: "12px 16px", textAlign: "center", fontSize: 12.5, fontWeight: 600, color: C.teal, textDecoration: "none", display: "block" })}>
            ← Back to all 2026 races
          </Link>
        </div>
      </div>
    </div>
  );
}
