/* Shared presentational pieces for ballot surfaces (elections hub +
   /g/[county] pages) so candidates and races render identically and
   every candidate links to the same detail page. Server-safe — no hooks.
   PickButton is a client leaf imported here; this file stays a server component. */

import Link from "next/link";
import { candidateDetailHref } from "@/lib/county-utils";
import type { BallotRace, BallotCandidate } from "@/lib/georgia-ballot-data";
import { PickButton } from "./pick-button";
import { CandidatePhoto } from "./candidate-photo";
import { C } from "@/lib/design-tokens";
export { C };

export const TONE_BY_PARTY: Record<string, string> = {
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

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function cardStyle(): React.CSSProperties {
  return {
    background: C.card,
    border: `1px solid ${C.rule}`,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
  };
}

export function CandidateRow({
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
      <CandidatePhoto
        name={candidate.name}
        wikipediaTitle={candidate.wikipediaTitle}
        size={36}
        partyColor={tone}
        shape="square"
      />
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
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <Link href={href} style={{ textDecoration: "none", flex: 1, minWidth: 0 }}>
          {inner}
        </Link>
        <PickButton candidateName={candidate.name} raceOffice={raceOffice} />
      </div>
    );
  }
  // No profile page yet — still allow picking
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{inner}</div>
      <PickButton candidateName={candidate.name} raceOffice={raceOffice} />
    </div>
  );
}

export function RaceCard({ race }: { race: BallotRace }) {
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
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600, color: C.ink900, margin: 0, letterSpacing: -0.2 }}>
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

export function SectionHeading({ label, count }: { label: string; count: number }) {
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
